const test = require('node:test');
const assert = require('node:assert/strict');
const board = require('../data/board-live.json').data.board;
const model = require('../model.js');

test('ficha de Predictive Conflict Modeling preserva toda a estrutura oficial', () => {
  const tech = board.entities.find(item => item.id === '110939710');
  const detail = model.detailFor(tech, board, {
    '110939710': [{type:'p',text:'Tradução técnica em português.'}]
  });
  assert.equal(detail.technologyNumber, 6);
  assert.equal(detail.trl, 5);
  assert.equal(detail.srl, 3);
  assert.equal(detail.organizations.length, 11);
  assert.equal(detail.sources.length, 20);
  assert.deepEqual(detail.sdgNumbers, [1,16,17,10]);
  assert.equal(detail.translation.length, 1);
  assert.equal(detail.sourceUrl, 'https://innovationmap.at/?pg=technology_110939710');
});

test('organizações são resolvidas com nomes reais; URLs inseguras são descartadas', () => {
  const tech = board.entities.find(item => item.id === '110939710');
  const detail = model.detailFor(tech, board, {});
  assert.equal(detail.organizations[0].name, 'Hensoldt Analytics');
  assert.equal(detail.organizations[0].country, 'AT');
  assert.ok(detail.sources.every(s => /^https?:\/\//.test(s.url)));
  assert.equal(detail.translation.length, 0);
});

test('layout radial distribui todos os 105 títulos por cinco setores e 9 anéis TRL', () => {
  const positions = model.radialLayout(board.entities, board.collections);
  assert.equal(positions.length, 105);
  assert.equal(new Set(positions.map(p => p.id)).size, 105);
  assert.equal(new Set(positions.map(p => p.sector)).size, 5);
  assert.ok(positions.every(p => Number.isFinite(p.angle) && p.angle >= -90 && p.angle < 270));
  assert.ok(positions.every(p => p.trl >= 1 && p.trl <= 9));
  assert.ok(positions.every(p => p.labelRadius > p.dotRadius));
});

test('navegação anterior e próximo segue a numeração exibida pela fonte', () => {
  const list = model.numbered(board.entities);
  const index = list.findIndex(e => e.id === '110939710');
  assert.equal(list[index].number, 6);
  assert.equal(model.neighbors(list, '110939710').previous.id, list[index-1].id);
  assert.equal(model.neighbors(list, '110939710').next.id, list[index+1].id);
});

test('filtros combinados por ODS e SRL usam as classificações oficiais', () => {
  const tech = board.entities.find(item => item.id === '110939710');
  assert.equal(model.matchesSDGandSRL(tech,board,16,3),true);
  assert.equal(model.matchesSDGandSRL(tech,board,12,3),false);
  assert.equal(model.matchesSDGandSRL(tech,board,16,4),false);
  assert.equal(model.matchesSDGandSRL(tech,board,0,0),true);
});
