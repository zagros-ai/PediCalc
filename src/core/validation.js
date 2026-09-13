// src/core/validation.js
// Pure input/patient validation and contraindication rules used by the
// calculator and the calculator UI. No DOM access.

import { Utils } from './utils.js';
import { t } from './i18n.js';

export const ValidationEngine = {
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
            return { preferred: t('form.drop'), message: t('form.dropBetter') };
        }
        if (weight >= 10 && weight < 20 && drug.category === 'drop') {
            return { preferred: t('form.syrup'), message: t('form.syrupBetter') };
        }
        return null;
    },

    validateInput(weight, age, requiresAge, requiresWeight = true, height = null) {
        const errors = [];
        const warnings = [];

        if (requiresWeight) {
            if (weight === undefined || weight === null || weight === '') {
                errors.push({ field: 'weight', message: t('val.weightRequired') });
            } else {
                const w = Number(weight);
                if (isNaN(w) || w <= 0) {
                    errors.push({ field: 'weight', message: t('val.weightPositive') });
                } else if (w < 0.5) {
                    errors.push({ field: 'weight', message: t('val.weightTooLow') });
                } else if (w > 150) {
                    errors.push({ field: 'weight', message: t('val.weightTooHigh') });
                } else if (w < 2.5) {
                    warnings.push({ field: 'weight', message: t('val.neonatalPrecision') });
                } else if (w > 35) {
                    warnings.push({ field: 'weight', message: t('val.aboveAdult') });
                }
            }
        }

        if (requiresAge) {
            if (age === undefined || age === null || age === '') {
                errors.push({ field: 'age', message: t('val.ageRequired') });
            } else {
                const a = Number(age);
                if (isNaN(a) || a < 0) {
                    errors.push({ field: 'age', message: t('val.agePositive') });
                } else if (a > 18) {
                    errors.push({ field: 'age', message: t('val.ageTooHigh') });
                } else if (a < 0.5 && requiresAge) {
                    warnings.push({ field: 'age', message: t('val.ageUnder6mo') });
                }
            }
        }

        if (height !== null && height !== '') {
            const h = Number(height);
            if (isNaN(h) || h <= 0) {
                errors.push({ field: 'height', message: t('val.heightPositive') });
            } else if (h < 30 || h > 250) {
                errors.push({ field: 'height', message: t('val.heightRange') });
            }
        }

        return { errors, warnings, isValid: errors.length === 0 };
    },

    validatePatient(weight, age, requiresWeight = true) {
        const issues = [];
        let ageCategory = 'Unknown';

        if (requiresWeight) {
            if (weight < 0.5) issues.push({ type: 'error', message: t('val.weightVeryLow'), severity: 'critical' });
            if (weight < 2.5) issues.push({ type: 'warning', message: t('val.neonatalPrecision'), severity: 'high' });
            if (weight > 35) issues.push({ type: 'info', message: t('val.aboveAdult'), severity: 'low' });

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
export { Utils };
