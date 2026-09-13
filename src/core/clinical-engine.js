// src/core/clinical-engine.js
// Behavioural layer over ClinicalRulesDB: IV guidelines, organ-impairment
// adjustments, allergy cross-reactivity, drug-drug interactions and neonatal
// PMA protocols. This module holds logic only; all data lives in
// src/data/clinical-rules.data.js.

import { ClinicalRulesDB } from '../data/clinical-rules.data.js';

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
