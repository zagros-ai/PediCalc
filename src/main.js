// src/main.js
// Application entry point. Imported as an ES module from index.html.
// Importing the data modules first ensures the window.* globals used by the
// Android WebView bridge are populated before any UI runs.

import './core/i18n.js';
import './data/translations.fa.js';
import './data/drugs.data.js';
import './data/clinical-rules.data.js';
import './core/clinical-engine.js';
import './core/calculator.js';

import { renderCategories, renderDrugs } from './ui/renderers.js';
import { updateCartUI } from './ui/cart.js';
import { setupEvents } from './ui/events.js';
import { initDisclaimerLogic } from './ui/disclaimer.js';
import { setupLanguageToggle } from './ui/i18n-dom.js';

async function init() {
    // Apply persisted language (dir/lang + static strings) and wire the toggle.
    // When the language changes, re-render the dynamic UI so it follows suit.
    setupLanguageToggle(async () => {
        await renderCategories();
        renderDrugs();
        updateCartUI();
    });

    await renderCategories();
    renderDrugs();
    updateCartUI();
    setupEvents();
    initDisclaimerLogic();
}

document.addEventListener('DOMContentLoaded', init);
