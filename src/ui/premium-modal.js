// src/ui/premium-modal.js
// The "PediCalc Premium" upsell modal. The markup previously lived as one giant
// inline template literal inside the main script; it is isolated here and built
// from small, readable pieces.

import { Utils } from '../core/utils.js';

const PREMIUM_FEATURES = [
    'دسترسی به تمامی داروهای قفل شده',
    'بررسی هوشمند تداخلات دارویی',
    'تنظیمات نوزادان نارس (PMA)',
    'تنظیم دوز در نارسایی کلیوی و کبدی'
];

function featureListItem(text) {
    return `
        <li style="display: flex; align-items: center; margin-bottom: 14px; color: #374151; font-size: 0.9rem; font-weight: 600;">
            <i class="fas fa-check-circle" style="color: #10b981; margin-left: 12px; font-size: 1.2rem;"></i>
            ${Utils.escapeHtml(text)}
        </li>`;
}

function buildModalMarkup() {
    return `
<div class="modal-container" style="border-radius: 20px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 0; max-width: 90%; width: 360px; margin: auto; align-self: center;">
    <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 35px 20px 25px; text-align: center; position: relative; border-bottom: 1px solid #fde68a;">
        <button class="modal-close premium-close-btn-top" style="position: absolute; top: 15px; right: 15px; background: white; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer;">
            <i class="fas fa-times" style="color: #9ca3af; font-size: 14px;"></i>
        </button>
        <div style="width: 75px; height: 75px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); border: 4px solid white;">
            <i class="fas fa-crown" style="color: white; font-size: 34px;"></i>
        </div>
        <h3 style="color: #92400e; font-size: 1.5rem; font-weight: 900; margin: 0; font-family: inherit;">نسخه ویژه PediCalc</h3>
        <p style="color: #b45309; font-size: 0.85rem; margin-top: 8px; font-weight: 600;">دسترسی نامحدود به تمامی امکانات بالینی</p>
    </div>
    <div class="modal-body" style="padding: 25px 25px 20px; background: white; text-align: right; direction: rtl;">
        <ul style="list-style: none; padding: 0; margin: 0 0 25px 0;">
            ${PREMIUM_FEATURES.map(featureListItem).join('')}
        </ul>
        <button id="buyPremiumBtn" style="width: 100%; padding: 14px; font-size: 1.05rem; font-weight: 800; font-family: inherit; color: white; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.35); display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="fas fa-gem"></i> فعال‌سازی و خرید
        </button>
        <div style="text-align: center; margin-top: 15px;">
            <span style="font-size: 0.7rem; color: #9ca3af; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                <i class="fas fa-shield-alt"></i> پرداخت امن از طریق کافه‌بازار
            </span>
        </div>
    </div>
</div>`;
}

/** Show (creating on first use) the premium upsell modal. */
export function showPremiumModal() {
    let modal = document.getElementById('premium-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'premium-modal';
        modal.className = 'modal-overlay active';
        modal.innerHTML = buildModalMarkup();
        document.body.appendChild(modal);

        const buyBtn = modal.querySelector('#buyPremiumBtn');
        if (buyBtn) {
            buyBtn.addEventListener('click', () => {
                if (typeof window.Android !== 'undefined' && window.Android.purchasePremium) {
                    window.Android.purchasePremium();
                    modal.classList.remove('active');
                }
            });
        }

        const closeBtn = modal.querySelector('.premium-close-btn-top');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        }
    } else {
        modal.classList.add('active');
    }
}
