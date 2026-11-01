"""Gera um snapshot offline PT-BR a partir dos campos públicos em inglês.

Modelo sugerido: Argos/OPUS-MT en→pt 1.9 (CC-BY 4.0 para o modelo de origem).
O resultado é tradução automática NÃO revisada; a fonte original permanece acessível.
Dependências de geração não são distribuídas com o aplicativo.
"""
from __future__ import annotations

import argparse
import json
import re
import unicodedata
from pathlib import Path

from lxml import html


BASE = Path(__file__).resolve().parent


def extract_blocks(fragment: str) -> list[dict[str, str]]:
    """Extrai somente texto de conteúdo editorial, nunca scripts/HTML ativo."""
    container = html.fragment_fromstring(fragment or '', create_parent='div')
    blocks = []
    for el in container.iter():
        kind = el.tag.lower() if isinstance(el.tag, str) else ''
        if kind not in {'p', 'h1', 'h2', 'h3', 'li', 'blockquote'}:
            continue
        if el.xpath('ancestor::script | ancestor::style | ancestor::noscript'):
            continue
        words = ' '.join(' '.join(el.itertext()).split())
        if not words or words.startswith('Image:'):
            continue
        blocks.append({'type': 'h2' if kind.startswith('h') else 'li' if kind == 'li' else 'p', 'text': words})
    return blocks


def ptbr_conventions(text: str) -> str:
    # O OPUS-MT devolve marcadores SentencePiece, que precisam ser removidos
    # ANTES da comparação dos termos compostos do glossário.
    text = ' '.join(text.replace('▁', ' ').split())
    substitutions = {
        'Avanços profundos de aprendizagem': 'Avanços em aprendizado profundo',
        'sobreposição de estados': 'superposição de estados',
        'sobreposição e emaranhamento': 'superposição e emaranhamento',
        'subatómico': 'subatômico',
        'susceptíveis': 'suscetíveis',
        'crowdsourced': 'colaborativos',
        'em linha': 'online',
        'raciocínio mecânico': 'raciocínio computacional',
        'utilizadores': 'usuários', 'utilizador': 'usuário',
        'ficheiros': 'arquivos', 'ficheiro': 'arquivo',
        'equipa': 'equipe', 'equipas': 'equipes',
        'controlo': 'controle', 'controlos': 'controles',
        'ecrã': 'tela', 'ecrãs': 'telas',
        'telemóvel': 'celular', 'telemóveis': 'celulares',
        'perspetivas': 'perspectivas', 'perspetiva': 'perspectiva',
        'deteção': 'detecção', 'detetar': 'detectar',
        'aprendizagem automática': 'aprendizado de máquina',
    }
    for before, after in substitutions.items():
        def replace_case(match):
            return after[:1].upper() + after[1:] if match.group()[:1].isupper() else after
        text = re.sub(r'\b' + re.escape(before) + r'\b', replace_case, text, flags=re.IGNORECASE)
    return ' '.join(text.split())


def polish_payload(payload: dict) -> dict:
    """Aplica o glossário revisado a traduções já geradas, sem reinferir o modelo."""
    for id_, summary in payload.get('summaries', {}).items():
        payload['summaries'][id_] = ptbr_conventions(summary)
    for blocks in payload.get('entries', {}).values():
        for block in blocks:
            block['text'] = ptbr_conventions(block['text'])
    return payload


def run_model(model_root: Path):
    import ctranslate2
    import sentencepiece as spm

    sentencepiece = spm.SentencePieceProcessor(model_file=str(model_root / 'sentencepiece.model'))
    translator = ctranslate2.Translator(str(model_root / 'model'), device='cpu', inter_threads=2, intra_threads=2)

    def translate(text: str) -> str:
        # Títulos e sentenças curtas mantém o tamanho de cada entrada do modelo controlado.
        parts = re.split(r'(?<=[.!?])\s+(?=[A-ZÀ-Ú0-9])', text)
        tokens_by_part = []
        for part in parts:
            tokens = sentencepiece.encode(part, out_type=str)
            if not tokens:
                continue
            tokens_by_part.append(tokens)
        # As sentenças são independentes; lotes evitam chamadas repetidas ao modelo.
        sentences = []
        for start in range(0, len(tokens_by_part), 8):
            batch = translator.translate_batch(tokens_by_part[start:start+8], beam_size=3, max_decoding_length=550)
            sentences.extend(ptbr_conventions(''.join(result.hypotheses[0])) for result in batch)
        return ' '.join(sentences)

    return translate


def historical_technologies(current_board: dict, legacy_board: dict) -> list[dict]:
    """Une arquivo oficial e seis remanescentes sem duplicar nomes já presentes."""
    def key(name: str) -> str:
        unaccented = unicodedata.normalize('NFD', name.lower())
        return ''.join(char for char in unaccented if char.isascii() and char.isalnum())

    existing = {key(tech['name']) for tech in current_board['entities'] + current_board['archive']}
    older_only = [tech for tech in legacy_board['entities'] if key(tech['name']) not in existing]
    return current_board['archive'] + older_only


def save_translations(output_file: Path, payload: dict):
    output_file.write_text('window.PT_FULL = ' + json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')


def generate_historical(board_file: Path, legacy_file: Path, output_file: Path, model_root: Path):
    """Acrescenta traduções históricas sem reprocessar nem alterar as fichas atuais."""
    board = json.loads(board_file.read_text(encoding='utf-8'))['data']['board']
    legacy = json.loads(legacy_file.read_text(encoding='utf-8'))['data']['board']
    data = output_file.read_text(encoding='utf-8').removeprefix('window.PT_FULL = ').strip().removesuffix(';')
    payload = json.loads(data)
    translate = run_model(model_root)
    historical = historical_technologies(board, legacy)
    for index, tech in enumerate(historical, 1):
        tech_id = str(tech['id'])
        if tech_id not in payload['entries']:
            blocks = extract_blocks(tech.get('description', {}).get('longTextHtml', ''))
            payload['entries'][tech_id] = [{'type': b['type'], 'text': translate(b['text'])} for b in blocks]
            payload['summaries'][tech_id] = translate(tech.get('description', {}).get('shortText', ''))
        if index % 5 == 0 or index == len(historical):
            save_translations(output_file, payload)
            print(f'Histórico: {index}/{len(historical)} fichas; {len(payload["entries"])} traduções no total.', flush=True)
    payload['meta']['coverage'] = '105 fichas atuais, 61 do arquivo oficial e 6 do snapshot anterior'
    save_translations(output_file, payload)
    return len(historical)


def generate(board_file: Path, output_file: Path, model_root: Path):
    board = json.loads(board_file.read_text(encoding='utf-8'))['data']['board']
    translate = run_model(model_root)
    entries = {}
    summaries = {}
    for index, tech in enumerate(board['entities'], 1):
        blocks = extract_blocks(tech.get('description', {}).get('longTextHtml', ''))
        entries[str(tech['id'])] = [{'type': block['type'], 'text': translate(block['text'])} for block in blocks]
        summaries[str(tech['id'])] = translate(tech.get('description', {}).get('shortText', ''))
        if index % 10 == 0 or index == len(board['entities']):
            print(f'Traduzidas {index}/{len(board["entities"])} fichas.', flush=True)
            payload = {'meta': {
                'language': 'pt-BR', 'method': 'tradução automática offline; revisão humana pendente',
                'source': 'Envisioning / WKO Innovation Map 26/27',
                'model': 'OPUS-MT en→pt 1.9 (Argos Translate)',
            }, 'entries': entries, 'summaries': summaries}
            save_translations(output_file, payload)
    return len(entries)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--model', type=Path)
    parser.add_argument('--polish-only', action='store_true', help='Reaplicar apenas o glossário ao resultado já salvo')
    parser.add_argument('--historical-only', action='store_true', help='Acrescentar arquivo e remanescentes às traduções existentes')
    parser.add_argument('--input', type=Path, default=BASE / 'data/board-live.json')
    parser.add_argument('--legacy', type=Path, default=BASE / 'data/board.json')
    parser.add_argument('--output', type=Path, default=BASE / 'data/pt-full.js')
    args = parser.parse_args()
    if args.polish_only:
        content = args.output.read_text(encoding='utf-8').removeprefix('window.PT_FULL = ').strip().removesuffix(';')
        payload = polish_payload(json.loads(content))
        save_translations(args.output, payload)
        print(f'Vocabulário atualizado em {len(payload["entries"])} fichas.')
    else:
        if not args.model: parser.error('--model é obrigatório para tradução completa')
        if args.historical_only:
            print(f'Histórico: {generate_historical(args.input, args.legacy, args.output, args.model)} fichas.', flush=True)
        else:
            print(f'Total: {generate(args.input, args.output, args.model)} traduções.', flush=True)
