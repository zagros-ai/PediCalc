// src/ui/renderers.js
// Rendering + per-drug calculator UI: category grid, drug list, and the
// expandable dose calculator dropdown with all its event wiring.

import { DOM } from './dom.js';
import { State, isPremiumUser } from '../core/state.js';
import { Utils } from '../core/utils.js';
import { ValidationEngine } from '../core/validation.js';
import { DrugDoseCalculator } from '../core/calculator.js';
import { AdvancedClinicalEngine } from '../core/clinical-engine.js';
import { categoriesDB, drugsDB } from '../data/drugs.data.js';
import { showPremiumModal } from './premium-modal.js';
import { updateCartUI } from './cart.js';
import { t, localized } from '../core/i18n.js';
import { resolveFa } from '../data/translations.fa.js';

const esc = Utils.escapeHtml;

function getCategoryImage(categoryId) {
    const category = categoriesDB.find(c => c.id === categoryId);
    return category?.image || null;
}

export async function renderCategories() {
    const categoryPromises = categoriesDB.map(async (cat) => {
        const count = cat.id === 'all' ? drugsDB.length : drugsDB.filter(d => d.category === cat.id).length;
        const isActive = State.category === cat.id ? 'active' : '';

        let iconHtml;
        if (cat.image) {
            const imageExists = await Utils.checkImage(cat.image);
            if (imageExists) iconHtml = `<img src="${esc(cat.image)}" alt="${esc(localized(cat, 'name'))}" class="category-image" />`;
            else iconHtml = `<i class="fas ${esc(cat.icon)}"></i>`;
        } else {
            iconHtml = `<i class="fas ${esc(cat.icon)}"></i>`;
        }

        return `
            <div class="category-item ${isActive}" data-id="${esc(cat.id)}" role="tab" aria-selected="${isActive ? 'true' : 'false'}">
                <div class="category-icon">${iconHtml}</div>
                <div class="category-name">${esc(localized(cat, 'name'))}</div>
                <div class="category-count">${count}</div>
            </div>
        `;
    });

    const htmls = await Promise.all(categoryPromises);
    DOM.categoryGrid.innerHTML = htmls.join('');
}

export function renderDrugs() {
    let filtered = drugsDB;
    if (State.category !== 'all') {
        filtered = filtered.filter(d => d.category === State.category);
    }
    if (State.searchQuery) {
        const q = State.searchQuery.toLowerCase();
        filtered = filtered.filter(d =>
            d.name.toLowerCase().includes(q) ||
            resolveFa('drug', d.name).toLowerCase().includes(q) ||
            (d.indications && d.indications.some(i => i.toLowerCase().includes(q) || resolveFa('indication', i).toLowerCase().includes(q))) ||
            d.category.includes(q)
        );
    }

    DOM.drugCount.textContent = t('drugs.count', { n: drugsDB.length });
    DOM.resultCount.textContent = t('drugs.items', { n: filtered.length });
    State.openDropdownId = null;

    if (filtered.length === 0) {
        DOM.drugList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search-minus"></i>
                <h3>${esc(t('drugs.none.title'))}</h3>
                <p>${esc(t('drugs.none.body'))}</p>
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
                ${drug.indications.slice(0, 2).map(i => `<span class="tag-mini">${esc(resolveFa('indication', i))}</span>`).join('')}
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
                <button class="close-card-btn" aria-label="${esc(t('drugs.closeCalc'))}">
                    <img src="assets/close-icon.png" class="close-icon" alt="${esc(t('drugs.close'))}" />
                </button>
                <div class="drug-card-content">
                    <div class="drug-icon-wrapper">
                        ${iconHtml}
                    </div>
                    <div class="drug-details">
                        <h4 class="drug-name">${esc(resolveFa('drug', drug.name))}</h4>
                        <span class="drug-form">${esc(drug.form)}</span>
                        ${indicationsHTML}
                    </div>
                </div>
                <button class="select-drug-btn toggle-calc-btn" data-drug-id="${esc(drug.id)}">
                    ${isLocked ? `<i class="fas fa-lock"></i> ${esc(t('drugs.unlock'))}` : `<i class="fas fa-calculator"></i> ${esc(t('drugs.calculate'))}`}
                </button>
                <div class="drug-calc-dropdown" id="calc-dropdown-${esc(drug.id)}" hidden></div>
            </article>
        `;
    }).join('');
}

export function closeAllCalculators() {
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

export function toggleCalcDropdown(drugId, btn) {
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

export function renderCalcUI(drugId, container) {
    const drug = drugsDB.find(d => d.id === parseInt(drugId));
    if (!drug) return;

    const isTopical = ['ointment', 'cream', 'gel', 'spray'].includes(drug.category);
    const isZeroWeight = drug.minMgPerKg === 0 && drug.maxMgPerKg === 0;
    const requiresWeight = !isTopical && !isZeroWeight;

    const ageInputHTML = drug.requiresAge ? `
        <input type="number" class="calc-age-input" step="0.01" min="0" max="18" placeholder="${esc(t('calc.age'))}" autocomplete="off" />
    ` : '';

    const weightInputHTML = requiresWeight ? `
        <input type="number" class="calc-weight-input" step="0.1" min="0.5" max="150" placeholder="${esc(t('calc.weight'))}" autocomplete="off" />
        <input type="number" class="calc-height-input" step="1" min="30" max="250" placeholder="${esc(t('calc.height'))}" autocomplete="off" />
    ` : `<input type="hidden" class="calc-weight-input" value="0" />`;

    // Base-dose display keeps units (mg/kg) in English; only "Standard or Age-based" is translated.
    const baseDoseDisplay = (drug.indicationDoses && drug.indicationDoses.length > 0)
        ? `${drug.indicationDoses[0].minMgPerKg}${drug.indicationDoses[0].minMgPerKg !== drug.indicationDoses[0].maxMgPerKg ? ` to ${drug.indicationDoses[0].maxMgPerKg}` : ''} mg/kg`
        : (drug.fixedDose ? t('calc.standardOrAge') : `${drug.minMgPerKg}${drug.minMgPerKg !== drug.maxMgPerKg ? ` to ${drug.maxMgPerKg}` : ''} mg/kg`);

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
            <i class="fas ${isInCart ? 'fa-minus-circle' : 'fa-plus-circle'}"></i> ${isInCart ? esc(t('cart.remove')) : esc(t('cart.add'))}
        </button>
    `;

    const concentrationHTML = hasConcentration ? `
        <div class="concentration-settings">
            <label><i class="fas fa-vial"></i> ${esc(t('calc.concentration'))}</label>
            <div class="conc-inputs">
                <input type="number" class="conc-mg" value="${esc(defaultTotalMg)}" step="0.1" min="0.1">
                <span>${esc(doseUnit)} ${esc(t('calc.per'))}</span>
                <input type="number" class="conc-vol" value="${esc(defaultTotalVol)}" step="0.1" min="0.1">
                <span>${esc(unitType)}</span>
            </div>
        </div>
    ` : '';

    const indicationSelectorHTML = drug.indicationDoses && drug.indicationDoses.length > 0 ? `
        <div class="custom-dropdown" id="dropdown-group-${esc(drug.id)}">
            <label class="custom-dropdown-label"><i class="fas fa-stethoscope"></i> ${esc(t('calc.selectIndication'))}</label>
            <div class="dropdown-selected" id="dropdown-selected-${esc(drug.id)}" data-value="0">
                <span class="selected-text">${esc(resolveFa('indicationDose', drug.indicationDoses[0].name))}</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
            </div>
            <div class="dropdown-options" id="dropdown-options-${esc(drug.id)}">
                ${drug.indicationDoses.map((ind, index) => `
                    <div class="dropdown-option ${index === 0 ? 'selected' : ''}" data-value="${index}">
                        ${esc(resolveFa('indicationDose', ind.name))}
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const advancedClinicalHTML = `
        <div class="adv-clinical-toggle">
            <img src="assets/settings.png" alt="${esc(t('adv.title'))}" class="gear-icon" style="width: 18px; height: 18px; object-fit: contain; transition: transform 0.3s ease; margin-right: 4px;" /> ${esc(t('adv.title'))}
            <i class="fas fa-chevron-down adv-icon" style="margin-left: auto; transition: transform 0.3s ease;"></i>
        </div>
        <div class="adv-clinical-panel" hidden>
            <div style="margin-bottom: 12px;">
                <label style="font-size: 0.7rem; font-weight: 700; color: var(--text-secondary); display:block; margin-bottom: 4px;">
                    ${esc(t('adv.pma'))}
                    <div style="font-size: 0.6rem; font-weight: 400; color: var(--text-tertiary); margin-top: 2px;">${esc(t('adv.pmaHint'))}</div>
                </label>
                <input type="number" class="calc-pma-input" placeholder="${esc(t('adv.pmaPlaceholder'))}" style="width: 100%; padding: 8px; border: 2px solid var(--border-light); border-radius: var(--radius-sm); font-family: inherit; font-size: 0.75rem;">
            </div>
            <div style="display: flex; gap: 15px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed var(--border-light);">
                <label style="font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 4px; color: var(--text-primary); cursor: pointer;">
                    <input type="checkbox" class="calc-renal-cb" style="accent-color: var(--primary-500); width: 14px; height: 14px;"> ${esc(t('adv.renal'))}
                </label>
                <label style="font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 4px; color: var(--text-primary); cursor: pointer;">
                    <input type="checkbox" class="calc-hepatic-cb" style="accent-color: var(--primary-500); width: 14px; height: 14px;"> ${esc(t('adv.hepatic'))}
                </label>
            </div>
            <div>
                <label style="font-size: 0.7rem; font-weight: 800; color: var(--danger-600); display:block; margin-bottom: 4px;">${esc(t('adv.allergies'))}</label>
                <div class="allergy-checkbox-group">
                    <label class="allergy-checkbox-label">
                        <input type="checkbox" class="calc-allergy-cb" value="Penicillin"> ${esc(t('adv.penicillins'))}
                    </label>
                    <label class="allergy-checkbox-label">
                        <input type="checkbox" class="calc-allergy-cb" value="Cephalosporin"> ${esc(t('adv.cephalosporins'))}
                    </label>
                    <label class="allergy-checkbox-label">
                        <input type="checkbox" class="calc-allergy-cb" value="NSAID"> ${esc(t('adv.nsaids'))}
                    </label>
                    <label class="allergy-checkbox-label">
                        <input type="checkbox" class="calc-allergy-cb" value="Macrolide"> ${esc(t('adv.macrolides'))}
                    </label>
                </div>
            </div>
        </div>
    `;

    const noInputBoxStyle = (!requiresWeight && !drug.requiresAge) ? 'border-style: dashed; background: var(--primary-50);' : '';
    const buttonStyle = (!requiresWeight && !drug.requiresAge) ? 'width: 100%; padding: 8px; font-size: 0.85rem; justify-content: center; border-radius: var(--radius-md);' : 'padding: 0 10px; min-width: 40px; justify-content: center;';
    const buttonContent = (!requiresWeight && !drug.requiresAge) ? `<i class="fas fa-file-prescription" style="margin-right: 6px;"></i> ${esc(t('calc.showInstructions'))}` : '<img src="assets/arrow.png" alt="Calculate" style="width: 24px; height: 24px; object-fit: contain; display: block;" />';

    container.innerHTML = `
        <div class="focus-calc-panel">
            ${cartBtnHTML}
            ${indicationSelectorHTML}
            <div class="mdh-base-dose" style="margin-bottom: 10px;">
                <span>${esc(t('calc.baseDose'))}</span>
                <strong class="dynamic-base-dose-display">${esc(baseDoseDisplay)}</strong>
            </div>
            ${concentrationHTML}
            ${advancedClinicalHTML}
            <div class="weight-input-section" style="${noInputBoxStyle}">
                <label class="weight-input-label">${(requiresWeight || drug.requiresAge) ? esc(t('calc.enterDetails')) : esc(t('calc.noDetails'))}</label>
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
                cartBtn.innerHTML = `<i class="fas fa-plus-circle"></i> ${esc(t('cart.add'))}`;
                cartBtn.style.border = '2px dashed var(--primary-500)';
                cartBtn.style.background = 'var(--primary-50)';
                cartBtn.style.color = 'var(--primary-700)';
            } else {
                State.prescriptionList.push(drug.name);
                cartBtn.innerHTML = `<i class="fas fa-minus-circle"></i> ${esc(t('cart.remove'))}`;
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
            errorDiv.textContent = t('calc.fixErrors'); errorDiv.hidden = false; Utils.vibrate(50); return;
        }
        errorDiv.hidden = true; Utils.vibrate();

        let customConc = null;
        if (hasConcentration) {
            const mgVal = parseFloat(container.querySelector('.conc-mg').value);
            const volVal = parseFloat(container.querySelector('.conc-vol').value);

            if (isNaN(mgVal) || isNaN(volVal) || mgVal <= 0 || volVal <= 0) {
                errorDiv.textContent = t('calc.badConc');
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
                        <div style="font-size: 0.7rem; color: #334155; margin-bottom: 3px;"><strong>${esc(t('iv.rate'))}</strong> ${esc(ivGuide.rate)}</div>
                        <div style="font-size: 0.7rem; color: #334155;"><strong>${esc(t('iv.maxConc'))}</strong> ${esc(ivGuide.maxConc)}</div>
                        ${ivGuide.warning ? `<div style="font-size: 0.65rem; color: #b91c1c; margin-top: 6px; font-weight: 700;"><i class="fas fa-exclamation-triangle"></i> ${esc(t('iv.warning'))} ${esc(ivGuide.warning)}</div>` : ''}
                    </div>
                `;
            }
        }

        let safetyBadge = doseResult.isValid
            ? `<span class="safety-badge safe"><i class="fas fa-check-circle"></i> ${esc(t('badge.noInteraction'))}</span>`
            : (doseResult.severity === 'high'
                ? `<span class="safety-badge dangerous"><i class="fas fa-exclamation-triangle"></i> ${esc(t('badge.caution'))}</span>`
                : `<span class="safety-badge caution"><i class="fas fa-shield-alt"></i> ${esc(t('badge.monitor'))}</span>`);

        resultArea.innerHTML = `
            <div class="calc-final-result ${warningClass}">
                <div class="cfr-header">${esc(t('calc.perDose'))} ${safetyBadge}</div>
                <div class="cfr-amount">${esc(doseResult.displayResult)}</div>
                <div class="cfr-interval">${esc(t('calc.frequency'))} <strong>${esc(Utils.getIntervalText(doseResult.appliedInterval))}</strong></div>
            </div>
            ${calculator.getFormulaHTML(doseResult)}

            <div style="margin-top: 15px;">
                ${patientWarningsHTML}
                ${validationHTML}
                ${drug.warning ? `<div class="drug-warning"><i class="fas fa-exclamation-triangle"></i> ${esc(resolveFa('clinical', drug.warning))}</div>` : ''}
                ${ivHTML}
            </div>

            ${showHomeGuide ? `<div class="drug-home-guide" style="margin-top: 10px;"><div class="home-guide-label">${esc(t('calc.adminGuide'))}</div><div class="home-guide-text">${Utils.generateHomeGuide(drug, minDose, maxDose, doseResult, customConc)}</div></div>` : ''}
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
