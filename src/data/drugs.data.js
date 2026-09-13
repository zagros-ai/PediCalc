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

export const categoriesDB = [
    { id: 'all', name: 'All', nameFa: 'همه', icon: 'fa-layer-group', image: 'assets/categories/all.png' },
    { id: 'syrup', name: 'Syrup', nameFa: 'شربت', icon: 'fa-wine-bottle', image: 'assets/categories/syrup.png' },
    { id: 'drop', name: 'Drop', nameFa: 'قطره', icon: 'fa-tint', image: 'assets/categories/drop.png' },
    { id: 'ampoule', name: 'Ampoule', nameFa: 'آمپول', icon: 'fa-syringe', image: 'assets/categories/ampoule.png' },
    { id: 'tablet', name: 'Tab & Cap', nameFa: 'قرص و کپسول', icon: 'fa-pills', image: 'assets/categories/pill.png' },
    { id: 'powder', name: 'Powder', nameFa: 'پودر', icon: 'fa-box-open', image: 'assets/categories/powder.png' },
    { id: 'suppository', name: 'Suppository', nameFa: 'شیاف', icon: 'fa-capsules', image: 'assets/categories/suppository.png' },
    { id: 'vial', name: 'Vial', nameFa: 'ویال', icon: 'fa-flask', image: 'assets/categories/vial.png' },
    { id: 'inhaler', name: 'Inhaler', nameFa: 'اسپری استنشاقی', icon: 'fa-wind', image: 'assets/categories/inhaler.png' },
    { id: 'ointment', name: 'Ointment', nameFa: 'پماد', icon: 'fa-hand-sparkles', image: 'assets/categories/ointment.png' },
    { id: 'cream', name: 'Cream', nameFa: 'کرم', icon: 'fa-paint-brush', image: 'assets/categories/cream.png' },
    { id: 'gel', name: 'Gel', nameFa: 'ژل', icon: 'fa-flask', image: 'assets/categories/gel.png' },
    { id: 'spray', name: 'Spray', nameFa: 'اسپری', icon: 'fa-spray-can', image: 'assets/categories/spray.png' },
    { id: 'sachet', name: 'Sachet', nameFa: 'ساشه', icon: 'fa-envelope', image: 'assets/categories/sachet.png' }
];

export const drugsDB = [
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
