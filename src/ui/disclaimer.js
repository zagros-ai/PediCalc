// src/ui/disclaimer.js
// First-run legal disclaimer / medical agreement modal. The accept button
// unlocks only after the user scrolls to the bottom; acceptance is persisted
// in localStorage. Also wires the "Terms & Disclaimer" side-nav entry.

import { DOM } from './dom.js';
import { Utils } from '../core/utils.js';

export function initDisclaimerLogic() {
    const modal = document.getElementById('disclaimerModal');
    const body = document.getElementById('disclaimerBody');
    const acceptBtn = document.getElementById('acceptDisclaimerBtn');
    const scrollNotice = document.getElementById('scrollNotice');
    const navBtn = document.getElementById('disclaimerNavBtn');

    if (!modal || !body || !acceptBtn) return;

    const hasAccepted = localStorage.getItem('pedicalc_disclaimer_accepted');

    if (!hasAccepted) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function checkScroll() {
        const isBottom = body.scrollHeight - body.scrollTop <= body.clientHeight + 15;
        if (isBottom || body.scrollHeight <= body.clientHeight) {
            acceptBtn.disabled = false;
            acceptBtn.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
            acceptBtn.style.cursor = 'pointer';
            acceptBtn.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
            if (scrollNotice) scrollNotice.style.display = 'none';
        }
    }

    body.addEventListener('scroll', checkScroll);
    setTimeout(checkScroll, 300);

    acceptBtn.addEventListener('click', () => {
        if (acceptBtn.disabled) return;
        localStorage.setItem('pedicalc_disclaimer_accepted', 'true');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        Utils.vibrate();
    });

    if (navBtn) {
        navBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Utils.vibrate();
            if (DOM.sideNav) DOM.sideNav.classList.remove('active');
            if (DOM.navOverlay) DOM.navOverlay.classList.remove('active');

            acceptBtn.disabled = false;
            acceptBtn.style.background = 'var(--primary-600)';
            acceptBtn.textContent = 'بستن';
            if (scrollNotice) scrollNotice.style.display = 'none';
            modal.classList.add('active');
        });
    }
}
