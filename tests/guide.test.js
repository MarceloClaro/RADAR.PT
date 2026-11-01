/* Contratos de navegação, proveniência e apresentação offline do guia. */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

function guideData() {
  const file = path.join(root, "guide.js");
  assert.ok(fs.existsSync(file), "Guia de pesquisa local ausente");
  const context = {window: {}};
  vm.runInNewContext(fs.readFileSync(file, "utf8"), context, {filename: "guide.js", timeout: 2000});
  return context.window.RADAR_GUIDE;
}

test("menu fornece acesso navegável ao guia acadêmico offline", () => {
  assert.match(html, /data-view="guide"/, "Falta botão do guia");
  assert.match(html, /id="view-guide"/, "Falta tela do guia");
  assert.match(html, /id="guide-content"/, "Falta conteúdo didático");
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  assert.match(app, /"guide"/, "Navegação não reconhece a tela do guia");
  assert.match(app, /renderGuide\(/, "Conteúdo do guia não é renderizado");
});

test("escalas e categorias têm explicação acessível e completas", () => {
  const guide = guideData();
  assert.equal(Object.keys(guide.trl).length, 9);
  assert.equal(Object.keys(guide.srl).length, 9);
  for(let level = 1; level <= 9; level++) {
    assert.ok(guide.trl[level].plain.length > 35, `TRL ${level} sem explicação`);
    assert.ok(guide.srl[level].plain.length > 35, `SRL ${level} sem explicação`);
  }
  assert.equal(guide.sectors.length, 5);
  for(const sector of guide.sectors) assert.ok(sector.description.length > 45);
  assert.equal(guide.ods.length, 17);
  for(const item of guide.ods) assert.ok(item.example.length > 12);
});

test("fichas dão acesso a bibliografia acadêmica verificada sem inventar metadados", () => {
  const guide = guideData();
  for(const name of ["Predictive Conflict Modeling", "DNA Data Storage", "Synthetic Chromosome", "AI-Powered Protein Design"]) {
    assert.ok(guide.studiesByTechnology[name]?.length, `Sem estudos individuais: ${name}`);
    for(const id of guide.studiesByTechnology[name]) {
      const source = guide.references.find(item=>item.id === id);
      assert.ok(source, `Referência inexistente: ${id}`);
      assert.match(source.doi, /^10\.\d{4,9}\//);
      assert.match(source.abnt, /DOI:/);
    }
  }
  assert.match(fs.readFileSync(path.join(root, "app.js"), "utf8"), /studiesByTechnology/, "Fichas não exibem pesquisas vinculadas");
});

test("perfil de Marcelo Claro inclui retrato local e separa origem da adaptação", () => {
  assert.match(html, /MARCELO CLARO LARANJEIRA/i);
  assert.match(html, /github\.com\/MarceloClaro/i);
  assert.match(html, /src="marcelo-claro-avatar\.(?:png|jpg|jpeg)"/);
  assert.match(html, /Envisioning.*WKO|WKO.*Envisioning/s, "Falta atribuição da fonte original");
  const picture = path.join(root, "marcelo-claro-avatar.png");
  assert.ok(fs.existsSync(picture), "Retrato GitHub não está incorporado ao pacote offline");
  const magic = fs.readFileSync(picture).subarray(0,8).toString("hex");
  assert.equal(magic, "89504e470d0a1a0a", "Arquivo da fotografia não é PNG válido");
});
