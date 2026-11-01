# Radar de Inovação — Explorador Local em Português

**Adaptação educacional:** Prof. Marcelo Claro · BLA–REA Research Lab  
**Fonte original:** [Innovation Map 26/27 — Envisioning / WKO](https://innovationmap.at/?pg=home)  
**Datas de referência dos conjuntos:** 01/11/2026  
**Edição local:** 7.0 — leitura integral em PT-BR com original inglês opcional

## Como abrir

1. Descompacte o arquivo ZIP em uma pasta no seu computador.
2. Abra o arquivo **`index.html`** com duplo clique no Chrome, Edge ou Firefox.
3. Use o menu para alternar entre **Mapa radial**, **Catálogo**, **Histórico**, **Comparar**, **Guia didático** e **Sobre**.

Não é necessário instalar Python, Node.js, extensões ou servidor. A aplicação carrega os dados por meio do arquivo JavaScript local `data/board.js`. É possível navegar sem conexão com a internet.

Se preferir utilizar um servidor local, execute dentro desta pasta:

```bash
python -m http.server 8765
```

Depois abra <http://localhost:8765> no navegador.

## Funcionalidades

- **105 tecnologias atuais** distribuídas em cinco tendências e exibidas no mapa.
- **61 registros do arquivo histórico oficial** (edições de 2021 a 2023) e **6 registros remanescentes** do snapshot anterior, em uma seção própria.
- Total de **172 fichas por proveniência**: as versões e conceitos correlatos não devem ser confundidos com 172 tecnologias científicas distintas.
- **Mapa radial interativo com 105 nomes**, seleção por ponto ou rótulo, cinco setores, nove anéis TRL e zoom.
- Interface, títulos e resumos editoriais em português brasileiro.
- **Resumo original e descrição técnica extensa traduzidos automaticamente** para as 172 fichas atuais e históricas, incorporados ao ZIP para uso offline. A tradução não foi revisada por especialistas e exige conferência antes de uso acadêmico.
- A **descrição integral em português brasileiro é exibida primeiro** em cada ficha. A seção recolhida **“Fonte original em inglês — conferência acadêmica”** é exclusivamente opcional, para comparação e rastreabilidade das fontes.
- As fichas apresentam **TRL e SRL (quando fornecidos), ODS em português, organizações e suas URLs, todas as fontes sem truncamento, créditos, descrições originais em inglês e navegação anterior/próximo**.
- Busca com tolerância a acentos, filtros por tendência, TRL, SRL e 17 ODS, classificação por nome ou maturidade, inclusive quando a ficha histórica tem os dados necessários.
- Pesquisa ampliada nas descrições originais e nos sinônimos técnicos, com atalhos editoriais para **DNA e biotecnologia, IA, tecnologias quânticas, energia e agrotecnologia**.
- O termo **DNA sintético** recupera *Synthetic Chromosome* (TRL 4) e *DNA Data Storage* (TRL 5), além das relações temáticas acessíveis no atalho especializado.
- Fichas com descrição original identificada (em inglês), referências completas, campos temáticos e índices do conjunto de origem.
- Favoritos no armazenamento local do navegador, comparação de até três tecnologias atuais ou históricas e exportação de CSV em PT-BR por seção.
- **Guia didático offline**: nove níveis TRL e nove SRL com explicação para leigos, cinco categorias, 17 ODS, glossário de indicadores, projetos no GitHub/Kaggle e referências acadêmicas em ABNT atualizada.
- **Explicações de maturidade dentro de cada ficha**, mediante a opção “O que significa este nível?”. Quando houver artigo acadêmico verificado para o tema, aparece uma seção adicional com DOI e citação ABNT. As fichas sem curadoria acadêmica suplementar são identificadas claramente.
- **Biografia e foto do Prof. Marcelo Claro Laranjeira** na página **Sobre o projeto**, com links aos repositórios públicos [MarceloClaro](https://github.com/MarceloClaro), [matricula](https://github.com/MarceloClaro/matricula) e [OpenCode_Ecosystem](https://github.com/MarceloClaro/OpenCode_Ecosystem). O retrato original do perfil público foi incluído localmente para funcionar sem internet.
- Nenhuma chamada remota automática, rastreador, dependência CDN, login ou conta necessária.

## Limitações e transparência

- Trata-se de uma **reimplementação local independente** da experiência de exploração, não de uma cópia exata da interface ou do backend proprietário da Envisioning.
- A fonte oficial confirma **105 tecnologias ativas em cinco grupos**. A descrição HTML antiga menciona 108, mas esse número não é confirmado pelo catálogo público atual.
- O cache antigo continha 105 tecnologias com 46 títulos em comum com a API atual. A API atual traz 59 títulos que faltavam à primeira versão, além de um arquivo de 61 registros.
- Seis títulos do cache anterior não aparecem nem na API atual nem no arquivo oficial: *Satellite Quantum Key Distribution*, *Deep Fake Detection Tool*, *6th-generation Wireless (6G)*, *3D Printed Biological Tissue*, *Stacking Concrete Energy Storage* e *Nanotagging*. Eles foram preservados como **snapshot anterior**, sem afirmar que são novos conceitos ou que permanecem ativos.
- Há dois tipos de resumo: uma **síntese editorial curta** em PT-BR e uma **tradução automática do resumo original**. Os textos longos também são traduções automáticas de inglês para português feitas com modelo aberto, com normalização de vocabulário PT-BR; podem conter erros semânticos, terminológicos e de concordância. Não constituem revisão ou validação científica. O original permanece visível no painel.
- As fichas do acervo histórico também apresentam tradução automática longa, inclusive **Edifício de energia líquida zero** (*Zero-energy Building*, arquivo 2021) e os seis remanescentes do snapshot anterior. As traduções longas são identificadas como automáticas; o inglês original é mantido para verificação. Os títulos editoriais e as classificações da fonte permanecem inalterados.
- A coleta foi feita de um endpoint público e não requer autenticação. Os links de referência são externos e somente são abertos por iniciativa do usuário.
- Os dados, nomes de produtos e textos originais pertencem aos respectivos titulares; este pacote é destinado a uso pessoal, educacional e de pesquisa. Verifique as condições de uso e licenciamento antes de redistribuir ou publicar cópias dos dados de terceiros.
- Autenticação Auth0, edição de dados, funções privadas, atualização em tempo real, imagens hospedadas e serviços da página original **não foram reproduzidos**.
- A **Open Design Alliance** não foi empregada porque a aplicação oferece HTML, JavaScript e JSON; não foi identificado um artefato DWG, DXF, DGN ou IFC que exigisse os SDKs ODA. Não se afirma extração via ODA.
- As referências acadêmicas adicionais são uma **curadoria independente para exemplos selecionados** (modelagem preditiva de conflitos, armazenamento em DNA, cromossomos sintéticos, projeto de proteínas por IA e computação quântica). Não se afirma revisão bibliográfica exaustiva das 105 tecnologias.
- Para as fontes originais do radar, links e títulos foram preservados, mas autores, datas e paginação não são inventados quando ausentes. Estudos complementares **não validam** os números TRL/SRL publicados pela WKO.
- Fotografias e biografias públicas podem mudar no GitHub. O arquivo `marcelo-claro-avatar.png` registra somente a fotografia pública obtida em 01/11/2026; não há atualização automática nem verificação de diplomas pela ferramenta.

## Proveniência e integridade

Origem do snapshot anterior (`data/board.json`):

```text
https://radar.envisioning.io/wko/innovation/app/cache/board/qdkDfh3oHygRRdhaL.json
```

SHA-256 dos bytes originais do arquivo `data/board.json`:

```text
5ebcb87d0e8fc74654578cce274e0f7125e082cbbf959b976014779affdcf52e
```

Origem do catálogo atualizado e do arquivo histórico (`data/board-live.json`):

```text
https://ev-radar-proxy.vercel.app/api/board/wko?lang=en&_vercel_no_cache=1
```

A configuração pública da [Innovation Map 26/27](https://innovationmap.at/?pg=home), em `app/json/settings/data.json`, aponta para o mesmo endpoint de dados (`ev-radar-proxy.vercel.app/api/board/wko`). Por isso, não foi necessário alterar o conjunto de 105 tecnologias atuais para corrigir a pesquisa sobre DNA sintético.

SHA-256 dos bytes consultados em 01/11/2026:

```text
5d60c3af0d4a90f11f04149df0178bd018fd12d0c73bdae1f17aa1aa55c4da31
```

O arquivo `data/board.js` foi produzido mecanicamente a partir dos dois JSON, com atribuições de dados locais para permitir abertura via `file://`. Nenhum JavaScript do aplicativo original foi incorporado ou executado.

O arquivo `data/pt-full.js` foi gerado por `gerar_traducoes.py` mediante **OPUS-MT English→Portuguese 1.9**, modelo distribuído no ecossistema Argos Translate (tradução no computador de desenvolvimento; no navegador não há execução do modelo). As 67 traduções históricas foram acrescentadas sem substituir as 105 atuais; para reproduzir essa operação use `python3 gerar_traducoes.py --historical-only --model /caminho/do/modelo`, com o pacote extraído e as dependências `ctranslate2`, `sentencepiece` e `lxml`. Origem do modelo: [Argos package index](https://github.com/argosopentech/argospm-index), [servidor de pacotes Argos](https://data.argosopentech.com/argospm/v1/) e [Argos Translate](https://github.com/argosopentech/argos-translate). Referência autoral indicada no pacote: **Jörg Tiedemann e Santhosh Thottingal**, *OPUS-MT — Building open translation services for the World*, EAMT 2020; modelo derivado sob licença **CC BY 4.0**. Verifique direitos sobre os textos de origem antes de distribuição pública.

## Validação SDD/TDD

Para desenvolvedores com Node.js instalado, os testes podem ser executados com:

```bash
node tests/check.js
node --test tests/detail.test.js
node --test tests/pt-coverage.test.js
node --test tests/historical-pt.test.js
node --test tests/guide.test.js
python3 -m unittest discover -s tests -p test_translate.py
```

Verificam a composição **105 + 61 + 6**, as tendências, a cobertura das traduções, os detalhes completos, os hashes de ambos os snapshots, os recursos locais e a sintaxe do código de navegação. Para regenerar o arquivo JavaScript de dados a partir dos JSON:

```bash
python3 gerar_dados.py
```

Os testes automatizados não substituem testes visuais em navegadores e não certificam a segurança do serviço original.

## Créditos

- **Plataforma e pesquisa de origem:** Envisioning, projeto Innovation Map / WKO.
- **Adaptação local, resumos editoriais e organização da pesquisa:** Prof. Marcelo Claro — BLA–REA Research Lab.
- **Autor identificado no GitHub:** Marcelo Claro Laranjeira ([perfil](https://github.com/MarceloClaro)). Fotografia pública: avatar GitHub, disponibilizado no pacote para navegação offline.
- **Referências acadêmicas e acessibilidade didática:** síntese curada com consulta a fontes primárias e DOI até 01/11/2026, sem alegar validação independente ou revisão por pares da própria adaptação.
- **Traduções longas:** geração automática a partir do modelo OPUS-MT/Argos; sem revisão humana nem endosso da Envisioning.

Não existe afiliação oficial declarada com a Envisioning.
