// src/ui/cart.js
// The "Active Prescriptions" banner (a.k.a. cart) that lists drugs whose
// interactions are being checked, and lets the user remove them.

import { State } from '../core/state.js';
import { Utils } from '../core/utils.js';
import { drugsDB } from '../data/drugs.data.js';

export function updateCartUI() {
    let banner = document.getElementById('cartBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'cartBanner';
        banner.style.cssText = 'padding: 10px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); margin-bottom: 15px; display: none;';
        const targetSection = document.getElementById('drugSection');
        if (targetSection) targetSection.insertBefore(banner, targetSection.firstChild);
    }

    if (!State.prescriptionList || State.prescriptionList.length === 0) {
        banner.style.display = 'none';
        return;
    }

    banner.style.display = 'block';

    banner.innerHTML = `
        <div style="font-size: 0.8rem; font-weight: 800; color: var(--danger-700); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
            <i class="fas fa-file-medical"></i> Active Prescriptions (${State.prescriptionList.length})
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; padding-top: 8px;">
            ${State.prescriptionList.map(name => `
                <div style="position: relative; background: white; padding: 6px 14px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; border: 1px solid var(--danger-200); color: var(--danger-800); box-shadow: var(--shadow-sm);">
                    ${Utils.escapeHtml(name)}
                    <div class="remove-from-cart" data-name="${Utils.escapeHtml(name)}" style="position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; background: var(--danger-500); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.2s; z-index: 2;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="font-size: 0.65rem; color: var(--danger-600); margin-top: 12px;">
            * Interactions will be checked automatically for these drugs.
        </div>
    `;

    banner.querySelectorAll('.remove-from-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const name = e.target.getAttribute('data-name');
            State.prescriptionList = State.prescriptionList.filter(n => n !== name);
            updateCartUI();

            if (State.openDropdownId) {
                const currentDrug = drugsDB.find(d => d.id === parseInt(State.openDropdownId));
                if (currentDrug) {
                    const openDropdown = document.getElementById(`calc-dropdown-${State.openDropdownId}`);
                    if (openDropdown) {
                        const activeCartBtn = openDropdown.querySelector('.toggle-cart-btn');
                        if (activeCartBtn && currentDrug.name === name) {
                            activeCartBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add to Active Prescription (Check Interactions)';
                            activeCartBtn.style.border = '2px dashed var(--primary-500)';
                            activeCartBtn.style.background = 'var(--primary-50)';
                            activeCartBtn.style.color = 'var(--primary-700)';
                        }
                        const calcBtn = openDropdown.querySelector('.calc-submit-btn');
                        if (calcBtn && !calcBtn.disabled) {
                            calcBtn.click();
                        }
                    }
                }
            }
        });
        btn.addEventListener('mouseenter', e => e.target.style.transform = 'scale(1.15)');
        btn.addEventListener('mouseleave', e => e.target.style.transform = 'scale(1)');
    });
}
