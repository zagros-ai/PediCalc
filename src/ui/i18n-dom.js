// src/ui/i18n-dom.js
// Applies translations to the STATIC markup in index.html that carries
// data-i18n* attributes, and wires the header language-toggle button.
//
// Attributes supported on any element:
//   data-i18n="key"                 -> sets textContent
//   data-i18n-placeholder="key"     -> sets placeholder
//   data-i18n-aria="key"            -> sets aria-label
//   data-i18n-content="key"         -> sets the content attribute (e.g. <meta>)
//   data-i18n-args='{"n":0}'        -> optional JSON interpolation args for the key

import { t, getLang, toggleLang, onLangChange, applyLanguage } from '../core/i18n.js';

function argsFor(el) {
    const raw = el.getAttribute('data-i18n-args');
    if (!raw) return undefined;
    try { return JSON.parse(raw); } catch { return undefined; }
}

/** Translate every element in the document that carries a data-i18n* attribute. */
export function applyStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.getAttribute('data-i18n'), argsFor(el));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('[data-i18n-content]').forEach(el => {
        el.setAttribute('content', t(el.getAttribute('data-i18n-content')));
    });
}

/**
 * Wire the header language toggle. `onChange` is invoked after the language
 * switches so the caller can re-render the dynamic parts (categories, drug list).
 */
export function setupLanguageToggle(onChange) {
    applyLanguage(); // set <html> lang/dir for the persisted/default language
    applyStaticTranslations();

    const btn = document.getElementById('langToggleBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            toggleLang();
        });
    }

    onLangChange(() => {
        applyStaticTranslations();
        if (typeof onChange === 'function') onChange(getLang());
    });
}
