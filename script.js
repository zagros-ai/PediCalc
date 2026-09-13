// script.js
(function() {
    'use strict';

    // ============================================================
    // بررسی وضعیت پرمیوم کاربر از جاوا
    // ============================================================
    let isPremiumUser = false;
    if (typeof Android !== 'undefined') {
        isPremiumUser = Android.isPremium();
    }

    function showPremiumModal() {
        let modal = document.getElementById('premium-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'premium-modal';
            modal.className = 'modal-overlay active';

            // طراحی جدید و بسیار زیبای پاپ آپ نسخه ویژه
            modal.innerHTML = `
<div class="modal-container" style="border-radius: 20px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 0; max-width: 90%; width: 360px; margin: auto; align-self: center;">                    <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 35px 20px 25px; text-align: center; position: relative; border-bottom: 1px solid #fde68a;">
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
                            <li style="display: flex; align-items: center; margin-bottom: 14px; color: #374151; font-size: 0.9rem; font-weight: 600;">
                                <i class="fas fa-check-circle" style="color: #10b981; margin-left: 12px; font-size: 1.2rem;"></i>
                                دسترسی به تمامی داروهای قفل شده
                            </li>
                            <li style="display: flex; align-items: center; margin-bottom: 14px; color: #374151; font-size: 0.9rem; font-weight: 600;">
                                <i class="fas fa-check-circle" style="color: #10b981; margin-left: 12px; font-size: 1.2rem;"></i>
                                بررسی هوشمند تداخلات دارویی
                            </li>
                            <li style="display: flex; align-items: center; margin-bottom: 14px; color: #374151; font-size: 0.9rem; font-weight: 600;">
                                <i class="fas fa-check-circle" style="color: #10b981; margin-left: 12px; font-size: 1.2rem;"></i>
                                تنظیمات نوزادان نارس (PMA)
                            </li>
                            <li style="display: flex; align-items: center; color: #374151; font-size: 0.9rem; font-weight: 600;">
                                <i class="fas fa-check-circle" style="color: #10b981; margin-left: 12px; font-size: 1.2rem;"></i>
                                تنظیم دوز در نارسایی کلیوی و کبدی
                            </li>
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
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('buyPremiumBtn').addEventListener('click', () => {
                if (typeof Android !== 'undefined') {
                    Android.purchasePremium();
                    modal.classList.remove('active');
                }
            });

            modal.querySelector('.premium-close-btn-top').addEventListener('click', () => {
                modal.classList.remove('active');
            });
        } else {
            modal.classList.add('active');
        }
    }

    // ============================================================
    //  CORE CALCULATOR CLASS
    // ============================================================
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

            // تشخیص قطعی و ایمن غلظت از روی دیتابیس (حذف کامل mgPerDrop)
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
            if (window.AdvancedClinicalEngine && this.advancedSettings.pmaVal && isInjectable) {
                const neonatalProtocol = window.AdvancedClinicalEngine.getNeonatalProtocol(this.drug.name, this.advancedSettings.pmaVal);
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
            if (window.AdvancedClinicalEngine) {
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
                    const rAdj = window.AdvancedClinicalEngine.checkOrganImpairment(this.drug.name, 'renal');
                    if (rAdj) result.warnings.push(`<strong>${rAdj.alert}:</strong> ${rAdj.message}`);
                }
                if (this.advancedSettings.isHepatic) {
                    const hAdj = window.AdvancedClinicalEngine.checkOrganImpairment(this.drug.name, 'hepatic');
                    if (hAdj) result.warnings.push(`<strong>${hAdj.alert}:</strong> ${hAdj.message}`);
                }
                if (this.advancedSettings.allergies && this.advancedSettings.allergies.length > 0) {
                    const allergyRisks = window.AdvancedClinicalEngine.checkAllergyRisk(this.drug.name, this.advancedSettings.allergies);
                    allergyRisks.forEach(risk => {
                        if (risk.severity === 'critical' || risk.severity === 'high') {
                            result.alerts.push(risk.message);
                            result.severity = 'high';
                        } else {
                            result.warnings.push(risk.message);
                        }
                    });
                }

                if (this.advancedSettings.activePrescriptions && this.advancedSettings.activePrescriptions.length > 0) {
                    const interactions = window.AdvancedClinicalEngine.checkInteractions(this.drug.name, this.advancedSettings.activePrescriptions);
                    interactions.forEach(interaction => {
                        if (interaction.severity === 'critical') {
                            result.alerts.push(`<strong>Critical Interaction with ${interaction.interactingWith}:</strong> ${interaction.message}`);
                            result.severity = 'high';
                        } else if (interaction.severity === 'high') {
                            result.alerts.push(`<strong>Major Interaction with ${interaction.interactingWith}:</strong> ${interaction.message}`);
                            if (result.severity !== 'high') result.severity = 'high';
                        } else {
                            result.warnings.push(`<strong>Interaction with ${interaction.interactingWith}:</strong> ${interaction.message}`);
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
                    if (this.weight < 10) result.alerts.push(`Recommendation: ${formRec.preferred} is more suitable for ${this.drug.name}.`);
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
                if (parsedMin === parsedMax) {
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
            let activeMin = this.selectedIndication ? this.selectedIndication.minMgPerKg : this.drug.minMgPerKg;
            let activeMax = this.selectedIndication ? this.selectedIndication.maxMgPerKg : this.drug.maxMgPerKg;

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

            if (activeMin === activeMax || result.minDose === result.maxDose) {
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
                            <span class="f-result" style="color: var(--primary-700); font-size: 0.85rem;"><strong>${volStr}</strong></span>
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
                            <span class="f-result">= <strong>${result.calculatedFixedDose}</strong></span>
                        </div>
                        ${result.dailyMaxDisplay ? `<div class="formula-line"><span class="f-desc">Daily Max:</span><span class="f-result"><strong>${this.drug.maxDailyDoseMg}${dailyMaxUnit}</strong></span></div>` : ''}
                        ${volumeHTML}
                    </div>
                `;
            }

            const isCappedMin = (this.drug.maxSingleDoseMg && result.minDose === this.drug.maxSingleDoseMg) || (result.minDose < this.activeMin * this.calcWeight);
            const isCappedMax = (this.drug.maxSingleDoseMg && result.maxDose === this.drug.maxSingleDoseMg) || (result.maxDose < this.activeMax * this.calcWeight);

            const min = this.activeMin;
            const max = this.activeMax;

            const weightStr = this.usedIBW ? `AdjBW (${this.ibwVal.toFixed(1)}kg)` : `Wt (${this.calcWeight}kg)`;

            if (min === max || result.minDose === result.maxDose) {
                return `
                    <div class="formula-box">
                        <div class="formula-title"><i class="fas fa-square-root-variable"></i> Formula:</div>
                        <div class="formula-line">
                            <span class="f-desc">${weightStr} × ${min} ${perKgUnit} ${isCappedMin ? '(Capped)' : ''}</span>
                            <span class="f-result">= <strong>${this._formatNum(result.minDose)}</strong></span>
                        </div>
                        ${result.dailyMaxDisplay && result.dailyMax > 0 ? `<div class="formula-line"><span class="f-desc">Daily Max:</span><span class="f-result"><strong>${result.dailyMax}${dailyMaxUnit}</strong></span></div>` : ''}
                        ${volumeHTML}
                    </div>
                `;
            }

            return `
                <div class="formula-box">
                    <div class="formula-title"><i class="fas fa-square-root-variable"></i> Formula:</div>
                    <div class="formula-line">
                        <span class="f-desc">Min: ${weightStr} × ${min} ${perKgUnit} ${isCappedMin ? '(Capped)' : ''}</span>
                        <span class="f-result">= <strong>${this._formatNum(result.minDose)}</strong></span>
                    </div>
                    <div class="formula-line">
                        <span class="f-desc">Max: ${weightStr} × ${max} ${perKgUnit} ${isCappedMax ? '(Capped)' : ''}</span>
                        <span class="f-result">= <strong>${this._formatNum(result.maxDose)}</strong></span>
                    </div>
                    ${result.dailyMaxDisplay && result.dailyMax > 0 ? `<div class="formula-line"><span class="f-desc">Daily Max:</span><span class="f-result"><strong>${result.dailyMax}${dailyMaxUnit}</strong></span></div>` : ''}
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

    // ============================================================
    //  VALIDATION ENGINE
    // ============================================================
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
        getRecommendedForm: (drug, weight) => {
            if (weight < 10 && drug.category === 'syrup') {
                return { preferred: 'Drop', message: 'For infants, drop or suspension form is more suitable.' };
            }
            if (weight >= 10 && weight < 20 && drug.category === 'drop') {
                return { preferred: 'Syrup', message: 'For older children, syrup form is more convenient.' };
            }
            return null;
        },
        validateInput: (weight, age, requiresAge, requiresWeight = true, height = null) => {
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
        validatePatient: (weight, age, requiresWeight = true) => {
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

    // ============================================================
    //  DOM Caching
    // ============================================================
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

    // ============================================================
    //  STATE
    // ============================================================
    const State = {
        category: 'all',
        searchQuery: '',
        openDropdownId: null,
        prescriptionList: []
    };

    // ============================================================
    //  GLOBAL UI FUNCTIONS (CART)
    // ============================================================
    function updateCartUI() {
        let banner = document.getElementById('cartBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'cartBanner';
            banner.style.cssText = 'padding: 10px; background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-md); margin-bottom: 15px; display: none;';
            const targetSection = document.getElementById('drugSection');
            if(targetSection) targetSection.insertBefore(banner, targetSection.firstChild);
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
                        ${name}
                        <div class="remove-from-cart" data-name="${name}" style="position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; background: var(--danger-500); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.2s; z-index: 2;">
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
                    const currentDrug = window.drugsDB.find(d => d.id === parseInt(State.openDropdownId));
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
                            if(calcBtn && !calcBtn.disabled) {
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

    // ============================================================
    //  UTILITIES
    // ============================================================
    const Utils = {
        getIntervalText: (hours) => {
            if (hours === 0) return 'Single Dose / As needed';
            const map = { 24: 'Every 24 hours', 12: 'Every 12 hours', 8: 'Every 8 hours', 6: 'Every 6 hours', 4: 'Every 4 hours' };
            return map[hours] || `Every ${hours} hours`;
        },
        generateHomeGuide: (drug, minDose, maxDose, validation, customConc) => {
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
                if (minCc === maxCc) return `<strong>${minCc} ml</strong> ${intervalText}`;
                return `<strong>${minCc} to ${maxCc} ml</strong> ${intervalText}`;
            }

            if (validation.isFixedDose) {
                return `<strong>${validation.calculatedFixedDose}</strong> ${intervalText}`;
            }

            return `Use as prescribed by physician.`;
        },
        // Single source of truth for dose-unit resolution (used by the calculator, formula/formatting
        // helpers, and the calculator UI) so unit-detection logic never has to be duplicated/kept in sync.
        resolveDoseUnit: (drug) => {
            if (drug.doseUnit) return drug.doseUnit;
            const nameLower = drug.name.toLowerCase();
            const formLower = drug.form ? drug.form.toLowerCase() : '';
            if (nameLower.includes('penicillin') || nameLower.includes('nystatin') || formLower.includes('u/') || formLower.includes('iu')) return 'Units';
            if (formLower.includes('meq')) return 'mEq';
            if (formLower.includes('mcg')) return 'mcg';
            if (formLower.includes('g/')) return 'g';
            return 'mg';
        },
        vibrate: (ms = 10) => { if (navigator.vibrate) navigator.vibrate(ms); },
        getIconClass: (category) => {
            if(category === 'syrup') return 'fa-wine-bottle';
            if(category === 'drop') return 'fa-tint';
            if(category === 'ampoule') return 'fa-syringe';
            if(category === 'powder') return 'fa-box-open';
            if(category === 'suppository') return 'fa-capsules';
            if(category === 'vial') return 'fa-flask';
            if(category === 'inhaler') return 'fa-wind';
            if(category === 'ointment') return 'fa-hand-sparkles';
            if(category === 'cream') return 'fa-paint-brush';
            if(category === 'gel') return 'fa-flask';
            if(category === 'spray') return 'fa-spray-can';
            if(category === 'sachet') return 'fa-envelope';
            if(category === 'capsule') return 'fa-capsules';
            return 'fa-pills';
        },
        getCategoryImage: (categoryId) => {
            const category = window.categoriesDB.find(c => c.id === categoryId);
            return category?.image || null;
        },
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },
        checkImage: (url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = url;
            });
        }
    };

    // ============================================================
    //  RENDERERS
    // ============================================================
    async function renderCategories() {
        const categoryPromises = window.categoriesDB.map(async (cat) => {
            const count = cat.id === 'all' ? window.drugsDB.length : window.drugsDB.filter(d => d.category === cat.id).length;
            const isActive = State.category === cat.id ? 'active' : '';

            let iconHtml;
            if (cat.image) {
                const imageExists = await Utils.checkImage(cat.image);
                if (imageExists) iconHtml = `<img src="${cat.image}" alt="${cat.name}" class="category-image" />`;
                else iconHtml = `<i class="fas ${cat.icon}"></i>`;
            } else {
                iconHtml = `<i class="fas ${cat.icon}"></i>`;
            }

            return `
                <div class="category-item ${isActive}" data-id="${cat.id}" role="tab" aria-selected="${isActive ? 'true' : 'false'}">
                    <div class="category-icon">${iconHtml}</div>
                    <div class="category-name">${cat.name}</div>
                    <div class="category-count">${count}</div>
                </div>
            `;
        });

        const htmls = await Promise.all(categoryPromises);
        DOM.categoryGrid.innerHTML = htmls.join('');
    }

    function renderDrugs() {
        let filtered = window.drugsDB;
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

        DOM.drugCount.textContent = `${window.drugsDB.length} Drugs`;
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
            // بررسی قفل بودن دارو (رایگان فقط استامینوفن و ایبوپروفن)
            const isFreeDrug = drug.name.toLowerCase().includes('acetaminophen') || drug.name.toLowerCase().includes('ibuprofen');
            const isLocked = !isPremiumUser && !isFreeDrug;

            const categoryImage = Utils.getCategoryImage(drug.category);
            const iconClass = Utils.getIconClass(drug.category);

            const iconHtml = categoryImage
                ? `<img src="${categoryImage}" alt="${drug.category}" class="drug-image" onerror="this.outerHTML='<i class=\\'fas ${iconClass}\\'></i>'" />`
                : `<i class="fas ${iconClass}"></i>`;

            const indicationsHTML = drug.indications ? `
                <div class="drug-indications-mini">
                    ${drug.indications.slice(0, 2).map(i => `<span class="tag-mini">${i}</span>`).join('')}
                    ${drug.indications.length > 2 ? `<span class="tag-mini">+</span>` : ''}
                </div>
            ` : '';

            const lockHTML = isLocked ? `
                <div class="lock-icon-btn" style="cursor: pointer; position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, #fde68a 0%, #f59e0b 100%); color: #fff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(245, 158, 11, 0.4); z-index: 2;">
                    <i class="fas fa-lock" style="font-size: 0.8rem;"></i>
                </div>
            ` : '';

            return `
                <article class="drug-list-card" data-drug-id="${drug.id}" data-locked="${isLocked}" style="position: relative;">
                    ${lockHTML}
                    <button class="close-card-btn" aria-label="Close Calculator">
                        <img src="assets/close-icon.png" class="close-icon" alt="Close" />
                    </button>
                    <div class="drug-card-content">
                        <div class="drug-icon-wrapper">
                            ${iconHtml}
                        </div>
                        <div class="drug-details">
                            <h4 class="drug-name">${drug.name}</h4>
                            <span class="drug-form">${drug.form}</span>
                            ${indicationsHTML}
                        </div>
                    </div>
                    <button class="select-drug-btn toggle-calc-btn" data-drug-id="${drug.id}">
                        ${isLocked ? '<i class="fas fa-lock"></i> قفل / فعال‌سازی' : '<i class="fas fa-calculator"></i> Calculate Dose'}
                    </button>
                    <div class="drug-calc-dropdown" id="calc-dropdown-${drug.id}" hidden></div>
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
        const drug = window.drugsDB.find(d => d.id === parseInt(drugId));
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

        // استخراج ایمن غلظت از دیتابیس با استانداردسازی ml
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
                    <input type="number" class="conc-mg" value="${defaultTotalMg}" step="0.1" min="0.1">
                    <span>${doseUnit} per</span>
                    <input type="number" class="conc-vol" value="${defaultTotalVol}" step="0.1" min="0.1">
                    <span>${unitType}</span>
                </div>
            </div>
        ` : '';

        const indicationSelectorHTML = drug.indicationDoses && drug.indicationDoses.length > 0 ? `
            <div class="custom-dropdown" id="dropdown-group-${drug.id}">
                <label class="custom-dropdown-label"><i class="fas fa-stethoscope"></i> Select Clinical Indication:</label>
                <div class="dropdown-selected" id="dropdown-selected-${drug.id}" data-value="0">
                    <span class="selected-text">${drug.indicationDoses[0].name}</span>
                    <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
                <div class="dropdown-options" id="dropdown-options-${drug.id}">
                    ${drug.indicationDoses.map((ind, index) => `
                        <div class="dropdown-option ${index === 0 ? 'selected' : ''}" data-value="${index}">
                            ${ind.name}
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
                    <strong class="dynamic-base-dose-display">${baseDoseDisplay}</strong>
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
            // بررسی اینکه آیا داروی فعلی استامینوفن یا ایبوپروفن است؟
            const isFreeDrug = drug.name.toLowerCase().includes('acetaminophen') || drug.name.toLowerCase().includes('ibuprofen');

            // اگر کاربر نسخه ویژه رو نداره و دارو هم رایگان نیست، قفل رو نشون بده
            if (!isPremiumUser && !isFreeDrug) {
                showPremiumModal();
                return;
            }

            // در غیر این صورت تنظیمات پیشرفته باز شود
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
                    msg.innerHTML = `<i class="fas fa-times-circle"></i> ${err.message}`;
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
                    msg.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${warn.message}`;
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
                    <div class="validation-item ${issue.severity}"><i class="fas ${issue.type === 'error' ? 'fa-times-circle' : issue.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i><span>${issue.message}</span></div>
                `).join('')}</div>`;
            }

            let warningClass = ''; let validationHTML = '';
            if (doseResult.alerts.length > 0) {
                warningClass = 'has-contraindication';
                validationHTML = `<div class="drug-contraindication ${doseResult.severity}">${doseResult.alerts.map(alert => `
                    <div class="contraindication-item"><i class="fas fa-exclamation-circle"></i><span>${alert}</span></div>
                `).join('')}</div>`;
            }
            if (doseResult.warnings.length > 0) {
                validationHTML += `<div class="drug-validation-warnings">${doseResult.warnings.map(warning => `
                    <div class="validation-warning-item"><i class="fas fa-info-circle"></i><span>${warning}</span></div>
                `).join('')}</div>`;
            }

            let ivHTML = '';
            if (window.AdvancedClinicalEngine && (drug.category === 'ampoule' || drug.category === 'vial')) {
                const ivGuide = window.AdvancedClinicalEngine.checkIVGuidelines(drug.name);
                if (ivGuide) {
                    ivHTML = `
                        <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-left: 4px solid #0ea5e9; padding: 10px; border-radius: 6px; margin-bottom: 12px;">
                            <strong style="color: #0369a1; display:flex; align-items: center; gap: 6px; font-size: 0.75rem; margin-bottom: 6px;"><i class="fas fa-syringe"></i> ${ivGuide.title}</strong>
                            <div style="font-size: 0.7rem; color: #334155; margin-bottom: 3px;"><strong>Infusion Rate:</strong> ${ivGuide.rate}</div>
                            <div style="font-size: 0.7rem; color: #334155;"><strong>Max Concentration:</strong> ${ivGuide.maxConc}</div>
                            ${ivGuide.warning ? `<div style="font-size: 0.65rem; color: #b91c1c; margin-top: 6px; font-weight: 700;"><i class="fas fa-exclamation-triangle"></i> Warning: ${ivGuide.warning}</div>` : ''}
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
                    <div class="cfr-amount">${doseResult.displayResult}</div>
                    <div class="cfr-interval">Frequency: <strong>${Utils.getIntervalText(doseResult.appliedInterval)}</strong></div>
                </div>
                ${calculator.getFormulaHTML(doseResult)}

                <div style="margin-top: 15px;">
                    ${patientWarningsHTML}
                    ${validationHTML}
                    ${drug.warning ? `<div class="drug-warning"><i class="fas fa-exclamation-triangle"></i> ${drug.warning}</div>` : ''}
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

    // ============================================================
    //  DISCLAIMER & LEGAL AGREEMENT ENGINE
    // ============================================================
    function initDisclaimerLogic() {
        const modal = document.getElementById('disclaimerModal');
        const body = document.getElementById('disclaimerBody');
        const acceptBtn = document.getElementById('acceptDisclaimerBtn');
        const scrollNotice = document.getElementById('scrollNotice');
        const navBtn = document.getElementById('disclaimerNavBtn');

        if (!modal || !body || !acceptBtn) return;

        const hasAccepted = localStorage.getItem('pedicalc_disclaimer_accepted');

        // اگر قبلاً نپذیرفته، مدال به صورت اجباری باز شود
        if (!hasAccepted) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // چک کردن اسکرول تا انتها
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
        // برای صفحه نمایش‌های بزرگ که نیاز به اسکرول ندارند
        setTimeout(checkScroll, 300);

        // ثبت تایید کاربر
        acceptBtn.addEventListener('click', () => {
            if (acceptBtn.disabled) return;
            localStorage.setItem('pedicalc_disclaimer_accepted', 'true');
            modal.classList.remove('active');
            document.body.style.overflow = '';
            Utils.vibrate();
        });

        // باز کردن توافقنامه از منوی برنامه (جهت دسترسی همیشگی)
        if (navBtn) {
            navBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Utils.vibrate();
                if (DOM.sideNav) DOM.sideNav.classList.remove('active');
                if (DOM.navOverlay) DOM.navOverlay.classList.remove('active');

                // باز کردن مدال در حالت مطالعه (دکمه از قبل فعال باشد)
                acceptBtn.disabled = false;
                acceptBtn.style.background = 'var(--primary-600)';
                acceptBtn.textContent = 'بستن';
                if (scrollNotice) scrollNotice.style.display = 'none';
                modal.classList.add('active');
            });
        }
    }

    // ============================================================
    //  EVENTS
    // ============================================================
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
            // هندل کلیک روی خود آیکون قفل
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

                // بررسی قفل بودن دارو هنگام کلیک
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

    // ============================================================
    //  INIT
    // ============================================================
    async function init() {
        await renderCategories();
        renderDrugs();
        updateCartUI();
        setupEvents();
        initDisclaimerLogic(); // فراخوانی منطق توافقنامه
    }

    document.addEventListener('DOMContentLoaded', init);

})();