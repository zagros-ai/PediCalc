// Ad-hoc boot smoke test: stubs a minimal DOM, then imports and runs the real
// app entry chain (main.js -> renderers/events/cart/disclaimer) to prove the
// module graph wires up and init() completes without runtime errors.
// Not part of `node --test`; run directly with `node tests/boot.smoke.mjs`.

function makeEl(tag = 'div') {
    const el = {
        tagName: tag, _children: [], style: {}, dataset: {}, classList: {
            _s: new Set(),
            add(...c) { c.forEach(x => this._s.add(x)); },
            remove(...c) { c.forEach(x => this._s.delete(x)); },
            toggle(c) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); },
            contains(c) { return this._s.has(c); }
        },
        _html: '', hidden: false, textContent: '', value: '',
        get innerHTML() { return this._html; },
        set innerHTML(v) { this._html = v; },
        appendChild(c) { this._children.push(c); return c; },
        insertBefore(c) { this._children.unshift(c); return c; },
        addEventListener() {},
        removeEventListener() {},
        querySelector() { return null; },
        querySelectorAll() { return []; },
        closest() { return null; },
        getAttribute() { return null; },
        setAttribute() {},
        focus() {},
        scrollIntoView() {}
    };
    return el;
}

const ids = [
    'categoryGrid', 'searchInput', 'clearSearch', 'drugList', 'resultCount',
    'drugCount', 'helpModal', 'modalClose', 'menuBtn', 'sideNav', 'navOverlay',
    'closeNavBtn', 'aboutBtn', 'aboutModal', 'aboutModalClose', 'drugSection',
    'disclaimerModal', 'disclaimerBody', 'acceptDisclaimerBtn', 'scrollNotice',
    'disclaimerNavBtn'
];
const store = Object.fromEntries(ids.map(id => [id, makeEl()]));

let domReadyCb = null;
globalThis.document = {
    getElementById: (id) => store[id] || null,
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: (tag) => makeEl(tag),
    addEventListener: (evt, cb) => { if (evt === 'DOMContentLoaded') domReadyCb = cb; },
    body: makeEl('body')
};
globalThis.window = globalThis;
if (!globalThis.navigator || !globalThis.navigator.vibrate) {
    try { Object.defineProperty(globalThis, 'navigator', { value: { vibrate: () => {} }, configurable: true }); }
    catch { /* navigator already provided by runtime; vibrate() is optional */ }
}
globalThis.localStorage = { getItem: () => 'true', setItem: () => {} };
globalThis.Image = class { set src(_) { setTimeout(() => this.onerror && this.onerror(), 0); } };

await import('../src/main.js');

if (typeof domReadyCb !== 'function') {
    console.error('FAIL: main.js did not register a DOMContentLoaded handler');
    process.exit(1);
}

try {
    await domReadyCb();
    // Assert the renderers actually wrote something into the cached containers.
    const catHtml = store.categoryGrid.innerHTML;
    const drugHtml = store.drugList.innerHTML;
    if (!catHtml || !/category-item/.test(catHtml)) throw new Error('category grid not rendered');
    if (!drugHtml || !/drug-list-card/.test(drugHtml)) throw new Error('drug list not rendered');
    if (!/window\.drugsDB/.test('window.drugsDB') || !globalThis.drugsDB || !globalThis.drugsDB.length) {
        throw new Error('window.drugsDB global not populated');
    }
    if (!globalThis.AdvancedClinicalEngine) throw new Error('window.AdvancedClinicalEngine not populated');
    console.log('BOOT SMOKE OK — init() completed; categories & drugs rendered; globals populated.');
    console.log('  drugs:', globalThis.drugsDB.length, '| drugCount text:', store.drugCount.textContent);
} catch (e) {
    console.error('FAIL:', e.message);
    process.exit(1);
}
