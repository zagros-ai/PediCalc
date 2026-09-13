// src/ui/events.js
// Global event wiring: search, category selection, drug-list delegation
// (calculator toggle / lock / close), modals and the side navigation.

import { DOM } from './dom.js';
import { State } from '../core/state.js';
import { Utils } from '../core/utils.js';
import { renderCategories, renderDrugs, toggleCalcDropdown, closeAllCalculators } from './renderers.js';
import { showPremiumModal } from './premium-modal.js';

export function setupEvents() {
    const handleSearch = Utils.debounce((e) => {
        State.searchQuery = e.target.value.trim();
        DOM.clearSearch.hidden = !State.searchQuery;
        renderDrugs();
    }, 350);

    DOM.searchInput.addEventListener('input', handleSearch);

    DOM.clearSearch.addEventListener('click', () => {
        DOM.searchInput.value = '';
        State.searchQuery = '';
        DOM.clearSearch.hidden = true;
        renderDrugs();
        DOM.searchInput.focus();
    });

    DOM.categoryGrid.addEventListener('click', async (e) => {
        const item = e.target.closest('.category-item');
        if (!item) return;
        Utils.vibrate();
        State.category = item.dataset.id;
        await renderCategories();
        renderDrugs();
    });

    DOM.drugList.addEventListener('click', (e) => {
        const lockIconBtn = e.target.closest('.lock-icon-btn');
        if (lockIconBtn) {
            e.preventDefault();
            Utils.vibrate();
            showPremiumModal();
            return;
        }

        const toggleBtn = e.target.closest('.toggle-calc-btn');
        if (toggleBtn) {
            e.preventDefault();
            Utils.vibrate();
            const card = toggleBtn.closest('.drug-list-card');

            if (card && card.dataset.locked === 'true') {
                showPremiumModal();
                return;
            }

            const drugId = toggleBtn.dataset.drugId;
            if (drugId) toggleCalcDropdown(drugId, toggleBtn);
            return;
        }

        const closeBtn = e.target.closest('.close-card-btn');
        if (closeBtn) {
            e.preventDefault();
            Utils.vibrate();
            closeAllCalculators();
            return;
        }
    });

    DOM.modalClose.addEventListener('click', () => DOM.helpModal.classList.remove('active'));

    DOM.helpModal.addEventListener('click', (e) => {
        if (e.target === DOM.helpModal) DOM.helpModal.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                const optionsBox = dropdown.querySelector('.dropdown-options');
                const selectedBox = dropdown.querySelector('.dropdown-selected');
                if (optionsBox && selectedBox) {
                    optionsBox.classList.remove('show');
                    selectedBox.classList.remove('open');
                }
            }
        });
    });

    const toggleNav = () => {
        Utils.vibrate();
        if (DOM.sideNav) DOM.sideNav.classList.toggle('active');
        if (DOM.navOverlay) DOM.navOverlay.classList.toggle('active');
    };

    if (DOM.menuBtn) DOM.menuBtn.addEventListener('click', toggleNav);
    if (DOM.closeNavBtn) DOM.closeNavBtn.addEventListener('click', toggleNav);
    if (DOM.navOverlay) DOM.navOverlay.addEventListener('click', toggleNav);

    if (DOM.aboutBtn) {
        DOM.aboutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Utils.vibrate();
            if (DOM.sideNav) DOM.sideNav.classList.remove('active');
            if (DOM.navOverlay) DOM.navOverlay.classList.remove('active');
            if (DOM.aboutModal) DOM.aboutModal.classList.add('active');
        });
    }

    if (DOM.aboutModalClose) {
        DOM.aboutModalClose.addEventListener('click', () => {
            DOM.aboutModal.classList.remove('active');
        });
    }

    if (DOM.aboutModal) {
        DOM.aboutModal.addEventListener('click', (e) => {
            if (e.target === DOM.aboutModal) DOM.aboutModal.classList.remove('active');
        });
    }
}
