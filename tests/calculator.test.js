// tests/calculator.test.js
// Unit tests for the core dosing engine (DrugDoseCalculator). Runs on Node's
// built-in test runner with zero dependencies:  `npm test`  (i.e. node --test).

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DrugDoseCalculator } from '../src/core/calculator.js';
import { drugsDB } from '../src/data/drugs.data.js';

const findDrug = (name, category) => {
    const d = drugsDB.find(x => x.name === name && (!category || x.category === category));
    if (!d) throw new Error(`Fixture drug not found: ${name} ${category ?? ''}`);
    return d;
};

test('weight-based range: Acetaminophen syrup at 10 kg → 100–150 mg q6h', () => {
    const r = new DrugDoseCalculator(findDrug('Acetaminophen', 'syrup'), 10).calculate();
    assert.equal(r.minDose, 100);
    assert.equal(r.maxDose, 150);
    assert.equal(r.appliedInterval, 6);
    assert.equal(r.displayResult, '100 mg to 150 mg');
});

test('single-value dose (min==max) renders one number, not a range', () => {
    // Cefixime: 4 mg/kg, min==max → single value
    const r = new DrugDoseCalculator(findDrug('Cefixime', 'syrup'), 10).calculate();
    assert.equal(r.minDose, 40);
    assert.equal(r.maxDose, 40);
    assert.equal(r.displayResult, '40 mg');
});

test('maxSingleDoseMg caps the per-dose amount and flags an alert', () => {
    const drug = {
        name: 'TestCapped', form: 'Syrup 100mg/5ml', category: 'syrup',
        minMgPerKg: 50, maxMgPerKg: 50, intervalHours: 8, doseUnit: 'mg',
        // maxDailyDoseMg present so the generic ">1000 mg/day" high-severity rule
        // does not fire; this isolates the per-dose cap behaviour under test.
        maxSingleDoseMg: 500, maxDailyDoseMg: 1500, baseDose: 100, baseVolume: 5
    };
    // 50 mg/kg * 40 kg = 2000 mg, capped to maxSingleDoseMg = 500
    const r = new DrugDoseCalculator(drug, 40).calculate();
    assert.equal(r.minDose, 500);
    assert.equal(r.maxDose, 500);
    assert.equal(r.severity, 'medium');
    assert.ok(r.alerts.some(a => /Capped at 500/.test(a)));
});

test('maxDailyDoseMg caps daily dose and per-dose ceiling', () => {
    // Acetaminophen at 100 kg: 10-15 mg/kg but maxSingleDoseMg 1000 and maxDailyDoseMg 4000, q6h
    const r = new DrugDoseCalculator(findDrug('Acetaminophen', 'syrup'), 100).calculate();
    assert.ok(r.dailyMax <= 4000, `dailyMax ${r.dailyMax} should be capped to 4000`);
    // 4 doses/day → per-dose ceiling 1000
    assert.ok(r.maxDose <= 1000);
});

test('fixed age-based dose selects the correct tier', () => {
    // Cetirizine syrup: ageDoses tiers; age 3 → 2.5 to 5 mg
    const drug = findDrug('Cetirizine', 'syrup');
    const r = new DrugDoseCalculator(drug, 0, 3).calculate();
    assert.equal(r.isFixedDose, true);
    assert.equal(r.minDose, 2.5);
    assert.equal(r.maxDose, 5);
    assert.equal(r.calculatedFixedDose, '2.5 to 5 mg');
});

test('age below ageAlert threshold raises the configured alert', () => {
    const drug = findDrug('Loratadine', 'syrup'); // ageAlert under 2 years, severity high
    const r = new DrugDoseCalculator(drug, 0, 1).calculate();
    assert.equal(r.severity, 'high');
    assert.ok(r.alerts.some(a => /under 2 years/i.test(a)));
});

test('topical drugs return their fixed instruction', () => {
    const drug = findDrug('Mupirocin', 'ointment');
    const r = new DrugDoseCalculator(drug, 10).calculate();
    assert.equal(r.isFixedDose, true);
    assert.equal(r.displayResult, 'Apply thin layer');
});

test('unit formatting: mcg drug formats in mcg', () => {
    const drug = {
        name: 'TestMcg', form: 'Ampoule', category: 'ampoule',
        minMgPerKg: 1, maxMgPerKg: 2, intervalHours: 0, doseUnit: 'mcg', baseDose: 50, baseVolume: 1
    };
    const r = new DrugDoseCalculator(drug, 10).calculate();
    assert.equal(r.displayResult, '10 mcg to 20 mcg');
});

test('unit formatting: Units drug uses toLocaleString + Units label', () => {
    const drug = findDrug('Penicillin', 'vial'); // 25000-40000 Units/kg
    const r = new DrugDoseCalculator(drug, 10).calculate();
    assert.match(r.displayResult, /Units/);
    assert.equal(r.minDose, 250000);
    assert.equal(r.maxDose, 400000);
});

test('gram conversion: doses ≥ 1000 mg display in grams', () => {
    const drug = {
        name: 'TestGram', form: 'Vial', category: 'vial',
        minMgPerKg: 100, maxMgPerKg: 100, intervalHours: 12, doseUnit: 'mg',
        highDoseSafe: true, baseDose: 1000
    };
    const r = new DrugDoseCalculator(drug, 20).calculate(); // 2000 mg
    assert.equal(r.displayResult, '2.0 g');
});

test('contraindication triggers on low weight (Ibuprofen < 6 kg)', () => {
    const r = new DrugDoseCalculator(findDrug('Ibuprofen', 'syrup'), 5).calculate();
    assert.equal(r.severity, 'high');
    assert.ok(r.alerts.some(a => /contraindicated/i.test(a)));
});

test('drug interaction is detected via active prescriptions', () => {
    // Ceftriaxone + Calcium Gluconate = critical
    const r = new DrugDoseCalculator(
        findDrug('Ceftriaxone', 'vial'), 10, 5, null, null,
        { activePrescriptions: ['Calcium Gluconate'] }
    ).calculate();
    assert.equal(r.severity, 'high');
    assert.ok(r.alerts.some(a => /Critical Interaction with Calcium Gluconate/.test(a)));
});

test('allergy cross-reactivity flags penicillin-class drugs', () => {
    const r = new DrugDoseCalculator(
        findDrug('Amoxicillin', 'syrup'), 10, 5, null, null,
        { allergies: ['Penicillin'] }
    ).calculate();
    assert.equal(r.severity, 'high');
    assert.ok(r.alerts.some(a => /allergic to Penicillin/.test(a)));
});

test('neonatal PMA protocol overrides dose and interval for injectables', () => {
    // Gentamicin ampoule, PMA 28 → dose 5 mg/kg, interval 48h
    const drug = findDrug('Gentamicin', 'ampoule');
    const r = new DrugDoseCalculator(drug, 3, null, null, null, { pmaVal: 28 }).calculate();
    assert.equal(r.appliedInterval, 48);
    assert.equal(r.minDose, 15); // 5 mg/kg * 3 kg
    assert.equal(r.maxDose, 15);
    assert.ok(r.warnings.some(w => /NICU protocol/.test(w)));
});

test('hydrophilic drug in obesity uses Adjusted Body Weight', () => {
    // Gentamicin (hydrophilic). Height 100cm → IBW = 100*100*1.65/1000 = 16.5 kg.
    // Weight 40 kg > 1.2*16.5(19.8) → AdjBW = 16.5 + 0.4*(40-16.5) = 25.9
    const drug = findDrug('Gentamicin', 'ampoule');
    const r = new DrugDoseCalculator(drug, 40, null, null, null, {}, 100).calculate();
    assert.equal(r.severity, 'high');
    assert.ok(r.alerts.some(a => /Adjusted Body Weight/.test(a)));
    assert.ok(r.warnings.some(w => /Ideal Body Weight/.test(w)));
});

test('selected indication overrides base dose parameters', () => {
    const drug = findDrug('Amoxicillin', 'syrup');
    const highDose = drug.indicationDoses.find(i => /AOM|High Dose/i.test(i.name));
    const r = new DrugDoseCalculator(drug, 10, null, null, highDose).calculate();
    assert.equal(r.appliedInterval, highDose.intervalHours);
    assert.equal(r.minDose, highDose.minMgPerKg * 10);
});

test('custom concentration does not change mg dose (only volume)', () => {
    const drug = findDrug('Acetaminophen', 'syrup');
    const r = new DrugDoseCalculator(drug, 10, null, /* customConc */ 24).calculate();
    // mg dose unchanged by concentration
    assert.equal(r.minDose, 100);
    assert.equal(r.maxDose, 150);
    // formula HTML should include a volume line
    assert.match(drug ? new DrugDoseCalculator(drug, 10, null, 24).getFormulaHTML(r) : '', /Volume to Administer/);
});
