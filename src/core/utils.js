// src/core/utils.js
// Framework-free helper utilities shared across the app: HTML escaping,
// dose-unit resolution, interval formatting, the home administration guide,
// and small DOM/UX helpers.

/**
 * Escape a value for safe interpolation into innerHTML.
 * Every dynamic value (drug names, warnings, interaction messages, user input)
 * MUST pass through this before being concatenated into an HTML string.
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Compare two finite numbers for practical (dose-level) equality, tolerating the
 * tiny rounding error inherent in IEEE-754 floating point (e.g. 0.1 + 0.2).
 * Used instead of `===` when deciding whether a min/max dose pair collapses to a
 * single value, so display logic never diverges because of a 1e-15 difference.
 * @param {number} a
 * @param {number} b
 * @param {number} [epsilon] absolute tolerance (default 1e-9)
 * @returns {boolean}
 */
export function nearlyEqual(a, b, epsilon = 1e-9) {
    return Math.abs(a - b) < epsilon;
}

export const Utils = {
    escapeHtml,
    nearlyEqual,

    getIntervalText(hours) {
        if (hours === 0) return 'Single Dose / As needed';
        const map = { 24: 'Every 24 hours', 12: 'Every 12 hours', 8: 'Every 8 hours', 6: 'Every 6 hours', 4: 'Every 4 hours' };
        return map[hours] || `Every ${hours} hours`;
    },

    generateHomeGuide(drug, minDose, maxDose, validation, customConc) {
        const intervalText = Utils.getIntervalText(validation.appliedInterval);

        if (minDose > 0 && (drug.category === 'syrup' || drug.category === 'drop')) {
            let baseConc = null;
            if (drug.baseDose !== undefined && drug.baseVolume !== undefined) {
                let amount = drug.baseDose;
                if (drug.doseUnit && drug.doseUnit.toLowerCase() === 'g') amount *= 1000;
                baseConc = amount / drug.baseVolume;
            } else if (drug.mgPerMl) {
                baseConc = drug.mgPerMl;
            }
            const activeConc = parseFloat(customConc !== null ? customConc : baseConc);
            if (!activeConc || activeConc <= 0) return `<strong style="color: var(--danger-500);"><i class="fas fa-exclamation-triangle"></i> Error: Concentration cannot be zero.</strong>`;

            const minCc = parseFloat((minDose / activeConc).toFixed(2)).toString();
            const maxCc = parseFloat((maxDose / activeConc).toFixed(2)).toString();
            if (minCc === maxCc) return `<strong>${escapeHtml(minCc)} ml</strong> ${escapeHtml(intervalText)}`;
            return `<strong>${escapeHtml(minCc)} to ${escapeHtml(maxCc)} ml</strong> ${escapeHtml(intervalText)}`;
        }

        if (validation.isFixedDose) {
            return `<strong>${escapeHtml(validation.calculatedFixedDose)}</strong> ${escapeHtml(intervalText)}`;
        }

        return `Use as prescribed by physician.`;
    },

    // Single source of truth for dose-unit resolution (used by the calculator, formula/formatting
    // helpers, and the calculator UI) so unit-detection logic never has to be duplicated/kept in sync.
    resolveDoseUnit(drug) {
        if (drug.doseUnit) return drug.doseUnit;
        const nameLower = drug.name.toLowerCase();
        const formLower = drug.form ? drug.form.toLowerCase() : '';
        if (nameLower.includes('penicillin') || nameLower.includes('nystatin') || formLower.includes('u/') || formLower.includes('iu')) return 'Units';
        if (formLower.includes('meq')) return 'mEq';
        if (formLower.includes('mcg')) return 'mcg';
        if (formLower.includes('g/')) return 'g';
        return 'mg';
    },

    vibrate(ms = 10) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(ms);
    },

    getIconClass(category) {
        const map = {
            syrup: 'fa-wine-bottle', drop: 'fa-tint', ampoule: 'fa-syringe',
            powder: 'fa-box-open', suppository: 'fa-capsules', vial: 'fa-flask',
            inhaler: 'fa-wind', ointment: 'fa-hand-sparkles', cream: 'fa-paint-brush',
            gel: 'fa-flask', spray: 'fa-spray-can', sachet: 'fa-envelope', capsule: 'fa-capsules'
        };
        return map[category] || 'fa-pills';
    },

    debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    checkImage(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
};
