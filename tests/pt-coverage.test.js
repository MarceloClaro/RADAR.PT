const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const board = require('../data/board-live.json').data.board;

test('cada tecnologia atual tem resumo e descrição longa em português incorporados', () => {
  const context = {window:{}};
  vm.runInNewContext(fs.readFileSync(require.resolve('../data/pt-full.js'), 'utf8'),context);
  const {summaries,entries} = context.window.PT_FULL;
  assert.equal(Object.keys(summaries).length, 172);
  assert.equal(Object.keys(entries).length, 172);
  for(const tech of board.entities){
    assert.ok(summaries[tech.id]?.length>45,`Resumo ausente: ${tech.name}`);
    assert.ok(entries[tech.id]?.length>=2,`Texto extenso ausente: ${tech.name}`);
  }
  assert.ok(entries['110939710'].some(b=>b.type==='h2' && /perspectivas futuras/i.test(b.text)));
});
