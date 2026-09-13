// tests/bundle.smoke.mjs
// Boots the GENERATED classic bundle (dist/app.bundle.js) inside a stubbed DOM
// to prove it runs without ES modules — i.e. the way an Android WebView loads
// it. Run:  node tests/bundle.smoke.mjs   (regenerate the bundle first).

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const code = readFileSync(join(root, 'dist', 'app.bundle.js'), 'utf8');

function makeEl(tag = 'div') {
    return {
        tagName: tag, _children: [], style: {}, dataset: {},
        classList: { _s: new Set(), add(...c) { c.forEach(x => this._s.add(x)); }, remove(...c) { c.forEach(x => this._s.delete(x)); }, toggle(c) { this._s.has(c) ? this._s.delete(c) : this._s.add(c); }, contains(c) { return this._s.has(c); } },
        _html: '', hidden: false, textContent: '', value: '',
        get innerHTML() { return this._html; }, set innerHTML(v) { this._html = v; },
        appendChild(c) { this._children.push(c); return c; },
        insertBefore(c) { this._children.unshift(c); return c; },
        addEventListener() {}, removeEventListener() {},
        querySelector() { return null; }, querySelectorAll() { return []; },
        closest() { return null; }, getAttribute() { return null; }, setAttribute() {},
        focus() {}, scrollIntoView() {}
    };
}

const ids = ['categoryGrid', 'searchInput', 'clearSearch', 'drugList', 'resultCount', 'drugCount', 'helpModal', 'modalClose', 'menuBtn', 'sideNav', 'navOverlay', 'closeNavBtn', 'aboutBtn', 'aboutModal', 'aboutModalClose', 'drugSection', 'disclaimerModal', 'disclaimerBody', 'acceptDisclaimerBtn', 'scrollNotice', 'disclaimerNavBtn'];
const store = Object.fromEntries(ids.map(id => [id, makeEl()]));

let domReadyCb = null;
const sandbox = {};
sandbox.window = sandbox;
sandbox.navigator = { vibrate: () => {} };
sandbox.localStorage = { getItem: () => 'true', setItem: () => {} };
sandbox.Image = class { set src(_) { setTimeout(() => this.onerror && this.onerror(), 0); } };
sandbox.setTimeout = setTimeout;
sandbox.console = console;
sandbox.document = {
    getElementById: (id) => store[id] || null,
    querySelector: () => null, querySelectorAll: () => [],
    createElement: (tag) => makeEl(tag),
    addEventListener: (evt, cb) => { if (evt === 'DOMContentLoaded') domReadyCb = cb; },
    body: makeEl('body')
};

vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'dist/app.bundle.js' });

if (typeof domReadyCb !== 'function') {
    console.error('FAIL: bundle did not register a DOMContentLoaded handler');
    process.exit(1);
}

try {
    await domReadyCb();
    if (!/category-item/.test(store.categoryGrid.innerHTML)) throw new Error('category grid not rendered');
    if (!/drug-list-card/.test(store.drugList.innerHTML)) throw new Error('drug list not rendered');
    if (!sandbox.drugsDB || !sandbox.drugsDB.length) throw new Error('window.drugsDB not populated');
    if (!sandbox.AdvancedClinicalEngine) throw new Error('window.AdvancedClinicalEngine not populated');
    console.log('BUNDLE SMOKE OK — classic bundle booted; rendered', sandbox.drugsDB.length, 'drugs; globals populated.');
} catch (e) {
    console.error('FAIL:', e.message);
    process.exit(1);
}
