import unittest

from gerar_traducoes import extract_blocks, historical_technologies, ptbr_conventions, polish_payload
import json
from pathlib import Path


class TranslationPreparationTest(unittest.TestCase):
    def test_historical_selection_includes_six_legacy_entries_without_duplicates(self):
        root = Path(__file__).resolve().parent.parent / 'data'
        live = json.loads((root / 'board-live.json').read_text(encoding='utf-8'))['data']['board']
        old = json.loads((root / 'board.json').read_text(encoding='utf-8'))['data']['board']
        historical = historical_technologies(live, old)
        self.assertEqual(len(historical), 67)
        self.assertIn('Zero-energy Building', [t['name'] for t in historical])

    def test_extracts_paragraphs_and_future_heading_without_executing_html(self):
        blocks = extract_blocks('<p>A <strong>machine</strong> helps.</p><h1>Future Perspectives</h1><p>Another text.</p><script>alert(1)</script>')
        self.assertEqual(blocks, [
            {'type': 'p', 'text': 'A machine helps.'},
            {'type': 'h2', 'text': 'Future Perspectives'},
            {'type': 'p', 'text': 'Another text.'},
        ])

    def test_normalizes_portuguese_terminology_to_br(self):
        self.assertEqual(ptbr_conventions('Os utilizadores consultam ficheiros na equipa.'),
                         'Os usuários consultam arquivos na equipe.')

    def test_technical_terms_are_not_literal_mistranslations(self):
        self.assertEqual(ptbr_conventions('Avanços profundos de aprendizagem e sobreposição de estados.'),
                         'Avanços em aprendizado profundo e superposição de estados.')

    def test_normalizes_sentencepiece_spacing_before_technical_glossary(self):
        self.assertEqual(ptbr_conventions('Avanços▁profundos de▁aprendizagem e▁sobreposição de▁estados.'),
                         'Avanços em aprendizado profundo e superposição de estados.')

    def test_polishes_all_summary_and_description_blocks(self):
        payload={'summaries':{'1':'Os utilizadores veem ficheiros.'},
                 'entries':{'1':[{'type':'p','text':'Raciocínio mecânico e sobreposição de estados.'}]}}
        result=polish_payload(payload)
        self.assertEqual(result['summaries']['1'],'Os usuários veem arquivos.')
        self.assertEqual(result['entries']['1'][0]['text'],'Raciocínio computacional e superposição de estados.')


if __name__ == '__main__':
    unittest.main()
