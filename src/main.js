// src/main.js
// Application entry point. Imported as an ES module from index.html.
// Importing the data modules first ensures the window.* globals used by the
// Android WebView bridge are populated before any UI runs.

import './data/drugs.data.js';
import './data/clinical-rules.data.js';
import './core/clinical-engine.js';
import './core/calculator.js';

import { renderCategories, renderDrugs } from './ui/renderers.js';
import { updateCartUI } from './ui/cart.js';
import { setupEvents } from './ui/events.js';
import { initDisclaimerLogic } from './ui/disclaimer.js';

async function init() {
    await renderCategories();
    renderDrugs();
    updateCartUI();
    setupEvents();
    initDisclaimerLogic();
}

document.addEventListener('DOMContentLoaded', init);
