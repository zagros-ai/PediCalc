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
    const agreeCheckbox = document.getElementById('disclaimerAgreeCheckbox');
    const agreeLabel = document.getElementById('disclaimerAgreeLabel');

    if (!modal || !body || !acceptBtn) return;

    // Show the agreement ONLY on the first launch (until accepted).
    const hasAccepted = localStorage.getItem('pedicalc_disclaimer_accepted');
    if (!hasAccepted) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    let scrolledToEnd = false;

    // The "enter app" button becomes usable only after the user has both
    // scrolled to the end AND ticked the acceptance checkbox.
    function refreshAcceptState() {
        const ready = scrolledToEnd && !!(agreeCheckbox && agreeCheckbox.checked);
        acceptBtn.disabled = !ready;
        if (ready) {
            acceptBtn.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)';
            acceptBtn.style.cursor = 'pointer';
            acceptBtn.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.3)';
        } else {
            acceptBtn.style.background = 'var(--text-tertiary)';
            acceptBtn.style.cursor = 'not-allowed';
            acceptBtn.style.boxShadow = 'none';
        }
    }

    function checkScroll() {
        const isBottom = body.scrollHeight - body.scrollTop <= body.clientHeight + 15;
        if (isBottom || body.scrollHeight <= body.clientHeight) {
            scrolledToEnd = true;
            if (scrollNotice) scrollNotice.style.display = 'none';
            // Reveal the acceptance checkbox once the text has been read.
            if (agreeLabel) agreeLabel.style.display = 'flex';
        }
        refreshAcceptState();
    }

    // Hide the checkbox until the user reaches the end of the text.
    if (agreeLabel) agreeLabel.style.display = 'none';
    if (agreeCheckbox) agreeCheckbox.addEventListener('change', refreshAcceptState);

    body.addEventListener('scroll', checkScroll);
    setTimeout(checkScroll, 300);

    acceptBtn.addEventListener('click', () => {
        if (acceptBtn.disabled) return;
        localStorage.setItem('pedicalc_disclaimer_accepted', 'true');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        Utils.vibrate();
    });

    // Re-opening from the side-nav is read-only: show the text with the checkbox
    // hidden and the button acting as a plain "close".
    if (navBtn) {
        navBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Utils.vibrate();
            if (DOM.sideNav) DOM.sideNav.classList.remove('active');
            if (DOM.navOverlay) DOM.navOverlay.classList.remove('active');

            if (agreeLabel) agreeLabel.style.display = 'none';
            acceptBtn.disabled = false;
            acceptBtn.style.background = 'var(--primary-600)';
            acceptBtn.style.cursor = 'pointer';
            acceptBtn.textContent = 'بستن';
            if (scrollNotice) scrollNotice.style.display = 'none';
            modal.classList.add('active');
        });
    }
}
