/* Apresentação do guia, toda criada com textContent para evitar HTML de terceiros. */
(() => {
  "use strict";
  const guide=window.RADAR_GUIDE,labels=window.PT_CONTENT;
  if(!guide||!labels)return;
  function el(tag,className,text){const item=document.createElement(tag);if(className)item.className=className;if(text!==undefined)item.textContent=String(text);return item;}
  function external(url,text){const link=el("a","",text);link.href=url;link.target="_blank";link.rel="noopener noreferrer";return link;}
  function section(root,title,lead){const item=el("article","panel guide-panel");item.append(el("h3","",title));if(lead)item.append(el("p","guide-lead",lead));root.append(item);return item;}
  function scale(root,kind,title,lead){
    const item=section(root,title,lead),wrap=el("div","guide-table-wrap"),table=el("table","guide-table"),head=el("tr");
    for(const label of ["Nível","Descrição","Em linguagem simples",...(kind==="trl"?["Evidência típica"]:[])])head.append(el("th","",label));table.append(head);
    for(let i=1;i<=9;i++){
      const level=guide[kind][i],row=el("tr");row.append(el("td","guide-level",`${i}/9`),el("td","",level.name),el("td","",level.plain));
      if(level.evidence)row.append(el("td","",level.evidence));table.append(row);
    }
    wrap.append(table);item.append(wrap);
  }
  guide.renderGuide=()=>{
    const root=document.getElementById("guide-content");if(!root)return;root.replaceChildren();
    const intro=section(root,"Como interpretar o radar?","São quatro perguntas diferentes: o que a tecnologia faz; até onde foi testada; como a sociedade a recebe; e a quais objetivos sociais ela pode se relacionar.");
    intro.append(el("p","guide-notice","TRL 9 não comprova segurança absoluta, justiça social nem preço acessível. SRL 9 não comprova acesso igualitário. As classificações reproduzem a fonte original e não foram auditadas independentemente."));
    scale(root,"trl","1. TRL — os nove níveis de maturidade tecnológica","Da pesquisa inicial ao uso operacional. Os exemplos de evidência são didáticos e não substituem critérios setoriais oficiais.");
    scale(root,"srl","2. SRL — os nove níveis de preparação social","Da quase completa falta de conhecimento à ampla integração social. Os nomes refletem a classificação do radar WKO; não existe uma única escala SRL universal.");
    const categories=section(root,"3. As cinco categorias do radar","Agrupam tecnologias por assunto, não por importância ou qualidade. Os atalhos DNA, IA, quântica, energia e agrotecnologia são recortes editoriais adicionais.");
    const cards=el("div","guide-category-grid");for(const group of guide.sectors){const card=el("section","guide-category");card.append(el("h4","",labels.sectors[group.id]?.[0]||group.id),el("p","",group.description),el("small","",`Exemplos: ${group.example}.`));cards.append(card);}categories.append(cards);
    const ods=section(root,"4. Os 17 Objetivos de Desenvolvimento Sustentável","Os ODS são metas das Nações Unidas. A associação de uma tecnologia a um ODS indica pertinência temática, não impacto positivo automaticamente demonstrado.");
    const grid=el("div","guide-ods-grid");for(const record of guide.ods){const cell=el("section","guide-ods-item");cell.append(el("strong","",String(record.id).padStart(2,"0")),el("p","",`${labels.sdgLabels[record.id]}: ${record.example}`));grid.append(cell);}ods.append(grid);
    const fields=section(root,"5. Entenda a ficha de cada tecnologia","Resumo: funcionamento e aplicação. Perspectivas futuras: cenários, não garantias. Organizações: atores relacionados, sem comprovação automática de parceria. Fontes: títulos e links que ainda precisam de avaliação bibliográfica.");
    fields.append(el("p","guide-notice","Favoritos são marcações pessoais. Indicadores de edições históricas como viabilidade, demonstração, desejabilidade, investimento, competição e especialização não equivalem à escala SRL atual."));
    const studies=section(root,"6. GitHub, Kaggle e estudos em andamento","Use repositórios para estudar código e metodologias. Uma página GitHub não equivale a artigo revisado por pares; uma base Kaggle exige checagem de licença, proveniência e período de cobertura.");
    const links=el("ul","guide-repo-list");for(const repo of guide.repos){const li=el("li");li.append(external(repo.url,repo.label));links.append(li);}studies.append(links,el("p","guide-notice","A cópia do Global Terrorism Database no Kaggle contém dados de 1970 a 2017, sem representar um sistema de acompanhamento em tempo real. Consulte o produtor original e seus termos antes de reutilizar os dados."));
    const references=section(root,"7. Referências e citações — ABNT 6023:2025 e 10520:2023","Abaixo estão referências de artigos científicos com DOI verificado. Quando o artigo tem número eletrônico, ele aparece no lugar de páginas. Os links abrem publicações externas apenas quando acionados.");
    const ordered=el("ol","guide-ref-list");for(const ref of guide.references){const item=el("li");item.append(el("strong","",ref.kind),el("p","",`${ref.abnt} Disponível em: ${ref.url}. Acesso em: 1 nov. 2026.`),external(ref.url,"Consultar publicação / DOI ↗"));ordered.append(item);}references.append(ordered);
    references.append(el("p","guide-notice","Citação indireta: (Hegre et al., 2019). Em transcrição literal, acrescente página ou outra localização quando disponível. Os artigos destacados ajudam a estudar temas, mas não certificam os valores TRL/SRL da WKO."));
    const norms=section(root,"8. Normas e fontes oficiais","Para a forma das citações e bibliografias, confira as normas na ABNT ou pela biblioteca de sua instituição. Para objetivos globais, consulte a ONU; para maturidade técnica, consulte a NASA.");
    const official=el("ul","guide-repo-list");for(const [text,url] of [["Biblioteca UFES — normas ABNT atualizadas","https://biblioteca.ufes.br/normalizacao"],["NASA — Technology Readiness Levels","https://www.nasa.gov/directorates/somd/space-communications-navigation-program/technology-readiness-levels/"],["ONU Brasil — 17 ODS","https://brasil.un.org/pt-br/sdgs"],["WKO / Envisioning — radar original","https://innovationmap.at/?pg=home"]]){const li=el("li");li.append(external(url,text));official.append(li);}norms.append(official);
  };
})();
