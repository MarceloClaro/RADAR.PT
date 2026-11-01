/* Modelo de leitura do acervo WKO — sem dependência de rede ou DOM. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RADAR_MODEL = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const order = ['Data Era', 'Human Expansion', 'Generate & Drive', 'Agritech & Food', 'Smart Living'];
  function safeUrl(value) {
    try {
      const url = new URL(String(value || ''));
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  function numbered(entities) {
    return [...(entities || [])].sort((a, b) => Number(a.number || 0) - Number(b.number || 0) || a.name.localeCompare(b.name));
  }
  function neighbors(entities, id) {
    const i = entities.findIndex(e => String(e.id) === String(id));
    return {previous: i > 0 ? entities[i - 1] : null, next: i >= 0 ? entities[i + 1] || null : null};
  }
  function detailFor(tech, board, fullPT = {}) {
    const organizations = new Map((board?.allOrganizations || []).map(o => [String(o.id), o]));
    const organizationList = (tech.organizations || []).map(id => organizations.get(String(id))).filter(Boolean).map(o => ({
      name: o.name, country: o.country?.code || '', url: safeUrl(o.url)
    }));
    const sdgNumbers = (tech.sdg || []).map(id => board?.tags?.sdg?.[id]?.title?.en).filter(Boolean)
      .map(name => Number(name.match(/^SDG\s+(\d+)/)?.[1])).filter(Number.isFinite);
    const sources = (tech.attachments || []).map(a => ({name: a.name || 'Referência', url: safeUrl(a.web?.sourceUrl), type: a.type || ''})).filter(a => a.url);
    return {
      technologyNumber: Number(tech.number) || null,
      trl: Number(tech.trl) || 1,
      srl: Number(tech.srl?.value) || null,
      srlRange: tech.srl ? [Number(tech.srl.min), Number(tech.srl.max)] : null,
      organizations: organizationList,
      sdgNumbers,
      sources,
      translation: fullPT[String(tech.id)] || [],
      imageCredit: tech.imageAuthor || '',
      sourceUrl: `https://innovationmap.at/?pg=technology_${encodeURIComponent(tech.id)}`
    };
  }
  function radialLayout(entities, collections) {
    const bySector = new Map(order.map(s => [s, []]));
    const sectorById = new Map();
    for (const collection of collections || []) {
      for (const id of collection.entitiesId || []) sectorById.set(String(id), collection.name);
    }
    for (const tech of numbered(entities)) {
      const sector = sectorById.get(String(tech.id));
      if (bySector.has(sector)) bySector.get(sector).push(tech);
    }
    return order.flatMap((sector, index) => {
      const list = bySector.get(sector);
      return list.map((tech, i) => ({
        id: String(tech.id), number: Number(tech.number), name: tech.name,
        sector, trl: Number(tech.trl) || 1,
        angle: -90 + index * 72 + (i + .5) * 72 / list.length,
        dotRadius: 122 + (9 - Number(tech.trl || 1)) * 28,
        labelRadius: 514
      }));
    });
  }
  function matchesSDGandSRL(tech, board, sdgNumber = 0, minSRL = 0) {
    if(minSRL && Number(tech.srl?.value || 0) < minSRL) return false;
    if(!sdgNumber) return true;
    return (tech.sdg || []).some(id => {
      const title = board?.tags?.sdg?.[id]?.title?.en || '';
      return Number(title.match(/^SDG\s+(\d+)/)?.[1]) === Number(sdgNumber);
    });
  }
  return {safeUrl, numbered, neighbors, detailFor, radialLayout, matchesSDGandSRL};
});
