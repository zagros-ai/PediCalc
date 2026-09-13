// build/bundle.mjs
// Zero-dependency bundler for the Android WebView build.
//
// WHY: index.html can load the app as native ES modules (<script type="module">)
// which is great for development and served over HTTP. But an Android WebView
// that loads the page from file:///android_asset/ blocks ES-module imports
// (module scripts require CORS, which file:// cannot satisfy), leaving a blank
// screen. This script concatenates the src/ modules — in dependency order —
// into a single classic script (dist/app.bundle.js) with no import/export, so
// it runs in any WebView without a module loader.
//
// It is deliberately dumb: it strips `import ...` lines and the leading
// `export ` keyword, and drops bare re-export lines. All modules live in one
// shared function scope, so their top-level declarations simply see each other.
//
// Usage:  node build/bundle.mjs

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Dependency order: a module must appear AFTER everything it depends on.
const MODULE_ORDER = [
    'src/core/utils.js',
    'src/data/drugs.data.js',
    'src/data/clinical-rules.data.js',
    'src/core/validation.js',
    'src/core/clinical-engine.js',
    'src/core/calculator.js',
    'src/core/state.js',
    'src/ui/dom.js',
    'src/ui/premium-modal.js',
    'src/ui/cart.js',
    'src/ui/disclaimer.js',
    'src/ui/renderers.js',
    'src/ui/events.js',
    'src/main.js'
];

/** Remove ES-module syntax so the file can live inside one shared IIFE scope. */
function stripModuleSyntax(code) {
    const out = [];
    for (const line of code.split('\n')) {
        const trimmed = line.trim();

        // Drop import statements entirely (symbols become in-scope siblings).
        if (/^import\b/.test(trimmed)) continue;

        // Drop bare re-export lines like `export { Utils };`
        if (/^export\s*\{[^}]*\}\s*;?\s*$/.test(trimmed)) continue;

        // Turn `export const X` / `export function X` / `export class X`
        // into a plain declaration by removing the leading `export `.
        if (/^export\s+(const|let|var|function|class|async)\b/.test(trimmed)) {
            out.push(line.replace(/^(\s*)export\s+/, '$1'));
            continue;
        }

        out.push(line);
    }
    return out.join('\n');
}

const banner =
`// dist/app.bundle.js — GENERATED FILE, DO NOT EDIT BY HAND.
// Built from the src/ ES modules by build/bundle.mjs for the Android WebView
// (a classic, non-module script that runs from file:///android_asset/).
// To regenerate:  node build/bundle.mjs
`;

const parts = [banner, '(function () {', "    'use strict';", ''];

for (const rel of MODULE_ORDER) {
    const code = stripModuleSyntax(readFileSync(join(root, rel), 'utf8')).trimEnd();
    parts.push(`    // ===== ${rel} =====`);
    // Indent each module body by 4 spaces to sit inside the IIFE.
    parts.push(code.split('\n').map(l => (l ? '    ' + l : l)).join('\n'));
    parts.push('');
}

parts.push('})();');
parts.push('');

const outPath = join(root, 'dist', 'app.bundle.js');
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, parts.join('\n'), 'utf8');

console.log(`Bundled ${MODULE_ORDER.length} modules -> dist/app.bundle.js`);
