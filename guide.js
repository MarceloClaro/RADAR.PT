/* Guia didático independente; artigos verificados em 01/11/2026.
 * Estudos complementares não validam os TRL/SRL atribuídos pela fonte WKO.
 */
window.RADAR_GUIDE = {
  trl: {
    1:{name:"Pesquisa científica inicial",plain:"Pesquisadores observam um fenômeno que poderá ter aplicações úteis, mas ainda não existe uma solução pronta.",evidence:"Resultados de investigação básica e princípios documentados."},
    2:{name:"Conceito tecnológico",plain:"Uma possível aplicação foi imaginada e descrita. Ainda falta mostrar que essa ideia realmente pode funcionar.",evidence:"Conceito fundamentado, hipótese e proposta técnica."},
    3:{name:"Prova de conceito",plain:"Um primeiro experimento demonstra que a ideia é possível, embora ainda esteja longe de um produto confiável.",evidence:"Experimento inicial com resultados reproduzíveis."},
    4:{name:"Ambiente de laboratório",plain:"Componentes da tecnologia funcionam juntos em um laboratório com condições controladas.",evidence:"Testes de componentes integrados em ambiente controlado."},
    5:{name:"Validação em campo",plain:"O sistema começa a ser validado em condições parecidas com o ambiente em que será usado de verdade.",evidence:"Testes documentados em ambiente relevante."},
    6:{name:"Teste de protótipo",plain:"Um protótipo mais completo é submetido a avaliações técnicas que simulam o uso previsto.",evidence:"Medições de desempenho e testes de protótipo em ambiente relevante."},
    7:{name:"Demonstração de protótipo",plain:"Uma versão avançada demonstra funcionamento em condições operacionais reais ou representativas.",evidence:"Demonstração operacional documentada."},
    8:{name:"Pronta para implementação",plain:"O sistema foi concluído e qualificado para sua finalidade, mas ainda precisa ser implantado conforme o contexto.",evidence:"Qualificação, documentação, testes finais e requisitos aplicáveis."},
    9:{name:"Totalmente operacional",plain:"A tecnologia já demonstrou funcionamento no uso real previsto; isso não garante ausência de riscos sociais.",evidence:"Registros verificáveis de operação efetiva."}
  },
  srl: {
    1:{name:"Consciência mínima e barreiras elevadas",plain:"Quase ninguém conhece a inovação, e existem barreiras importantes para que pessoas e instituições possam utilizá-la."},
    2:{name:"Conhecimento limitado e ceticismo",plain:"Poucos grupos ouviram falar da tecnologia, e dúvidas sobre utilidade, confiança ou riscos ainda predominam."},
    3:{name:"Interesse emergente e exposição inicial",plain:"As pessoas começam a se interessar pela solução, mas ainda têm pouco contato direto com ela."},
    4:{name:"Conhecimento crescente e barreiras institucionais",plain:"A inovação já é mais conhecida, porém leis, custos, infraestrutura ou instituições ainda dificultam a adoção."},
    5:{name:"Adoção inicial e participação de interessados",plain:"Grupos pioneiros experimentam a tecnologia e começam a participar da discussão sobre seus impactos."},
    6:{name:"Adoção em expansão e penetração no mercado",plain:"O uso se espalha para novas organizações e públicos, embora o acesso possa continuar desigual."},
    7:{name:"Alta aceitação e apoio institucional",plain:"Existe aceitação relativamente ampla e apoio de instituições para o uso responsável da inovação."},
    8:{name:"Norma estabelecida e incorporação social",plain:"A tecnologia passa a fazer parte de atividades habituais e práticas sociais reconhecidas."},
    9:{name:"Integração social profunda e impacto sistêmico",plain:"A inovação está amplamente incorporada à sociedade e modifica processos, serviços ou comportamentos de modo duradouro."}
  },
  sectors: [
    {id:"Data Era",description:"Organiza tecnologias voltadas a criar, armazenar, analisar, comunicar e proteger informações, incluindo inteligência artificial e infraestruturas digitais.",example:"Modelagem preditiva de conflitos; armazenamento de dados em DNA"},
    {id:"Human Expansion",description:"Reúne pesquisas para compreender, preservar, recuperar ou ampliar capacidades do corpo e da mente humana, incluindo medicina e biotecnologia.",example:"Órgãos artificiais; medicina regenerativa"},
    {id:"Generate & Drive",description:"Abrange produção, transformação e uso de energia, novos materiais e soluções para mobilidade e processos industriais.",example:"Redes elétricas descentralizadas; captura de CO₂"},
    {id:"Agritech & Food",description:"Apresenta soluções que podem transformar agricultura, produção de alimentos e bioeconomia, com atenção aos recursos naturais.",example:"Veículos agrícolas autônomos; alimentos impressos em 3D"},
    {id:"Smart Living",description:"Agrupa tecnologias aplicadas à vida cotidiana, moradia, cidades, serviços e ambientes mais conectados e automatizados.",example:"Cultivo doméstico automatizado; serviços inteligentes"}
  ],
  ods: [
    {id:1,example:"Reduzir a vulnerabilidade econômica de famílias."},
    {id:2,example:"Melhorar produção e acesso a alimentos suficientes."},
    {id:3,example:"Prevenir doenças e ampliar o cuidado em saúde."},
    {id:4,example:"Facilitar aprendizagem e acesso à educação."},
    {id:5,example:"Diminuir barreiras e discriminação de gênero."},
    {id:6,example:"Proteger água e ampliar condições de saneamento."},
    {id:7,example:"Ampliar acesso a energia limpa e confiável."},
    {id:8,example:"Promover emprego digno e atividade econômica sustentável."},
    {id:9,example:"Aprimorar infraestrutura, produção e inovação."},
    {id:10,example:"Diminuir desigualdades entre grupos e territórios."},
    {id:11,example:"Tornar moradias, cidades e comunidades mais resilientes."},
    {id:12,example:"Reduzir desperdícios e impactos do consumo e da produção."},
    {id:13,example:"Reduzir emissões e enfrentar riscos climáticos."},
    {id:14,example:"Proteger mares, oceanos e vida aquática."},
    {id:15,example:"Preservar ecossistemas terrestres e biodiversidade."},
    {id:16,example:"Fortalecer paz, justiça e instituições responsáveis."},
    {id:17,example:"Ampliar cooperação e acesso ao conhecimento científico."}
  ],
  references: [
    {id:"bernstein2022",kind:"Estudo sobre preparação social",doi:"10.1007/s11948-021-00360-3",url:"https://doi.org/10.1007/s11948-021-00360-3",abnt:"BERNSTEIN, Michael J. et al. The societal readiness thinking tool: a practical resource for maturing the societal readiness of research projects. Science and Engineering Ethics, v. 28, n. 1, art. 6, 2022. DOI: https://doi.org/10.1007/s11948-021-00360-3."},
    {id:"hegre2019",kind:"Conflitos e IA",doi:"10.1177/0022343319823860",url:"https://doi.org/10.1177/0022343319823860",abnt:"HEGRE, Håvard et al. ViEWS: a political violence early-warning system. Journal of Peace Research, v. 56, n. 2, p. 155-174, 2019. DOI: https://doi.org/10.1177/0022343319823860."},
    {id:"erlich2017",kind:"DNA como meio de armazenamento",doi:"10.1126/science.aaj2038",url:"https://doi.org/10.1126/science.aaj2038",abnt:"ERLICH, Yaniv; ZIELINSKI, Dina. DNA Fountain enables a robust and efficient storage architecture. Science, v. 355, n. 6328, p. 950-954, 2017. DOI: https://doi.org/10.1126/science.aaj2038."},
    {id:"gimpel2026",kind:"Comparação de métodos de armazenamento em DNA",doi:"10.1038/s41467-026-70548-3",url:"https://doi.org/10.1038/s41467-026-70548-3",abnt:"GIMPEL, Andreas L. et al. Comparison of state-of-the-art error-correction coding for sequence-based DNA data storage. Nature Communications, v. 17, art. 3963, 2026. DOI: https://doi.org/10.1038/s41467-026-70548-3."},
    {id:"wang2026",kind:"Armazenamento em DNA — publicação antecipada",doi:"10.1038/s41467-026-78759-4",url:"https://doi.org/10.1038/s41467-026-78759-4",abnt:"WANG, Y. et al. Towards scalable DNA data storage with DNA-SaM codec system. Nature Communications, publicação antecipada, 2026. DOI: https://doi.org/10.1038/s41467-026-78759-4."},
    {id:"hutchison2016",kind:"Genoma sintético mínimo",doi:"10.1126/science.aad6253",url:"https://doi.org/10.1126/science.aad6253",abnt:"HUTCHISON, Clyde A. III et al. Design and synthesis of a minimal bacterial genome. Science, v. 351, n. 6280, art. aad6253, 2016. DOI: https://doi.org/10.1126/science.aad6253."},
    {id:"watson2023",kind:"Projeto de proteínas com IA",doi:"10.1038/s41586-023-06415-8",url:"https://doi.org/10.1038/s41586-023-06415-8",abnt:"WATSON, Joseph L. et al. De novo design of protein structure and function with RFdiffusion. Nature, v. 620, p. 1089-1100, 2023. DOI: https://doi.org/10.1038/s41586-023-06415-8."},
    {id:"quantum2025",kind:"Comparação de software quântico",doi:"10.1038/s43588-025-00792-y",url:"https://doi.org/10.1038/s43588-025-00792-y",abnt:"NATION, Paul D. et al. Benchmarking the performance of quantum computing software for quantum circuit creation, manipulation and compilation. Nature Computational Science, v. 5, p. 427-435, 2025. DOI: https://doi.org/10.1038/s43588-025-00792-y."}
  ],
  studiesByTechnology: {
    "Predictive Conflict Modeling":["hegre2019"],
    "DNA Data Storage":["erlich2017","gimpel2026","wang2026"],
    "Synthetic Chromosome":["hutchison2016"],
    "AI-Powered Protein Design":["watson2023"],
    "Quantum Computing":["quantum2025"]
  },
  repos: [
    {label:"VIEWS Platform — previsão de conflitos",url:"https://github.com/views-platform/views-pipeline-core"},
    {label:"DnaChisel — otimização de sequências de DNA",url:"https://github.com/Edinburgh-Genome-Foundry/DnaChisel"},
    {label:"RFdiffusion — projeto de proteínas",url:"https://github.com/RosettaCommons/RFdiffusion"},
    {label:"Qiskit — computação quântica",url:"https://github.com/Qiskit/qiskit"},
    {label:"CropHarvest — agricultura e satélites",url:"https://github.com/nasaharvest/cropharvest"},
    {label:"GTD histórica — Kaggle (não atual)",url:"https://www.kaggle.com/Start-UMD/gtd"}
  ]
};
