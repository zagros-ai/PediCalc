// src/data/clinical-rules.data.js
// Pure data module: the clinical rules database (IV guidelines, organ-impairment
// adjustments, cross-allergy classes, drug-interaction matrix, neonatal PMA protocols).
// The behavioural logic that consumes this data lives in src/core/clinical-engine.js.

// ============================================================
//  CLINICAL RULES DATABASE (Comprehensive Local Edition)
// ============================================================
export const ClinicalRulesDB = {

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
            },
            'Esomeprazole': {
                maxConcentration: '8 mg/ml',
                rate: 'Infusion over 10-30 minutes OR slow IV injection over 3 minutes',
                warning: 'Reconstitute only with 0.9% Sodium Chloride, Lactated Ringer\'s, or 5% Dextrose. Use within 12 hours.'
            },
            'Amphotericin B (Conventional)': {
                maxConcentration: '0.1 mg/ml',
                rate: 'Infusion over 2-6 hours',
                warning: 'Pre-medicate to avoid infusion reactions. Highly nephrotoxic.'
            },
            'Labetalol': {
                maxConcentration: '5 mg/ml',
                rate: 'IV push over 2 minutes',
                warning: 'Monitor blood pressure continuously. Patient must be supine.'
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
            'Meropenem': { type: 'renal', warning: 'Adjust dose and interval if GFR < 50 ml/min.' },
            'Esomeprazole': { type: 'hepatic', warning: 'In severe hepatic impairment, do not exceed 20 mg daily.' },
            'Amphotericin B (Conventional)': { type: 'renal', warning: 'Highly nephrotoxic. Requires close monitoring of renal function and electrolytes.' },
            'Albendazole': { type: 'hepatic', warning: 'Monitor liver enzymes closely. Use with caution in patients with hepatic impairment.' },
            'Mebendazole': { type: 'hepatic', warning: 'Metabolized primarily by the liver. Use with caution in significant hepatic impairment.' },
            'Enoxaparin': { type: 'renal', warning: 'Reduce dose or monitor Anti-Xa levels carefully if CrCl < 30 ml/min.' },
            'Sertraline': { type: 'hepatic', warning: 'Use a lower dose or increase dosing interval in hepatic impairment.' },
            'Loperamide': { type: 'hepatic', warning: 'Use with caution in hepatic impairment due to reduced first-pass metabolism.' }
        },

        // 3. Allergy Cross-Reactivity
        crossAllergies: {
            'Penicillin': ['Amoxicillin', 'Ampicillin', 'Co-Amoxiclav', 'Penicillin V', 'Penicillin 6.3.3', 'Penicillin', 'Piperacillin-Tazobactam (Zosyn)', 'Ampicillin-Sulbactam (Unasyn)'],
            'Cephalosporin': ['Cefixime', 'Cephalexin', 'Ceftriaxone', 'Cefazoline', 'Cefotaxime', 'Ceftizoxim', 'Cefdinir', 'Cefuroxime', 'Cefadroxil', 'Ceftazidime', 'Cefepime'],
            'NSAID': ['Ibuprofen', 'Mefenamic Acid', 'Indomethacin', 'Diclofenac', 'Ketorolac', 'Naproxen', 'Celecoxib'],
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
            {
                drugs: ['Itraconazole', 'Ondansetron'],
                severity: 'critical',
                message: 'Critical Risk: Additive QT prolongation leading to life-threatening arrhythmias.'
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
            {
                drugs: ['Esomeprazole', 'Diazepam'],
                severity: 'high',
                message: 'High Risk: Esomeprazole inhibits CYP2C19, decreasing Diazepam clearance and prolonging its effects.'
            },
            {
                drugs: ['Itraconazole', 'Midazolam'],
                severity: 'high',
                message: 'High Risk: Itraconazole strongly inhibits CYP3A4, significantly increasing Midazolam levels and prolonging sedation.'
            },
            {
                drugs: ['Griseofulvin', 'Phenobarbital'],
                severity: 'high',
                message: 'High Risk: Phenobarbital significantly decreases the absorption and serum levels of Griseofulvin.'
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
                drugs: ['Ferrous Sulfate', 'Esomeprazole'],
                severity: 'medium',
                message: 'Moderate Risk: Decreased gastric acidity lowers absorption of elemental iron.'
            },
            {
                drugs: ['Omeprazole', 'Cefuroxime'],
                severity: 'medium',
                message: 'Moderate Risk: Increased gastric pH decreases absorption of oral Cefuroxime.'
            },
            {
                drugs: ['Esomeprazole', 'Cefuroxime'],
                severity: 'medium',
                message: 'Moderate Risk: Increased gastric pH decreases absorption of oral Cefuroxime.'
            },
            {
                drugs: ['Pantoprazole', 'Cefuroxime'],
                severity: 'medium',
                message: 'Moderate Risk: Increased gastric pH decreases absorption of oral Cefuroxime.'
            },
            {
                drugs: ['Esomeprazole', 'Levothyroxine'],
                severity: 'medium',
                message: 'Moderate Risk: PPIs increase gastric pH, which may decrease the absorption of Levothyroxine.'
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
            },

            // ============================================================
            //  NEWLY ADDED INTERACTIONS (Psychiatric, Analgesics, Coagulation)
            // ============================================================
            {
                drugs: ['Tramadol', 'Sertraline'],
                severity: 'critical',
                message: 'Critical Risk: High risk of Serotonin Syndrome and increased seizure risk.'
            },
            {
                drugs: ['Tramadol', 'Fluoxetine'],
                severity: 'critical',
                message: 'Critical Risk: High risk of Serotonin Syndrome and increased seizure risk.'
            },
            {
                drugs: ['Methadone', 'Fluconazole'],
                severity: 'high',
                message: 'High Risk: Fluconazole inhibits methadone metabolism; increased risk of severe respiratory depression and QT prolongation.'
            },
            {
                drugs: ['Sertraline', 'Linezolid'],
                severity: 'critical',
                message: 'Critical Risk: Absolute contraindication. High risk of fatal Serotonin Syndrome.'
            },
            {
                drugs: ['Fluoxetine', 'Linezolid'],
                severity: 'critical',
                message: 'Critical Risk: Absolute contraindication. High risk of fatal Serotonin Syndrome.'
            },
            {
                drugs: ['Enoxaparin', 'Naproxen'],
                severity: 'high',
                message: 'High Risk: Increased risk of severe bleeding and epidural/spinal hematoma.'
            },
            {
                drugs: ['Enoxaparin', 'Ibuprofen'],
                severity: 'high',
                message: 'High Risk: Increased risk of severe bleeding.'
            },
            {
                drugs: ['Enoxaparin', 'Ketorolac'],
                severity: 'critical',
                message: 'Critical Risk: Extremely high risk of major bleeding. Combination is generally contraindicated.'
            },
            {
                drugs: ['Methadone', 'Amiodarone'],
                severity: 'critical',
                message: 'Critical Risk: Additive QT prolongation leading to life-threatening Torsades de Pointes.'
            },
            {
                drugs: ['Clonidine', 'Propranolol'],
                severity: 'high',
                message: 'High Risk: May cause paradoxical hypertension or severe bradycardia. Rebound hypertension upon withdrawal is exacerbated.'
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
