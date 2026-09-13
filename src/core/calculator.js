// src/core/calculator.js
// The core pediatric dosing engine. Given a drug record plus patient data
// (weight, age, height, concentration, indication and advanced clinical
// settings) it produces the per-dose amount, daily maximum, applied interval,
// warnings/alerts and the formula HTML. Pure computation + HTML string output;
// no direct DOM manipulation.

import { Utils, escapeHtml, nearlyEqual } from './utils.js';
import { ValidationEngine } from './validation.js';
import { AdvancedClinicalEngine } from './clinical-engine.js';
import { t } from './i18n.js';
import { resolveFa } from '../data/translations.fa.js';

export class DrugDoseCalculator {
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
                let warnMsg = t('dyn.nicu', { pma: this.advancedSettings.pmaVal });
                if (this.neonatalOverrideDose !== null) {
                    warnMsg += t('dyn.nicuDoseInterval', { dose: this.neonatalOverrideDose, interval });
                } else {
                    warnMsg += t('dyn.nicuInterval', { interval });
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
                        result.alerts.push(`<strong>${escapeHtml(t('dyn.critInteraction', { drug: interaction.interactingWith }))}</strong> ${escapeHtml(interaction.message)}`);
                        result.severity = 'high';
                    } else if (interaction.severity === 'high') {
                        result.alerts.push(`<strong>${escapeHtml(t('dyn.majorInteraction', { drug: interaction.interactingWith }))}</strong> ${escapeHtml(interaction.message)}`);
                        if (result.severity !== 'high') result.severity = 'high';
                    } else {
                        result.warnings.push(`<strong>${escapeHtml(t('dyn.interaction', { drug: interaction.interactingWith }))}</strong> ${escapeHtml(interaction.message)}`);
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
                result.alerts.push(resolveFa('clinical', contra.warning));
                result.severity = contra.severity;
            }
        }

        // 6. Form Recommendations
        if (this.weight > 0) {
            const formRec = ValidationEngine.getRecommendedForm(this.drug, this.weight);
            if (formRec) {
                result.warnings.push(formRec.message);
                if (this.weight < 10) result.alerts.push(t('dyn.recommend', { form: formRec.preferred, drug: resolveFa('drug', this.drug.name) }));
            }
        }

        result.isValid = result.alerts.length === 0 && result.severity !== 'high';

        // 7. Max Daily Display Formatting
        let doseUnitLabel = Utils.resolveDoseUnit(this.drug);

        if (this.drug.maxDailyDoseMg) {
            result.dailyMaxDisplay = t('dyn.maxDaily', { max: this.drug.maxDailyDoseMg, unit: doseUnitLabel });
        } else {
            result.dailyMaxDisplay = '';
        }

        return result;
    }

    _calculateTopical(result) {
        result.isFixedDose = true;
        result.calculatedFixedDose = this.drug.fixedDose || t('dyn.applyThin');
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
                result.alerts.push(resolveFa('clinical', this.drug.ageAlert.message));
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
                result.warnings.push(t('dyn.ibwWarn', { ibw: ibw.toFixed(1) }));
                if (this.drug.hydrophilic) {
                    calcWeight = ibw + 0.4 * (this.weight - ibw); // Adjusted Body Weight
                    this.usedIBW = true;
                    this.ibwVal = calcWeight;
                    result.alerts.push(`<strong>${escapeHtml(t('dyn.adjbw'))}</strong>${escapeHtml(t('dyn.adjbwBody', { w: calcWeight.toFixed(1) }))}`);
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
                result.alerts.push(t('dyn.capped', { max: this.drug.maxSingleDoseMg, unit: doseUnitLabel }));
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
                result.warnings.push(t('dyn.dailyCapped', { unit: doseUnitLabel, orig: originalDailyMax, max: this.drug.maxDailyDoseMg }));

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
            result.warnings.push(t('dyn.highDaily', { daily: result.dailyMax, unit: doseUnitLabel }));
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
                        <span class="f-desc" style="color: var(--primary-800); font-weight: bold;">${escapeHtml(t('formula.volume'))}</span>
                        <span class="f-result" style="color: var(--primary-700); font-size: 0.85rem;"><strong>${escapeHtml(volStr)}</strong></span>
                    </div>
                `;
            }
        }

        // Formatting for Fixed Dose Rules
        if (result.isFixedDose) {
            return `
                <div class="formula-box">
                    <div class="formula-title"><i class="fas fa-info-circle"></i> ${escapeHtml(t('formula.title'))}</div>
                    <div class="formula-line">
                        <span class="f-desc">${escapeHtml(t('formula.fixedDesc'))}</span>
                        <span class="f-result">= <strong>${escapeHtml(result.calculatedFixedDose)}</strong></span>
                    </div>
                    ${result.dailyMaxDisplay ? `<div class="formula-line"><span class="f-desc">${escapeHtml(t('formula.dailyMax'))}</span><span class="f-result"><strong>${escapeHtml(this.drug.maxDailyDoseMg)}${dailyMaxUnit}</strong></span></div>` : ''}
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
                    <div class="formula-title"><i class="fas fa-square-root-variable"></i> ${escapeHtml(t('formula.title'))}</div>
                    <div class="formula-line">
                        <span class="f-desc">${escapeHtml(weightStr)} × ${escapeHtml(min)} ${perKgUnit} ${isCappedMin ? escapeHtml(t('formula.capped')) : ''}</span>
                        <span class="f-result">= <strong>${escapeHtml(this._formatNum(result.minDose))}</strong></span>
                    </div>
                    ${result.dailyMaxDisplay && result.dailyMax > 0 ? `<div class="formula-line"><span class="f-desc">${escapeHtml(t('formula.dailyMax'))}</span><span class="f-result"><strong>${escapeHtml(result.dailyMax)}${dailyMaxUnit}</strong></span></div>` : ''}
                    ${volumeHTML}
                </div>
            `;
        }

        return `
            <div class="formula-box">
                <div class="formula-title"><i class="fas fa-square-root-variable"></i> ${escapeHtml(t('formula.title'))}</div>
                <div class="formula-line">
                    <span class="f-desc">Min: ${escapeHtml(weightStr)} × ${escapeHtml(min)} ${perKgUnit} ${isCappedMin ? escapeHtml(t('formula.capped')) : ''}</span>
                    <span class="f-result">= <strong>${escapeHtml(this._formatNum(result.minDose))}</strong></span>
                </div>
                <div class="formula-line">
                    <span class="f-desc">Max: ${escapeHtml(weightStr)} × ${escapeHtml(max)} ${perKgUnit} ${isCappedMax ? escapeHtml(t('formula.capped')) : ''}</span>
                    <span class="f-result">= <strong>${escapeHtml(this._formatNum(result.maxDose))}</strong></span>
                </div>
                ${result.dailyMaxDisplay && result.dailyMax > 0 ? `<div class="formula-line"><span class="f-desc">${escapeHtml(t('formula.dailyMax'))}</span><span class="f-result"><strong>${escapeHtml(result.dailyMax)}${dailyMaxUnit}</strong></span></div>` : ''}
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
