const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const model = require('../model.js');

const live = require('../data/board-live.json').data.board;
const old = require('../data/board.json').data.board;
const normalize = name => name.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const currentNames = new Set([...live.entities, ...live.archive].map(t => normalize(t.name)));
const extra = old.entities.filter(t => !currentNames.has(normalize(t.name)));
const historical = [...live.archive, ...extra];

test('todas as 67 fichas históricas têm resumo e texto integral traduzido para PT-BR', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../data/pt-full.js'), 'utf8'),context);
  const {entries, summaries} = context.window.PT_FULL;
  assert.equal(live.archive.length, 61);
  assert.equal(extra.length, 6);
  assert.equal(Object.keys(entries).length, 172);
  for (const tech of historical) {
    const id = String(tech.id);
    const translation = entries[id];
    const englishText = tech.description.longTextHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    assert.ok(summaries[id]?.length > 35, `Resumo não traduzido: ${tech.name}`);
    assert.ok(translation?.length >= 2, `Tradução extensa ausente: ${tech.name}`);
    assert.ok(translation.every(b => ['p','h2','li'].includes(b.type) && b.text.length > 2), `Estrutura inválida: ${tech.name}`);
    assert.ok(translation.reduce((n,b) => n + b.text.length, 0) > englishText.length * .37,
      `Tradução incompleta: ${tech.name}`);
    assert.equal(model.detailFor(tech, live, entries).translation.length, translation.length,
      `A ficha não incorpora os blocos traduzidos: ${tech.name}`);
  }
});

test('Edifício de energia líquida zero inclui explicações e perspectivas em português', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../data/pt-full.js'), 'utf8'),context);
  const blocks = context.window.PT_FULL.entries['110939760'];
  assert.ok(blocks?.length >= 3);
  const full = blocks.map(b => b.text).join(' ');
  assert.match(full, /edif[ií]ci|constru[cç][aã]o/i);
  assert.match(full, /energia/i);
  assert.match(full, /perspectivas futuras/i);
  assert.ok(!/this model takes into account|with the growing demand/i.test(full));
});

test('leitura mostra tradução antes da seção inglesa recolhida para conferência acadêmica', () => {
  const source = fs.readFileSync(require.resolve('../app.js'), 'utf8');
  assert.ok(source.indexOf('root.append(body)') < source.indexOf('root.append(original)'),
    'A descrição traduzida deve vir antes do original em inglês');
  assert.match(source, /node\("details","original-content"\)/,
    'A seção de conferência deve ficar recolhida por padrão');
  assert.match(source, /Fonte original em inglês — conferência acadêmica/,
    'O rótulo precisa distinguir claramente a fonte original do conteúdo traduzido');
});
