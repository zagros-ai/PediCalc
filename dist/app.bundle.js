// dist/app.bundle.js — GENERATED FILE, DO NOT EDIT BY HAND.
// Built from the src/ ES modules by build/bundle.mjs for the Android WebView
// (a classic, non-module script that runs from file:///android_asset/).
// To regenerate:  node build/bundle.mjs

(function () {
    'use strict';

    // ===== src/core/utils.js =====
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
    function escapeHtml(value) {
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
    function nearlyEqual(a, b, epsilon = 1e-9) {
        return Math.abs(a - b) < epsilon;
    }

    const Utils = {
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

    // ===== src/data/drugs.data.js =====
    // src/data/drugs.data.js
    // Pure data module: drug categories and the pediatric drug database.
    // Exported as ES modules; also mirrored onto `window` for the Android WebView bridge.
    //
    // ⚠️ FIELD-NAMING CAVEAT — READ BEFORE ADDING A DRUG:
    //   `minMgPerKg` / `maxMgPerKg` hold the per-kilogram dose expressed in the
    //   drug's OWN `doseUnit` (mg, mcg, Units, mEq, g) — despite the "Mg" in the
    //   name they are NOT always milligrams. For example Fentanyl uses
    //   { minMgPerKg: 1, maxMgPerKg: 2, doseUnit: 'mcg' } meaning 1–2 mcg/kg.
    //   New entries may instead use the unit-neutral aliases `minDosePerKg` /
    //   `maxDosePerKg`; the calculator reads either. Always set `doseUnit`
    //   explicitly so the value's unit is unambiguous.

    const categoriesDB = [
        { id: 'all', name: 'All', icon: 'fa-layer-group', image: 'assets/categories/all.png' },
        { id: 'syrup', name: 'Syrup', icon: 'fa-wine-bottle', image: 'assets/categories/syrup.png' },
        { id: 'drop', name: 'Drop', icon: 'fa-tint', image: 'assets/categories/drop.png' },
        { id: 'ampoule', name: 'Ampoule', icon: 'fa-syringe', image: 'assets/categories/ampoule.png' },
        { id: 'tablet', name: 'Tab & Cap', icon: 'fa-pills', image: 'assets/categories/pill.png' },
        { id: 'powder', name: 'Powder', icon: 'fa-box-open', image: 'assets/categories/powder.png' },
        { id: 'suppository', name: 'Suppository', icon: 'fa-capsules', image: 'assets/categories/suppository.png' },
        { id: 'vial', name: 'Vial', icon: 'fa-flask', image: 'assets/categories/vial.png' },
        { id: 'inhaler', name: 'Inhaler', icon: 'fa-wind', image: 'assets/categories/inhaler.png' },
        { id: 'ointment', name: 'Ointment', icon: 'fa-hand-sparkles', image: 'assets/categories/ointment.png' },
        { id: 'cream', name: 'Cream', icon: 'fa-paint-brush', image: 'assets/categories/cream.png' },
        { id: 'gel', name: 'Gel', icon: 'fa-flask', image: 'assets/categories/gel.png' },
        { id: 'spray', name: 'Spray', icon: 'fa-spray-can', image: 'assets/categories/spray.png' },
        { id: 'sachet', name: 'Sachet', icon: 'fa-envelope', image: 'assets/categories/sachet.png' }
    ];
    
    const drugsDB = [
        // ==========================================
        // SYRUPS & SUSPENSIONS
        // ==========================================
        { id: 1, name: 'Acetaminophen', form: 'Syrup 120mg/5ml', category: 'syrup', minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 6, baseDose: 120, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 4000, indications: ['Fever', 'Mild Pain'], warning: 'Risk of liver toxicity with overdose. Max 75mg/kg/day.' },
        {
            id: 2, name: 'Ibuprofen', form: 'Syrup 100mg/5ml', category: 'syrup',
            minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 8, baseDose: 100, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 800, maxDailyDoseMg: 3200,
            indications: ['Fever', 'Pain', 'JIA'], requiresAge: true,
            warning: 'Take with food. Not recommended under 6 months.',
            indicationDoses: [
                { name: 'Fever / Mild-Moderate Pain', minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 8 },
                { name: 'Juvenile Idiopathic Arthritis (JIA)', minMgPerKg: 7.5, maxMgPerKg: 10, intervalHours: 6 }
            ]
        },
        {
            id: 3, name: 'Amoxicillin', form: 'Suspension 250mg/5ml', category: 'syrup',
            minMgPerKg: 13.3, maxMgPerKg: 15, intervalHours: 8, baseDose: 250, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 3000,
            indications: ['Otitis Media', 'Bacterial Infection'],
            warning: 'High-dose required for AOM.',
            indicationDoses: [
                { name: 'Standard Infection (Mild to Moderate)', minMgPerKg: 13.3, maxMgPerKg: 16.6, intervalHours: 8 },
                { name: 'Acute Otitis Media (AOM) / High Dose', minMgPerKg: 40, maxMgPerKg: 45, intervalHours: 12 }
            ]
        },
        { id: 4, name: 'Cefixime', form: 'Suspension 100mg/5ml', category: 'syrup', minMgPerKg: 4, maxMgPerKg: 4, intervalHours: 12, baseDose: 100, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 400, maxDailyDoseMg: 400, indications: ['UTI', 'Respiratory Infection'], indicationDoses: [{ name: 'Standard (8mg/kg/day)', minMgPerKg: 4, maxMgPerKg: 4, intervalHours: 12 }, { name: 'Once Daily Dosing', minMgPerKg: 8, maxMgPerKg: 8, intervalHours: 24 }] },
        {
            id: 5, name: 'Azithromycin', form: 'Suspension 200mg/5ml', category: 'syrup',
            minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 24, baseDose: 200, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 500, maxDailyDoseMg: 500,
            indications: ['Atypical Pneumonia', 'AOM', 'Pharyngitis'],
            warning: 'Dosing depends on indication and day of therapy.',
            indicationDoses: [
                { name: 'AOM/Pneumonia: Day 1', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 24 },
                { name: 'AOM/Pneumonia: Days 2-5', minMgPerKg: 5, maxMgPerKg: 5, intervalHours: 24 },
                { name: 'AOM: 3-Day Regimen', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 24 },
                { name: 'Pharyngitis / Tonsillitis (5 Days)', minMgPerKg: 12, maxMgPerKg: 12, intervalHours: 24 }
            ]
        },
        { id: 101, name: 'Ampicillin', form: 'Suspension 250mg/5ml', category: 'syrup', minMgPerKg: 12.5, maxMgPerKg: 25, intervalHours: 6, baseDose: 250, baseVolume: 5, doseUnit: 'mg', indications: ['Bacterial Infection'], highDoseSafe: true },
        {
            id: 102, name: 'Co-Amoxiclav', form: 'Suspension 312mg/5ml', category: 'syrup',
            minMgPerKg: 13.3, maxMgPerKg: 15, intervalHours: 8, baseDose: 312, baseVolume: 5, doseUnit: 'mg',
            indications: ['Resistant Infection', 'AOM', 'Sinusitis'],
            indicationDoses: [
                { name: 'Standard Infection (Amox Component)', minMgPerKg: 13.3, maxMgPerKg: 15, intervalHours: 8 },
                { name: 'Severe Infection / AOM (High Dose)', minMgPerKg: 40, maxMgPerKg: 45, intervalHours: 12 }
            ]
        },
        {
            id: 103, name: 'Co-trimoxazole', form: 'Suspension 240mg/5ml (40mg TMP)', category: 'syrup',
            minMgPerKg: 4, maxMgPerKg: 6, intervalHours: 12, baseDose: 40, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 160,
            indications: ['UTI', 'AOM', 'PCP'],
            warning: 'Dose based on TMP component (40mg TMP / 5ml). Concentration calculation uses TMP.',
            indicationDoses: [
                { name: 'UTI / AOM / Shigellosis', minMgPerKg: 4, maxMgPerKg: 5, intervalHours: 12 },
                { name: 'Pneumocystis jirovecii (PCP) Treatment', minMgPerKg: 3.75, maxMgPerKg: 5, intervalHours: 6 }
            ]
        },
        { id: 104, name: 'Dextromethorphan', form: 'Syrup 15mg/5ml', category: 'syrup', minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 8, baseDose: 15, baseVolume: 5, doseUnit: 'mg', indications: ['Dry Cough'], warning: 'Not recommended under 2 years without physician advice.', requiresAge: true },
        { id: 105, name: 'Diphenhydramine', form: 'Syrup 12.5mg/5ml', category: 'syrup', minMgPerKg: 1.25, maxMgPerKg: 1.25, intervalHours: 6, baseDose: 12.5, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 50, indications: ['Allergy', 'Cough'] },
        { id: 106, name: 'Erythromycin', form: 'Suspension 200mg/5ml', category: 'syrup', minMgPerKg: 10, maxMgPerKg: 12.5, intervalHours: 6, baseDose: 200, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 1000, indications: ['Bacterial Infection'] },
        { id: 107, name: 'Furazolidone', form: 'Suspension 50mg/15ml', category: 'syrup', minMgPerKg: 1.25, maxMgPerKg: 2, intervalHours: 6, baseDose: 50, baseVolume: 15, doseUnit: 'mg', indications: ['Bacterial Diarrhea'] },
        { id: 108, name: 'Guaifenesin', form: 'Syrup 100mg/5ml', category: 'syrup', minMgPerKg: 6, maxMgPerKg: 6, intervalHours: 4, baseDose: 100, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 400, indications: ['Productive Cough'] },
        { id: 109, name: 'Hydroxyzine', form: 'Syrup 10mg/5ml', category: 'syrup', minMgPerKg: 0.5, maxMgPerKg: 0.5, intervalHours: 6, baseDose: 10, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 50, indications: ['Pruritus', 'Anxiety'] },
        {
            id: 110, name: 'Cephalexin', form: 'Suspension 250mg/5ml', category: 'syrup',
            minMgPerKg: 12.5, maxMgPerKg: 25, intervalHours: 6, baseDose: 250, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 1000,
            indications: ['Skin Infection', 'UTI', 'Osteomyelitis'],
            highDoseSafe: true,
            indicationDoses: [
                { name: 'Standard Infection (Skin/Soft Tissue)', minMgPerKg: 12.5, maxMgPerKg: 16.6, intervalHours: 8 },
                { name: 'Severe Infection / Osteomyelitis', minMgPerKg: 25, maxMgPerKg: 25, intervalHours: 6 }
            ]
        },
        { id: 111, name: 'Piperazine', form: 'Syrup', category: 'syrup', minMgPerKg: 50, maxMgPerKg: 75, intervalHours: 24, baseDose: 500, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 3500, indications: ['Pinworm', 'Roundworm'] },
        { id: 112, name: 'Promethazine', form: 'Syrup 6.25mg/5ml', category: 'syrup', minMgPerKg: 0.25, maxMgPerKg: 0.5, intervalHours: 6, baseDose: 6.25, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 25, indications: ['Nausea', 'Allergy'], warning: 'Contraindicated under 2 years.', requiresAge: true },
        { id: 113, name: 'Pseudoephedrine', form: 'Syrup 30mg/5ml', category: 'syrup', minMgPerKg: 1, maxMgPerKg: 1, intervalHours: 6, baseDose: 30, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 60, indications: ['Nasal Congestion'] },
        { id: 114, name: 'Salbutamol', form: 'Syrup 2mg/5ml', category: 'syrup', minMgPerKg: 0.1, maxMgPerKg: 0.15, intervalHours: 8, baseDose: 2, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 4, indications: ['Asthma', 'Bronchospasm'] },
        { id: 115, name: 'Theophylline-G', form: 'Syrup', category: 'syrup', minMgPerKg: 4, maxMgPerKg: 6, intervalHours: 6, baseDose: 50, baseVolume: 5, doseUnit: 'mg', indications: ['Asthma'] },
        { id: 116, name: 'Bromhexine', form: 'Syrup 4mg/5ml', category: 'syrup', minMgPerKg: 0.3, maxMgPerKg: 0.3, intervalHours: 8, baseDose: 4, baseVolume: 5, doseUnit: 'mg', indications: ['Mucolytic'] },
        { id: 117, name: 'Chlorpheniramine', form: 'Syrup 2mg/5ml', category: 'syrup', minMgPerKg: 0.08, maxMgPerKg: 0.08, intervalHours: 6, baseDose: 2, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 4, indications: ['Allergy'] },
        { id: 118, name: 'Dicyclomine', form: 'Syrup 10mg/5ml', category: 'syrup', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 6, baseDose: 10, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 20, indications: ['GI Spasm'], warning: 'Contraindicated under 6 months.', requiresAge: true, fixedDose: 'Age-Based Dose',
            ageDoses: [
                { minAge: 0.5, maxAge: 2, minDose: 5, maxDose: 5 },
                { minAge: 2, maxAge: 12.0001, minDose: 10, maxDose: 10 },
                { minAge: 12.0001, maxAge: 999, minDose: 20, maxDose: 20 }
            ],
            ageAlert: { minAgeRequired: 0.5, message: 'Contraindicated under 6 months.', severity: 'high' }
        },
        { id: 119, name: 'Levetiracetam (Keppra)', form: 'Solution 100mg/ml', category: 'syrup', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 12, baseDose: 100, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 1500, indications: ['Seizures'], warning: 'Starting dose. May be increased as per physician.' },
        { id: 120, name: 'Clarithromycin', form: 'Suspension 125mg/5ml', category: 'syrup', minMgPerKg: 7.5, maxMgPerKg: 7.5, intervalHours: 12, baseDose: 125, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 500, indications: ['Bacterial Infection', 'Otitis Media'] },
        { id: 121, name: 'Doxycycline', form: 'Suspension 50mg/5ml', category: 'syrup', minMgPerKg: 2.2, maxMgPerKg: 2.2, intervalHours: 12, baseDose: 50, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 100, indications: ['Bacterial Infection', 'Acne'], requiresAge: true },
        {
            id: 122, name: 'Metronidazole', form: 'Suspension 200mg/5ml', category: 'syrup',
            minMgPerKg: 7.5, maxMgPerKg: 7.5, intervalHours: 8, baseDose: 200, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 750,
            indications: ['Giardia', 'Amebiasis', 'Anaerobic Infection'],
            indicationDoses: [
                { name: 'Giardiasis', minMgPerKg: 5, maxMgPerKg: 5, intervalHours: 8 },
                { name: 'Amebiasis', minMgPerKg: 11.6, maxMgPerKg: 16.6, intervalHours: 8 },
                { name: 'Anaerobic Bacterial Infection', minMgPerKg: 7.5, maxMgPerKg: 7.5, intervalHours: 6 }
            ]
        },
        { id: 123, name: 'Nitrofurantoin', form: 'Suspension 25mg/5ml', category: 'syrup', minMgPerKg: 1.25, maxMgPerKg: 1.75, intervalHours: 6, baseDose: 25, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 100, indications: ['UTI Treatment', 'UTI Prophylaxis'], indicationDoses: [{ name: 'Treatment', minMgPerKg: 1.25, maxMgPerKg: 1.75, intervalHours: 6 }, { name: 'Prophylaxis', minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 24 }] },
        { id: 124, name: 'Penicillin V', form: 'Suspension 250mg/5ml', category: 'syrup', minMgPerKg: 12.5, maxMgPerKg: 12.5, intervalHours: 6, baseDose: 250, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 500, indications: ['Bacterial Infection', 'Streptococcal'], highDoseSafe: true },
        { id: 125, name: 'Rifampin', form: 'Suspension 100mg/5ml', category: 'syrup', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 12, baseDose: 100, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 600, indications: ['Tuberculosis'] },
        { id: 126, name: 'Vancomycin', form: 'Suspension 250mg/5ml', category: 'syrup', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 6, baseDose: 250, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 500, indications: ['C. difficile Enterocolitis (Oral)'], warning: 'Oral form is for local GI effect only.', highDoseSafe: true, hydrophilic: true },
        { id: 127, name: 'Ondansetron', form: 'Syrup 4mg/5ml', category: 'syrup', minMgPerKg: 0.15, maxMgPerKg: 0.15, intervalHours: 8, baseDose: 4, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 8, indications: ['Vomiting', 'Gastroenteritis'], warning: 'Safe and effective for gastroenteritis.' },
        {
            id: 128, name: 'Clindamycin', form: 'Suspension 75mg/5ml', category: 'syrup',
            minMgPerKg: 3.3, maxMgPerKg: 6.6, intervalHours: 8, baseDose: 75, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 600,
            indications: ['Skin Infection', 'MRSA'],
            warning: 'Administer with full glass of water.',
            indicationDoses: [
                { name: 'Mild-Moderate Infection', minMgPerKg: 3.3, maxMgPerKg: 6.6, intervalHours: 8 },
                { name: 'Severe Infection / MRSA', minMgPerKg: 10, maxMgPerKg: 13.3, intervalHours: 8 }
            ]
        },
        { id: 129, name: 'Acyclovir', form: 'Suspension 200mg/5ml', category: 'syrup', minMgPerKg: 20, maxMgPerKg: 20, intervalHours: 6, baseDose: 200, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 800, maxDailyDoseMg: 3200, indications: ['Herpes Simplex', 'Varicella'], warning: 'Max dose 800mg/dose.' },
        {
            id: 130, name: 'Fluconazole', form: 'Suspension 50mg/5ml', category: 'syrup',
            minMgPerKg: 6, maxMgPerKg: 6, intervalHours: 24, baseDose: 50, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 400,
            indications: ['Candidiasis', 'Systemic Fungal'],
            warning: 'Dose varies by severity.',
            indicationDoses: [
                { name: 'Oropharyngeal Candidiasis: Day 1', minMgPerKg: 6, maxMgPerKg: 6, intervalHours: 24 },
                { name: 'Oropharyngeal Candidiasis: Maintenance', minMgPerKg: 3, maxMgPerKg: 3, intervalHours: 24 },
                { name: 'Systemic Infection / Meningitis', minMgPerKg: 12, maxMgPerKg: 12, intervalHours: 24 }
            ]
        },
        { id: 131, name: 'Valproic Acid', form: 'Syrup 250mg/5ml', category: 'syrup', minMgPerKg: 15, maxMgPerKg: 15, intervalHours: 24, baseDose: 250, baseVolume: 5, doseUnit: 'mg', maxDailyDoseMg: 3000, indications: ['Seizures'], warning: 'Starting dose 10-15 mg/kg/day. Monitor LFTs.' },
        {
            id: 1401, name: 'Domperidone', form: 'Suspension 1mg/ml', category: 'syrup',
            minMgPerKg: 0.25, maxMgPerKg: 0.25, intervalHours: 8, baseDose: 1, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 10, maxDailyDoseMg: 30,
            indications: ['GERD', 'Nausea', 'Vomiting'],
            warning: 'Risk of QT prolongation. Use lowest effective dose.'
        },
        {
            id: 1402, name: 'Lactulose', form: 'Syrup 10g/15ml', category: 'syrup',
            minMgPerKg: 667, maxMgPerKg: 2000, intervalHours: 24, baseDose: 10, baseVolume: 15, doseUnit: 'g',
            indications: ['Constipation'],
            warning: 'Dose equivalent to 1-3 ml/kg/day. Adjust based on clinical response.'
        },
        {
            id: 1403, name: 'Famotidine', form: 'Suspension 40mg/5ml', category: 'syrup',
            minMgPerKg: 0.25, maxMgPerKg: 0.5, intervalHours: 12, baseDose: 40, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 20, maxDailyDoseMg: 40,
            indications: ['GERD', 'Peptic Ulcer', 'Esophagitis']
        },
        {
            id: 1404, name: 'Ketotifen', form: 'Syrup 1mg/5ml', category: 'syrup',
            minMgPerKg: 0.05, maxMgPerKg: 0.05, intervalHours: 12, baseDose: 1, baseVolume: 5, doseUnit: 'mg', maxDailyDoseMg: 2,
            indications: ['Asthma Prophylaxis', 'Allergic Rhinitis'],
            warning: 'May cause drowsiness. Administer cautiously in infants.'
        },
        {
            id: 1405, name: 'Desloratadine', form: 'Syrup 2.5mg/5ml', category: 'syrup',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, baseDose: 2.5, baseVolume: 5, doseUnit: 'mg', fixedDose: 'Age-Based Dose', requiresAge: true,
            indications: ['Allergic Rhinitis', 'Chronic Urticaria'],
            warning: '6-11mo: 1mg | 1-5yr: 1.25mg | 6-11yr: 2.5mg once daily.',
            ageDoses: [
                { minAge: 0.5, maxAge: 1, minDose: 1, maxDose: 1 },
                { minAge: 1, maxAge: 6, minDose: 1.25, maxDose: 1.25 },
                { minAge: 6, maxAge: 12, minDose: 2.5, maxDose: 2.5 },
                { minAge: 12, maxAge: 999, minDose: 5, maxDose: 5 }
            ],
            ageAlert: { minAgeRequired: 0.5, message: 'Not recommended under 6 months.', severity: 'medium' }
        },
        {
            id: 1408, name: 'Calcium (as Carbonate/Glubionate)', form: 'Syrup', category: 'syrup',
            minMgPerKg: 50, maxMgPerKg: 100, intervalHours: 8, baseDose: 125, baseVolume: 5, doseUnit: 'mg',
            indications: ['Hypocalcemia', 'Dietary Supplementation'],
            warning: 'Dose based on elemental calcium. Check bottle for exact elemental Ca/ml.'
        },
        {
            id: 1409, name: 'Carbamazepine', form: 'Suspension 100mg/5ml', category: 'syrup',
            minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 12, baseDose: 100, baseVolume: 5, doseUnit: 'mg', maxDailyDoseMg: 1000,
            indications: ['Seizures', 'Epilepsy'],
            warning: 'Initial dose. Monitor serum levels.'
        },
        {
            id: 1410, name: 'Phenytoin', form: 'Suspension 125mg/5ml', category: 'syrup',
            minMgPerKg: 2.5, maxMgPerKg: 4, intervalHours: 12, baseDose: 125, baseVolume: 5, doseUnit: 'mg', maxDailyDoseMg: 300,
            indications: ['Seizures'],
            warning: 'Maintenance dose. Shake bottle extremely well before use.'
        },
        {
            id: 1412, name: 'Mefenamic Acid', form: 'Suspension 50mg/5ml', category: 'syrup',
            minMgPerKg: 6.5, maxMgPerKg: 6.5, intervalHours: 8, baseDose: 50, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 250,
            indications: ['Pain', 'Resistant Fever'], requiresAge: true,
            warning: 'Not recommended for children under 6 months. Take with food.'
        },
        {
            id: 1501, name: 'Pediatric Cold', form: 'Syrup', category: 'syrup',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 6, doseUnit: 'mg', fixedDose: 'Based on Age/Weight',
            indications: ['Cold symptoms', 'Nasal Congestion'],
            warning: 'Contains Acetaminophen, Pseudoephedrine, and Chlorpheniramine. Do not give with other acetaminophen products.'
        },
        {
            id: 1502, name: 'Ferrous Sulfate', form: 'Syrup 125mg/5ml', category: 'syrup',
            minMgPerKg: 3, maxMgPerKg: 6, intervalHours: 24, baseDose: 125, baseVolume: 5, doseUnit: 'mg',
            indications: ['Iron Deficiency Anemia'],
            warning: 'Dose based on elemental iron (25mg/5ml elemental).'
        },
        {
            id: 1504, name: 'Iron Polymaltose', form: 'Syrup 50mg/5ml', category: 'syrup',
            minMgPerKg: 3, maxMgPerKg: 6, intervalHours: 24, baseDose: 50, baseVolume: 5, doseUnit: 'mg',
            indications: ['Iron Deficiency Anemia']
        },
        {
            id: 1509, name: 'Prednisolone', form: 'Syrup 15mg/5ml', category: 'syrup',
            minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 24, baseDose: 15, baseVolume: 5, doseUnit: 'mg', maxDailyDoseMg: 60,
            indications: ['Asthma', 'Inflammation'],
            warning: 'Taper if used >5 days.'
        },
        {
            id: 1510, name: 'Dexamethasone', form: 'Elixir 0.5mg/5ml', category: 'syrup',
            minMgPerKg: 0.15, maxMgPerKg: 0.6, intervalHours: 24, baseDose: 0.5, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 16,
            indications: ['Croup', 'Asthma Exacerbation']
        },
        {
            id: 1515, name: 'Cetirizine', form: 'Syrup 5mg/5ml', category: 'syrup',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, baseDose: 5, baseVolume: 5, doseUnit: 'mg', fixedDose: 'Age-Based Dose', requiresAge: true,
            indications: ['Allergic Rhinitis'],
            ageDoses: [
                { minAge: 0.5, maxAge: 2, minDose: 2.5, maxDose: 2.5 },
                { minAge: 2, maxAge: 6, minDose: 2.5, maxDose: 5 },
                { minAge: 6, maxAge: 999, minDose: 5, maxDose: 10 }
            ],
            ageAlert: { minAgeRequired: 0.5, message: 'Not recommended under 6 months.', severity: 'medium' }
        },
        {
            id: 1516, name: 'Loratadine', form: 'Syrup 5mg/5ml', category: 'syrup',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, baseDose: 5, baseVolume: 5, doseUnit: 'mg', fixedDose: 'Age-Based Dose', requiresAge: true,
            indications: ['Allergic Rhinitis'],
            ageDoses: [
                { minAge: 2, maxAge: 6, minDose: 5, maxDose: 5 },
                { minAge: 6, maxAge: 999, minDose: 10, maxDose: 10 }
            ],
            ageAlert: { minAgeRequired: 2, message: 'Not recommended under 2 years.', severity: 'high' }
        },
        {
            id: 1603, name: 'Cefdinir', form: 'Suspension 125mg/5ml', category: 'syrup',
            minMgPerKg: 7, maxMgPerKg: 7, intervalHours: 12, baseDose: 125, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 300, maxDailyDoseMg: 600,
            indications: ['Otitis Media', 'Pneumonia', 'Skin Infection']
        },
        {
            id: 1604, name: 'Cefuroxime', form: 'Suspension 125mg/5ml', category: 'syrup',
            minMgPerKg: 15, maxMgPerKg: 20, intervalHours: 12, baseDose: 125, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 500, maxDailyDoseMg: 1000,
            indications: ['Otitis Media', 'Respiratory Infection']
        },
        {
            id: 1608, name: 'Oxcarbazepine', form: 'Suspension 300mg/5ml', category: 'syrup',
            minMgPerKg: 4, maxMgPerKg: 5, intervalHours: 12, baseDose: 300, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 600, maxDailyDoseMg: 2400,
            indications: ['Focal Seizures'], warning: 'Starting dose 8-10 mg/kg/day divided q12h.'
        },
        {
            id: 1612, name: 'Fexofenadine', form: 'Suspension 30mg/5ml', category: 'syrup',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, baseDose: 30, baseVolume: 5, doseUnit: 'mg', fixedDose: 'Age-Based Dose', requiresAge: true,
            indications: ['Allergic Rhinitis', 'Urticaria'],
            ageDoses: [
                { minAge: 0.5, maxAge: 2, minDose: 15, maxDose: 15 },
                { minAge: 2, maxAge: 12, minDose: 30, maxDose: 30 },
                { minAge: 12, maxAge: 999, minDose: 60, maxDose: 60 }
            ],
            ageAlert: { minAgeRequired: 0.5, message: 'Not recommended under 6 months.', severity: 'medium' }
        },
        {
            id: 1704, name: 'Linezolid', form: 'Suspension 100mg/5ml', category: 'syrup',
            minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 8, baseDose: 100, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 600, maxDailyDoseMg: 1200,
            indications: ['MRSA', 'VRE Infections']
        },
        {
            id: 1706, name: 'Oseltamivir (Tamiflu)', form: 'Suspension 12mg/ml', category: 'syrup',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, baseDose: 12, baseVolume: 1, doseUnit: 'mg', fixedDose: 'Weight-based tier',
            indications: ['Influenza Treatment'], warning: '<15kg: 30mg | 15-23kg: 45mg | 23-40kg: 60mg | >40kg: 75mg twice daily.'
        },
        {
            id: 1707, name: 'Cefadroxil', form: 'Suspension 250mg/5ml', category: 'syrup',
            minMgPerKg: 15, maxMgPerKg: 15, intervalHours: 12, baseDose: 250, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 500, maxDailyDoseMg: 1000,
            indications: ['Pharyngitis', 'Skin Infections']
        },
        {
            id: 1718, name: 'Chloral Hydrate', form: 'Syrup 500mg/5ml', category: 'syrup',
            minMgPerKg: 25, maxMgPerKg: 50, intervalHours: 0, baseDose: 500, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 1000,
            indications: ['Pre-procedure Sedation'], warning: 'Administer 30-45 minutes before procedure.'
        },
        {
            id: 1720, name: 'Phenobarbital', form: 'Syrup 15mg/5ml', category: 'syrup',
            minMgPerKg: 3, maxMgPerKg: 5, intervalHours: 24, baseDose: 15, baseVolume: 5, doseUnit: 'mg', maxDailyDoseMg: 200,
            indications: ['Seizures'], warning: 'Maintenance dose. Monitor serum levels.'
        },
        {
            id: 2006, name: 'Hyoscine (Buscopan)', form: 'Syrup 5mg/5ml', category: 'syrup',
            minMgPerKg: 0.3, maxMgPerKg: 0.5, intervalHours: 8, baseDose: 5, baseVolume: 5, doseUnit: 'mg', maxSingleDoseMg: 20,
            indications: ['GI Spasm', 'Abdominal Cramps']
        },
    
        // ==========================================
        // DROPS
        // ==========================================
        { id: 6, name: 'Acetaminophen', form: 'Drop 100mg/ml', category: 'drop', minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 6, baseDose: 100, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 4000, indications: ['Fever', 'Pain'] },
        { id: 201, name: 'Clobutinol', form: 'Drop 10mg/ml', category: 'drop', minMgPerKg: 0.5, maxMgPerKg: 1, intervalHours: 8, doseUnit: 'mg', baseDose: 10, baseVolume: 1, indications: ['Cough', 'Bronchospasm'], warning: 'Use with caution in children under 2 years.' },
        { id: 202, name: 'Dextromethorphan', form: 'Drop 15mg/ml', category: 'drop', minMgPerKg: 0.5, maxMgPerKg: 1, intervalHours: 6, doseUnit: 'mg', baseDose: 15, baseVolume: 1, indications: ['Dry Cough'], warning: 'Not recommended under 2 years.', requiresAge: true },
        { id: 203, name: 'Dimeticon', form: 'Drop 40mg/ml', category: 'drop', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 8, doseUnit: 'mg', baseDose: 40, baseVolume: 1, indications: ['Colic', 'Gas'], fixedDose: '0.3-0.6 ml', warning: 'Symptomatic relief of gas and colic.' },
        { id: 204, name: 'Ferrous Sulfate', form: 'Drop 125mg/ml', category: 'drop', minMgPerKg: 3, maxMgPerKg: 6, intervalHours: 24, baseDose: 125, baseVolume: 1, doseUnit: 'mg', indications: ['Iron Deficiency Anemia'], warning: 'Dose based on elemental iron (25mg/ml elemental).' },
        { id: 205, name: 'Metoclopramide', form: 'Drop 4mg/ml', category: 'drop', minMgPerKg: 0.1, maxMgPerKg: 0.2, intervalHours: 8, doseUnit: 'mg', baseDose: 4, baseVolume: 1, maxSingleDoseMg: 10, indications: ['Nausea', 'Vomiting', 'GERD'], warning: 'Contraindicated in children under 1 year.', requiresAge: true },
        { id: 206, name: 'Nystatin', form: 'Drop 100000U/ml', category: 'drop', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 6, baseDose: 100000, baseVolume: 1, doseUnit: 'Units', indications: ['Oral Thrush'], fixedDose: '1-2 ml (100000-200000U) 4 times daily', warning: 'Administer after feeding.' },
        { id: 207, name: 'Vitamin A+D', form: 'Drop', category: 'drop', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'Units', baseDose: 400, baseVolume: 1, indications: ['Routine Supplementation', 'Vitamin Deficiency'], fixedDose: '1 ml daily', warning: 'Standard daily dose for infants under 15-24 months.' },
        { id: 208, name: 'Phenobarbital', form: 'Drop 20mg/ml', category: 'drop', minMgPerKg: 3, maxMgPerKg: 5, intervalHours: 24, baseDose: 20, baseVolume: 1, doseUnit: 'mg', indications: ['Seizures'], warning: 'Maintenance dose. Monitor serum levels.' },
        { id: 209, name: 'Zinc Sulfate', form: 'Drop 10mg/ml', category: 'drop', minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 24, doseUnit: 'mg', baseDose: 10, baseVolume: 1, maxDailyDoseMg: 40, indications: ['Diarrhea', 'Zinc Deficiency'] },
        { id: 210, name: 'Loratadine', form: 'Drop', category: 'drop', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'mg', indications: ['Allergy'], fixedDose: 'Age-Based Dose', requiresAge: true,
            ageDoses: [
                { minAge: 2, maxAge: 6, minDose: 5, maxDose: 5 },
                { minAge: 6, maxAge: 999, minDose: 10, maxDose: 10 }
            ],
            ageAlert: { minAgeRequired: 2, message: 'Not recommended under 2 years.', severity: 'high' }
        },
        { id: 211, name: 'Cetirizine', form: 'Drop', category: 'drop', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'mg', indications: ['Allergy'], fixedDose: 'Age-Based Dose', requiresAge: true,
            ageDoses: [
                { minAge: 0.5, maxAge: 2, minDose: 2.5, maxDose: 2.5 },
                { minAge: 2, maxAge: 6, minDose: 2.5, maxDose: 5 },
                { minAge: 6, maxAge: 999, minDose: 5, maxDose: 10 }
            ],
            ageAlert: { minAgeRequired: 0.5, message: 'Not recommended under 6 months.', severity: 'medium' }
        },
        {
            id: 1406, name: 'Pediatric Multivitamin', form: 'Drop', category: 'drop',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'mg',
            indications: ['Routine Supplementation'],
            fixedDose: '1 ml daily'
        },
        {
            id: 1407, name: 'Vitamin D3', form: 'Drop 400 IU/ml', category: 'drop',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'Units', baseDose: 400, baseVolume: 1,
            indications: ['Rickets Prophylaxis'],
            fixedDose: '1 ml (400 IU) daily',
            warning: 'Check specific brand concentration carefully before use.'
        },
        {
            id: 1503, name: 'Iron Polymaltose', form: 'Drop 50mg/ml', category: 'drop',
            minMgPerKg: 3, maxMgPerKg: 6, intervalHours: 24, baseDose: 50, baseVolume: 1, doseUnit: 'mg',
            indications: ['Iron Deficiency Anemia'],
            warning: 'Better GI tolerance. Dose based on elemental iron.'
        },
        {
            id: 1505, name: 'Liposomal Iron (e.g. Sidereal)', form: 'Drop 7mg/ml', category: 'drop',
            minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 24, baseDose: 7, baseVolume: 1, doseUnit: 'mg',
            indications: ['Iron Deficiency Anemia', 'Supplementation'],
            warning: 'Highly bioavailable, usually lower dose needed.'
        },
        {
            id: 1513, name: 'Salbutamol', form: 'Nebulizer Solution 5mg/ml', category: 'drop',
            minMgPerKg: 0.15, maxMgPerKg: 0.15, intervalHours: 4, baseDose: 5, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 5,
            indications: ['Asthma', 'Bronchospasm'],
            warning: 'Dilute with normal saline before nebulization.'
        },
        {
            id: 1601, name: 'Budesonide (Pulmicort)', form: 'Nebules 0.5mg/2ml', category: 'drop',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, baseDose: 0.5, baseVolume: 2, doseUnit: 'mg', fixedDose: '0.25 - 1 mg/dose (Asthma) / 2 mg (Croup)',
            indications: ['Asthma', 'Croup']
        },
        {
            id: 1715, name: 'Ipratropium Bromide', form: 'Nebulizer Solution 250mcg/ml', category: 'drop',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 6, baseDose: 250, baseVolume: 1, doseUnit: 'mcg', fixedDose: '250 mcg (<20kg) | 500 mcg (>20kg)',
            indications: ['Severe Asthma Exacerbation'], warning: 'Often mixed with Salbutamol for nebulization.'
        },
        {
            id: 1716, name: 'Hypertonic Saline 3%', form: 'Nebulizer Solution', category: 'drop',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 8, doseUnit: 'mg', fixedDose: '3 to 4 ml via nebulizer',
            indications: ['Bronchiolitis'], warning: 'Can induce bronchospasm; sometimes given with a bronchodilator.'
        },
        {
            id: 2011, name: 'Clonazepam', form: 'Drop 2.5mg/ml', category: 'drop',
            minMgPerKg: 0.005, maxMgPerKg: 0.025, intervalHours: 12, baseDose: 2.5, baseVolume: 1, doseUnit: 'mg',
            indications: ['Seizures'], warning: 'Start with low dose and titrate. (Concentration: 2.5 mg/ml)'
        },
    
        // ==========================================
        // AMPOULES
        // ==========================================
        {
            id: 10, name: 'Gentamicin', form: 'Ampoule 80mg', category: 'ampoule',
            minMgPerKg: 2.5, maxMgPerKg: 3.5, intervalHours: 8, baseDose: 80, baseVolume: 2, doseUnit: 'mg', maxSingleDoseMg: 350,
            indications: ['Gram-negative Infections'],
            warning: 'Monitor renal function and hearing.',
            hydrophilic: true,
            indicationDoses: [
                { name: 'Traditional Dosing', minMgPerKg: 2.5, maxMgPerKg: 3.5, intervalHours: 8 },
                { name: 'Extended-Interval (Once Daily)', minMgPerKg: 5, maxMgPerKg: 7.5, intervalHours: 24 }
            ]
        },
        { id: 301, name: 'Cimetidine', form: 'Ampoule 200mg/2ml', category: 'ampoule', minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 6, baseDose: 200, baseVolume: 2, doseUnit: 'mg', maxSingleDoseMg: 300, indications: ['GI Ulcer', 'GERD'], warning: 'May cause CNS effects in neonates.' },
        {
            id: 302, name: 'Dexamethasone', form: 'Ampoule 4mg/ml', category: 'ampoule',
            minMgPerKg: 0.15, maxMgPerKg: 0.6, intervalHours: 0, baseDose: 4, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 16,
            indications: ['Inflammation', 'Croup', 'Meningitis', 'Asthma'],
            warning: 'Use lowest effective dose.',
            indicationDoses: [
                { name: 'Croup (Single Dose)', minMgPerKg: 0.15, maxMgPerKg: 0.6, intervalHours: 0 },
                { name: 'Asthma Exacerbation', minMgPerKg: 0.6, maxMgPerKg: 0.6, intervalHours: 24 },
                { name: 'Bacterial Meningitis', minMgPerKg: 0.15, maxMgPerKg: 0.15, intervalHours: 6 }
            ]
        },
        {
            id: 303, name: 'Diazepam', form: 'Ampoule 5mg/ml', category: 'ampoule',
            minMgPerKg: 0.1, maxMgPerKg: 0.3, intervalHours: 0, baseDose: 5, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 10,
            indications: ['Seizures', 'Muscle Spasm'], requiresAge: true,
            warning: 'Risk of respiratory depression. Have resuscitation equipment ready.',
            indicationDoses: [
                { name: 'Status Epilepticus (IV)', minMgPerKg: 0.1, maxMgPerKg: 0.3, intervalHours: 0 },
                { name: 'Muscle Spasm', minMgPerKg: 0.1, maxMgPerKg: 0.2, intervalHours: 8 }
            ]
        },
        {
            id: 304, name: 'Gentamicin', form: 'Ampoule 40mg/ml', category: 'ampoule',
            minMgPerKg: 2.5, maxMgPerKg: 3.5, intervalHours: 8, baseDose: 40, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 350,
            indications: ['Gram-negative Infections'],
            warning: 'Monitor renal function and hearing.',
            hydrophilic: true,
            indicationDoses: [
                { name: 'Traditional Dosing', minMgPerKg: 2.5, maxMgPerKg: 3.5, intervalHours: 8 },
                { name: 'Extended-Interval (Once Daily)', minMgPerKg: 5, maxMgPerKg: 7.5, intervalHours: 24 }
            ]
        },
        { id: 305, name: 'Metoclopramide', form: 'Ampoule 10mg/2ml', category: 'ampoule', minMgPerKg: 0.1, maxMgPerKg: 0.2, intervalHours: 8, baseDose: 10, baseVolume: 2, doseUnit: 'mg', maxSingleDoseMg: 10, indications: ['Nausea', 'Vomiting'], warning: 'Contraindicated in children under 1 year.', requiresAge: true },
        { id: 306, name: 'Epinephrine', form: 'Ampoule 1mg/ml', category: 'ampoule', minMgPerKg: 0.01, maxMgPerKg: 0.01, intervalHours: 0, baseDose: 1, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 0.5, indications: ['Anaphylaxis', 'Cardiac Arrest'], warning: 'Emergency use only. Dilute appropriately for IV vs IM.' },
        { id: 307, name: 'Calcium Gluconate', form: 'Ampoule 100mg/ml', category: 'ampoule', minMgPerKg: 100, maxMgPerKg: 100, intervalHours: 24, baseDose: 100, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 2000, indications: ['Hypocalcemia'], warning: 'Monitor calcium levels. Dilute before IV use.' },
        {
            id: 308, name: 'Phenobarbital', form: 'Ampoule 200mg/ml', category: 'ampoule',
            minMgPerKg: 3, maxMgPerKg: 5, intervalHours: 24, baseDose: 200, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 200,
            indications: ['Seizures'],
            warning: 'Loading dose is required for acute control.',
            indicationDoses: [
                { name: 'Acute Loading Dose (IV)', minMgPerKg: 15, maxMgPerKg: 20, intervalHours: 0 },
                { name: 'Maintenance Dose', minMgPerKg: 3, maxMgPerKg: 5, intervalHours: 24 }
            ]
        },
        { id: 309, name: 'Furosemide', form: 'Ampoule 10mg/ml', category: 'ampoule', minMgPerKg: 1, maxMgPerKg: 1, intervalHours: 12, baseDose: 10, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 40, indications: ['Edema', 'Heart Failure'], warning: 'Monitor electrolyte balance.' },
        { id: 310, name: 'Morphine', form: 'Ampoule 10mg/ml', category: 'ampoule', minMgPerKg: 0.1, maxMgPerKg: 0.2, intervalHours: 4, baseDose: 10, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 15, indications: ['Severe Pain'], warning: 'Risk of respiratory depression. Use with caution.' },
        { id: 311, name: 'Naloxone', form: 'Ampoule 0.4mg/ml', category: 'ampoule', minMgPerKg: 0.01, maxMgPerKg: 0.1, intervalHours: 0, baseDose: 0.4, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 2, indications: ['Opioid Overdose'], warning: 'Emergency use only. May precipitate withdrawal.' },
        { id: 312, name: 'Atropine', form: 'Ampoule 0.5mg/ml', category: 'ampoule', minMgPerKg: 0.02, maxMgPerKg: 0.02, intervalHours: 0, baseDose: 0.5, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 0.5, indications: ['Bradycardia'], warning: 'Emergency use only.' },
        { id: 313, name: 'Flumazenil', form: 'Ampoule 0.1mg/ml', category: 'ampoule', minMgPerKg: 0.01, maxMgPerKg: 0.01, intervalHours: 0, baseDose: 0.1, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 0.2, indications: ['Benzodiazepine Overdose'], warning: 'Emergency use only.' },
        { id: 314, name: 'Ondansetron', form: 'Ampoule 4mg/2ml', category: 'ampoule', minMgPerKg: 0.15, maxMgPerKg: 0.15, intervalHours: 8, baseDose: 4, baseVolume: 2, doseUnit: 'mg', maxSingleDoseMg: 8, indications: ['Vomiting'], warning: 'Safe and effective antiemetic.' },
        {
            id: 1411, name: 'Midazolam', form: 'Ampoule 15mg/3ml', category: 'ampoule',
            minMgPerKg: 0.1, maxMgPerKg: 0.2, intervalHours: 0, baseDose: 15, baseVolume: 3, doseUnit: 'mg', maxSingleDoseMg: 5,
            indications: ['Status Epilepticus', 'Sedation'],
            warning: 'Emergency use. Can be administered IV, IM, or Buccal.'
        },
        {
            id: 1508, name: 'Vitamin D3', form: 'Ampoule 300,000 IU', category: 'ampoule',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 0, baseDose: 300000, baseVolume: 1, doseUnit: 'Units', fixedDose: 'Single IM injection',
            indications: ['Severe Malabsorption', 'Rickets'],
            warning: 'For intramuscular (IM) use only. Extremely high dose.'
        },
        {
            id: 1512, name: 'Acetaminophen (Apotel)', form: 'Ampoule 1000mg/100ml', category: 'ampoule',
            minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 6, baseDose: 1000, baseVolume: 100, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 4000,
            indications: ['Fever', 'Pain (NPO)']
        },
        {
            id: 1514, name: 'Diphenhydramine', form: 'Ampoule 50mg/ml', category: 'ampoule',
            minMgPerKg: 1, maxMgPerKg: 1.25, intervalHours: 6, baseDose: 50, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 50,
            indications: ['Allergic Reaction', 'Anaphylaxis adjunct']
        },
        {
            id: 1602, name: 'Epinephrine (L-Epi)', form: 'Ampoule 1mg/ml', category: 'ampoule',
            minMgPerKg: 0.5, maxMgPerKg: 0.5, intervalHours: 0, baseDose: 1, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 5,
            indications: ['Croup', 'Stridor'],
            warning: 'Nebulized dose: 0.5 ml/kg of 1:1000 solution (Max 5 ml).'
        },
        {
            id: 1610, name: 'Lorazepam', form: 'Ampoule 4mg/ml', category: 'ampoule',
            minMgPerKg: 0.05, maxMgPerKg: 0.1, intervalHours: 0, baseDose: 4, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 4,
            indications: ['Status Epilepticus'], warning: 'Emergency use. Dilute with equal volume of diluent before IV push.'
        },
        {
            id: 1614, name: 'Epinephrine Auto-injector', form: 'Ampoule 0.15mg', category: 'ampoule',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 0, baseDose: 0.15, baseVolume: 1, doseUnit: 'mg', fixedDose: '0.15 mg IM (for 15-30 kg weight)',
            indications: ['Anaphylaxis'], warning: 'For children weighing 15-30 kg. >30 kg use 0.3 mg.'
        },
        {
            id: 1710, name: 'Fentanyl', form: 'Ampoule 50mcg/ml', category: 'ampoule',
            minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 0, baseDose: 50, baseVolume: 1, doseUnit: 'mcg', maxSingleDoseMg: 50,
            indications: ['Analgesia', 'Sedation'], warning: 'Dose in micrograms (mcg)! Push slowly to avoid chest wall rigidity. 1-2 mcg/kg/dose.'
        },
        {
            id: 1712, name: 'Ketorolac', form: 'Ampoule 30mg/ml', category: 'ampoule',
            minMgPerKg: 0.5, maxMgPerKg: 0.5, intervalHours: 6, baseDose: 30, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 15, maxDailyDoseMg: 60,
            indications: ['Moderate to Severe Pain'], warning: 'Max 5 days of use. Avoid in bleeding risk or renal impairment.'
        },
        {
            id: 1713, name: 'Adenosine', form: 'Ampoule 6mg/2ml', category: 'ampoule',
            minMgPerKg: 0.1, maxMgPerKg: 0.2, intervalHours: 0, baseDose: 6, baseVolume: 2, doseUnit: 'mg', maxSingleDoseMg: 12,
            indications: ['SVT (Supraventricular Tachycardia)'], warning: 'Rapid IV push followed by rapid saline flush. First dose: 0.1 mg/kg. Second: 0.2 mg/kg.'
        },
        {
            id: 1714, name: 'Amiodarone', form: 'Ampoule 150mg/3ml', category: 'ampoule',
            minMgPerKg: 5, maxMgPerKg: 5, intervalHours: 0, baseDose: 150, baseVolume: 3, doseUnit: 'mg', maxSingleDoseMg: 300,
            indications: ['Refractory VF/Pulseless VT', 'SVT'], warning: 'Infuse over 20-60 mins (except in cardiac arrest). Monitor BP and ECG.'
        },
        {
            id: 1717, name: 'Acetylcysteine', form: 'Ampoule 200mg/ml', category: 'ampoule',
            minMgPerKg: 150, maxMgPerKg: 150, intervalHours: 0, baseDose: 200, baseVolume: 1, doseUnit: 'mg',
            indications: ['Acetaminophen Toxicity'], warning: 'Loading dose: 150 mg/kg over 60 min. Follow standard 3-bag IV protocol.', highDoseSafe: true
        },
        {
            id: 2005, name: 'Hyoscine (Buscopan)', form: 'Ampoule 20mg/ml', category: 'ampoule',
            minMgPerKg: 0.3, maxMgPerKg: 0.5, intervalHours: 8, baseDose: 20, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 20,
            indications: ['GI Spasm', 'Abdominal Cramps']
        },
        {
            id: 2009, name: 'Betamethasone LA', form: 'Ampoule 4mg/ml', category: 'ampoule',
            minMgPerKg: 0.1, maxMgPerKg: 0.2, intervalHours: 24, baseDose: 4, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 4,
            indications: ['Severe Allergic Reaction', 'Croup']
        },
    
        // ==========================================
        // TABLETS & CAPSULES
        // ==========================================
        { id: 14, name: 'Methylphenidate', form: 'Tablet 10mg', category: 'tablet', minMgPerKg: 0.3, maxMgPerKg: 0.6, intervalHours: 8, doseUnit: 'mg', maxDailyDoseMg: 60, indications: ['ADHD'] },
        { id: 16, name: 'Diazepam', form: 'Tablet 5mg', category: 'tablet', minMgPerKg: 0.1, maxMgPerKg: 0.3, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 10, indications: ['Muscle Spasm', 'Anxiety'], requiresAge: true },
        { id: 17, name: 'Phenobarbital', form: 'Tablet 30mg', category: 'tablet', minMgPerKg: 3, maxMgPerKg: 5, intervalHours: 24, doseUnit: 'mg', maxDailyDoseMg: 200, indications: ['Seizures'], warning: 'Maintenance dose.' },
        { id: 401, name: 'Acetaminophen', form: 'Tablet 500mg', category: 'tablet', minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 6, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 4000, indications: ['Fever', 'Pain'], warning: 'Risk of liver toxicity with overdose.' },
        {
            id: 402, name: 'Ibuprofen', form: 'Tablet 200mg', category: 'tablet',
            minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 800, maxDailyDoseMg: 3200,
            indications: ['Fever', 'Pain', 'Inflammation', 'JIA'], requiresAge: true,
            warning: 'Take with food.',
            indicationDoses: [
                { name: 'Fever / Pain', minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 8 },
                { name: 'Juvenile Idiopathic Arthritis (JIA)', minMgPerKg: 7.5, maxMgPerKg: 10, intervalHours: 6 }
            ]
        },
        {
            id: 403, name: 'Amoxicillin', form: 'Tablet 500mg', category: 'tablet',
            minMgPerKg: 13.3, maxMgPerKg: 15, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 3000,
            indications: ['Bacterial Infection'],
            warning: 'Standard dose. High-dose for AOM is 80-90 mg/kg/day divided q12h.',
            indicationDoses: [
                { name: 'Standard Infection (Mild to Moderate)', minMgPerKg: 13.3, maxMgPerKg: 16.6, intervalHours: 8 },
                { name: 'Acute Otitis Media (AOM) / High Dose', minMgPerKg: 40, maxMgPerKg: 45, intervalHours: 12 }
            ]
        },
        {
            id: 404, name: 'Azithromycin', form: 'Tablet 250mg', category: 'tablet',
            minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 24, doseUnit: 'mg', maxSingleDoseMg: 500, maxDailyDoseMg: 500,
            indications: ['Bacterial Infection'],
            indicationDoses: [
                { name: 'AOM/Pneumonia: Day 1', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 24 },
                { name: 'AOM/Pneumonia: Days 2-5', minMgPerKg: 5, maxMgPerKg: 5, intervalHours: 24 },
                { name: 'Pharyngitis / Tonsillitis (5 Days)', minMgPerKg: 12, maxMgPerKg: 12, intervalHours: 24 }
            ]
        },
        { id: 405, name: 'Risperidone', form: 'Tablet 1mg', category: 'tablet', minMgPerKg: 0.025, maxMgPerKg: 0.05, intervalHours: 12, doseUnit: 'mg', maxDailyDoseMg: 6, indications: ['Psychiatric Disorders'], warning: 'Monitor side effects.' },
        { id: 406, name: 'Propranolol', form: 'Tablet 10mg', category: 'tablet', minMgPerKg: 0.5, maxMgPerKg: 1, intervalHours: 12, doseUnit: 'mg', maxDailyDoseMg: 240, indications: ['Migraine', 'Hemangioma'] },
        {
            id: 407, name: 'Metronidazole', form: 'Tablet 250mg', category: 'tablet',
            minMgPerKg: 7.5, maxMgPerKg: 7.5, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 750, maxDailyDoseMg: 4000,
            indications: ['Giardia', 'Amebiasis', 'Anaerobic Infection'],
            indicationDoses: [
                { name: 'Giardiasis', minMgPerKg: 5, maxMgPerKg: 5, intervalHours: 8 },
                { name: 'Amebiasis', minMgPerKg: 11.6, maxMgPerKg: 16.6, intervalHours: 8 },
                { name: 'Anaerobic Bacterial Infection', minMgPerKg: 7.5, maxMgPerKg: 7.5, intervalHours: 6 }
            ]
        },
        { id: 408, name: 'Ciprofloxacin', form: 'Tablet 250mg', category: 'tablet', minMgPerKg: 10, maxMgPerKg: 20, intervalHours: 12, doseUnit: 'mg', maxSingleDoseMg: 750, indications: ['UTI', 'Respiratory Infection'], warning: 'Contraindicated in children under 18 years for routine use.', requiresAge: true },
        { id: 409, name: 'Doxycycline', form: 'Tablet 100mg', category: 'tablet', minMgPerKg: 2.2, maxMgPerKg: 2.2, intervalHours: 12, doseUnit: 'mg', maxSingleDoseMg: 100, indications: ['Bacterial Infection', 'Acne'], requiresAge: true },
        { id: 410, name: 'Prednisolone', form: 'Tablet 5mg', category: 'tablet', minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 24, doseUnit: 'mg', maxDailyDoseMg: 60, indications: ['Inflammation', 'Asthma'], warning: 'Taper when discontinuing.' },
        { id: 411, name: 'Montelukast', form: 'Chewable Tablet 5mg', category: 'tablet', fixedDose: '5 mg daily', intervalHours: 24, doseUnit: 'mg', maxDailyDoseMg: 10, indications: ['Asthma', 'Allergic Rhinitis'], warning: 'For children 6 to 14 years.' },
        {
            id: 1506, name: 'Vitamin D3', form: 'Pearl 50000 IU', category: 'tablet',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 0, doseUnit: 'Units', fixedDose: '1 pearl weekly/monthly (Based on deficiency)',
            indications: ['Severe Vitamin D Deficiency', 'Rickets Treatment'],
            warning: 'Extremely high dose! Not for daily routine supplementation without explicit physician order.'
        },
        {
            id: 1507, name: 'Vitamin D3', form: 'Pearl 1000 IU', category: 'tablet',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'Units', fixedDose: '1 pearl daily',
            indications: ['Maintenance Supplementation']
        },
        {
            id: 1511, name: 'Ondansetron', form: 'ODT Tablet 4mg', category: 'tablet',
            minMgPerKg: 0.15, maxMgPerKg: 0.15, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 8,
            indications: ['Vomiting']
        },
        { id: 1609, name: 'Clobazam', form: 'Tablet 10mg', category: 'tablet', minMgPerKg: 0.1, maxMgPerKg: 0.5, intervalHours: 12, doseUnit: 'mg', maxDailyDoseMg: 40, indications: ['Refractory Seizures'] },
        { id: 1613, name: 'Levothyroxine', form: 'Tablet 50mcg', category: 'tablet', minMgPerKg: 0.004, maxMgPerKg: 0.01, intervalHours: 24, doseUnit: 'mg', maxDailyDoseMg: 0.2, indications: ['Hypothyroidism'], warning: 'Dose varies by age. Infants (10-15 mcg/kg/day), Children (4-6 mcg/kg/day).' },
        {
            id: 1705, name: 'Oseltamivir (Tamiflu)', form: 'Capsule 75mg', category: 'tablet',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, doseUnit: 'mg', fixedDose: 'Weight-based tier',
            indications: ['Influenza Treatment'], warning: '<15kg: 30mg | 15-23kg: 45mg | 23-40kg: 60mg | >40kg: 75mg twice daily.'
        },
        {
            id: 1719, name: 'Topiramate', form: 'Tablet 25mg', category: 'tablet',
            minMgPerKg: 0.5, maxMgPerKg: 3, intervalHours: 12, doseUnit: 'mg', maxDailyDoseMg: 400,
            indications: ['Seizures', 'Migraine Prophylaxis'], warning: 'Start low (0.5-1 mg/kg/day) and titrate up.'
        },
        {
            id: 1724, name: 'Hydrocortisone', form: 'Tablet 10mg', category: 'tablet',
            minMgPerKg: 8, maxMgPerKg: 10, intervalHours: 24, doseUnit: 'mg',
            indications: ['Adrenal Insufficiency (CAH)'], warning: 'Physiologic replacement is 8-10 mg/m2/day divided q8h. Stress doses are higher.'
        },
        {
            id: 2012, name: 'Clonazepam', form: 'Tablet 1mg', category: 'tablet',
            minMgPerKg: 0.005, maxMgPerKg: 0.025, intervalHours: 12, doseUnit: 'mg',
            indications: ['Seizures']
        },
        {
            id: 2013, name: 'Gabapentin', form: 'Capsule 100mg', category: 'tablet',
            minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 300,
            indications: ['Neuropathic Pain', 'Focal Seizures']
        },
    
        // ==========================================
        // SUPPOSITORIES
        // ==========================================
        { id: 21, name: 'Acetaminophen', form: 'Suppository 120mg', category: 'suppository', minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 6, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 4000, indications: ['Fever', 'Pain'], warning: 'Use with caution in severe diarrhea.' },
        { id: 22, name: 'Diazepam', form: 'Suppository 5mg', category: 'suppository', minMgPerKg: 0.2, maxMgPerKg: 0.5, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 10, indications: ['Seizures', 'Spasm'], warning: 'Risk of drowsiness.', requiresAge: true },
        { id: 501, name: 'Pedi-Lax Glycerin', form: 'Suppository 1g', category: 'suppository', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'mg', indications: ['Constipation'], fixedDose: '1 suppository PRN', warning: 'For occasional use only. Not for routine use.' },
        { id: 502, name: 'Bisacodyl', form: 'Suppository 5mg', category: 'suppository', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'mg', indications: ['Constipation'], fixedDose: '5-10 mg (for children over 6 years)' },
        { id: 503, name: 'Indomethacin', form: 'Suppository 25mg', category: 'suppository', minMgPerKg: 0.1, maxMgPerKg: 0.2, intervalHours: 12, doseUnit: 'mg', indications: ['PDA Closure'], warning: 'Used in neonates only under specialist supervision.' },
        { id: 504, name: 'Hydrocortisone', form: 'Suppository 25mg', category: 'suppository', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, doseUnit: 'mg', indications: ['Ulcerative Colitis'], fixedDose: '10-20 mg/dose' },
        {
            id: 2007, name: 'Diclofenac', form: 'Suppository 50mg', category: 'suppository',
            minMgPerKg: 0.5, maxMgPerKg: 1, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 50,
            indications: ['Fever (Resistant)', 'Pain'], requiresAge: true,
            warning: 'Contraindicated under 1 year. Use with extreme caution due to risk of severe hypothermia and GI bleed.'
        },
        {
            id: 2008, name: 'Ibuprofen', form: 'Suppository 125mg', category: 'suppository',
            minMgPerKg: 5, maxMgPerKg: 10, intervalHours: 8, doseUnit: 'mg', maxSingleDoseMg: 400,
            indications: ['Fever', 'Pain (NPO/Vomiting)'], requiresAge: true
        },
    
        // ==========================================
        // VIALS
        // ==========================================
        {
            id: 23, name: 'Ceftriaxone', form: 'Vial 1g', category: 'vial',
            minMgPerKg: 25, maxMgPerKg: 37.5, intervalHours: 12, baseDose: 1000, doseUnit: 'mg', maxSingleDoseMg: 2000, maxDailyDoseMg: 4000,
            indications: ['Severe Infection', 'Meningitis'],
            highDoseSafe: true, requiresAge: true,
            warning: 'Contraindicated in neonates with jaundice.',
            indicationDoses: [
                { name: 'Standard / Severe Infection', minMgPerKg: 25, maxMgPerKg: 37.5, intervalHours: 12 },
                { name: 'Meningitis', minMgPerKg: 50, maxMgPerKg: 50, intervalHours: 12 }
            ]
        },
        {
            id: 24, name: 'Vancomycin', form: 'Vial 500mg', category: 'vial',
            minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 6, baseDose: 500, doseUnit: 'mg', maxSingleDoseMg: 1000,
            indications: ['MRSA Infection', 'Meningitis'],
            highDoseSafe: true, hydrophilic: true,
            warning: 'Requires serum level monitoring.',
            indicationDoses: [
                { name: 'Standard / Mild-Mod Infection', minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 6 },
                { name: 'Meningitis / Severe MRSA', minMgPerKg: 15, maxMgPerKg: 15, intervalHours: 6 }
            ]
        },
        {
            id: 601, name: 'Ampicillin', form: 'Vial 500mg', category: 'vial',
            minMgPerKg: 25, maxMgPerKg: 37.5, intervalHours: 6, baseDose: 500, doseUnit: 'mg', maxSingleDoseMg: 2000, maxDailyDoseMg: 12000,
            indications: ['Bacterial Infection', 'Meningitis'],
            highDoseSafe: true,
            warning: 'Dose depends on severity. May require higher doses for meningitis.',
            indicationDoses: [
                { name: 'Standard / Moderate Infection', minMgPerKg: 25, maxMgPerKg: 37.5, intervalHours: 6 },
                { name: 'Meningitis / Severe Infection', minMgPerKg: 50, maxMgPerKg: 100, intervalHours: 6 }
            ]
        },
        { id: 602, name: 'Cefazoline', form: 'Vial 500mg', category: 'vial', minMgPerKg: 16.6, maxMgPerKg: 33.3, intervalHours: 8, baseDose: 500, doseUnit: 'mg', maxSingleDoseMg: 2000, indications: ['Skin Infection', 'Bone Infection'], warning: 'Dose should be adjusted in renal impairment. (50-100 mg/kg/day div q8h)', highDoseSafe: true },
        {
            id: 603, name: 'Cefotaxime', form: 'Vial 500mg', category: 'vial',
            minMgPerKg: 37.5, maxMgPerKg: 37.5, intervalHours: 6, baseDose: 500, doseUnit: 'mg', maxSingleDoseMg: 2000, maxDailyDoseMg: 12000,
            indications: ['Meningitis', 'Sepsis', 'Pneumonia'],
            highDoseSafe: true,
            warning: 'Neonates may require lower doses in first week of life.',
            indicationDoses: [
                { name: 'Standard Infection', minMgPerKg: 37.5, maxMgPerKg: 37.5, intervalHours: 6 },
                { name: 'Meningitis', minMgPerKg: 56, maxMgPerKg: 75, intervalHours: 6 }
            ]
        },
        { id: 604, name: 'Ceftizoxim', form: 'Vial 500mg', category: 'vial', minMgPerKg: 25, maxMgPerKg: 50, intervalHours: 8, baseDose: 500, doseUnit: 'mg', maxSingleDoseMg: 2000, indications: ['Bacterial Infection', 'UTI'], warning: 'Dose adjust based on severity.', highDoseSafe: true },
        { id: 606, name: 'Penicillin 6.3.3', form: 'Vial', category: 'vial', minMgPerKg: 25000, maxMgPerKg: 40000, intervalHours: 4, doseUnit: 'Units', indications: ['Bacterial Infection'], warning: 'Dose in units/kg. Severe infections may require higher doses.', highDoseSafe: true },
        { id: 607, name: 'Penicillin', form: 'Vial', category: 'vial', minMgPerKg: 25000, maxMgPerKg: 40000, intervalHours: 4, doseUnit: 'Units', indications: ['Bacterial Infection'], warning: 'Dose in units/kg. Use with caution in penicillin allergy.', highDoseSafe: true },
        { id: 608, name: 'Chloramphenicol', form: 'Vial 1g', category: 'vial', minMgPerKg: 25, maxMgPerKg: 25, intervalHours: 6, baseDose: 1000, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 4000, indications: ['Meningitis', 'Severe Infection'], warning: 'Monitor blood counts. Risk of aplastic anemia.', highDoseSafe: true },
        { id: 609, name: 'Ciprofloxacin', form: 'Vial 200mg', category: 'vial', minMgPerKg: 10, maxMgPerKg: 15, intervalHours: 12, baseDose: 200, doseUnit: 'mg', maxSingleDoseMg: 400, maxDailyDoseMg: 800, indications: ['Resistant Infection'], warning: 'Use with caution in children.', requiresAge: true },
        {
            id: 610, name: 'Amikacin', form: 'Vial 500mg', category: 'vial',
            minMgPerKg: 7.5, maxMgPerKg: 7.5, intervalHours: 12, baseDose: 500, doseUnit: 'mg', maxSingleDoseMg: 1500, maxDailyDoseMg: 1500,
            indications: ['Gram-negative Infection'],
            warning: 'Monitor renal function and hearing. (15 mg/kg/day div q12h)',
            hydrophilic: true,
            indicationDoses: [
                { name: 'Traditional Dosing', minMgPerKg: 7.5, maxMgPerKg: 7.5, intervalHours: 12 },
                { name: 'Extended-Interval (Once Daily)', minMgPerKg: 15, maxMgPerKg: 20, intervalHours: 24 }
            ]
        },
        {
            id: 611, name: 'Methylprednisolone', form: 'Vial 40mg', category: 'vial',
            minMgPerKg: 0.5, maxMgPerKg: 1, intervalHours: 12, baseDose: 40, doseUnit: 'mg', maxSingleDoseMg: 60,
            indications: ['Severe Inflammation', 'Asthma'],
            warning: 'Taper when discontinuing.',
            indicationDoses: [
                { name: 'Status Asthmaticus', minMgPerKg: 0.5, maxMgPerKg: 1, intervalHours: 12 },
                { name: 'Severe Inflammation', minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 24 }
            ]
        },
        { id: 612, name: 'IVIG', form: 'Vial 2.5g', category: 'vial', minMgPerKg: 2000, maxMgPerKg: 2000, intervalHours: 24, baseDose: 2.5, doseUnit: 'g', indications: ['Kawasaki Disease', 'Immunodeficiency'], warning: 'Administer slowly. Monitor for reactions. (2 g/kg as single dose for Kawasaki)', highDoseSafe: true },
        {
            id: 1605, name: 'Meropenem', form: 'Vial 500mg', category: 'vial',
            minMgPerKg: 20, maxMgPerKg: 40, intervalHours: 8, baseDose: 500, doseUnit: 'mg', maxSingleDoseMg: 2000, maxDailyDoseMg: 6000,
            indications: ['Meningitis', 'Severe Sepsis'], highDoseSafe: true,
            indicationDoses: [
                { name: 'Severe Infection', minMgPerKg: 20, maxMgPerKg: 20, intervalHours: 8 },
                { name: 'Meningitis', minMgPerKg: 40, maxMgPerKg: 40, intervalHours: 8 }
            ]
        },
        {
            id: 1606, name: 'Ampicillin-Sulbactam (Unasyn)', form: 'Vial 1.5g', category: 'vial',
            minMgPerKg: 25, maxMgPerKg: 50, intervalHours: 6, baseDose: 1500, doseUnit: 'mg', maxSingleDoseMg: 2000,
            indications: ['Severe Infection'], warning: 'Dose based on Ampicillin component.', highDoseSafe: true
        },
        {
            id: 1611, name: 'Hydrocortisone', form: 'Vial 100mg', category: 'vial',
            minMgPerKg: 2, maxMgPerKg: 4, intervalHours: 6, baseDose: 100, doseUnit: 'mg', maxSingleDoseMg: 100,
            indications: ['Adrenal Insufficiency', 'Anaphylaxis', 'Severe Asthma'],
            indicationDoses: [
                {name: 'Status Asthmaticus / Anaphylaxis', minMgPerKg: 2, maxMgPerKg: 4, intervalHours: 6},
                {name: 'Physiologic Replacement', minMgPerKg: 8, maxMgPerKg: 10, intervalHours: 24}
            ]
        },
        {
            id: 1701, name: 'Piperacillin-Tazobactam (Zosyn)', form: 'Vial 2.25g', category: 'vial',
            minMgPerKg: 75, maxMgPerKg: 100, intervalHours: 6, baseDose: 2250, doseUnit: 'mg', maxSingleDoseMg: 4000, maxDailyDoseMg: 16000,
            indications: ['Severe Sepsis', 'Neutropenic Fever'], warning: 'Dose based on Piperacillin component. Infuse over 30 mins.'
        },
        {
            id: 1702, name: 'Colistin (Colistimethate)', form: 'Vial 1,000,000 IU', category: 'vial',
            minMgPerKg: 50000, maxMgPerKg: 75000, intervalHours: 8, baseDose: 1000000, doseUnit: 'Units',
            indications: ['MDR Gram-negative Infections'], warning: 'Dose in IU/kg/day divided q8h. Adjust in renal impairment.', highDoseSafe: true, hydrophilic: true
        },
        {
            id: 1703, name: 'Linezolid', form: 'Vial 600mg/300ml', category: 'vial',
            minMgPerKg: 10, maxMgPerKg: 10, intervalHours: 8, baseDose: 600, baseVolume: 300, doseUnit: 'mg', maxSingleDoseMg: 600, maxDailyDoseMg: 1200,
            indications: ['MRSA', 'VRE Infections'], warning: 'For children < 12 years: 10 mg/kg q8h. For > 12 years: 10 mg/kg q12h (max 600mg).'
        },
        {
            id: 1708, name: 'Voriconazole', form: 'Vial 200mg', category: 'vial',
            minMgPerKg: 7, maxMgPerKg: 9, intervalHours: 12, baseDose: 200, doseUnit: 'mg', maxSingleDoseMg: 350,
            indications: ['Invasive Aspergillosis', 'Candidemia'], warning: 'Children 2-12 years: 9 mg/kg IV q12h. Monitor liver function.'
        },
        {
            id: 1709, name: 'Ketamine', form: 'Vial 50mg/ml', category: 'vial',
            minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 0, baseDose: 50, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 100,
            indications: ['Procedural Sedation', 'Severe Refractory Asthma'], warning: 'IV push slowly. May cause emergence delirium.'
        },
        {
            id: 1711, name: 'Propofol', form: 'Vial 10mg/ml', category: 'vial',
            minMgPerKg: 1, maxMgPerKg: 2.5, intervalHours: 0, baseDose: 10, baseVolume: 1, doseUnit: 'mg',
            indications: ['Anesthesia Induction'], warning: 'Risk of Propofol Infusion Syndrome (PRIS). Extreme caution in young children.'
        },
        {
            id: 1721, name: 'Potassium Chloride (KCl)', form: 'Vial 2mEq/ml', category: 'vial',
            minMgPerKg: 0.5, maxMgPerKg: 1, intervalHours: 0, baseDose: 2, baseVolume: 1, doseUnit: 'mEq',
            indications: ['Hypokalemia'], warning: 'NEVER give IV push! Must be diluted and infused slowly. Dose in mEq/kg.'
        },
        {
            id: 1722, name: 'Magnesium Sulfate', form: 'Vial 20% (200mg/ml) or 50% (500mg/ml)', category: 'vial',
            minMgPerKg: 25, maxMgPerKg: 50, intervalHours: 0, baseDose: 200, baseVolume: 1, doseUnit: 'mg', maxSingleDoseMg: 2000,
            indications: ['Severe Asthma', 'Hypomagnesemia'], warning: 'Infuse over 20-30 mins for asthma. Default calculation uses 20% (200mg/ml) concentration.'
        },
        {
            id: 1723, name: 'Sodium Bicarbonate 7.5%', form: 'Vial 7.5% (0.89 mEq/ml)', category: 'vial',
            minMgPerKg: 1, maxMgPerKg: 1, intervalHours: 0, baseDose: 0.89, baseVolume: 1, doseUnit: 'mEq',
            indications: ['Severe Metabolic Acidosis', 'Cardiac Arrest'], warning: 'Dose in mEq/kg. (7.5% solution = 0.89 mEq/ml).'
        },
        {
            id: 2001, name: 'Ceftazidime', form: 'Vial 1g', category: 'vial',
            minMgPerKg: 30, maxMgPerKg: 50, intervalHours: 8, baseDose: 1000, doseUnit: 'mg', maxSingleDoseMg: 2000, maxDailyDoseMg: 6000,
            indications: ['Pseudomonas Infection', 'Meningitis'], highDoseSafe: true
        },
        {
            id: 2002, name: 'Cefepime', form: 'Vial 1g', category: 'vial',
            minMgPerKg: 50, maxMgPerKg: 50, intervalHours: 8, baseDose: 1000, doseUnit: 'mg', maxSingleDoseMg: 2000, maxDailyDoseMg: 6000,
            indications: ['Febrile Neutropenia', 'Severe Infection'], highDoseSafe: true
        },
        {
            id: 2003, name: 'Imipenem/Cilastatin', form: 'Vial 500mg', category: 'vial',
            minMgPerKg: 15, maxMgPerKg: 25, intervalHours: 6, baseDose: 500, doseUnit: 'mg', maxSingleDoseMg: 1000, maxDailyDoseMg: 4000,
            indications: ['MDR Infections', 'Severe Sepsis']
        },
        {
            id: 2004, name: 'Pantoprazole', form: 'Vial 40mg', category: 'vial',
            minMgPerKg: 1, maxMgPerKg: 1, intervalHours: 24, baseDose: 40, doseUnit: 'mg', maxSingleDoseMg: 40, maxDailyDoseMg: 80,
            indications: ['GERD', 'GI Bleeding (NPO)']
        },
    
        // ==========================================
        // POWDER
        // ==========================================
        { id: 25, name: 'Kidylact', form: 'Sachet 1g', category: 'powder', fixedDose: '1 Sachet', intervalHours: 24, doseUnit: 'mg', indications: ['Diarrhea', 'Probiotic'], warning: 'Standard dose: 1 Sachet daily. Dissolve in cool water, milk, or juice.' },
        { id: 701, name: 'ORS', form: 'Sachet', category: 'powder', fixedDose: 'As per weight', intervalHours: 24, doseUnit: 'mg', indications: ['Dehydration'], warning: 'Dissolve in 200ml water. Administer based on dehydration severity.' },
        { id: 702, name: 'Activated Charcoal', form: 'Powder', category: 'powder', minMgPerKg: 1000, maxMgPerKg: 1000, intervalHours: 0, doseUnit: 'mg', maxSingleDoseMg: 50000, indications: ['Poisoning'], warning: 'Used in acute poisoning. Administer within 1 hour of ingestion.' },
        { id: 703, name: 'Ferrous Sulfate', form: 'Powder', category: 'powder', minMgPerKg: 3, maxMgPerKg: 6, intervalHours: 24, doseUnit: 'mg', indications: ['Iron Deficiency Anemia'], warning: 'Dose based on elemental iron.' },
        { id: 704, name: 'Zinc Sulfate', form: 'Powder', category: 'powder', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 24, doseUnit: 'mg', indications: ['Diarrhea', 'Zinc Deficiency'], fixedDose: '10-20 mg/day' },
        {
            id: 705, name: 'PEG (Polyethylene Glycol)', form: 'Powder', category: 'powder',
            minMgPerKg: 400, maxMgPerKg: 1000, intervalHours: 24, doseUnit: 'mg', maxDailyDoseMg: 17000,
            indications: ['Constipation', 'Fecal Impaction'],
            warning: 'Mix in water or juice. 1000mg = 1g', highDoseSafe: true,
            indicationDoses: [
                {name: 'Maintenance (0.4 - 1 g/kg/day)', minMgPerKg: 400, maxMgPerKg: 1000, intervalHours: 24},
                {name: 'Fecal Impaction Clean-out (1 - 1.5 g/kg/day)', minMgPerKg: 1000, maxMgPerKg: 1500, intervalHours: 24}
            ]
        },
    
        // ==========================================
        // INHALERS
        // ==========================================
        { id: 801, name: 'Salbutamol', form: 'Inhaler 100mcg/dose', category: 'inhaler', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 4, doseUnit: 'mcg', indications: ['Asthma', 'Bronchospasm'], fixedDose: '2 puffs (as needed)', warning: 'Max 8 puffs/day. Use spacer device for children.' },
        { id: 802, name: 'Budesonide', form: 'Inhaler 200mcg/dose', category: 'inhaler', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, doseUnit: 'mcg', indications: ['Asthma'], fixedDose: '200-400 mcg twice daily', warning: 'Rinse mouth after use.' },
        { id: 803, name: 'Ipratropium', form: 'Inhaler 20mcg/dose', category: 'inhaler', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 6, doseUnit: 'mcg', indications: ['Asthma', 'Bronchospasm'], fixedDose: '2 puffs 4 times daily' },
        { id: 804, name: 'Fluticasone', form: 'Inhaler 125mcg/dose', category: 'inhaler', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, doseUnit: 'mcg', indications: ['Asthma'], fixedDose: '125-250 mcg twice daily' },
        { id: 805, name: 'Beclomethasone', form: 'Inhaler 50mcg/dose', category: 'inhaler', minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, doseUnit: 'mcg', indications: ['Asthma'], fixedDose: '50-100 mcg twice daily' },
        {
            id: 2010, name: 'Fluticasone/Salmeterol (Seretide)', form: 'Inhaler 125/25 mcg', category: 'inhaler',
            minMgPerKg: 0, maxMgPerKg: 0, intervalHours: 12, doseUnit: 'mcg', fixedDose: '1-2 puffs twice daily',
            indications: ['Asthma (Maintenance)'], warning: 'Rinse mouth after use to prevent oral thrush.'
        },
    
        // ==========================================
        // OINTMENTS
        // ==========================================
        { id: 901, name: 'Mupirocin', form: 'Ointment 2%', category: 'ointment', fixedDose: 'Apply thin layer', intervalHours: 12, doseUnit: 'mg', indications: ['Skin Infection', 'Impetigo'], warning: 'Apply to affected area 3 times daily.' },
        { id: 902, name: 'Hydrocortisone', form: 'Ointment 1%', category: 'ointment', fixedDose: 'Apply thin layer', intervalHours: 12, doseUnit: 'mg', indications: ['Inflammation', 'Eczema'], warning: 'Not for use on face or diaper area.' },
        { id: 903, name: 'Zinc Oxide', form: 'Ointment 20%', category: 'ointment', fixedDose: 'Apply thin layer', intervalHours: 8, doseUnit: 'mg', indications: ['Diaper Rash', 'Skin Protection'] },
        { id: 904, name: 'Silver Sulfadiazine', form: 'Ointment 1%', category: 'ointment', fixedDose: 'Apply thin layer', intervalHours: 12, doseUnit: 'mg', indications: ['Burns', 'Wound Infection'], warning: 'Use with caution in neonates.' },
    
        // ==========================================
        // CREAMS
        // ==========================================
        { id: 1001, name: 'Clotrimazole', form: 'Cream 1%', category: 'cream', fixedDose: 'Apply thin layer', intervalHours: 12, doseUnit: 'mg', indications: ['Fungal Infection', 'Diaper Rash'] },
        { id: 1002, name: 'Miconazole', form: 'Cream 2%', category: 'cream', fixedDose: 'Apply thin layer', intervalHours: 12, doseUnit: 'mg', indications: ['Fungal Infection', 'Tinea'] },
        { id: 1003, name: 'Acyclovir', form: 'Cream 5%', category: 'cream', fixedDose: 'Apply 5 times daily', intervalHours: 4, doseUnit: 'mg', indications: ['Herpes Simplex', 'Chickenpox'], warning: 'Start treatment early.' },
        { id: 1004, name: 'Betamethasone', form: 'Cream 0.1%', category: 'cream', fixedDose: 'Apply thin layer', intervalHours: 12, doseUnit: 'mg', indications: ['Eczema', 'Inflammation'], warning: 'Potent steroid. Use sparingly.' },
    
        // ==========================================
        // GELS
        // ==========================================
        { id: 1101, name: 'Lidocaine', form: 'Gel 2%', category: 'gel', fixedDose: 'Apply small amount', intervalHours: 6, doseUnit: 'mg', indications: ['Local Anesthesia', 'Teething Pain'], warning: 'Use only small amounts in infants.' },
        { id: 1102, name: 'Aloe Vera', form: 'Gel', category: 'gel', fixedDose: 'Apply as needed', intervalHours: 4, doseUnit: 'mg', indications: ['Sunburn', 'Skin Irritation'] },
        { id: 1103, name: 'Diclofenac', form: 'Gel 1%', category: 'gel', fixedDose: 'Apply thin layer', intervalHours: 12, doseUnit: 'mg', indications: ['Joint Pain', 'Inflammation'], warning: 'Not recommended for children under 12 years.' },
    
        // ==========================================
        // SPRAYS
        // ==========================================
        { id: 1201, name: 'Fluticasone', form: 'Nasal Spray', category: 'spray', fixedDose: '1 spray each nostril', intervalHours: 24, doseUnit: 'mg', indications: ['Allergic Rhinitis'], warning: 'Use daily for best effect.' },
        { id: 1202, name: 'Xylometazoline', form: 'Nasal Spray 0.05%', category: 'spray', fixedDose: '1-2 sprays', intervalHours: 8, doseUnit: 'mg', indications: ['Nasal Congestion'], warning: 'Not for use more than 3 days.' },
        { id: 1203, name: 'Saline', form: 'Nasal Spray', category: 'spray', fixedDose: '1-2 sprays', intervalHours: 4, doseUnit: 'mg', indications: ['Nasal Congestion', 'Dry Nose'], warning: 'Safe for all ages.' },
    
        // ==========================================
        // SACHETS
        // ==========================================
        { id: 1301, name: 'ORS', form: 'Sachet', category: 'sachet', fixedDose: '1 sachet in 200ml water', intervalHours: 24, doseUnit: 'mg', indications: ['Dehydration'], warning: 'Prepare fresh daily.' },
        { id: 1302, name: 'Probiotic', form: 'Sachet', category: 'sachet', fixedDose: '1 sachet daily', intervalHours: 24, doseUnit: 'mg', indications: ['Diarrhea', 'Gut Health'], warning: 'Dissolve in water or milk.' },
        { id: 1303, name: 'Zinc', form: 'Sachet', category: 'sachet', fixedDose: '10-20 mg daily', intervalHours: 24, doseUnit: 'mg', indications: ['Diarrhea', 'Zinc Deficiency'] },
        { id: 1304, name: 'Montelukast', form: 'Sachet 4mg', category: 'sachet', fixedDose: '4 mg daily', intervalHours: 24, doseUnit: 'mg', indications: ['Asthma', 'Allergic Rhinitis'], warning: 'For children 6 months to 5 years.' },
        { id: 1607, name: 'Omeprazole', form: 'Sachet 10mg / Capsule', category: 'sachet', minMgPerKg: 1, maxMgPerKg: 1, intervalHours: 24, doseUnit: 'mg', maxSingleDoseMg: 40, maxDailyDoseMg: 40, indications: ['GERD', 'Peptic Ulcer'] }
    ];


    // Backward-compatible globals for the Android WebView bridge and any non-module consumers.
    if (typeof window !== 'undefined') {
        window.categoriesDB = categoriesDB;
        window.drugsDB = drugsDB;
    }

    // ===== src/data/clinical-rules.data.js =====
    // src/data/clinical-rules.data.js
    // Pure data module: the clinical rules database (IV guidelines, organ-impairment
    // adjustments, cross-allergy classes, drug-interaction matrix, neonatal PMA protocols).
    // The behavioural logic that consumes this data lives in src/core/clinical-engine.js.

    // ============================================================
    //  CLINICAL RULES DATABASE (Comprehensive Local Edition)
    // ============================================================
    const ClinicalRulesDB = {
    
            // 1. IV Administration & Dilution Guidelines
            ivGuidelines: {
                'Vancomycin': {
                    maxConcentration: '5 mg/ml',
                    rate: 'Over 60 minutes',
                    warning: 'Risk of Red Man Syndrome with rapid infusion. Use of a Central Venous Catheter (CVC) is recommended for concentrations higher than 5mg/ml.'
                },
                'Gentamicin': {
                    maxConcentration: '10 mg/ml',
                    rate: 'Over 30-60 minutes',
                    warning: 'Never infuse in the same line with penicillins (causes drug inactivation).'
                },
                'Amikacin': {
                    maxConcentration: '5 mg/ml',
                    rate: 'Over 30-60 minutes',
                    warning: 'Requires strict monitoring of renal function and serum levels.'
                },
                'Ceftriaxone': {
                    maxConcentration: '40 mg/ml',
                    rate: 'IV push over 2-4 minutes OR Infusion over 30 minutes',
                    warning: 'Co-administration with calcium-containing solutions (e.g., Ringer\'s Lactate) is strictly prohibited (risk of fatal precipitation).'
                },
                'Phenobarbital': {
                    maxConcentration: '50 mg/ml',
                    rate: 'Max 1-2 mg/kg/minute',
                    warning: 'Rapid IV injection may cause respiratory depression or hypotension. Resuscitation equipment must be available.'
                },
                'Phenytoin': {
                    maxConcentration: '5 mg/ml',
                    rate: 'Max 1-3 mg/kg/minute',
                    warning: 'Dilute only with Normal Saline (NS). Precipitates in dextrose solutions. Risk of cardiac arrhythmias with rapid injection.'
                },
                'Calcium Gluconate': {
                    maxConcentration: '50 mg/ml',
                    rate: 'Max 100 mg/minute',
                    warning: 'Rapid injection causes bradycardia and cardiac arrest. Cardiac monitoring is mandatory during infusion.'
                },
                'Diazepam': {
                    maxConcentration: 'Undiluted (5 mg/ml)',
                    rate: 'Max 1-2 mg/minute',
                    warning: 'Direct IV injection (undiluted) is recommended. Do not dilute due to incompatibility with most IV fluids.'
                },
                'Meropenem': {
                    maxConcentration: '50 mg/ml',
                    rate: 'IV push over 3-5 mins OR Infusion over 15-30 mins',
                    warning: 'Low stability after reconstitution; inject immediately.'
                },
                'Piperacillin-Tazobactam (Zosyn)': {
                    maxConcentration: '200 mg/ml',
                    rate: 'Over 30 minutes (or 3-4 hour extended infusion)',
                    warning: 'May cause false-positive Galactomannan test.'
                },
                'Ketamine': {
                    maxConcentration: '50 mg/ml',
                    rate: 'Over 1-2 minutes',
                    warning: 'Rapid administration may cause respiratory depression. Protect airway.'
                },
                'Colistin (Colistimethate)': {
                    maxConcentration: '75,000 IU/ml',
                    rate: 'Infusion over 30-60 mins',
                    warning: 'High risk of nephrotoxicity. Adjust dose in renal failure.'
                },
                'Amiodarone': {
                    maxConcentration: '2 mg/ml (for peripheral line)',
                    rate: 'Loading: over 20-60 mins',
                    warning: 'Incompatible with normal saline in some concentrations; usually mixed in D5W. Monitor ECG for bradycardia/AV block.'
                },
                'Fentanyl': {
                    maxConcentration: '50 mcg/ml',
                    rate: 'Over 1-3 minutes',
                    warning: 'Rapid IV push may cause chest wall rigidity and severe respiratory depression.'
                },
                'Potassium Chloride (KCl)': {
                    maxConcentration: '0.1 mEq/ml (peripheral) to 0.4 mEq/ml (central)',
                    rate: 'Max 0.5 - 1 mEq/kg/hour',
                    warning: 'ABSOLUTE CONTRAINDICATION FOR IV PUSH! Must be diluted and infused slowly. Continuous ECG monitoring required.'
                }
            },
    
            // 2. Organ Impairment Adjustments (Renal/Hepatic)
            adjustments: {
                'Amoxicillin': { type: 'renal', warning: 'If GFR < 30, increase dosing interval to 12 or 24 hours.' },
                'Co-Amoxiclav': { type: 'renal', warning: 'If GFR < 30, change 8-hour dosing to 12-hour intervals.' },
                'Cefotaxime': { type: 'renal', warning: 'If GFR < 10, reduce the dose by 50%.' },
                'Gentamicin': { type: 'renal', warning: 'Requires strict dose and interval adjustment based on creatinine clearance and serum levels (TDM).' },
                'Vancomycin': { type: 'renal', warning: 'Highly dependent on renal function. Dosing intervals may extend to 24 to 48 hours.' },
                'Fluconazole': { type: 'renal', warning: 'If GFR < 50, the maintenance dose should be halved after the loading dose.' },
                'Acetaminophen': { type: 'hepatic', warning: 'Use with extreme caution or reduce dose in severe hepatic impairment.' },
                'Metronidazole': { type: 'hepatic', warning: 'Reduce dose by up to 50% in severe hepatic impairment.' },
                'Ciprofloxacin': { type: 'renal', warning: 'Reduce dose or extend interval if GFR < 30 ml/min.' },
                'Meropenem': { type: 'renal', warning: 'Adjust dose and interval if GFR < 50 ml/min.' }
            },
    
            // 3. Allergy Cross-Reactivity
            crossAllergies: {
                'Penicillin': ['Amoxicillin', 'Ampicillin', 'Co-Amoxiclav', 'Penicillin V', 'Penicillin 6.3.3', 'Penicillin', 'Piperacillin-Tazobactam (Zosyn)', 'Ampicillin-Sulbactam (Unasyn)'],
                'Cephalosporin': ['Cefixime', 'Cephalexin', 'Ceftriaxone', 'Cefazoline', 'Cefotaxime', 'Ceftizoxim', 'Cefdinir', 'Cefuroxime', 'Cefadroxil', 'Ceftazidime', 'Cefepime'],
                'NSAID': ['Ibuprofen', 'Mefenamic Acid', 'Indomethacin', 'Diclofenac', 'Ketorolac'],
                'Macrolide': ['Azithromycin', 'Clarithromycin', 'Erythromycin']
            },
    
            // 4. Comprehensive Drug Interactions Matrix
            interactions: [
                // --- CRITICAL INTERACTIONS (Life Threatening) ---
                {
                    drugs: ['Ceftriaxone', 'Calcium Gluconate'],
                    severity: 'critical',
                    message: 'Fatal Risk: Precipitation of ceftriaxone-calcium in lungs and kidneys, especially in neonates.'
                },
                {
                    drugs: ['Amiodarone', 'Azithromycin'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation and potential fatal Torsades de Pointes arrhythmias.'
                },
                {
                    drugs: ['Amiodarone', 'Clarithromycin'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation and cardiotoxicity. Combination contraindicated.'
                },
                {
                    drugs: ['Amiodarone', 'Ondansetron'],
                    severity: 'critical',
                    message: 'Critical Risk: Synergistic QT prolongation leading to lethal ventricular arrhythmias.'
                },
                {
                    drugs: ['Amiodarone', 'Fentanyl'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe bradycardia, hypotension, and cardiac output depression.'
                },
                {
                    drugs: ['Potassium Chloride (KCl)', 'Spironolactone'],
                    severity: 'critical',
                    message: 'Fatal Risk: Severe hyperkalemia causing cardiac arrest.'
                },
                {
                    drugs: ['Clarithromycin', 'Domperidone'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation and risk of fatal Torsades de Pointes. Combination contraindicated.'
                },
                {
                    drugs: ['Erythromycin', 'Domperidone'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation and risk of fatal Torsades de Pointes. Combination contraindicated.'
                },
                {
                    drugs: ['Azithromycin', 'Domperidone'],
                    severity: 'critical',
                    message: 'Critical Risk: Synergistic QT prolongation. Extreme caution advised or avoid combination.'
                },
                {
                    drugs: ['Ondansetron', 'Domperidone'],
                    severity: 'critical',
                    message: 'Critical Risk: Additive QT prolongation leading to life-threatening arrhythmias.'
                },
                {
                    drugs: ['Fluconazole', 'Amiodarone'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation. Combination contraindicated.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Amiodarone'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation. Combination contraindicated.'
                },
                {
                    drugs: ['Fluconazole', 'Domperidone'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation and risk of Torsades de Pointes.'
                },
    
                // --- HIGH SEVERITY INTERACTIONS (Major Clinical Safety Risk) ---
                {
                    drugs: ['Clarithromycin', 'Carbamazepine'],
                    severity: 'high',
                    message: 'High Risk: Clarithromycin inhibits metabolism of Carbamazepine, causing severe toxicity (ataxia, lethargy).'
                },
                {
                    drugs: ['Erythromycin', 'Carbamazepine'],
                    severity: 'high',
                    message: 'High Risk: Erythromycin dramatically increases Carbamazepine plasma concentrations.'
                },
                {
                    drugs: ['Fluconazole', 'Ondansetron'],
                    severity: 'high',
                    message: 'High Risk: Additive prolongation of the QT interval. Monitor ECG closely.'
                },
                {
                    drugs: ['Metoclopramide', 'Promethazine'],
                    severity: 'high',
                    message: 'High Risk: Severe extrapyramidal reactions (EPS), dystonia, and neuroleptic malignant syndrome risk.'
                },
                {
                    drugs: ['Metoclopramide', 'Risperidone'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of extrapyramidal symptoms (EPS) and neuroleptic malignant syndrome.'
                },
                {
                    drugs: ['Diazepam', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Profound central nervous system (CNS) and severe respiratory depression.'
                },
                {
                    drugs: ['Midazolam', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Severe respiratory depression and airway compromise. Resuscitation equipment must be ready.'
                },
                {
                    drugs: ['Fentanyl', 'Midazolam'],
                    severity: 'high',
                    message: 'High Risk: Potent synergistic respiratory depression and severe hypotension.'
                },
                {
                    drugs: ['Morphine', 'Diazepam'],
                    severity: 'high',
                    message: 'High Risk: Profound central nervous system (CNS) and respiratory depression.'
                },
                {
                    drugs: ['Morphine', 'Midazolam'],
                    severity: 'high',
                    message: 'High Risk: Severe respiratory depression and hypotension. Monitor airway continuously.'
                },
                {
                    drugs: ['Gentamicin', 'Vancomycin'],
                    severity: 'high',
                    message: 'High Risk: Synergistic nephrotoxicity and ototoxicity. Monitor serum levels and renal function closely.'
                },
                {
                    drugs: ['Amikacin', 'Vancomycin'],
                    severity: 'high',
                    message: 'High Risk: Enhanced risk of renal failure and hearing loss.'
                },
                {
                    drugs: ['Gentamicin', 'Furosemide'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of ototoxicity and permanent hearing impairment.'
                },
                {
                    drugs: ['Furosemide', 'Vancomycin'],
                    severity: 'high',
                    message: 'High Risk: Increased ototoxicity and nephrotoxicity.'
                },
                {
                    drugs: ['Ketorolac', 'Furosemide'],
                    severity: 'high',
                    message: 'High Risk: NSAIDs blunt diuretic effect and increase risk of acute renal failure.'
                },
                {
                    drugs: ['Ibuprofen', 'Furosemide'],
                    severity: 'high',
                    message: 'High Risk: NSAIDs reduce the efficacy of loop diuretics and increase nephrotoxicity.'
                },
                {
                    drugs: ['Valproic Acid', 'Meropenem'],
                    severity: 'high',
                    message: 'High Risk: Carbapenems markedly decrease Valproic Acid serum levels, precipitating breakthrough seizures.'
                },
                {
                    drugs: ['Valproic Acid', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Valproate increases Phenobarbital levels significantly, causing severe sedation and coma.'
                },
                {
                    drugs: ['Phenytoin', 'Valproic Acid'],
                    severity: 'high',
                    message: 'High Risk: Complex alteration of phenytoin binding and metabolism leading to toxicity.'
                },
                {
                    drugs: ['Rifampin', 'Phenytoin'],
                    severity: 'high',
                    message: 'High Risk: Rifampin strongly induces metabolism of Phenytoin, significantly reducing seizure control.'
                },
                {
                    drugs: ['Fluconazole', 'Phenytoin'],
                    severity: 'high',
                    message: 'High Risk: Fluconazole inhibits phenytoin metabolism, increasing the risk of phenytoin toxicity.'
                },
                {
                    drugs: ['Metronidazole', 'Phenytoin'],
                    severity: 'high',
                    message: 'High Risk: Metronidazole inhibits Phenytoin metabolism, potentially leading to toxic serum levels.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Theophylline-G'],
                    severity: 'high',
                    message: 'High Risk: Ciprofloxacin inhibits theophylline metabolism, leading to severe seizures and arrhythmia.'
                },
                {
                    drugs: ['Clarithromycin', 'Theophylline-G'],
                    severity: 'high',
                    message: 'High Risk: Significantly increases Theophylline serum levels, increasing risk of toxicity.'
                },
                {
                    drugs: ['Erythromycin', 'Theophylline-G'],
                    severity: 'high',
                    message: 'High Risk: Markedly increases Theophylline serum levels, precipitating toxicity.'
                },
                {
                    drugs: ['Phenobarbital', 'Methylprednisolone'],
                    severity: 'high',
                    message: 'High Risk: Phenobarbital induces hepatic metabolism of corticosteroids, reducing efficacy.'
                },
                {
                    drugs: ['Phenytoin', 'Dexamethasone'],
                    severity: 'high',
                    message: 'High Risk: Phenytoin decreases steroid blood levels, compromising therapeutic efficacy.'
                },
                {
                    drugs: ['Epinephrine', 'Propranolol'],
                    severity: 'high',
                    message: 'High Risk: Unopposed alpha-adrenergic activity leading to severe hypertension and reflex bradycardia.'
                },
                {
                    drugs: ['Linezolid', 'Dextromethorphan'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of Serotonin Syndrome.'
                },
                {
                    drugs: ['Linezolid', 'Fentanyl'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of Serotonin Syndrome.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Calcium Gluconate'],
                    severity: 'high',
                    message: 'High Risk: Calcium severely decreases Ciprofloxacin absorption. Separate administration times.'
                },
                {
                    drugs: ['Doxycycline', 'Calcium Gluconate'],
                    severity: 'high',
                    message: 'High Risk: Calcium severely decreases Doxycycline absorption. Separate administration by hours.'
                },
                {
                    drugs: ['Levothyroxine', 'Ferrous Sulfate'],
                    severity: 'high',
                    message: 'High Risk: Iron decreases Levothyroxine absorption. Separate administration by at least 4 hours.'
                },
                {
                    drugs: ['Ketorolac', 'Ibuprofen'],
                    severity: 'high',
                    message: 'Contraindicated: Concurrent use of multiple NSAIDs increases GI adverse effects without added benefit.'
                },
                {
                    drugs: ['Ketorolac', 'Diclofenac'],
                    severity: 'high',
                    message: 'Contraindicated: Concurrent use of multiple NSAIDs significantly increases GI and renal toxicity.'
                },
                {
                    drugs: ['Ketorolac', 'Indomethacin'],
                    severity: 'high',
                    message: 'Contraindicated: Concurrent use of multiple NSAIDs significantly increases GI and renal toxicity.'
                },
                {
                    drugs: ['Ibuprofen', 'Indomethacin'],
                    severity: 'high',
                    message: 'Contraindicated: Concurrent use of multiple NSAIDs significantly increases GI and renal toxicity.'
                },
                {
                    drugs: ['Valproic Acid', 'Carbamazepine'],
                    severity: 'high',
                    message: 'High Risk: Complex CYP450 interactions leading to altered levels of both drugs and increased toxicity.'
                },
                {
                    drugs: ['Valproic Acid', 'Topiramate'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of hyperammonemia with or without encephalopathy.'
                },
                {
                    drugs: ['Phenytoin', 'Carbamazepine'],
                    severity: 'high',
                    message: 'High Risk: Mutual induction of metabolism, leading to unpredictable serum levels.'
                },
                {
                    drugs: ['Fluconazole', 'Carbamazepine'],
                    severity: 'high',
                    message: 'High Risk: Fluconazole inhibits CYP3A4, significantly increasing Carbamazepine toxicity.'
                },
                {
                    drugs: ['Cimetidine', 'Theophylline-G'],
                    severity: 'high',
                    message: 'High Risk: Cimetidine inhibits metabolism, leading to Theophylline toxicity (seizures, arrhythmias).'
                },
                {
                    drugs: ['Cimetidine', 'Phenytoin'],
                    severity: 'high',
                    message: 'High Risk: Cimetidine inhibits metabolism, leading to Phenytoin toxicity (ataxia, nystagmus).'
                },
                {
                    drugs: ['Morphine', 'Chloral Hydrate'],
                    severity: 'high',
                    message: 'High Risk: Additive CNS and respiratory depression.'
                },
                {
                    drugs: ['Fentanyl', 'Chloral Hydrate'],
                    severity: 'high',
                    message: 'High Risk: Additive CNS and respiratory depression.'
                },
                {
                    drugs: ['Diazepam', 'Chloral Hydrate'],
                    severity: 'high',
                    message: 'High Risk: Additive CNS and respiratory depression.'
                },
                {
                    drugs: ['Phenobarbital', 'Chloral Hydrate'],
                    severity: 'high',
                    message: 'High Risk: Additive CNS and respiratory depression.'
                },
                {
                    drugs: ['Clonazepam', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Synergistic CNS depression.'
                },
                {
                    drugs: ['Clonazepam', 'Morphine'],
                    severity: 'high',
                    message: 'High Risk: Profound central nervous system (CNS) and respiratory depression.'
                },
                {
                    drugs: ['Gabapentin', 'Morphine'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of severe CNS depression and respiratory failure.'
                },
                {
                    drugs: ['Linezolid', 'Methylphenidate'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of Serotonin Syndrome or hypertensive crisis.'
                },
                {
                    drugs: ['Colistin (Colistimethate)', 'Gentamicin'],
                    severity: 'high',
                    message: 'High Risk: Synergistic nephrotoxicity. Strict monitoring required.'
                },
                {
                    drugs: ['Colistin (Colistimethate)', 'Amikacin'],
                    severity: 'high',
                    message: 'High Risk: Synergistic nephrotoxicity. Strict monitoring required.'
                },
                {
                    drugs: ['Colistin (Colistimethate)', 'Vancomycin'],
                    severity: 'high',
                    message: 'High Risk: Synergistic nephrotoxicity. Strict monitoring required.'
                },
                {
                    drugs: ['Amikacin', 'Furosemide'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of ototoxicity and permanent hearing impairment.'
                },
                {
                    drugs: ['Doxycycline', 'Ferrous Sulfate'],
                    severity: 'high',
                    message: 'High Risk: Iron severely decreases Doxycycline absorption. Separate administration.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Ferrous Sulfate'],
                    severity: 'high',
                    message: 'High Risk: Iron severely decreases Ciprofloxacin absorption. Separate administration.'
                },
                {
                    drugs: ['Doxycycline', 'Iron Polymaltose'],
                    severity: 'high',
                    message: 'High Risk: Iron severely decreases Doxycycline absorption. Separate administration.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Iron Polymaltose'],
                    severity: 'high',
                    message: 'High Risk: Iron severely decreases Ciprofloxacin absorption. Separate administration.'
                },
                {
                    drugs: ['Levothyroxine', 'Calcium Gluconate'],
                    severity: 'high',
                    message: 'High Risk: Calcium decreases Levothyroxine absorption. Separate administration.'
                },
                {
                    drugs: ['Erythromycin', 'Fluconazole'],
                    severity: 'high',
                    message: 'High Risk: Additive QT prolongation risk.'
                },
    
                // --- MEDIUM SEVERITY INTERACTIONS ---
                {
                    drugs: ['Ibuprofen', 'Prednisolone'],
                    severity: 'medium',
                    message: 'Moderate Risk: Markedly increased risk of gastrointestinal mucosal ulceration and bleeding.'
                },
                {
                    drugs: ['Ibuprofen', 'Dexamethasone'],
                    severity: 'medium',
                    message: 'Moderate Risk: Synergistic GI toxicity and ulceration risk.'
                },
                {
                    drugs: ['Diclofenac', 'Prednisolone'],
                    severity: 'medium',
                    message: 'Moderate Risk: Increased risk of gastrointestinal bleeding and ulceration.'
                },
                {
                    drugs: ['Diclofenac', 'Dexamethasone'],
                    severity: 'medium',
                    message: 'Moderate Risk: Synergistic GI toxicity and ulceration risk.'
                },
                {
                    drugs: ['Salbutamol', 'Propranolol'],
                    severity: 'medium',
                    message: 'Moderate Risk: Antagonistic effect. Non-selective beta-blockers negate bronchodilating effect of Salbutamol.'
                },
                {
                    drugs: ['Ferrous Sulfate', 'Calcium Gluconate'],
                    severity: 'medium',
                    message: 'Moderate Risk: Calcium significantly impairs oral iron absorption. Separate administration by 2 hours.'
                },
                {
                    drugs: ['Ferrous Sulfate', 'Omeprazole'],
                    severity: 'medium',
                    message: 'Moderate Risk: Decreased gastric acidity lowers absorption of elemental iron.'
                },
                {
                    drugs: ['Omeprazole', 'Cefuroxime'],
                    severity: 'medium',
                    message: 'Moderate Risk: Increased gastric pH decreases absorption of oral Cefuroxime.'
                },
                {
                    drugs: ['Pantoprazole', 'Cefuroxime'],
                    severity: 'medium',
                    message: 'Moderate Risk: Increased gastric pH decreases absorption of oral Cefuroxime.'
                },
    
                // ============================================================
                //  NEWLY ADDED INTERACTIONS (SCIENTIFIC REFERENCES UPDATE)
                // ============================================================
                {
                    drugs: ['Piperacillin-Tazobactam (Zosyn)', 'Vancomycin'],
                    severity: 'high',
                    message: 'High Risk: Increased risk of acute kidney injury (AKI). Monitor renal function closely.'
                },
                {
                    drugs: ['Imipenem/Cilastatin', 'Valproic Acid'],
                    severity: 'high',
                    message: 'High Risk: Carbapenems rapidly and significantly decrease Valproic Acid serum levels, risking breakthrough seizures.'
                },
                {
                    drugs: ['Linezolid', 'Pseudoephedrine'],
                    severity: 'critical',
                    message: 'Critical Risk: Non-selective MAOI activity of Linezolid combined with pseudoephedrine can cause severe hypertensive crisis.'
                },
                {
                    drugs: ['Erythromycin', 'Midazolam'],
                    severity: 'high',
                    message: 'High Risk: Macrolides inhibit CYP3A4, significantly increasing Midazolam levels and prolonging sedation/respiratory depression.'
                },
                {
                    drugs: ['Clarithromycin', 'Midazolam'],
                    severity: 'high',
                    message: 'High Risk: Macrolides inhibit CYP3A4, significantly increasing Midazolam levels and prolonging sedation/respiratory depression.'
                },
                {
                    drugs: ['Fluconazole', 'Midazolam'],
                    severity: 'high',
                    message: 'High Risk: Fluconazole inhibits CYP3A4, increasing Midazolam plasma concentrations and risk of prolonged sedation.'
                },
                {
                    drugs: ['Cimetidine', 'Midazolam'],
                    severity: 'high',
                    message: 'High Risk: Cimetidine inhibits metabolism of Midazolam, leading to prolonged CNS depression.'
                },
                {
                    drugs: ['Erythromycin', 'Loratadine'],
                    severity: 'high',
                    message: 'High Risk: Erythromycin inhibits CYP3A4, increasing Loratadine levels and potential for adverse effects.'
                },
                {
                    drugs: ['Clarithromycin', 'Loratadine'],
                    severity: 'high',
                    message: 'High Risk: Clarithromycin inhibits CYP3A4, increasing Loratadine levels.'
                },
                {
                    drugs: ['Rifampin', 'Fluconazole'],
                    severity: 'high',
                    message: 'High Risk: Rifampin strongly induces metabolism, significantly decreasing Fluconazole levels.'
                },
                {
                    drugs: ['Rifampin', 'Doxycycline'],
                    severity: 'high',
                    message: 'High Risk: Rifampin induces hepatic metabolism, decreasing Doxycycline half-life and efficacy.'
                },
                {
                    drugs: ['Rifampin', 'Prednisolone'],
                    severity: 'high',
                    message: 'High Risk: Rifampin increases clearance of corticosteroids, requiring higher steroid doses.'
                },
                {
                    drugs: ['Rifampin', 'Dexamethasone'],
                    severity: 'high',
                    message: 'High Risk: Rifampin increases clearance of corticosteroids, markedly reducing efficacy.'
                },
                {
                    drugs: ['Phenytoin', 'Prednisolone'],
                    severity: 'high',
                    message: 'High Risk: Phenytoin induces hepatic metabolism of corticosteroids, reducing efficacy.'
                },
                {
                    drugs: ['Phenytoin', 'Levothyroxine'],
                    severity: 'high',
                    message: 'High Risk: Phenytoin increases the metabolism and clearance of Levothyroxine.'
                },
                {
                    drugs: ['Carbamazepine', 'Levothyroxine'],
                    severity: 'high',
                    message: 'High Risk: Carbamazepine induces metabolism of Levothyroxine, potentially increasing thyroid hormone requirements.'
                },
                {
                    drugs: ['Carbamazepine', 'Prednisolone'],
                    severity: 'high',
                    message: 'High Risk: Carbamazepine induces metabolism of corticosteroids, decreasing their blood levels and efficacy.'
                },
                {
                    drugs: ['Carbamazepine', 'Dexamethasone'],
                    severity: 'high',
                    message: 'High Risk: Carbamazepine induces metabolism of corticosteroids, decreasing their blood levels and efficacy.'
                },
                {
                    drugs: ['Amiodarone', 'Phenytoin'],
                    severity: 'high',
                    message: 'High Risk: Amiodarone inhibits CYP2C9, significantly increasing Phenytoin levels and risk of toxicity.'
                },
                {
                    drugs: ['Acetaminophen', 'Carbamazepine'],
                    severity: 'high',
                    message: 'High Risk: Carbamazepine increases toxic metabolite of acetaminophen, elevating risk of hepatotoxicity.'
                },
                {
                    drugs: ['Acetaminophen', 'Phenytoin'],
                    severity: 'high',
                    message: 'High Risk: Phenytoin increases toxic metabolite of acetaminophen, elevating risk of hepatotoxicity.'
                },
                {
                    drugs: ['Acetaminophen', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Phenobarbital induces CYP enzymes, increasing acetaminophen hepatotoxic metabolites.'
                },
                {
                    drugs: ['Doxycycline', 'Phenytoin'],
                    severity: 'high',
                    message: 'High Risk: Phenytoin induces metabolism of Doxycycline, decreasing its half-life.'
                },
                {
                    drugs: ['Doxycycline', 'Carbamazepine'],
                    severity: 'high',
                    message: 'High Risk: Carbamazepine induces metabolism of Doxycycline, decreasing its half-life.'
                },
                {
                    drugs: ['Doxycycline', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Phenobarbital induces metabolism of Doxycycline, decreasing its half-life.'
                },
                {
                    drugs: ['Omeprazole', 'Diazepam'],
                    severity: 'high',
                    message: 'High Risk: Omeprazole inhibits CYP2C19, decreasing Diazepam clearance and prolonging its effects.'
                },
                {
                    drugs: ['Cimetidine', 'Diazepam'],
                    severity: 'high',
                    message: 'High Risk: Cimetidine inhibits hepatic metabolism of Diazepam, leading to accumulation and prolonged sedation.'
                },
                {
                    drugs: ['Fluconazole', 'Diazepam'],
                    severity: 'high',
                    message: 'High Risk: Fluconazole inhibits CYP enzymes, increasing Diazepam concentrations.'
                },
                {
                    drugs: ['Erythromycin', 'Valproic Acid'],
                    severity: 'high',
                    message: 'High Risk: Erythromycin inhibits metabolism of Valproic Acid, leading to potential toxicity.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Prednisolone'],
                    severity: 'high',
                    message: 'High Risk: Concomitant use increases the risk of tendinitis and tendon rupture.'
                },
                {
                    drugs: ['Voriconazole', 'Phenobarbital'],
                    severity: 'critical',
                    message: 'Critical Risk: Phenobarbital significantly reduces Voriconazole levels. Co-administration is contraindicated.'
                },
                {
                    drugs: ['Voriconazole', 'Carbamazepine'],
                    severity: 'critical',
                    message: 'Critical Risk: Carbamazepine significantly reduces Voriconazole levels. Co-administration is contraindicated.'
                },
                {
                    drugs: ['Voriconazole', 'Rifampin'],
                    severity: 'critical',
                    message: 'Critical Risk: Rifampin profoundly reduces Voriconazole levels. Co-administration is contraindicated.'
                },
                {
                    drugs: ['Voriconazole', 'Phenytoin'],
                    severity: 'critical',
                    message: 'Critical Risk: Phenytoin reduces Voriconazole levels while Voriconazole increases Phenytoin levels.'
                },
                {
                    drugs: ['Levothyroxine', 'Omeprazole'],
                    severity: 'medium',
                    message: 'Moderate Risk: PPIs increase gastric pH, which may decrease the absorption of Levothyroxine.'
                },
                {
                    drugs: ['Levothyroxine', 'Pantoprazole'],
                    severity: 'medium',
                    message: 'Moderate Risk: PPIs increase gastric pH, which may decrease the absorption of Levothyroxine.'
                },
                {
                    drugs: ['Azithromycin', 'Ondansetron'],
                    severity: 'critical',
                    message: 'Critical Risk: Additive QT prolongation leading to life-threatening arrhythmias (Torsades de Pointes).'
                },
                {
                    drugs: ['Furosemide', 'Ceftriaxone'],
                    severity: 'high',
                    message: 'High Risk: Concomitant use may increase the risk of nephrotoxicity.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Ondansetron'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe synergistic QT prolongation. Monitor ECG closely.'
                },
    
                // ============================================================
                //  AI ADDED INTERACTIONS (BASED ON LATEST REFERENCES)
                // ============================================================
                {
                    drugs: ['Clindamycin', 'Erythromycin'],
                    severity: 'high',
                    message: 'High Risk: In vitro antagonism. Both drugs compete for the same 50S ribosomal binding site.'
                },
                {
                    drugs: ['Clindamycin', 'Azithromycin'],
                    severity: 'high',
                    message: 'High Risk: In vitro antagonism. Both drugs compete for the same 50S ribosomal binding site.'
                },
                {
                    drugs: ['Clindamycin', 'Clarithromycin'],
                    severity: 'high',
                    message: 'High Risk: In vitro antagonism. Both drugs compete for the same 50S ribosomal binding site.'
                },
                {
                    drugs: ['Furosemide', 'Prednisolone'],
                    severity: 'high',
                    message: 'High Risk: Synergistic potassium depletion. Increased risk of severe hypokalemia.'
                },
                {
                    drugs: ['Furosemide', 'Dexamethasone'],
                    severity: 'high',
                    message: 'High Risk: Synergistic potassium depletion. Increased risk of severe hypokalemia.'
                },
                {
                    drugs: ['Furosemide', 'Hydrocortisone'],
                    severity: 'high',
                    message: 'High Risk: Synergistic potassium depletion. Increased risk of severe hypokalemia.'
                },
                {
                    drugs: ['Furosemide', 'Methylprednisolone'],
                    severity: 'high',
                    message: 'High Risk: Synergistic potassium depletion. Increased risk of severe hypokalemia.'
                },
                {
                    drugs: ['Metoclopramide', 'Diphenhydramine'],
                    severity: 'medium',
                    message: 'Moderate Risk: Anticholinergic effects of Diphenhydramine antagonize the GI motility effects of Metoclopramide. Additive CNS depression.'
                },
                {
                    drugs: ['Phenytoin', 'Theophylline-G'],
                    severity: 'high',
                    message: 'High Risk: Phenytoin strongly induces the metabolism of Theophylline, potentially reducing its efficacy and asthma control.'
                },
                {
                    drugs: ['Phenobarbital', 'Theophylline-G'],
                    severity: 'high',
                    message: 'High Risk: Phenobarbital induces hepatic metabolism of Theophylline, significantly reducing its serum levels.'
                },
                {
                    drugs: ['Metronidazole', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Phenobarbital induces metabolism of Metronidazole, potentially leading to treatment failure.'
                },
                {
                    drugs: ['Doxycycline', 'Penicillin V'],
                    severity: 'high',
                    message: 'High Risk: Bacteriostatic drugs (Doxycycline) may interfere with the bactericidal action of Penicillins.'
                },
                {
                    drugs: ['Doxycycline', 'Amoxicillin'],
                    severity: 'high',
                    message: 'High Risk: Bacteriostatic drugs (Doxycycline) may interfere with the bactericidal action of Penicillins.'
                },
                {
                    drugs: ['Doxycycline', 'Ampicillin'],
                    severity: 'high',
                    message: 'High Risk: Bacteriostatic drugs (Doxycycline) may interfere with the bactericidal action of Penicillins.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Ibuprofen'],
                    severity: 'high',
                    message: 'High Risk: Concurrent use of fluoroquinolones and NSAIDs increases the risk of CNS stimulation and seizures.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Diclofenac'],
                    severity: 'high',
                    message: 'High Risk: Concurrent use of fluoroquinolones and NSAIDs increases the risk of CNS stimulation and seizures.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Ketorolac'],
                    severity: 'high',
                    message: 'High Risk: Concurrent use of fluoroquinolones and NSAIDs increases the risk of CNS stimulation and seizures.'
                },
                {
                    drugs: ['Diphenhydramine', 'Lorazepam'],
                    severity: 'high',
                    message: 'High Risk: Synergistic CNS and respiratory depression. Monitor patient closely.'
                },
                {
                    drugs: ['Chlorpheniramine', 'Diazepam'],
                    severity: 'high',
                    message: 'High Risk: Synergistic CNS and respiratory depression.'
                },
                {
                    drugs: ['Chlorpheniramine', 'Midazolam'],
                    severity: 'high',
                    message: 'High Risk: Synergistic CNS and respiratory depression.'
                },
                {
                    drugs: ['Promethazine', 'Diazepam'],
                    severity: 'high',
                    message: 'High Risk: Additive CNS and severe respiratory depression risk.'
                },
                {
                    drugs: ['Promethazine', 'Morphine'],
                    severity: 'high',
                    message: 'High Risk: Synergistic CNS and severe respiratory depression risk.'
                },
                {
                    drugs: ['Promethazine', 'Fentanyl'],
                    severity: 'high',
                    message: 'High Risk: Synergistic CNS and severe respiratory depression risk.'
                },
                {
                    drugs: ['Ondansetron', 'Clarithromycin'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe synergistic QT prolongation. Monitor ECG closely for Torsades de Pointes.'
                },
                {
                    drugs: ['Metoclopramide', 'Chlorpheniramine'],
                    severity: 'medium',
                    message: 'Moderate Risk: Additive CNS depression and potential antagonism of Metoclopramide\'s prokinetic effect.'
                },
                {
                    drugs: ['Magnesium Sulfate', 'Gentamicin'],
                    severity: 'high',
                    message: 'High Risk: Concurrent use may enhance neuromuscular blockade leading to respiratory depression.'
                },
                {
                    drugs: ['Magnesium Sulfate', 'Amikacin'],
                    severity: 'high',
                    message: 'High Risk: Concurrent use may enhance neuromuscular blockade leading to respiratory depression.'
                },
                {
                    drugs: ['Linezolid', 'Salbutamol'],
                    severity: 'high',
                    message: 'High Risk: Linezolid\'s MAOI activity can enhance the sympathomimetic effects of Salbutamol (tachycardia/hypertension).'
                },
                {
                    drugs: ['Valproic Acid', 'Lorazepam'],
                    severity: 'medium',
                    message: 'Moderate Risk: Valproic Acid decreases the clearance of Lorazepam, potentially increasing its effects.'
                },
                {
                    drugs: ['Valproic Acid', 'Diazepam'],
                    severity: 'medium',
                    message: 'Moderate Risk: Valproic Acid displaces Diazepam from protein binding sites and inhibits its metabolism.'
                },
    
                // ============================================================
                //  LATEST DISCOVERED INTERACTIONS (2026 SCIENTIFIC UPDATE)
                // ============================================================
                {
                    drugs: ['Azithromycin', 'Ciprofloxacin'],
                    severity: 'critical',
                    message: 'Critical Risk: Synergistic QT prolongation leading to life-threatening arrhythmias (Torsades de Pointes).'
                },
                {
                    drugs: ['Erythromycin', 'Ciprofloxacin'],
                    severity: 'critical',
                    message: 'Critical Risk: Synergistic QT prolongation leading to life-threatening arrhythmias (Torsades de Pointes).'
                },
                {
                    drugs: ['Clarithromycin', 'Ciprofloxacin'],
                    severity: 'critical',
                    message: 'Critical Risk: Synergistic QT prolongation leading to life-threatening arrhythmias.'
                },
                {
                    drugs: ['Voriconazole', 'Amiodarone'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation and CYP3A4 inhibition leading to lethal arrhythmias.'
                },
                {
                    drugs: ['Voriconazole', 'Domperidone'],
                    severity: 'critical',
                    message: 'Critical Risk: Severe QT prolongation and risk of fatal Torsades de Pointes. Contraindicated.'
                },
                {
                    drugs: ['Voriconazole', 'Ondansetron'],
                    severity: 'critical',
                    message: 'Critical Risk: Additive QT prolongation leading to life-threatening arrhythmias.'
                },
                {
                    drugs: ['Voriconazole', 'Omeprazole'],
                    severity: 'high',
                    message: 'High Risk: Mutual metabolic inhibition significantly increasing serum levels of both drugs.'
                },
                {
                    drugs: ['Voriconazole', 'Pantoprazole'],
                    severity: 'high',
                    message: 'High Risk: Mutual metabolic inhibition significantly increasing serum levels of both drugs.'
                },
                {
                    drugs: ['Co-trimoxazole', 'Potassium Chloride (KCl)'],
                    severity: 'high',
                    message: 'High Risk: Trimethoprim acts as a potassium-sparing diuretic, significantly increasing the risk of hyperkalemia.'
                },
                {
                    drugs: ['Ciprofloxacin', 'Magnesium Sulfate'],
                    severity: 'high',
                    message: 'High Risk: Magnesium severely decreases Ciprofloxacin absorption. Separate administration times.'
                },
                {
                    drugs: ['Doxycycline', 'Magnesium Sulfate'],
                    severity: 'high',
                    message: 'High Risk: Magnesium severely decreases Doxycycline absorption. Separate administration times.'
                },
                {
                    drugs: ['Theophylline-G', 'Propranolol'],
                    severity: 'high',
                    message: 'High Risk: Propranolol antagonizes bronchodilation and decreases Theophylline clearance, increasing toxicity.'
                },
                {
                    drugs: ['Fentanyl', 'Erythromycin'],
                    severity: 'high',
                    message: 'High Risk: Erythromycin inhibits CYP3A4, significantly increasing Fentanyl levels and respiratory depression.'
                },
                {
                    drugs: ['Fentanyl', 'Clarithromycin'],
                    severity: 'high',
                    message: 'High Risk: Clarithromycin inhibits CYP3A4, significantly increasing Fentanyl levels and respiratory depression.'
                },
                {
                    drugs: ['Fentanyl', 'Fluconazole'],
                    severity: 'high',
                    message: 'High Risk: Fluconazole inhibits CYP3A4, increasing Fentanyl concentrations and toxicity risk.'
                },
                {
                    drugs: ['Fentanyl', 'Voriconazole'],
                    severity: 'high',
                    message: 'High Risk: Voriconazole inhibits CYP3A4, significantly increasing Fentanyl levels and respiratory depression.'
                },
                {
                    drugs: ['Propofol', 'Fentanyl'],
                    severity: 'high',
                    message: 'High Risk: Synergistic severe respiratory depression and profound hypotension.'
                },
                {
                    drugs: ['Propofol', 'Midazolam'],
                    severity: 'high',
                    message: 'High Risk: Synergistic severe respiratory depression and hemodynamic instability.'
                },
                {
                    drugs: ['Ketamine', 'Diazepam'],
                    severity: 'high',
                    message: 'High Risk: Synergistic CNS depression leading to prolonged recovery times.'
                },
                {
                    drugs: ['Metronidazole', 'Carbamazepine'],
                    severity: 'high',
                    message: 'High Risk: Metronidazole inhibits CYP3A4, increasing Carbamazepine levels and risk of toxicity.'
                },
                {
                    drugs: ['Metronidazole', 'Amiodarone'],
                    severity: 'high',
                    message: 'High Risk: Additive QT prolongation and potential for serious cardiac arrhythmias.'
                },
                {
                    drugs: ['Diphenhydramine', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Synergistic central nervous system (CNS) and respiratory depression.'
                },
                {
                    drugs: ['Chlorpheniramine', 'Phenobarbital'],
                    severity: 'high',
                    message: 'High Risk: Synergistic central nervous system (CNS) and respiratory depression.'
                },
                {
                    drugs: ['Promethazine', 'Chloral Hydrate'],
                    severity: 'high',
                    message: 'High Risk: Profound additive CNS and respiratory depression.'
                },
                {
                    drugs: ['Valproic Acid', 'Ibuprofen'],
                    severity: 'medium',
                    message: 'Moderate Risk: Ibuprofen may displace Valproic Acid from protein binding, altering its free levels.'
                }
            ],
    
            // 5. Neonatal PMA Protocols (Dose & Interval)
            neonatalProtocols: {
                'Vancomycin': [
                    { maxPMA: 29, dose: 15, interval: 24 },
                    { minPMA: 30, maxPMA: 36, dose: 15, interval: 12 },
                    { minPMA: 37, dose: 15, interval: 8 }
                ],
                'Gentamicin': [
                    { maxPMA: 29, dose: 5, interval: 48 },
                    { minPMA: 30, maxPMA: 34, dose: 4.5, interval: 36 },
                    { minPMA: 35, dose: 4, interval: 24 }
                ],
                'Amikacin': [
                    { maxPMA: 29, dose: 18, interval: 48 },
                    { minPMA: 30, maxPMA: 34, dose: 15, interval: 36 },
                    { minPMA: 35, dose: 15, interval: 24 }
                ]
            }
        };

        // Backward-compatible global for any non-module consumers.
        if (typeof window !== 'undefined') {
            window.ClinicalRulesDB = ClinicalRulesDB;
        }

    // ===== src/core/validation.js =====
    // src/core/validation.js
    // Pure input/patient validation and contraindication rules used by the
    // calculator and the calculator UI. No DOM access.


    const ValidationEngine = {
        weightRanges: {
            'Neonate': { min: 0.5, max: 2.5, label: 'Neonate (0-1 month)' },
            'Infant': { min: 2.6, max: 10, label: 'Infant (1 month - 2 years)' },
            'Child': { min: 10.1, max: 20, label: 'Child (2-6 years)' },
            'Older Child': { min: 20.1, max: 30, label: 'Older Child (7-10 years)' },
            'Adolescent': { min: 30.1, max: 45, label: 'Adolescent (11-15 years)' }
        },

        contraindications: {
            'Ibuprofen': { minWeight: 6, minAge: 0.5, warning: 'Ibuprofen is contraindicated in infants under 6 months or weight < 6kg!', severity: 'high' },
            'Acetaminophen': { minWeight: 2.5, warning: 'In neonates under 2.5kg, dose must be determined by physician.', severity: 'medium' },
            'Ceftriaxone': { minWeight: 0, minAge: 0.08, warning: 'Contraindicated in neonates (< 28 days), especially with jaundice or if receiving IV calcium!', severity: 'high' },
            'Gentamicin': { minWeight: 0, warning: 'Requires close monitoring of renal function and hearing in neonates and infants!', severity: 'high' },
            'Vancomycin': { minWeight: 0, warning: 'Use in neonates requires serum level monitoring!', severity: 'high' },
            'Promethazine': { minAge: 2, warning: 'Contraindicated in children under 2 years due to risk of fatal respiratory depression.', severity: 'high' },
            'Metoclopramide': { minAge: 1, warning: 'Contraindicated in children under 1 year.', severity: 'high' },
            'Diazepam': { minWeight: 0, warning: 'Risk of respiratory depression. Use with caution in neonates.', severity: 'high' },
            'Penicillin': { minWeight: 0, warning: 'Use with caution in penicillin-allergic patients.', severity: 'medium' },
            'Doxycycline': { minWeight: 0, warning: 'According to AAP/Nelson guidelines, short courses (<21 days) are safe for all ages. Long courses are contraindicated under 8 yrs.', severity: 'medium' },
            'Ciprofloxacin': { minAge: 18, warning: 'Not recommended for routine use in children under 18 years.', severity: 'medium' },
            'Chloramphenicol': { minWeight: 0, warning: 'Risk of gray baby syndrome in neonates. Monitor blood counts.', severity: 'high' }
        },

        getRecommendedForm(drug, weight) {
            if (weight < 10 && drug.category === 'syrup') {
                return { preferred: 'Drop', message: 'For infants, drop or suspension form is more suitable.' };
            }
            if (weight >= 10 && weight < 20 && drug.category === 'drop') {
                return { preferred: 'Syrup', message: 'For older children, syrup form is more convenient.' };
            }
            return null;
        },

        validateInput(weight, age, requiresAge, requiresWeight = true, height = null) {
            const errors = [];
            const warnings = [];

            if (requiresWeight) {
                if (weight === undefined || weight === null || weight === '') {
                    errors.push({ field: 'weight', message: 'Please enter the weight.' });
                } else {
                    const w = Number(weight);
                    if (isNaN(w) || w <= 0) {
                        errors.push({ field: 'weight', message: 'Weight must be a valid positive number.' });
                    } else if (w < 0.5) {
                        errors.push({ field: 'weight', message: 'Weight is too low (minimum 0.5 kg).' });
                    } else if (w > 150) {
                        errors.push({ field: 'weight', message: 'Weight is too high (maximum 150 kg).' });
                    } else if (w < 2.5) {
                        warnings.push({ field: 'weight', message: 'Neonatal weight (<2.5kg) requires extreme precision.' });
                    } else if (w > 35) {
                        warnings.push({ field: 'weight', message: 'Weight above 35kg - patient may be adolescent or adult.' });
                    }
                }
            }

            if (requiresAge) {
                if (age === undefined || age === null || age === '') {
                    errors.push({ field: 'age', message: 'Please enter the age (this drug requires age).' });
                } else {
                    const a = Number(age);
                    if (isNaN(a) || a < 0) {
                        errors.push({ field: 'age', message: 'Age must be a valid positive number.' });
                    } else if (a > 18) {
                        errors.push({ field: 'age', message: 'Age above 18 years - this drug is for children.' });
                    } else if (a < 0.5 && requiresAge) {
                        warnings.push({ field: 'age', message: 'Age under 6 months - requires physician consultation.' });
                    }
                }
            }

            if (height !== null && height !== '') {
                const h = Number(height);
                if (isNaN(h) || h <= 0) {
                    errors.push({ field: 'height', message: 'Height must be a valid positive number.' });
                } else if (h < 30 || h > 250) {
                    errors.push({ field: 'height', message: 'Height must be between 30 and 250 cm.' });
                }
            }

            return { errors, warnings, isValid: errors.length === 0 };
        },

        validatePatient(weight, age, requiresWeight = true) {
            const issues = [];
            let ageCategory = 'Unknown';

            if (requiresWeight) {
                if (weight < 0.5) issues.push({ type: 'error', message: 'Weight entered is very low! Please recheck.', severity: 'critical' });
                if (weight < 2.5) issues.push({ type: 'warning', message: 'Neonatal weight (<2.5kg) requires extreme precision.', severity: 'high' });
                if (weight > 35) issues.push({ type: 'info', message: 'Weight above 35kg - patient may be adolescent or adult.', severity: 'low' });

                ageCategory = 'Neonate';
                for (const [key, range] of Object.entries(ValidationEngine.weightRanges)) {
                    if (weight >= range.min && weight <= range.max) {
                        ageCategory = key;
                        break;
                    }
                }
            }
            return { issues, ageCategory };
        }
    };

    // Utils is imported so downstream single-file consumers that only import
    // ValidationEngine still resolve the shared helper graph consistently.

    // ===== src/core/clinical-engine.js =====
    // src/core/clinical-engine.js
    // Behavioural layer over ClinicalRulesDB: IV guidelines, organ-impairment
    // adjustments, allergy cross-reactivity, drug-drug interactions and neonatal
    // PMA protocols. This module holds logic only; all data lives in
    // src/data/clinical-rules.data.js.


    /** Strip a parenthetical brand/qualifier suffix, e.g. "Acetaminophen (Apotel)" -> "Acetaminophen". */
    function getBaseName(name) {
        return name.split(' (')[0].trim();
    }

    /**
     * Expand a drug (or drug-class) name into every concrete drug name it can match.
     * If the name is a class defined in crossAllergies, include all of its members.
     */
    function getExpandedList(name) {
        const base = getBaseName(name);
        if (ClinicalRulesDB.crossAllergies[name]) {
            return [base, ...ClinicalRulesDB.crossAllergies[name].map(getBaseName)];
        }
        return [base];
    }

    const AdvancedClinicalEngine = {
        checkIVGuidelines(drugName) {
            const guideline = ClinicalRulesDB.ivGuidelines[drugName];
            if (!guideline) return null;
            return {
                title: 'IV Infusion Guidelines',
                rate: guideline.rate || 'Standard',
                maxConc: guideline.maxConcentration || 'N/A',
                warning: guideline.warning || ''
            };
        },

        checkOrganImpairment(drugName, impairmentType) {
            const adjustment = ClinicalRulesDB.adjustments[drugName];
            if (adjustment && adjustment.type === impairmentType) {
                return {
                    alert: `Requires ${impairmentType === 'renal' ? 'Renal' : 'Hepatic'} Dose Adjustment`,
                    message: adjustment.warning
                };
            }
            return null;
        },

        checkAllergyRisk(drugName, patientAllergies) {
            const risks = [];
            patientAllergies.forEach(allergyClass => {
                const drugsInClass = ClinicalRulesDB.crossAllergies[allergyClass];
                if (drugsInClass && drugsInClass.includes(drugName)) {
                    risks.push({
                        severity: 'critical',
                        message: `Absolute Contraindication! Patient is allergic to ${allergyClass} class.`
                    });
                } else if (allergyClass === 'Penicillin' && ClinicalRulesDB.crossAllergies['Cephalosporin'].includes(drugName)) {
                    risks.push({
                        severity: 'high',
                        message: `Caution: Patient is allergic to Penicillin. There is a 3-5% risk of cross-reactivity with Cephalosporins (${drugName}).`
                    });
                } else if (allergyClass === 'Cephalosporin' && ClinicalRulesDB.crossAllergies['Penicillin'].includes(drugName)) {
                    risks.push({
                        severity: 'high',
                        message: `Caution: Patient is allergic to Cephalosporins. There is a risk of cross-reactivity with Penicillins (${drugName}).`
                    });
                }
            });
            return risks;
        },

        checkInteractions(currentDrug, activePrescriptionList) {
            const foundInteractions = [];
            const currentBase = getBaseName(currentDrug);
            const activeBases = activePrescriptionList.map(getBaseName);

            ClinicalRulesDB.interactions.forEach(interaction => {
                const sideA = getExpandedList(interaction.drugs[0]);
                const sideB = getExpandedList(interaction.drugs[1]);

                let interactingActiveDrug = null;
                if (sideA.includes(currentBase)) {
                    interactingActiveDrug = activeBases.find(b => sideB.includes(b));
                } else if (sideB.includes(currentBase)) {
                    interactingActiveDrug = activeBases.find(b => sideA.includes(b));
                }

                if (interactingActiveDrug) {
                    const activeOriginalName = activePrescriptionList.find(d => getBaseName(d) === interactingActiveDrug);
                    foundInteractions.push({
                        interactingWith: activeOriginalName || interactingActiveDrug,
                        severity: interaction.severity,
                        message: interaction.message
                    });
                }
            });
            return foundInteractions;
        },

        getNeonatalProtocol(drugName, pmaWeeks) {
            const protocols = ClinicalRulesDB.neonatalProtocols[drugName];
            if (!protocols || !pmaWeeks) return null;

            for (const rule of protocols) {
                if (rule.minPMA && rule.maxPMA) {
                    if (pmaWeeks >= rule.minPMA && pmaWeeks <= rule.maxPMA) return { interval: rule.interval, dose: rule.dose };
                } else if (rule.minPMA && !rule.maxPMA) {
                    if (pmaWeeks >= rule.minPMA) return { interval: rule.interval, dose: rule.dose };
                } else if (!rule.minPMA && rule.maxPMA) {
                    if (pmaWeeks <= rule.maxPMA) return { interval: rule.interval, dose: rule.dose };
                }
            }
            return null;
        }
    };

    // Backward-compatible global for the Android WebView bridge / non-module consumers.
    if (typeof window !== 'undefined') {
        window.AdvancedClinicalEngine = AdvancedClinicalEngine;
    }

    // ===== src/core/calculator.js =====
    // src/core/calculator.js
    // The core pediatric dosing engine. Given a drug record plus patient data
    // (weight, age, height, concentration, indication and advanced clinical
    // settings) it produces the per-dose amount, daily maximum, applied interval,
    // warnings/alerts and the formula HTML. Pure computation + HTML string output;
    // no direct DOM manipulation.


    class DrugDoseCalculator {
        constructor(drug, weight, age = null, customConcentration = null, selectedIndication = null, advancedSettings = {}, height = null) {
            this.drug = drug;
            // Strict Number Parsing
            this.weight = Number(weight) || 0;
            this.age = age !== null && age !== '' ? Number(age) : null;
            this.height = Number(height) || 0;
            this.customConc = customConcentration;
            this.selectedIndication = selectedIndication;
            this.advancedSettings = advancedSettings; // { pmaVal, isRenal, isHepatic, allergies, activePrescriptions }
            this.doseType = this._determineDoseType();

            // Resolve the concentration safely from the database (no legacy mgPerDrop).
            this.autoConc = null;
            if (this.drug.baseDose !== undefined && this.drug.baseVolume !== undefined) {
                let amount = this.drug.baseDose;
                if (this.drug.doseUnit && this.drug.doseUnit.toLowerCase() === 'g') {
                    amount *= 1000;
                }
                this.autoConc = amount / this.drug.baseVolume;
            } else if (this.drug.mgPerMl) {
                this.autoConc = this.drug.mgPerMl;
            }
        }

        _determineDoseType() {
            if (this.drug.fixedDose) {
                return 'FIXED_OR_AGE_BASED';
            }
            if (['ointment', 'cream', 'gel', 'spray'].includes(this.drug.category)) {
                return 'TOPICAL';
            }
            if (this.drug.category === 'powder' && !this.drug.minMgPerKg) {
                return 'POWDER_FIXED';
            }
            return 'WEIGHT_BASED';
        }

        calculate() {
            // 1. Determine Initial Interval
            let interval = this.selectedIndication ? this.selectedIndication.intervalHours : this.drug.intervalHours;

            // 2. Adjust Interval and Dose based on Neonatal PMA before any calculations (Injectables Only)
            this.neonatalOverrideDose = null;
            const isInjectable = ['ampoule', 'vial'].includes(this.drug.category);
            if (AdvancedClinicalEngine && this.advancedSettings.pmaVal && isInjectable) {
                const neonatalProtocol = AdvancedClinicalEngine.getNeonatalProtocol(this.drug.name, this.advancedSettings.pmaVal);
                if (neonatalProtocol) {
                    if (neonatalProtocol.interval) interval = neonatalProtocol.interval;
                    if (neonatalProtocol.dose !== undefined) this.neonatalOverrideDose = neonatalProtocol.dose;
                }
            }

            let result = {
                minDose: 0,
                maxDose: 0,
                dailyMax: 0,
                displayResult: '',
                isFixedDose: false,
                calculatedFixedDose: '',
                warnings: [],
                alerts: [],
                severity: 'low',
                appliedInterval: interval
            };

            // 3. Process Advanced Clinical Rules (Organ Impairments, Allergies & INTERACTIONS)
            if (AdvancedClinicalEngine) {
                if (this.advancedSettings.pmaVal && (interval !== (this.selectedIndication ? this.selectedIndication.intervalHours : this.drug.intervalHours) || this.neonatalOverrideDose !== null)) {
                    let warnMsg = `Based on NICU protocol (PMA ${this.advancedSettings.pmaVal} weeks), `;
                    if (this.neonatalOverrideDose !== null) {
                        warnMsg += `dose adjusted to ${this.neonatalOverrideDose} mg/kg and interval to every ${interval} hours.`;
                    } else {
                        warnMsg += `dose interval adjusted to every ${interval} hours.`;
                    }
                    result.warnings.push(warnMsg);
                }
                if (this.advancedSettings.isRenal) {
                    const rAdj = AdvancedClinicalEngine.checkOrganImpairment(this.drug.name, 'renal');
                    if (rAdj) result.warnings.push(`<strong>${escapeHtml(rAdj.alert)}:</strong> ${escapeHtml(rAdj.message)}`);
                }
                if (this.advancedSettings.isHepatic) {
                    const hAdj = AdvancedClinicalEngine.checkOrganImpairment(this.drug.name, 'hepatic');
                    if (hAdj) result.warnings.push(`<strong>${escapeHtml(hAdj.alert)}:</strong> ${escapeHtml(hAdj.message)}`);
                }
                if (this.advancedSettings.allergies && this.advancedSettings.allergies.length > 0) {
                    const allergyRisks = AdvancedClinicalEngine.checkAllergyRisk(this.drug.name, this.advancedSettings.allergies);
                    allergyRisks.forEach(risk => {
                        if (risk.severity === 'critical' || risk.severity === 'high') {
                            result.alerts.push(escapeHtml(risk.message));
                            result.severity = 'high';
                        } else {
                            result.warnings.push(escapeHtml(risk.message));
                        }
                    });
                }

                if (this.advancedSettings.activePrescriptions && this.advancedSettings.activePrescriptions.length > 0) {
                    const interactions = AdvancedClinicalEngine.checkInteractions(this.drug.name, this.advancedSettings.activePrescriptions);
                    interactions.forEach(interaction => {
                        if (interaction.severity === 'critical') {
                            result.alerts.push(`<strong>Critical Interaction with ${escapeHtml(interaction.interactingWith)}:</strong> ${escapeHtml(interaction.message)}`);
                            result.severity = 'high';
                        } else if (interaction.severity === 'high') {
                            result.alerts.push(`<strong>Major Interaction with ${escapeHtml(interaction.interactingWith)}:</strong> ${escapeHtml(interaction.message)}`);
                            if (result.severity !== 'high') result.severity = 'high';
                        } else {
                            result.warnings.push(`<strong>Interaction with ${escapeHtml(interaction.interactingWith)}:</strong> ${escapeHtml(interaction.message)}`);
                        }
                    });
                }
            }

            // 4. Calculate Doses based on Type
            switch (this.doseType) {
                case 'TOPICAL':
                    result = this._calculateTopical(result);
                    break;
                case 'FIXED_OR_AGE_BASED':
                    result = this._calculateFixedOrAgeBased(result);
                    break;
                case 'POWDER_FIXED':
                    result = this._calculatePowderFixed(result);
                    break;
                case 'WEIGHT_BASED':
                default:
                    result = this._calculateWeightBased(result);
                    break;
            }

            // 5. Check Contraindications
            const contra = ValidationEngine.contraindications[this.drug.name];
            if (contra) {
                const weightTriggers = !!contra.minWeight && this.weight > 0 && this.weight < contra.minWeight;
                const ageTriggers = !!contra.minAge && this.age !== null && this.age < contra.minAge;
                // minWeight: 0 with no minAge means "always applies" (no real threshold), not "never applies".
                const alwaysApplies = !contra.minWeight && !contra.minAge;
                if (weightTriggers || ageTriggers || alwaysApplies) {
                    result.alerts.push(contra.warning);
                    result.severity = contra.severity;
                }
            }

            // 6. Form Recommendations
            if (this.weight > 0) {
                const formRec = ValidationEngine.getRecommendedForm(this.drug, this.weight);
                if (formRec) {
                    result.warnings.push(formRec.message);
                    if (this.weight < 10) result.alerts.push(`Recommendation: ${escapeHtml(formRec.preferred)} is more suitable for ${escapeHtml(this.drug.name)}.`);
                }
            }

            result.isValid = result.alerts.length === 0 && result.severity !== 'high';

            // 7. Max Daily Display Formatting
            let doseUnitLabel = Utils.resolveDoseUnit(this.drug);

            if (this.drug.maxDailyDoseMg) {
                result.dailyMaxDisplay = ` (Max daily: ${this.drug.maxDailyDoseMg} ${doseUnitLabel})`;
            } else {
                result.dailyMaxDisplay = '';
            }

            return result;
        }

        _calculateTopical(result) {
            result.isFixedDose = true;
            result.calculatedFixedDose = this.drug.fixedDose || 'Apply thin layer';
            result.displayResult = result.calculatedFixedDose;
            return result;
        }

        _calculateFixedOrAgeBased(result) {
            result.isFixedDose = true;
            result.calculatedFixedDose = this.drug.fixedDose;

            let parsedMin = 0;
            let parsedMax = 0;

            if (this.drug.ageDoses && this.age !== null) {
                let foundTier = this.drug.ageDoses.find(tier => this.age >= tier.minAge && this.age < tier.maxAge);
                if (foundTier) {
                    parsedMin = foundTier.minDose;
                    parsedMax = foundTier.maxDose;
                } else if (this.drug.ageAlert && this.age < this.drug.ageAlert.minAgeRequired) {
                    result.alerts.push(this.drug.ageAlert.message);
                    result.severity = this.drug.ageAlert.severity;
                }
            }

            if (parsedMin > 0) {
                result.minDose = parsedMin;
                result.maxDose = parsedMax;
                let unitLabel = this.drug.doseUnit || 'mg';
                if (nearlyEqual(parsedMin, parsedMax)) {
                    result.calculatedFixedDose = `${parsedMin} ${unitLabel}`;
                } else {
                    result.calculatedFixedDose = `${parsedMin} to ${parsedMax} ${unitLabel}`;
                }
            }

            result.displayResult = result.calculatedFixedDose;
            return result;
        }

        _calculatePowderFixed(result) {
            result.isFixedDose = true;
            result.calculatedFixedDose = this.drug.fixedDose;
            result.displayResult = result.calculatedFixedDose;
            return result;
        }

        _calculateWeightBased(result) {
            // Per-kg dose source. NOTE: the historical field name is `minMgPerKg` /
            // `maxMgPerKg`, but the VALUE is expressed in the drug's own `doseUnit`
            // (mg, mcg, Units, mEq or g) — it is NOT always milligrams. New drug
            // entries may instead use the unit-neutral aliases `minDosePerKg` /
            // `maxDosePerKg`; both are read here so the two can coexist.
            const source = this.selectedIndication || this.drug;
            let activeMin = source.minDosePerKg !== undefined ? source.minDosePerKg : source.minMgPerKg;
            let activeMax = source.maxDosePerKg !== undefined ? source.maxDosePerKg : source.maxMgPerKg;

            if (this.neonatalOverrideDose !== null && this.neonatalOverrideDose !== undefined) {
                activeMin = this.neonatalOverrideDose;
                activeMax = this.neonatalOverrideDose;
            }

            let calcWeight = this.weight;
            this.usedIBW = false;
            this.ibwVal = 0;

            if (this.height > 0) {
                // Traub-Johnson IBW formula for pediatrics
                const ibw = (this.height * this.height * 1.65) / 1000;

                if (this.weight > 1.2 * ibw) {
                    result.warnings.push(`Patient's actual weight is >120% of Ideal Body Weight (${ibw.toFixed(1)} kg).`);
                    if (this.drug.hydrophilic) {
                        calcWeight = ibw + 0.4 * (this.weight - ibw); // Adjusted Body Weight
                        this.usedIBW = true;
                        this.ibwVal = calcWeight;
                        result.alerts.push(`<strong>Hydrophilic Drug in Obesity:</strong> Dose calculated based on Adjusted Body Weight (AdjBW = ${calcWeight.toFixed(1)} kg) to prevent toxicity/underdosing.`);
                        result.severity = 'high';
                    }
                }
            }
            this.calcWeight = calcWeight;

            result.minDose = activeMin * calcWeight;
            result.maxDose = activeMax * calcWeight;

            let doseUnitLabel = Utils.resolveDoseUnit(this.drug);

            if (this.drug.maxSingleDoseMg) {
                if (result.minDose > this.drug.maxSingleDoseMg) {
                    result.minDose = this.drug.maxSingleDoseMg;
                    result.alerts.push(`Dose exceeded absolute adult max. Capped at ${this.drug.maxSingleDoseMg} ${doseUnitLabel}/dose.`);
                    result.severity = 'medium';
                }
                if (result.maxDose > this.drug.maxSingleDoseMg) {
                    result.maxDose = this.drug.maxSingleDoseMg;
                }
            }

            let originalDailyMax = 0;

            if (result.appliedInterval > 0) {
                const dailyMax = result.maxDose * (24 / result.appliedInterval);
                originalDailyMax = Number(dailyMax.toFixed(4));
                result.dailyMax = originalDailyMax;

                if (this.drug.maxDailyDoseMg && result.dailyMax > this.drug.maxDailyDoseMg) {
                    result.dailyMax = this.drug.maxDailyDoseMg;
                    result.warnings.push(`Calculated daily dose (Weight &times; ${doseUnitLabel}/kg) was ${originalDailyMax} ${doseUnitLabel}. It has been capped to the adult maximum limit of ${this.drug.maxDailyDoseMg} ${doseUnitLabel}. Please review administration frequency.`);

                    const dosesPerDay = 24 / result.appliedInterval;
                    const maxAllowedPerDose = this.drug.maxDailyDoseMg / dosesPerDay;

                    if (result.maxDose > maxAllowedPerDose) {
                        result.maxDose = maxAllowedPerDose;
                    }
                    if (result.minDose > maxAllowedPerDose) {
                        result.minDose = maxAllowedPerDose;
                    }
                }
            } else {
                result.dailyMax = this.drug.maxDailyDoseMg || 0;
                originalDailyMax = result.dailyMax;
                // Corrected logic: Single PRN dose ceilings should be governed by maxSingleDoseMg, not daily constraints.
            }

            if (result.dailyMax > 1000 && !this.drug.highDoseSafe && !this.drug.maxDailyDoseMg && result.appliedInterval > 0 && doseUnitLabel !== 'Units') {
                result.warnings.push(`Daily dose (${result.dailyMax} ${doseUnitLabel}) is generally high, verify with max daily allowance.`);
                result.severity = 'high';
            }

            if (nearlyEqual(activeMin, activeMax) || nearlyEqual(result.minDose, result.maxDose)) {
                result.displayResult = this._formatNum(result.minDose);
            } else {
                result.displayResult = `${this._formatNum(result.minDose)} to ${this._formatNum(result.maxDose)}`;
            }

            this.activeMin = activeMin;
            this.activeMax = activeMax;

            return result;
        }

        getFormulaHTML(result) {
            let doseUnit = Utils.resolveDoseUnit(this.drug);

            let dailyMaxUnit = doseUnit;
            let perKgUnit = doseUnit + '/kg';

            if (doseUnit.toLowerCase() === 'units') {
                dailyMaxUnit = ' Units';
                perKgUnit = 'Units/kg';
            } else if (doseUnit.toLowerCase() === 'meq') {
                dailyMaxUnit = ' mEq';
                perKgUnit = 'mEq/kg';
            } else if (doseUnit.toLowerCase() === 'mcg') {
                dailyMaxUnit = ' mcg';
                perKgUnit = 'mcg/kg';
            } else if (doseUnit.toLowerCase() === 'g') {
                dailyMaxUnit = ' g';
                perKgUnit = 'g/kg';
            } else {
                dailyMaxUnit = ' mg';
                perKgUnit = 'mg/kg';
            }

            // CC / Volume Calculation Logic (Standardized on mL)
            let volumeHTML = '';
            const baseConc = this.autoConc || this.drug.mgPerMl;

            if ((baseConc !== null || this.customConc !== null) && result.maxDose > 0) {
                const activeConc = this.customConc !== null ? this.customConc : baseConc;
                if (activeConc > 0) {
                    const minVol = (result.minDose / activeConc).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
                    const maxVol = (result.maxDose / activeConc).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
                    const unitLabel = 'ml (cc)';
                    const volStr = (minVol === maxVol) ? `${minVol} ${unitLabel}` : `${minVol} - ${maxVol} ${unitLabel}`;
                    volumeHTML = `
                        <div class="formula-line" style="background: var(--primary-100); padding: 8px; border-radius: var(--radius-sm); margin-top: 8px; border: 1px solid var(--primary-300);">
                            <span class="f-desc" style="color: var(--primary-800); font-weight: bold;">Volume to Administer:</span>
                            <span class="f-result" style="color: var(--primary-700); font-size: 0.85rem;"><strong>${escapeHtml(volStr)}</strong></span>
                        </div>
                    `;
                }
            }

            // Formatting for Fixed Dose Rules
            if (result.isFixedDose) {
                return `
                    <div class="formula-box">
                        <div class="formula-title"><i class="fas fa-info-circle"></i> Formula:</div>
                        <div class="formula-line">
                            <span class="f-desc">Age-based, Topical, or Standard Dose</span>
                            <span class="f-result">= <strong>${escapeHtml(result.calculatedFixedDose)}</strong></span>
                        </div>
                        ${result.dailyMaxDisplay ? `<div class="formula-line"><span class="f-desc">Daily Max:</span><span class="f-result"><strong>${escapeHtml(this.drug.maxDailyDoseMg)}${dailyMaxUnit}</strong></span></div>` : ''}
                        ${volumeHTML}
                    </div>
                `;
            }

            const isCappedMin = (this.drug.maxSingleDoseMg && nearlyEqual(result.minDose, this.drug.maxSingleDoseMg)) || (result.minDose < this.activeMin * this.calcWeight);
            const isCappedMax = (this.drug.maxSingleDoseMg && nearlyEqual(result.maxDose, this.drug.maxSingleDoseMg)) || (result.maxDose < this.activeMax * this.calcWeight);

            const min = this.activeMin;
            const max = this.activeMax;

            const weightStr = this.usedIBW ? `AdjBW (${this.ibwVal.toFixed(1)}kg)` : `Wt (${this.calcWeight}kg)`;

            if (nearlyEqual(min, max) || nearlyEqual(result.minDose, result.maxDose)) {
                return `
                    <div class="formula-box">
                        <div class="formula-title"><i class="fas fa-square-root-variable"></i> Formula:</div>
                        <div class="formula-line">
                            <span class="f-desc">${escapeHtml(weightStr)} × ${escapeHtml(min)} ${perKgUnit} ${isCappedMin ? '(Capped)' : ''}</span>
                            <span class="f-result">= <strong>${escapeHtml(this._formatNum(result.minDose))}</strong></span>
                        </div>
                        ${result.dailyMaxDisplay && result.dailyMax > 0 ? `<div class="formula-line"><span class="f-desc">Daily Max:</span><span class="f-result"><strong>${escapeHtml(result.dailyMax)}${dailyMaxUnit}</strong></span></div>` : ''}
                        ${volumeHTML}
                    </div>
                `;
            }

            return `
                <div class="formula-box">
                    <div class="formula-title"><i class="fas fa-square-root-variable"></i> Formula:</div>
                    <div class="formula-line">
                        <span class="f-desc">Min: ${escapeHtml(weightStr)} × ${escapeHtml(min)} ${perKgUnit} ${isCappedMin ? '(Capped)' : ''}</span>
                        <span class="f-result">= <strong>${escapeHtml(this._formatNum(result.minDose))}</strong></span>
                    </div>
                    <div class="formula-line">
                        <span class="f-desc">Max: ${escapeHtml(weightStr)} × ${escapeHtml(max)} ${perKgUnit} ${isCappedMax ? '(Capped)' : ''}</span>
                        <span class="f-result">= <strong>${escapeHtml(this._formatNum(result.maxDose))}</strong></span>
                    </div>
                    ${result.dailyMaxDisplay && result.dailyMax > 0 ? `<div class="formula-line"><span class="f-desc">Daily Max:</span><span class="f-result"><strong>${escapeHtml(result.dailyMax)}${dailyMaxUnit}</strong></span></div>` : ''}
                    ${volumeHTML}
                </div>
            `;
        }

        _formatNum(n) {
            let unit = Utils.resolveDoseUnit(this.drug).toLowerCase();

            if (unit === 'units' || unit === 'iu' || unit === 'u') {
                return n.toLocaleString() + ' Units';
            }
            if (unit === 'meq') {
                return parseFloat(n.toFixed(2)).toString() + ' mEq';
            }
            if (unit === 'mcg') {
                return parseFloat(n.toFixed(1)).toString() + ' mcg';
            }

            if (n >= 1000) return (n / 1000).toFixed(1) + ' g';
            if (n < 0.1) return parseFloat(n.toFixed(3)).toString() + ' mg'; // Fix Micro-dosing < 0.1
            if (n < 1) return parseFloat(n.toFixed(2)).toString() + ' mg';   // Fix Micro-dosing < 1.0
            return parseFloat(n.toFixed(1)).toString() + ' mg';
        }
    }

    // Backward-compatible global for the Android WebView bridge / non-module consumers.
    if (typeof window !== 'undefined') {
        window.DrugDoseCalculator = DrugDoseCalculator;
    }

    // ===== src/core/state.js =====
    // src/core/state.js
    // Shared mutable UI state (single instance imported by the UI modules).

    const State = {
        category: 'all',
        searchQuery: '',
        openDropdownId: null,
        prescriptionList: []
    };

    /** Whether the user has an active premium entitlement (from the Android bridge). */
    function isPremiumUser() {
        if (typeof window !== 'undefined' && typeof window.Android !== 'undefined' && window.Android.isPremium) {
            try {
                return !!window.Android.isPremium();
            } catch {
                return false;
            }
        }
        return false;
    }

    // ===== src/ui/dom.js =====
    // src/ui/dom.js
    // Cached references to the static elements defined in index.html.
    // Populated on import (after DOMContentLoaded, per main.js load order).

    const DOM = {
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

    // ===== src/ui/premium-modal.js =====
    // src/ui/premium-modal.js
    // The "PediCalc Premium" upsell modal. The markup previously lived as one giant
    // inline template literal inside the main script; it is isolated here and built
    // from small, readable pieces.


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
    function showPremiumModal() {
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

    // ===== src/ui/cart.js =====
    // src/ui/cart.js
    // The "Active Prescriptions" banner (a.k.a. cart) that lists drugs whose
    // interactions are being checked, and lets the user remove them.


    function updateCartUI() {
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

    // ===== src/ui/disclaimer.js =====
    // src/ui/disclaimer.js
    // First-run legal disclaimer / medical agreement modal. The accept button
    // unlocks only after the user scrolls to the bottom; acceptance is persisted
    // in localStorage. Also wires the "Terms & Disclaimer" side-nav entry.


    function initDisclaimerLogic() {
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

    // ===== src/ui/renderers.js =====
    // src/ui/renderers.js
    // Rendering + per-drug calculator UI: category grid, drug list, and the
    // expandable dose calculator dropdown with all its event wiring.


    const esc = Utils.escapeHtml;

    function getCategoryImage(categoryId) {
        const category = categoriesDB.find(c => c.id === categoryId);
        return category?.image || null;
    }

    async function renderCategories() {
        const categoryPromises = categoriesDB.map(async (cat) => {
            const count = cat.id === 'all' ? drugsDB.length : drugsDB.filter(d => d.category === cat.id).length;
            const isActive = State.category === cat.id ? 'active' : '';

            let iconHtml;
            if (cat.image) {
                const imageExists = await Utils.checkImage(cat.image);
                if (imageExists) iconHtml = `<img src="${esc(cat.image)}" alt="${esc(cat.name)}" class="category-image" />`;
                else iconHtml = `<i class="fas ${esc(cat.icon)}"></i>`;
            } else {
                iconHtml = `<i class="fas ${esc(cat.icon)}"></i>`;
            }

            return `
                <div class="category-item ${isActive}" data-id="${esc(cat.id)}" role="tab" aria-selected="${isActive ? 'true' : 'false'}">
                    <div class="category-icon">${iconHtml}</div>
                    <div class="category-name">${esc(cat.name)}</div>
                    <div class="category-count">${count}</div>
                </div>
            `;
        });

        const htmls = await Promise.all(categoryPromises);
        DOM.categoryGrid.innerHTML = htmls.join('');
    }

    function renderDrugs() {
        let filtered = drugsDB;
        if (State.category !== 'all') {
            filtered = filtered.filter(d => d.category === State.category);
        }
        if (State.searchQuery) {
            const q = State.searchQuery.toLowerCase();
            filtered = filtered.filter(d =>
                d.name.toLowerCase().includes(q) ||
                (d.indications && d.indications.some(i => i.toLowerCase().includes(q))) ||
                d.category.includes(q)
            );
        }

        DOM.drugCount.textContent = `${drugsDB.length} Drugs`;
        DOM.resultCount.textContent = `${filtered.length} items`;
        State.openDropdownId = null;

        if (filtered.length === 0) {
            DOM.drugList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search-minus"></i>
                    <h3>No Drug Found</h3>
                    <p>Please change the category or search term.</p>
                </div>
            `;
            return;
        }

        DOM.drugList.innerHTML = filtered.map(drug => {
            // Free tier: only Acetaminophen and Ibuprofen are unlocked.
            const isFreeDrug = drug.name.toLowerCase().includes('acetaminophen') || drug.name.toLowerCase().includes('ibuprofen');
            const isLocked = !isPremiumUser() && !isFreeDrug;

            const categoryImage = getCategoryImage(drug.category);
            const iconClass = Utils.getIconClass(drug.category);

            const iconHtml = categoryImage
                ? `<img src="${esc(categoryImage)}" alt="${esc(drug.category)}" class="drug-image" onerror="this.outerHTML='<i class=\\'fas ${esc(iconClass)}\\'></i>'" />`
                : `<i class="fas ${esc(iconClass)}"></i>`;

            const indicationsHTML = drug.indications ? `
                <div class="drug-indications-mini">
                    ${drug.indications.slice(0, 2).map(i => `<span class="tag-mini">${esc(i)}</span>`).join('')}
                    ${drug.indications.length > 2 ? `<span class="tag-mini">+</span>` : ''}
                </div>
            ` : '';

            const lockHTML = isLocked ? `
                <div class="lock-icon-btn" style="cursor: pointer; position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, #fde68a 0%, #f59e0b 100%); color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4); z-index: 2;">
                    <i class="fas fa-lock" style="font-size: 0.8rem;"></i>
                </div>
            ` : '';

            return `
                <article class="drug-list-card" data-drug-id="${esc(drug.id)}" data-locked="${isLocked}" style="position: relative;">
                    ${lockHTML}
                    <button class="close-card-btn" aria-label="Close Calculator">
                        <img src="assets/close-icon.png" class="close-icon" alt="Close" />
                    </button>
                    <div class="drug-card-content">
                        <div class="drug-icon-wrapper">
                            ${iconHtml}
                        </div>
                        <div class="drug-details">
                            <h4 class="drug-name">${esc(drug.name)}</h4>
                            <span class="drug-form">${esc(drug.form)}</span>
                            ${indicationsHTML}
                        </div>
                    </div>
                    <button class="select-drug-btn toggle-calc-btn" data-drug-id="${esc(drug.id)}">
                        ${isLocked ? '<i class="fas fa-lock"></i> قفل / فعال‌سازی' : '<i class="fas fa-calculator"></i> Calculate Dose'}
                    </button>
                    <div class="drug-calc-dropdown" id="calc-dropdown-${esc(drug.id)}" hidden></div>
                </article>
            `;
        }).join('');
    }

    function closeAllCalculators() {
        document.querySelectorAll('.drug-calc-dropdown').forEach(dd => {
            dd.hidden = true;
            dd.innerHTML = '';
        });

        document.querySelectorAll('.drug-list-card').forEach(card => {
            card.style.display = 'flex';
            card.classList.remove('is-active-card');
        });
        State.openDropdownId = null;
    }

    function toggleCalcDropdown(drugId, btn) {
        const dropdownId = `calc-dropdown-${drugId}`;
        const targetDropdown = document.getElementById(dropdownId);
        const currentCard = btn.closest('.drug-list-card');
        const isCurrentlyHidden = targetDropdown.hidden;

        closeAllCalculators();

        if (isCurrentlyHidden) {
            targetDropdown.hidden = false;
            currentCard.classList.add('is-active-card');

            document.querySelectorAll('.drug-list-card').forEach(card => {
                if (card !== currentCard) {
                    card.style.display = 'none';
                }
            });

            State.openDropdownId = drugId;
            renderCalcUI(drugId, targetDropdown);
        }
    }

    function renderCalcUI(drugId, container) {
        const drug = drugsDB.find(d => d.id === parseInt(drugId));
        if (!drug) return;

        const isTopical = ['ointment', 'cream', 'gel', 'spray'].includes(drug.category);
        const isZeroWeight = drug.minMgPerKg === 0 && drug.maxMgPerKg === 0;
        const requiresWeight = !isTopical && !isZeroWeight;

        const ageInputHTML = drug.requiresAge ? `
            <input type="number" class="calc-age-input" step="0.01" min="0" max="18" placeholder="Age in years (e.g., 0.08 for 1 mo)" autocomplete="off" />
        ` : '';

        const weightInputHTML = requiresWeight ? `
            <input type="number" class="calc-weight-input" step="0.1" min="0.5" max="150" placeholder="Weight (kg)" autocomplete="off" />
            <input type="number" class="calc-height-input" step="1" min="30" max="250" placeholder="Height (cm) - Optional" autocomplete="off" />
        ` : `<input type="hidden" class="calc-weight-input" value="0" />`;

        const baseDoseDisplay = (drug.indicationDoses && drug.indicationDoses.length > 0)
            ? `${drug.indicationDoses[0].minMgPerKg}${drug.indicationDoses[0].minMgPerKg !== drug.indicationDoses[0].maxMgPerKg ? ` to ${drug.indicationDoses[0].maxMgPerKg}` : ''} mg/kg`
            : (drug.fixedDose ? 'Standard or Age-based' : `${drug.minMgPerKg}${drug.minMgPerKg !== drug.maxMgPerKg ? ` to ${drug.maxMgPerKg}` : ''} mg/kg`);

        const hasConcentration = (drug.baseDose !== undefined && drug.baseVolume !== undefined) || !!drug.mgPerMl;

        let defaultTotalMg = 0, defaultTotalVol = 1, unitType = 'ml';
        let doseUnit = Utils.resolveDoseUnit(drug);

        if (hasConcentration) {
            if (drug.baseDose !== undefined && drug.baseVolume !== undefined) {
                defaultTotalMg = drug.baseDose;
                defaultTotalVol = drug.baseVolume;
            } else if (drug.mgPerMl) {
                defaultTotalMg = drug.mgPerMl;
                defaultTotalVol = 1;
            }
        }

        const isInCart = State.prescriptionList && State.prescriptionList.includes(drug.name);
        const cartBtnHTML = `
            <button type="button" class="toggle-cart-btn" style="margin-bottom: 12px; width: 100%; padding: 8px; border-radius: var(--radius-sm); border: 2px dashed ${isInCart ? 'var(--danger-500)' : 'var(--primary-500)'}; background: ${isInCart ? 'var(--danger-50)' : 'var(--primary-50)'}; color: ${isInCart ? 'var(--danger-700)' : 'var(--primary-700)'}; font-weight: 700; font-family: inherit; font-size: 0.75rem; cursor: pointer; transition: all 0.2s;">
                <i class="fas ${isInCart ? 'fa-minus-circle' : 'fa-plus-circle'}"></i> ${isInCart ? 'Remove from Active Prescription' : 'Add to Active Prescription (Check Interactions)'}
            </button>
        `;

        const concentrationHTML = hasConcentration ? `
            <div class="concentration-settings">
                <label><i class="fas fa-vial"></i> Concentration:</label>
                <div class="conc-inputs">
                    <input type="number" class="conc-mg" value="${esc(defaultTotalMg)}" step="0.1" min="0.1">
                    <span>${esc(doseUnit)} per</span>
                    <input type="number" class="conc-vol" value="${esc(defaultTotalVol)}" step="0.1" min="0.1">
                    <span>${esc(unitType)}</span>
                </div>
            </div>
        ` : '';

        const indicationSelectorHTML = drug.indicationDoses && drug.indicationDoses.length > 0 ? `
            <div class="custom-dropdown" id="dropdown-group-${esc(drug.id)}">
                <label class="custom-dropdown-label"><i class="fas fa-stethoscope"></i> Select Clinical Indication:</label>
                <div class="dropdown-selected" id="dropdown-selected-${esc(drug.id)}" data-value="0">
                    <span class="selected-text">${esc(drug.indicationDoses[0].name)}</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div class="dropdown-options" id="dropdown-options-${esc(drug.id)}">
                    ${drug.indicationDoses.map((ind, index) => `
                        <div class="dropdown-option ${index === 0 ? 'selected' : ''}" data-value="${index}">
                            ${esc(ind.name)}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';

        const advancedClinicalHTML = `
            <div class="adv-clinical-toggle">
                <img src="assets/settings.png" alt="Advanced Settings" class="gear-icon" style="width: 18px; height: 18px; object-fit: contain; transition: transform 0.3s ease; margin-right: 4px;" /> Advanced Clinical Settings
                <i class="fas fa-chevron-down adv-icon" style="margin-left: auto; transition: transform 0.3s ease;"></i>
            </div>
            <div class="adv-clinical-panel" hidden>
                <div style="margin-bottom: 12px;">
                    <label style="font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); display:block; margin-bottom: 4px;">
                        Post Menstrual Age (PMA) - Neonates (weeks):
                        <div style="font-size: 0.6rem; font-weight: 400; color: var(--text-tertiary); margin-top: 2px;">(Gestational Age at birth + Chronological Age)</div>
                    </label>
                    <input type="number" class="calc-pma-input" placeholder="e.g., 32" style="width: 100%; padding: 8px; border: 2px solid var(--border-light); border-radius: var(--radius-sm); font-family: inherit; font-size: 0.75rem;">
                </div>
                <div style="display: flex; gap: 15px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-light);">
                    <label style="font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 4px; color: var(--text-primary); cursor: pointer;">
                        <input type="checkbox" class="calc-renal-cb" style="accent-color: var(--primary-500); width: 14px; height: 14px;"> Renal Impairment
                    </label>
                    <label style="font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 4px; color: var(--text-primary); cursor: pointer;">
                        <input type="checkbox" class="calc-hepatic-cb" style="accent-color: var(--primary-500); width: 14px; height: 14px;"> Hepatic Impairment
                    </label>
                </div>
                <div>
                    <label style="font-size: 0.7rem; font-weight: 800; color: var(--danger-600); display:block; margin-bottom: 4px;">Patient Allergies:</label>
                    <div class="allergy-checkbox-group">
                        <label class="allergy-checkbox-label">
                            <input type="checkbox" class="calc-allergy-cb" value="Penicillin"> Penicillins
                        </label>
                        <label class="allergy-checkbox-label">
                            <input type="checkbox" class="calc-allergy-cb" value="Cephalosporin"> Cephalosporins
                        </label>
                        <label class="allergy-checkbox-label">
                            <input type="checkbox" class="calc-allergy-cb" value="NSAID"> NSAIDs
                        </label>
                        <label class="allergy-checkbox-label">
                            <input type="checkbox" class="calc-allergy-cb" value="Macrolide"> Macrolides
                        </label>
                    </div>
                </div>
            </div>
        `;

        const noInputBoxStyle = (!requiresWeight && !drug.requiresAge) ? 'border-style: dashed; background: var(--primary-50);' : '';
        const buttonStyle = (!requiresWeight && !drug.requiresAge) ? 'width: 100%; padding: 8px; font-size: 0.85rem; justify-content: center; border-radius: var(--radius-md);' : 'padding: 0 10px; min-width: 40px; justify-content: center;';
        const buttonContent = (!requiresWeight && !drug.requiresAge) ? '<i class="fas fa-file-prescription" style="margin-right: 6px;"></i> Show Instructions' : '<img src="assets/arrow.png" alt="Calculate" style="width: 24px; height: 24px; object-fit: contain; display: block;" />';

        container.innerHTML = `
            <div class="focus-calc-panel">
                ${cartBtnHTML}
                ${indicationSelectorHTML}
                <div class="mdh-base-dose" style="margin-bottom: 10px;">
                    <span>Base Dose:</span>
                    <strong class="dynamic-base-dose-display">${esc(baseDoseDisplay)}</strong>
                </div>
                ${concentrationHTML}
                ${advancedClinicalHTML}
                <div class="weight-input-section" style="${noInputBoxStyle}">
                    <label class="weight-input-label">${(requiresWeight || drug.requiresAge) ? 'Enter patient details:' : 'No patient details required:'}</label>
                    <div class="weight-input-group">
                        ${weightInputHTML}
                        ${ageInputHTML}
                        <button class="btn-primary calc-submit-btn" style="display: flex; align-items: center; ${buttonStyle}">
                            ${buttonContent}
                        </button>
                    </div>
                    <div class="weight-error" hidden></div>
                    <div class="validation-messages" style="margin-top: 6px;"></div>
                </div>
                <div class="calc-result-area" hidden style="margin-top: 10px;"></div>
            </div>
        `;

        const cartBtn = container.querySelector('.toggle-cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const idx = State.prescriptionList.indexOf(drug.name);
                if (idx > -1) {
                    State.prescriptionList.splice(idx, 1);
                    cartBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add to Active Prescription (Check Interactions)';
                    cartBtn.style.border = '2px dashed var(--primary-500)';
                    cartBtn.style.background = 'var(--primary-50)';
                    cartBtn.style.color = 'var(--primary-700)';
                } else {
                    State.prescriptionList.push(drug.name);
                    cartBtn.innerHTML = '<i class="fas fa-minus-circle"></i> Remove from Active Prescription';
                    cartBtn.style.border = '2px dashed var(--danger-500)';
                    cartBtn.style.background = 'var(--danger-50)';
                    cartBtn.style.color = 'var(--danger-700)';
                }
                Utils.vibrate();
                updateCartUI();
                const resultArea = container.querySelector('.calc-result-area');
                if (!resultArea.hidden) performCalculation();
            });
        }

        const advToggle = container.querySelector('.adv-clinical-toggle');
        const advPanel = container.querySelector('.adv-clinical-panel');
        const advIcon = container.querySelector('.adv-icon');
        const gearIcon = container.querySelector('.gear-icon');

        advToggle.addEventListener('click', () => {
            const isFreeDrug = drug.name.toLowerCase().includes('acetaminophen') || drug.name.toLowerCase().includes('ibuprofen');

            if (!isPremiumUser() && !isFreeDrug) {
                showPremiumModal();
                return;
            }

            advPanel.hidden = !advPanel.hidden;
            advIcon.style.transform = advPanel.hidden ? 'rotate(0deg)' : 'rotate(180deg)';
            if (gearIcon) {
                gearIcon.style.transform = advPanel.hidden ? 'rotate(0deg)' : 'rotate(90deg)';
            }
        });

        const calcBtn = container.querySelector('.calc-submit-btn');
        const weightInput = container.querySelector('.calc-weight-input');
        const heightInput = container.querySelector('.calc-height-input');
        const ageInput = container.querySelector('.calc-age-input');
        const errorDiv = container.querySelector('.weight-error');
        const validationMessages = container.querySelector('.validation-messages');
        const resultArea = container.querySelector('.calc-result-area');
        const dynamicBaseDoseDisplay = container.querySelector('.dynamic-base-dose-display');

        let selectedIndicationObj = drug.indicationDoses && drug.indicationDoses.length > 0 ? drug.indicationDoses[0] : null;
        const dropdownGroup = container.querySelector(`#dropdown-group-${drug.id}`);

        if (dropdownGroup) {
            const selectedBox = dropdownGroup.querySelector('.dropdown-selected');
            const optionsBox = dropdownGroup.querySelector('.dropdown-options');
            const selectedText = dropdownGroup.querySelector('.selected-text');
            const options = dropdownGroup.querySelectorAll('.dropdown-option');

            selectedBox.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsBox.classList.toggle('show');
                selectedBox.classList.toggle('open');
            });

            options.forEach(option => {
                option.addEventListener('click', () => {
                    const value = option.getAttribute('data-value');
                    selectedText.textContent = option.textContent.trim();
                    options.forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    optionsBox.classList.remove('show');
                    selectedBox.classList.remove('open');
                    selectedIndicationObj = drug.indicationDoses[value];
                    dynamicBaseDoseDisplay.textContent = `${selectedIndicationObj.minMgPerKg}${selectedIndicationObj.minMgPerKg !== selectedIndicationObj.maxMgPerKg ? ` to ${selectedIndicationObj.maxMgPerKg}` : ''} mg/kg`;

                    if (calcBtn.disabled === false && !resultArea.hidden) performCalculation();
                });
            });
        }

        const validateFields = () => {
            const weightVal = weightInput.value;
            const ageVal = ageInput ? ageInput.value : null;
            const heightVal = heightInput ? heightInput.value : null;
            const validation = ValidationEngine.validateInput(weightVal, ageVal, !!drug.requiresAge, requiresWeight, heightVal);

            validationMessages.innerHTML = '';
            errorDiv.hidden = true;
            if (requiresWeight && weightInput.type !== 'hidden') weightInput.classList.remove('input-error', 'input-warning', 'input-valid');
            if (heightInput) heightInput.classList.remove('input-error', 'input-warning', 'input-valid');
            if (ageInput) ageInput.classList.remove('input-error', 'input-warning', 'input-valid');

            if (validation.errors.length > 0) {
                validation.errors.forEach(err => {
                    const msg = document.createElement('div');
                    msg.style.cssText = `color: var(--danger-500); font-size: 0.65rem; font-weight: 600; padding: 3px 6px; background: var(--danger-100); border-radius: var(--radius-sm); margin-top: 3px; display: flex; align-items: center; gap: 4px;`;
                    msg.innerHTML = `<i class="fas fa-times-circle"></i> ${esc(err.message)}`;
                    validationMessages.appendChild(msg);
                    if (err.field === 'weight' && requiresWeight) weightInput.classList.add('input-error');
                    else if (err.field === 'age' && ageInput) ageInput.classList.add('input-error');
                    else if (err.field === 'height' && heightInput) heightInput.classList.add('input-error');
                });
                calcBtn.disabled = true; calcBtn.style.opacity = '0.5'; calcBtn.style.cursor = 'not-allowed'; resultArea.hidden = true;
                return false;
            }

            if (validation.warnings.length > 0) {
                validation.warnings.forEach(warn => {
                    const msg = document.createElement('div');
                    msg.style.cssText = `color: var(--warning-600); font-size: 0.65rem; font-weight: 600; padding: 3px 6px; background: var(--warning-100); border-radius: var(--radius-sm); margin-top: 3px; display: flex; align-items: center; gap: 4px;`;
                    msg.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${esc(warn.message)}`;
                    validationMessages.appendChild(msg);
                    if (warn.field === 'weight' && requiresWeight) weightInput.classList.add('input-warning');
                    else if (warn.field === 'age' && ageInput) ageInput.classList.add('input-warning');
                });
            }

            if (requiresWeight && weightVal > 0) weightInput.classList.add('input-valid');
            if (heightInput && heightVal > 0) heightInput.classList.add('input-valid');
            if (ageInput && ageVal !== '' && Number(ageVal) >= 0) ageInput.classList.add('input-valid');
            calcBtn.disabled = false; calcBtn.style.opacity = '1'; calcBtn.style.cursor = 'pointer';
            return validation.isValid;
        };

        if (requiresWeight && weightInput.type !== 'hidden') weightInput.addEventListener('input', validateFields);
        if (heightInput) heightInput.addEventListener('input', validateFields);
        if (ageInput) ageInput.addEventListener('input', validateFields);
        validateFields();

        const performCalculation = () => {
            const weightVal = Number(weightInput.value) || 0;
            const ageVal = ageInput ? Number(ageInput.value) : null;
            const heightVal = heightInput ? Number(heightInput.value) : null;

            if (!validateFields()) {
                errorDiv.textContent = 'Please fix the errors above.'; errorDiv.hidden = false; Utils.vibrate(50); return;
            }
            errorDiv.hidden = true; Utils.vibrate();

            let customConc = null;
            if (hasConcentration) {
                const mgVal = parseFloat(container.querySelector('.conc-mg').value);
                const volVal = parseFloat(container.querySelector('.conc-vol').value);

                if (isNaN(mgVal) || isNaN(volVal) || mgVal <= 0 || volVal <= 0) {
                    errorDiv.textContent = 'Please enter valid positive numbers for concentration.';
                    errorDiv.hidden = false;
                    Utils.vibrate(50);
                    return;
                }
                const normalizedMgVal = (drug.doseUnit && drug.doseUnit.toLowerCase() === 'g') ? mgVal * 1000 : mgVal;
                customConc = normalizedMgVal / volVal;
            }

            const advancedSettings = {
                pmaVal: Number(container.querySelector('.calc-pma-input').value) || null,
                isRenal: container.querySelector('.calc-renal-cb').checked,
                isHepatic: container.querySelector('.calc-hepatic-cb').checked,
                allergies: Array.from(container.querySelectorAll('.calc-allergy-cb:checked')).map(cb => cb.value),
                activePrescriptions: State.prescriptionList
            };

            const calculator = new DrugDoseCalculator(drug, weightVal, ageVal, customConc, selectedIndicationObj, advancedSettings, heightVal);
            const doseResult = calculator.calculate();

            const minDose = doseResult.minDose;
            const maxDose = doseResult.maxDose;
            const showHomeGuide = ['syrup', 'drop', 'powder', 'inhaler'].includes(drug.category) || drug.category === 'sachet';

            let patientWarningsHTML = '';
            const patientValidation = ValidationEngine.validatePatient(weightVal, ageVal, requiresWeight);
            if (patientValidation.issues.length > 0) {
                patientWarningsHTML = `<div class="patient-validation">${patientValidation.issues.map(issue => `
                    <div class="validation-item ${esc(issue.severity)}"><i class="fas ${issue.type === 'error' ? 'fa-times-circle' : issue.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i><span>${esc(issue.message)}</span></div>
                `).join('')}</div>`;
            }

            let warningClass = ''; let validationHTML = '';
            if (doseResult.alerts.length > 0) {
                warningClass = 'has-contraindication';
                validationHTML = `<div class="drug-contraindication ${esc(doseResult.severity)}">${doseResult.alerts.map(alert => `
                    <div class="contraindication-item"><i class="fas fa-exclamation-circle"></i><span>${alert}</span></div>
                `).join('')}</div>`;
            }
            if (doseResult.warnings.length > 0) {
                validationHTML += `<div class="drug-validation-warnings">${doseResult.warnings.map(warning => `
                    <div class="validation-warning-item"><i class="fas fa-info-circle"></i><span>${warning}</span></div>
                `).join('')}</div>`;
            }

            let ivHTML = '';
            if (AdvancedClinicalEngine && (drug.category === 'ampoule' || drug.category === 'vial')) {
                const ivGuide = AdvancedClinicalEngine.checkIVGuidelines(drug.name);
                if (ivGuide) {
                    ivHTML = `
                        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-left: 4px solid #0ea5e9; padding: 10px; border-radius: 6px; margin-bottom: 12px;">
                            <strong style="color: #0369a1; display:flex; align-items: center; gap: 6px; font-size: 0.75rem; margin-bottom: 6px;"><i class="fas fa-syringe"></i> ${esc(ivGuide.title)}</strong>
                            <div style="font-size: 0.7rem; color: #334155; margin-bottom: 3px;"><strong>Infusion Rate:</strong> ${esc(ivGuide.rate)}</div>
                            <div style="font-size: 0.7rem; color: #334155;"><strong>Max Concentration:</strong> ${esc(ivGuide.maxConc)}</div>
                            ${ivGuide.warning ? `<div style="font-size: 0.65rem; color: #b91c1c; margin-top: 6px; font-weight: 700;"><i class="fas fa-exclamation-triangle"></i> Warning: ${esc(ivGuide.warning)}</div>` : ''}
                        </div>
                    `;
                }
            }

            let safetyBadge = doseResult.isValid
                ? `<span class="safety-badge safe"><i class="fas fa-check-circle"></i> No Known Interaction</span>`
                : (doseResult.severity === 'high'
                    ? `<span class="safety-badge dangerous"><i class="fas fa-exclamation-triangle"></i> Caution</span>`
                    : `<span class="safety-badge caution"><i class="fas fa-shield-alt"></i> Monitor</span>`);

            resultArea.innerHTML = `
                <div class="calc-final-result ${warningClass}">
                    <div class="cfr-header">Per Dose Amount: ${safetyBadge}</div>
                    <div class="cfr-amount">${esc(doseResult.displayResult)}</div>
                    <div class="cfr-interval">Frequency: <strong>${esc(Utils.getIntervalText(doseResult.appliedInterval))}</strong></div>
                </div>
                ${calculator.getFormulaHTML(doseResult)}

                <div style="margin-top: 15px;">
                    ${patientWarningsHTML}
                    ${validationHTML}
                    ${drug.warning ? `<div class="drug-warning"><i class="fas fa-exclamation-triangle"></i> ${esc(drug.warning)}</div>` : ''}
                    ${ivHTML}
                </div>

                ${showHomeGuide ? `<div class="drug-home-guide" style="margin-top: 10px;"><div class="home-guide-label">Administration Guide</div><div class="home-guide-text">${Utils.generateHomeGuide(drug, minDose, maxDose, doseResult, customConc)}</div></div>` : ''}
            `;
            resultArea.hidden = false;
            setTimeout(() => container.parentElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
        };

        calcBtn.addEventListener('click', performCalculation);
        const handleEnter = (e) => { if (e.key === 'Enter') { e.preventDefault(); if (validateFields()) performCalculation(); } };
        if (requiresWeight && weightInput.type !== 'hidden') weightInput.addEventListener('keypress', handleEnter);
        if (heightInput) heightInput.addEventListener('keypress', handleEnter);
        if (ageInput) ageInput.addEventListener('keypress', handleEnter);
    }

    // ===== src/ui/events.js =====
    // src/ui/events.js
    // Global event wiring: search, category selection, drug-list delegation
    // (calculator toggle / lock / close), modals and the side navigation.


    function setupEvents() {
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

    // ===== src/main.js =====
    // src/main.js
    // Application entry point. Imported as an ES module from index.html.
    // Importing the data modules first ensures the window.* globals used by the
    // Android WebView bridge are populated before any UI runs.



    async function init() {
        await renderCategories();
        renderDrugs();
        updateCartUI();
        setupEvents();
        initDisclaimerLogic();
    }

    document.addEventListener('DOMContentLoaded', init);

})();
