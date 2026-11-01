/* Verificação automatizada sem rede nem execução de código do site de origem. */
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const root = path.resolve(__dirname, "..");
const context = { window: {} };
const source = fs.readFileSync(path.join(root,"data","board.json"));
const liveSource = fs.readFileSync(path.join(root,"data","board-live.json"));
const expectedHash = "5ebcb87d0e8fc74654578cce274e0f7125e082cbbf959b976014779affdcf52e";
assert.equal(crypto.createHash("sha256").update(source).digest("hex"),expectedHash,"Hash do catálogo alterado");
assert.equal(crypto.createHash("sha256").update(liveSource).digest("hex"),"5d60c3af0d4a90f11f04149df0178bd018fd12d0c73bdae1f17aa1aa55c4da31","Hash do catálogo atual alterado");
for(const file of ["data/board.js","translations.js"]){
  const code=fs.readFileSync(path.join(root,file),"utf8");
  vm.runInNewContext(code,context,{filename:file,timeout:3000});
}
const board=context.window.RADAR_BOARD.data.board;
const old=context.window.RADAR_LEGACY.data.board;
const dictionary=context.window.PT_CONTENT.technologies;
assert.equal(board.collections.length,5);
assert.equal(board.entities.length,105);
assert.equal(board.archive.length,61);
assert.equal(old.entities.length,105);
assert.equal(new Set(board.entities.map(e=>e.id)).size,105);
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
const normalizedTranslation=new Set(Object.keys(dictionary).map(norm));
for(const item of [...board.entities,...board.archive,...old.entities]){assert.ok(normalizedTranslation.has(norm(item.name)),`Tradução ausente: ${item.name}`);assert.ok(item.trl>=1&&item.trl<=9);}
const allNames=new Set([...board.entities,...board.archive,...old.entities].map(e=>norm(e.name)));
for(const [key,topic] of Object.entries(context.window.PT_CONTENT.topics)){
  assert.ok(topic.names.length>=4,`Recorte temático insuficiente: ${key}`);
  for(const name of topic.names)assert.ok(allNames.has(norm(name)),`Tema com tecnologia inexistente: ${name}`);
}
const chromosome=board.entities.find(e=>e.name==="Synthetic Chromosome");
const dnaStorage=board.entities.find(e=>e.name==="DNA Data Storage");
assert.equal(chromosome.trl,4);
assert.equal(dnaStorage.trl,5);
for(const entry of [chromosome,dnaStorage]){
  const translation=Object.entries(dictionary).find(([key])=>norm(key)===norm(entry.name))[1];
  const aliases=Object.entries(context.window.PT_CONTENT.aliases).find(([key])=>norm(key)===norm(entry.name))?.[1]||[];
  const corpus=[...translation,...aliases,entry.name,entry.description?.shortText||""].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  assert.ok(corpus.includes("dna sintetico"),`DNA sintético não indexado: ${entry.name}`);
}
const current=new Set(board.entities.map(e=>norm(e.name)));
const archival=new Set(board.archive.map(e=>norm(e.name)));
const legacyOnly=old.entities.filter(e=>!current.has(norm(e.name))&&!archival.has(norm(e.name)));
assert.equal(legacyOnly.length,6);
assert.equal(board.entities.length+board.archive.length+legacyOnly.length,172);
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
assert.ok(html.includes('lang="pt-BR"'));
for(const id of ["view-archive","archive-grid","archive-count","archive-nav-count","stat-history"])assert.ok(html.includes(`id="${id}"`),`Elemento de histórico ausente: ${id}`);
assert.ok(html.includes('id="topic-shortcuts"'));
assert.ok(!/<script[^>]+src=["']https?:/i.test(html),"Script externo no HTML");
assert.ok(!/<link[^>]+href=["']https?:/i.test(html),"Recurso externo no HTML");
const js=fs.readFileSync(path.join(root,"app.js"),"utf8");
new vm.Script(js,{filename:"app.js"});
assert.ok(!js.includes("fetch("),"A aplicação não deve consultar dados remotos");
assert.ok(!js.includes("eval("),"Não utilizar eval");
assert.ok(js.includes("e.searchIndex.includes(term)"),"Pesquisa textual ampliada não encontrada");
console.log("OK: 172 registros; 5 tendências; DNA sintético localizável; atalhos temáticos; traduções; integridade; sintaxe JS.");
