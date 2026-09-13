// src/ui/dom.js
// Cached references to the static elements defined in index.html.
// Populated on import (after DOMContentLoaded, per main.js load order).

export const DOM = {
    categoryGrid: document.getElementById('categoryGrid'),
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    drugList: document.getElementById('drugList'),
    resultCount: document.getElementById('resultCount'),
    drugCount: document.getElementById('drugCount'),
    helpModal: document.getElementById('helpModal'),
    modalClose: document.getElementById('modalClose'),
    // NAV ELEMENTS
    menuBtn: document.getElementById('menuBtn'),
    sideNav: document.getElementById('sideNav'),
    navOverlay: document.getElementById('navOverlay'),
    closeNavBtn: document.getElementById('closeNavBtn'),
    // ABOUT US ELEMENTS
    aboutBtn: document.getElementById('aboutBtn'),
    aboutModal: document.getElementById('aboutModal'),
    aboutModalClose: document.getElementById('aboutModalClose')
};
