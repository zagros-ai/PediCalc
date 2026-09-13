// src/core/clinical-engine.js
// Behavioural layer over ClinicalRulesDB: IV guidelines, organ-impairment
// adjustments, allergy cross-reactivity, drug-drug interactions and neonatal
// PMA protocols. This module holds logic only; all data lives in
// src/data/clinical-rules.data.js.

import { ClinicalRulesDB } from '../data/clinical-rules.data.js';
import { t } from './i18n.js';
import { resolveFa } from '../data/translations.fa.js';

/** Localized label for an allergy class name used inside allergy sentences. */
function allergyClassLabel(allergyClass) {
    const key = {
        'Penicillin': 'adv.penicillins',
        'Cephalosporin': 'adv.cephalosporins',
        'NSAID': 'adv.nsaids',
        'Macrolide': 'adv.macrolides'
    }[allergyClass];
    return key ? t(key) : allergyClass;
}

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

export const AdvancedClinicalEngine = {
    checkIVGuidelines(drugName) {
        const guideline = ClinicalRulesDB.ivGuidelines[drugName];
        if (!guideline) return null;
        return {
            title: t('iv.title'),
            rate: guideline.rate || 'Standard',       // rate/conc keep units → not translated
            maxConc: guideline.maxConcentration || 'N/A',
            warning: guideline.warning ? resolveFa('clinical', guideline.warning) : ''
        };
    },

    checkOrganImpairment(drugName, impairmentType) {
        const adjustment = ClinicalRulesDB.adjustments[drugName];
        if (adjustment && adjustment.type === impairmentType) {
            return {
                alert: t(impairmentType === 'renal' ? 'dyn.renalAdjust' : 'dyn.hepaticAdjust'),
                message: resolveFa('clinical', adjustment.warning)
            };
        }
        return null;
    },

    checkAllergyRisk(drugName, patientAllergies) {
        const risks = [];
        patientAllergies.forEach(allergyClass => {
            const drugsInClass = ClinicalRulesDB.crossAllergies[allergyClass];
            const drugFa = resolveFa('drug', drugName);
            if (drugsInClass && drugsInClass.includes(drugName)) {
                risks.push({
                    severity: 'critical',
                    message: t('allergy.absolute', { class: allergyClassLabel(allergyClass) })
                });
            } else if (allergyClass === 'Penicillin' && ClinicalRulesDB.crossAllergies['Cephalosporin'].includes(drugName)) {
                risks.push({
                    severity: 'high',
                    message: t('allergy.penToCeph', { drug: drugFa })
                });
            } else if (allergyClass === 'Cephalosporin' && ClinicalRulesDB.crossAllergies['Penicillin'].includes(drugName)) {
                risks.push({
                    severity: 'high',
                    message: t('allergy.cephToPen', { drug: drugFa })
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
                const displayName = activeOriginalName || interactingActiveDrug;
                foundInteractions.push({
                    interactingWith: resolveFa('drug', displayName),
                    severity: interaction.severity,
                    message: resolveFa('clinical', interaction.message)
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
