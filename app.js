/* Radar.PT — interface original e independente, sem bibliotecas remotas.
 * Dados: snapshot público Envisioning/WKO; traduções/resumos: adaptação editorial.
 */
(() => {
  "use strict";
  const origin = "https://innovationmap.at/";
  const board = window.RADAR_BOARD?.data?.board;
  const legacyBoard = window.RADAR_LEGACY?.data?.board;
  const labels = window.PT_CONTENT;
  const education = window.RADAR_GUIDE || {};
  const model = window.RADAR_MODEL;
  const fullPT = window.PT_FULL?.entries || {};
  const sourceSummariesPT = window.PT_FULL?.summaries || {};
  const $ = (id) => document.getElementById(id);
  const svgNS = "http://www.w3.org/2000/svg";
  const sectorOrder = ["Data Era","Human Expansion","Generate & Drive","Agritech & Food","Smart Living"];
  const sectors = [...(board?.collections || [])].sort((a,b)=>sectorOrder.indexOf(a.name)-sectorOrder.indexOf(b.name));
  const sectorById = new Map();
  for (const sector of sectors) for (const id of sector.entitiesId || []) sectorById.set(id, sector.name);
  const organizationById = new Map((board?.allOrganizations || []).map(o => [o.id, o]));
  function normalizeName(value){return String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");}
  const translationByName=new Map(Object.entries(labels?.technologies||{}).map(([key,value])=>[normalizeName(key),value]));
  const aliasByName=new Map(Object.entries(labels?.aliases||{}).map(([key,value])=>[normalizeName(key),value]));
  const topicSets=Object.fromEntries(Object.entries(labels?.topics||{}).map(([id,topic])=>[id,new Set(topic.names.map(normalizeName))]));
  function mapped(item,sector,status,edition=null){
    const [title,summary]=translationByName.get(normalizeName(item.name)) || [item.name,"Tecnologia registrada na fonte. Consulte as referências e a descrição original."];
    const aliases=aliasByName.get(normalizeName(item.name))||[];
    const searchable=[title,summary,sourceSummariesPT[item.id]||"",item.name,sector,edition||"",...(item.synonyms||[]),...aliases,item.description?.shortText||"",String(item.description?.longTextHtml||"").replace(/<[^>]*>/g," "),...(item.domain||[]),...(fullPT[item.id]||[]).map(x=>x.text),...(item.organizations||[]).map(id=>organizationById.get(id)?.name||"")].join(" ");
    return {...item,sourceId:item.id,id:status==="current"?item.id:`${status}:${item.id}`,title,summary,sector,status,edition,trl:Number(item.trl)||1,searchIndex:removeDiacritics(searchable)};
  }
  const entries=(board?.entities||[]).map(item=>mapped(item,sectorById.get(item.id)||"Sem tendência","current"));
  const oldSectorById=new Map();
  for(const sector of legacyBoard?.collections||[])for(const id of sector.entitiesId||[])oldSectorById.set(id,sector.name);
  const currentNames=new Set(entries.map(e=>normalizeName(e.name)));
  const archivedNames=new Set((board?.archive||[]).map(e=>normalizeName(e.name)));
  const legacyOnly=(legacyBoard?.entities||[]).filter(e=>!currentNames.has(normalizeName(e.name))&&!archivedNames.has(normalizeName(e.name)));
  const historicalEntries=[...(board?.archive||[]).map(e=>mapped(e,e.collectionTitle||"Sem tendência","archive",e.edition||"Histórico")),...legacyOnly.map(e=>mapped(e,oldSectorById.get(e.id)||"Sem tendência","legacy","Snapshot anterior"))];
  const allEntries=[...entries,...historicalEntries];
  const byId=new Map(allEntries.map(e=>[e.id,e]));
  const state = {
    view: "radar", query: "", minTRL: 1, minSRL: 0, selectedSDG: 0, sort: "name", activeSectors: new Set(sectors.map(s => s.name)),
    favoritesOnly: false, favorites: readFavorites(), comparing: [], selectedId: null, zoom: 1, topic: null
  };
  // Preserva os favoritos da versão anterior, cujos identificadores foram substituídos no novo catálogo.
  const oldById=new Map((legacyBoard?.entities||[]).map(e=>[e.id,normalizeName(e.name)]));
  const newByName=new Map(allEntries.map(e=>[normalizeName(e.name),e.id]));
  state.favorites=new Set([...state.favorites].map(id=>byId.has(id)?id:newByName.get(oldById.get(id))).filter(id=>byId.has(id)));
  let toastTimer;

  function readFavorites() {
    try { return new Set(JSON.parse(localStorage.getItem("radar-pt:favorites") || "[]")); }
    catch { return new Set(); }
  }
  function persistFavorites() { try { localStorage.setItem("radar-pt:favorites", JSON.stringify([...state.favorites])); } catch {} }
  function removeDiacritics(value) { return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function formatScore(value) { return Number.isFinite(Number(value)) ? Number(value).toFixed(2).replace(".", ",") : "—"; }
  function sectorLabel(name) { return labels.sectors[name]?.[0] || name; }
  function sectorColor(name) { return labels.sectors[name]?.[1] || "#75d5ec"; }
  function sourceUrl(tech) { return tech?.status === "current" ? `${origin}?pg=technology_${encodeURIComponent(tech.sourceId)}` : `${origin}?pg=home`; }
  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = String(text);
    return element;
  }
  function svgNode(tag, attrs = {}, text = null) {
    const n = document.createElementNS(svgNS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
    if (text !== null) n.textContent = text;
    return n;
  }
  function button(text, className, handler) {
    const b = node("button", className, text); b.type = "button"; b.addEventListener("click", handler); return b;
  }
  function normalLink(url, labelText) {
    const link = node("a", "", labelText);
    link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer";
    return link;
  }
  function toast(message) {
    const box = $("toast"); box.textContent = message; box.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => box.classList.remove("show"), 2500);
  }
  function filtered(items=entries) {
    const term = removeDiacritics(state.query.trim());
    const result = items.filter(e => {
      if (!state.activeSectors.has(e.sector) || e.trl < state.minTRL) return false;
      if (!model.matchesSDGandSRL(e,board,state.selectedSDG,state.minSRL)) return false;
      if (state.favoritesOnly && !state.favorites.has(e.id)) return false;
      if (state.topic && !topicSets[state.topic]?.has(normalizeName(e.name))) return false;
      if (!term) return true;
      return e.searchIndex.includes(term);
    });
    return result.sort((a, b) => {
      if (state.sort === "trl-desc") return b.trl - a.trl || a.title.localeCompare(b.title, "pt-BR");
      if (state.sort === "trl-asc") return a.trl - b.trl || a.title.localeCompare(b.title, "pt-BR");
      if (state.sort === "sector") return sectorLabel(a.sector).localeCompare(sectorLabel(b.sector), "pt-BR") || a.title.localeCompare(b.title, "pt-BR");
      return a.title.localeCompare(b.title, "pt-BR");
    });
  }
  function buildSectorFilters() {
    const holder = $("sector-filters"); holder.replaceChildren();
    for (const sector of sectors) {
      const active = state.activeSectors.has(sector.name);
      const b = button("", `sector-filter${active ? " active" : ""}`, () => {
        if (state.activeSectors.has(sector.name)) state.activeSectors.delete(sector.name);
        else state.activeSectors.add(sector.name);
        render();
      });
      b.setAttribute("aria-pressed", String(active));
      b.style.setProperty("--sector-color", sectorColor(sector.name));
      b.append(node("span", "sector-dot"), node("span", "", sectorLabel(sector.name)), node("span", "sector-total", (sector.entitiesId || []).length));
      holder.append(b);
    }
  }
  function buildTopicShortcuts(){
    const holder=$("topic-shortcuts");holder.replaceChildren();
    for(const [id,topic] of Object.entries(labels.topics||{})){
      const active=state.topic===id;
      const chip=button(topic.label,`topic-chip${active?" active":""}`,()=>{
        state.topic=active?null:id;state.query="";state.minTRL=1;state.minSRL=0;state.selectedSDG=0;state.favoritesOnly=false;state.activeSectors=new Set(sectors.map(s=>s.name));
        $("search-input").value="";$("trl-slider").value="1";$("srl-select").value="0";$("sdg-select").value="0";$("favorites-filter").setAttribute("aria-pressed","false");$("favorites-filter").classList.remove("active");
        render();switchView("catalog");
      });
      chip.style.setProperty("--topic-color",topic.color);
      chip.setAttribute("aria-pressed",String(active));
      holder.append(chip);
    }
  }
  function hashText(s) { let h = 2166136261; for (const char of s) { h ^= char.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function polar(deg, radius, cx = 450, cy = 450) { const a = deg * Math.PI / 180; return { x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius }; }
  function wedgePath(start, end, inner, outer) {
    const a = polar(start, outer), b = polar(end, outer), c = polar(end, inner), d = polar(start, inner);
    return `M ${a.x} ${a.y} A ${outer} ${outer} 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 0 0 ${d.x} ${d.y} Z`;
  }
  function renderRadar(current) {
    const svg=$("radar-svg"); svg.replaceChildren();
    const core=svgNode("g",{transform:`translate(700 700) scale(${state.zoom}) translate(-700 -700)`});svg.append(core);
    const p=(angle,r)=>polar(angle,r,700,700);
    const wedge=(start,end,inner,outer)=>{
      const a=p(start,outer),b=p(end,outer),c=p(end,inner),d=p(start,inner);
      return `M ${a.x} ${a.y} A ${outer} ${outer} 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 0 0 ${d.x} ${d.y} Z`;
    };
    core.append(svgNode("circle",{cx:700,cy:700,r:418,fill:"#101e34",stroke:"#344966","stroke-width":2}));
    sectors.forEach((sector,index)=>{
      const start=-90+index*72,end=start+72,color=sectorColor(sector.name);
      const area=svgNode("path",{d:wedge(start,end,94,420),fill:color,opacity:.08,class:"sector-area"});
      area.addEventListener("click",()=>{state.activeSectors=new Set([sector.name]);render();toast(`Filtro: ${sectorLabel(sector.name)}`);});core.append(area);
      const bound=p(start,424);core.append(svgNode("line",{x1:700,y1:700,x2:bound.x,y2:bound.y,stroke:color,"stroke-opacity":.3,"stroke-width":1.5}));
      const middle=p((start+end)/2,462);
      core.append(svgNode("text",{x:middle.x,y:middle.y,fill:color,class:"radar-svg-label","text-anchor":"middle","dominant-baseline":"central",stroke:"#101e34","stroke-width":8,"paint-order":"stroke"},sectorLabel(sector.name).toUpperCase()));
    });
    for(let trl=1;trl<=9;trl++){
      const r=122+(9-trl)*28;
      core.append(svgNode("circle",{cx:700,cy:700,r,fill:"none",stroke:trl===1?"#58738e":"#304660","stroke-width":trl===1?2:1,"stroke-dasharray":trl===1?"":"4 6",opacity:.85}));
      const ringLabel=p(-92,r);core.append(svgNode("text",{x:ringLabel.x,y:ringLabel.y,class:"ring-text","text-anchor":"middle"},String(trl)));
    }
    const visible=new Set(current.map(e=>e.id));
    for(const pos of model.radialLayout(board.entities,board.collections)){
      const tech=byId.get(pos.id);if(!tech)continue;
      const show=visible.has(tech.id),color=sectorColor(tech.sector),d=p(pos.angle,pos.dotRadius),l=p(pos.angle,pos.labelRadius),arc=p(pos.angle,424);
      const filteredClass=show?"":" filtered";
      core.append(svgNode("line",{x1:arc.x,y1:arc.y,x2:l.x,y2:l.y,stroke:color,"stroke-width":.75,"stroke-opacity":show?.62:.07,"pointer-events":"none"}));
      const rad=pos.angle*Math.PI/180,pointsRight=Math.cos(rad)>=0,rotation=pointsRight?pos.angle:pos.angle+180;
      const t=svgNode("text",{x:l.x,y:l.y,fill:color,transform:`rotate(${rotation}, ${l.x}, ${l.y})`,"text-anchor":pointsRight?"start":"end","dominant-baseline":"central",class:`radar-tech-label${filteredClass}`,tabindex:show?0:-1,role:"button","aria-label":`${pos.number}. ${tech.title}`},`${pos.number}. ${tech.title.length>28?tech.title.slice(0,27)+"…":tech.title}`);
      const dot=svgNode("circle",{cx:d.x,cy:d.y,r:state.selectedId===tech.id?8.5:5.8,fill:color,class:`tech-dot${filteredClass}${state.selectedId===tech.id?" selected":""}`,tabindex:show?0:-1,role:"button","aria-label":`${tech.title}, TRL ${tech.trl}`});
      for(const el of [t,dot]){
        el.append(svgNode("title",{},`${pos.number}. ${tech.title} · TRL ${tech.trl}`));
        el.addEventListener("click",()=>{if(show)openDetail(tech.id);});
        el.addEventListener("pointerenter",e=>{if(show)showTooltip(e,tech);});
        el.addEventListener("pointermove",e=>{if(show)showTooltip(e,tech);});
        el.addEventListener("pointerleave",hideTooltip);
        el.addEventListener("focus",()=>{if(show)showTooltip(null,tech);});
        el.addEventListener("blur",hideTooltip);
        el.addEventListener("keydown",e=>{if(show&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openDetail(tech.id);}});
      }
      core.append(t,dot);
    }
    core.append(svgNode("circle",{cx:700,cy:700,r:93,fill:"#112b42",stroke:"#5fcce0","stroke-opacity":.6,"stroke-width":2}));
    core.append(svgNode("text",{x:700,y:691,fill:"#c8effb","text-anchor":"middle","font-size":24,"font-weight":850},"WKO 26/27"));
    core.append(svgNode("text",{x:700,y:716,fill:"#84a9bf","text-anchor":"middle","font-size":13},"RADAR.PT · 105 TECNOLOGIAS"));
    $("results-radar").textContent = `${current.length} tecnologias no recorte selecionado. Clique em um ponto para abrir a ficha.`;
    $("visible-count").textContent = current.length;
    $("zoom-indicator").textContent = `${Math.round(state.zoom*100)}%`;
  }
  function showTooltip(event, tech) {
    const tooltip = $("radar-tooltip");
    tooltip.replaceChildren(node("b","",tech.title),node("span","",`${sectorLabel(tech.sector)} · TRL ${tech.trl}`));
    tooltip.hidden = false;
    if (event) {
      const rect = $("radar-svg").getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      tooltip.style.left = `${Math.min(x+15,rect.width-265)}px`;
      tooltip.style.top = `${Math.max(0,y-55)}px`;
    } else {tooltip.style.left="45%";tooltip.style.top="10%";}
  }
  function hideTooltip() {$("radar-tooltip").hidden=true;}

  function renderCatalog(current) {
    $("catalog-count").textContent = `${current.length} registros encontrados · selecione uma ficha para explorar.`;
    const grid = $("catalog-grid"); grid.replaceChildren();
    if (!current.length) {grid.append(emptyState("Nenhuma tecnologia corresponde aos filtros atuais.","Ajuste a busca ou limpe os filtros."));return;}
    for (const e of current) {
      const card=button("","tech-card",()=>openDetail(e.id));
      const category=node("span","card-category",sectorLabel(e.sector));category.style.color=sectorColor(e.sector);
      card.append(category,node("span","card-name",e.title),node("span","card-summary",e.summary));
      const bottom=node("span","card-bottom");bottom.append(node("span","trl-badge",`TRL ${e.trl}`),node("span","card-link","Abrir ficha ↗"));card.append(bottom);grid.append(card);
    }
  }
  function renderArchive(current) {
    $("archive-count").textContent=`${current.length} registros históricos encontrados de ${historicalEntries.length} disponíveis: ${board?.archive?.length||0} da API oficial e ${legacyOnly.length} remanescentes do snapshot anterior.`;
    const grid=$("archive-grid");grid.replaceChildren();
    if(!current.length){grid.append(emptyState("Nenhum registro histórico corresponde aos filtros.","Limpe os filtros para visualizar o acervo completo."));return;}
    for(const e of current){
      const card=button("","tech-card",()=>openDetail(e.id));
      const category=node("span","card-category",`${sectorLabel(e.sector)} · ${e.status==="archive"?`ARQUIVO ${e.edition}`:"SNAPSHOT ANTERIOR"}`);
      category.style.color=e.status==="archive"?"#eebf88":"#9cb3c9";
      card.append(category,node("span","card-name",e.title),node("span","card-summary",e.summary));
      const bottom=node("span","card-bottom");bottom.append(node("span","trl-badge",`TRL ${e.trl}`),node("span","card-link","Abrir histórico ↗"));card.append(bottom);grid.append(card);
    }
  }
  function emptyState(title,text){const el=node("div","empty-state");el.append(node("strong","",title),node("span","",text));return el;}
  function renderGuide(){education.renderGuide?.();}
  function renderCompare() {
    const holder=$("comparison-content");holder.replaceChildren();$("compare-count").textContent=state.comparing.length;
    if (!state.comparing.length){holder.append(emptyState("Nenhuma tecnologia selecionada.","Abra uma ficha no mapa ou no catálogo e escolha “Comparar”."));return;}
    const chosen=state.comparing.map(id=>byId.get(id)).filter(Boolean);
    const wrapper=node("div","compare-wrapper"), table=node("table","compare-table");
    function row(title, getter, header=false) {
      const tr=node("tr"),th=node("th","",title);tr.append(th);
      chosen.forEach(e=>{const cell=node(header?"th":"td","",String(getter(e)));tr.append(cell);});
      table.append(tr);
    }
    row("Tecnologia",e=>e.title,true);row("Tendência",e=>sectorLabel(e.sector));
    row("Maturidade TRL",e=>`${e.trl}/9 · ${labels.trlShort[e.trl]||""}`);
    row("SRL (catálogo atual)",e=>formatScore(e.srl?.value));
    row("Prontidão (snapshot anterior)",e=>formatScore(e.readinessScore?.readiness));
    for(const [key,name] of Object.entries(labels.metricLabels))row(name,e=>formatScore(e.readinessScore?.averageScores?.[key]));
    wrapper.append(table);holder.append(wrapper);
    const note=node("p","detail-summary","Os indicadores são reproduzidos do conjunto de dados original, com escalas e critérios próprios; não equivalem a pontuações clínicas nem a rankings validados independentemente.");note.style.marginTop="19px";holder.append(note);
    chosen.forEach(e=>holder.append(button(`Remover ${e.title} da comparação`,"mini-remove",()=>{state.comparing=state.comparing.filter(id=>id!==e.id);renderCompare();refreshDetailButtons();})));
  }

  function openDetail(id) {
    const tech=byId.get(id);if(!tech)return;
    state.selectedId=id;const root=$("detail-content");root.replaceChildren();root.scrollTop=0;
    const meta=model.detailFor(tech,board,fullPT);
    const edition=tech.status==="current"?"TECNOLOGIA ATUAL":tech.status==="archive"?`ARQUIVO ${tech.edition}`:"SNAPSHOT ANTERIOR";
    const category=node("span","detail-kicker",`${sectorLabel(tech.sector)} · ${edition}`);category.style.color=sectorColor(tech.sector);
    root.append(category,node("h2","",`${meta.technologyNumber?`${meta.technologyNumber}. `:""}${tech.title}`),node("p","original-title",`Título original: ${tech.name}`));
    const actions=node("div","detail-actions");
    const favorite=button("","button button-secondary",()=>{if(state.favorites.has(id))state.favorites.delete(id);else state.favorites.add(id);persistFavorites();refreshDetailButtons();render();toast(state.favorites.has(id)?"Adicionado aos favoritos.":"Removido dos favoritos.");});favorite.id="favorite-current";
    const compare=button("","button button-quiet",()=>{if(state.comparing.includes(id))state.comparing=state.comparing.filter(x=>x!==id);else if(state.comparing.length>=3){toast("O limite de comparação é de três tecnologias.");return;}else state.comparing.push(id);renderCompare();refreshDetailButtons();toast("Comparação atualizada.");});compare.id="compare-current";
    actions.append(favorite,compare);root.append(actions);refreshDetailButtons();
    function meter(label,score,scaleTitle,description,color){
      const section=node("section","readiness-meter");section.append(node("div","meter-heading",label));
      const row=node("div","meter-segments");const value=Math.max(0,Math.min(9,Number(score)||0));
      for(let n=1;n<=9;n++){const segment=node("span",n<=value?"on":"");segment.style.setProperty("--meter-color",color);row.append(segment);}
      section.append(row,node("p","meter-caption",`${Number.isFinite(Number(score))&&score!==null?`${score} / 9`:`— / 9`} · ${scaleTitle}`));
      if(description)section.append(node("small","meter-description",description));
      return section;
    }
    function explainLevel(section,kind,level){
      const description=education[kind]?.[level];if(!description)return section;
      const help=node("details","meter-help");help.append(node("summary","","O que significa este nível?"),node("p","",description.plain));
      if(description.evidence)help.append(node("small","",`Evidência típica: ${description.evidence}`));
      section.append(help);return section;
    }
    root.append(explainLevel(meter("Nível de prontidão tecnológica (TRL)",meta.trl,labels.trlShort[meta.trl]||"Maturidade", "A escala de 1 a 9 representa a maturidade tecnológica informada pela fonte.",sectorColor(tech.sector)),"trl",meta.trl));
    if(tech.srl)root.append(explainLevel(meter("Nível de prontidão social (SRL)",meta.srl,labels.srlLabels[meta.srl]||"Prontidão social","A escala de 1 a 9 indica a incorporação social segundo critérios da fonte.","#b4d9f3"),"srl",meta.srl));
    else if(tech.readinessScore)root.append(node("p","detail-summary",`Prontidão da edição histórica: ${formatScore(tech.readinessScore.readiness)}. A escala SRL atual não está disponível para esta ficha.`));
    root.append(button("Consultar guia completo: TRL, SRL e ODS →","button button-quiet guide-open-button",()=>{closeDetail();switchView("guide");}));
    root.append(node("h3","","RESUMO DA FONTE · PORTUGUÊS BRASILEIRO"),node("p","detail-summary",sourceSummariesPT[tech.sourceId]||tech.summary));
    if(sourceSummariesPT[tech.sourceId])root.append(node("p","editorial-note",`Síntese editorial: ${tech.summary}`));
    root.append(node("h3","",`DESCRIÇÃO INTEGRAL EM PORTUGUÊS BRASILEIRO ${meta.translation.length?`(${meta.translation.length} BLOCOS)`:""}`));
    if(meta.translation.length){
      root.append(node("p","translation-notice","Tradução automática offline EN→PT, com ajustes terminológicos PT-BR. Não revisada por especialista; confira o original em inglês antes de citar."));
      const body=node("div","translated-body");
      for(const block of meta.translation)body.append(node(block.type==="h2"?"h4":block.type==="li"?"p":"p",block.type==="h2"?"translation-heading":block.type==="li"?"translation-list-item":"",block.text));
      root.append(body);
    }else root.append(node("p","detail-summary","Esta edição histórica não possui tradução integral incorporada. Consulte o resumo em português e o texto da fonte abaixo."));
    if(meta.imageCredit)root.append(node("p","image-credit",`Crédito da imagem na ficha original: ${meta.imageCredit} · ${tech.imageCopyright||""}`));
    root.append(node("h3","",`OBJETIVOS DE DESENVOLVIMENTO SUSTENTÁVEL (${meta.sdgNumbers.length})`));
    const sdgs=node("div","sdg-list");for(const number of meta.sdgNumbers)sdgs.append(node("span","sdg-item",`ODS ${String(number).padStart(2,"0")} · ${labels.sdgLabels[number]||"Objetivo de desenvolvimento sustentável"}`));
    if(!meta.sdgNumbers.length)sdgs.append(node("span","sdg-item","ODS não informado nesta edição"));root.append(sdgs);
    if((tech.domain||[]).length){root.append(node("h3","","DOMÍNIOS TÉCNICOS"));const tags=node("div","detail-tags");for(const domain of tech.domain)tags.append(node("span","",labels.domainLabels[domain]||domain.replaceAll("_"," ")));root.append(tags);}
    root.append(node("h3","",`ORGANIZAÇÕES (${meta.organizations.length})`));
    const orgList=node("ul","entity-list");for(const org of meta.organizations){const li=node("li");li.append(org.url?normalLink(org.url,org.name):node("span","",org.name));if(org.country)li.append(node("small","",` (${org.country})`));orgList.append(li);}
    if(!meta.organizations.length)orgList.append(node("li","","Organizações não informadas nesta edição."));root.append(orgList);
    root.append(node("h3","",`FONTES E ESTUDOS (${meta.sources.length})`));
    const sourceList=node("ol","source-list");for(const ref of meta.sources){const li=node("li");li.append(normalLink(ref.url,ref.name));const host=node("small","source-host",new URL(ref.url).hostname);li.append(host);sourceList.append(li);}
    if(!meta.sources.length)sourceList.append(node("li","","Referências não informadas nesta edição."));root.append(sourceList);
    const studies=(education.studiesByTechnology?.[tech.name]||[]).map(id=>education.references?.find(ref=>ref.id===id)).filter(Boolean);
    root.append(node("h3","",`ESTUDOS CIENTÍFICOS VERIFICADOS (${studies.length})`));
    if(studies.length){
      const curated=node("ol","source-list curated-studies");for(const ref of studies){const li=node("li");li.append(node("p","",`${ref.abnt} Disponível em: ${ref.url}. Acesso em: 1 nov. 2026.`),normalLink(ref.url,"Consultar publicação e DOI ↗"));curated.append(li);}root.append(curated);
    }else root.append(node("p","editorial-note","Ainda não foi realizada curadoria acadêmica adicional para esta ficha. As referências da fonte original acima podem não conter dados suficientes para uma entrada ABNT completa."));
    root.append(node("p","editorial-note","Estudos relacionados não validam de forma independente os níveis TRL/SRL informados pela Innovation Map."));
    const original=node("details","original-content");original.append(node("summary","","Fonte original em inglês — conferência acadêmica"));
    original.append(node("p","editorial-note","Material original para rastreabilidade e comparação terminológica. A tradução integral em português está disponível acima."));
    if(tech.description?.shortText)original.append(node("p","",tech.description.shortText));
    const originalText=String(tech.description?.longTextHtml||tech.description?.longText||"").replace(/<\/(?:p|h1|h2|h3|li)>/gi,"\n\n").replace(/<[^>]+>/g,"");
    if(originalText){const en=node("p","",originalText);en.style.whiteSpace="pre-wrap";original.append(en);}root.append(original);
    root.append(normalLink(sourceUrl(tech),"Ver ficha na Innovation Map oficial ↗"));
    if(tech.status==="current"){
      const nav=model.neighbors(model.numbered(board.entities),tech.sourceId),bar=node("div","detail-neighbors");
      bar.append(button(nav.previous?`← ${nav.previous.number}. Anterior`:"Início","button button-quiet",()=>{if(nav.previous)openDetail(nav.previous.id);}));
      bar.append(button(nav.next?`${nav.next.number}. Próxima →`:"Fim","button button-quiet",()=>{if(nav.next)openDetail(nav.next.id);}));root.append(bar);
    }
    $("detail-panel").classList.add("open");$("detail-panel").setAttribute("aria-hidden","false");$("detail-backdrop").hidden=false;
    $("close-detail").focus();renderRadar(filtered());
  }
  function refreshDetailButtons(){const fav=$("favorite-current"),cmp=$("compare-current");if(fav&&state.selectedId)fav.textContent=state.favorites.has(state.selectedId)?"★ Favorito":"☆ Favoritar";if(cmp&&state.selectedId)cmp.textContent=state.comparing.includes(state.selectedId)?"✓ Comparando":"⇄ Comparar";}
  function closeDetail(){state.selectedId=null;$("detail-panel").classList.remove("open");$("detail-panel").setAttribute("aria-hidden","true");$("detail-backdrop").hidden=true;hideTooltip();renderRadar(filtered());}
  function switchView(view){state.view=view;for(const id of ["radar","catalog","archive","compare","guide","about"]){const section=$(`view-${id}`);section.hidden=id!==view;section.classList.toggle("active",id===view);}document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.view===view));if(view==="compare")renderCompare();if(view==="radar")renderRadar(filtered());window.scrollTo({top:0,behavior:"smooth"});}
  function setZoom(value){state.zoom=Math.max(.75,Math.min(2,Math.round(value*10)/10));renderRadar(filtered());}
  function clearFilters(){state.query="";state.topic=null;state.minTRL=1;state.minSRL=0;state.selectedSDG=0;state.sort="name";state.favoritesOnly=false;state.activeSectors=new Set(sectors.map(s=>s.name));$("search-input").value="";$("sort-select").value="name";$("trl-slider").value="1";$("srl-select").value="0";$("sdg-select").value="0";$("favorites-filter").setAttribute("aria-pressed","false");$("favorites-filter").classList.remove("active");render();}
  function render(){const current=filtered(),history=filtered(historicalEntries);$("stat-total").textContent=entries.length;$("stat-history").textContent=historicalEntries.length;$("archive-nav-count").textContent=historicalEntries.length;$("trl-number").textContent=state.minTRL;buildSectorFilters();buildTopicShortcuts();renderRadar(current);renderCatalog(current);renderArchive(history);renderCompare();}
  function csvEncode(value){return `"${String(value??"").replaceAll('"','""')}"`;}
  function exportCsv(){const isArchive=state.view==="archive",selected=isArchive?filtered(historicalEntries):filtered(entries);
    const columns=["Título em português","Título original","Tendência","Situação","Edição","TRL","SRL / prontidão (fonte)","URL de referência"];
    const rows=selected.map(e=>[e.title,e.name,sectorLabel(e.sector),e.status==="current"?"Atual":e.status==="archive"?"Arquivo oficial":"Snapshot anterior",e.edition||"",e.trl,e.srl?.value??e.readinessScore?.readiness??"",sourceUrl(e)]);
    const csv="\uFEFF"+[columns,...rows].map(values=>values.map(csvEncode).join(";")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=isArchive?"radar_historico_67_registros_ptbr.csv":"radar_atual_105_tecnologias_ptbr.csv";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`${rows.length} registros exportados em CSV.`);
  }
  function bindEvents(){
    document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>switchView(b.dataset.view)));
    $("search-input").addEventListener("input",e=>{state.query=e.target.value;state.topic=null;render();});
    $("sort-select").addEventListener("change",e=>{state.sort=e.target.value;render();});
    $("trl-slider").addEventListener("input",e=>{state.minTRL=Number(e.target.value);render();});
    $("srl-select").addEventListener("change",e=>{state.minSRL=Number(e.target.value);render();});
    $("sdg-select").addEventListener("change",e=>{state.selectedSDG=Number(e.target.value);render();});
    $("favorites-filter").addEventListener("click",e=>{state.favoritesOnly=!state.favoritesOnly;e.currentTarget.setAttribute("aria-pressed",String(state.favoritesOnly));e.currentTarget.classList.toggle("active",state.favoritesOnly);render();});
    $("clear-filters").addEventListener("click",clearFilters);$("export-button").addEventListener("click",exportCsv);
    $("zoom-in").addEventListener("click",()=>setZoom(state.zoom+.1));$("zoom-out").addEventListener("click",()=>setZoom(state.zoom-.1));$("zoom-reset").addEventListener("click",()=>setZoom(1));
    $("clear-compare").addEventListener("click",()=>{state.comparing=[];renderCompare();refreshDetailButtons();});
    $("close-detail").addEventListener("click",closeDetail);$("detail-backdrop").addEventListener("click",closeDetail);
    document.addEventListener("keydown",event=>{if(event.key==="Escape")closeDetail();if(event.key==="/"&&!/input|textarea/i.test(document.activeElement?.tagName||"")){event.preventDefault();$("search-input").focus();}});
  }
  function init(){if(!board||!legacyBoard||!labels||!model||!entries.length){$("results-radar").textContent="Não foi possível carregar os catálogos. Verifique os arquivos de dados locais.";toast("Dados locais não encontrados.");return;}
    for(const [n,name] of Object.entries(labels.srlLabels)){const option=node("option","",`SRL ≥ ${n} · ${name}`);option.value=n;$("srl-select").append(option);}
    for(const [n,name] of Object.entries(labels.sdgLabels)){const option=node("option","",`ODS ${String(n).padStart(2,"0")} · ${name}`);option.value=n;$("sdg-select").append(option);}
    bindEvents();renderGuide();render();switchView("radar");}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
