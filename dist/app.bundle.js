// dist/app.bundle.js — GENERATED FILE, DO NOT EDIT BY HAND.
// Built from the src/ ES modules by build/bundle.mjs for the Android WebView
// (a classic, non-module script that runs from file:///android_asset/).
// To regenerate:  node build/bundle.mjs

(function () {
    'use strict';

    // ===== src/core/i18n.js =====
    // src/core/i18n.js
    // Lightweight, dependency-free internationalization (i18n) for PediCalc.
    //
    // - Two languages: 'en' (default) and 'fa' (Persian, RTL).
    // - UI strings live in the STRINGS dictionary below, keyed by a dotted id.
    // - Data-attached translations (drug names, clinical messages, ...) are NOT
    //   here; they live next to their data as `*Fa` fields and are resolved with
    //   `localized()` so English is always a safe fallback.
    // - Units and formula math tokens are intentionally NOT translated.
    //
    // Usage:
    //   import { t, getLang, setLang, onLangChange, localized, applyLanguage } from './i18n.js';
    //   t('search.placeholder')                 -> current-language UI string
    //   t('cart.count', { n: 3 })               -> with interpolation
    //   localized(drug, 'name')                 -> drug.nameFa (fa) or drug.name (fallback)

    const STORAGE_KEY = 'pedicalc_lang';
    const DEFAULT_LANG = 'en';
    const SUPPORTED = ['en', 'fa'];

    // The app ALWAYS starts in English on launch (product decision). The user can
    // switch to Persian during the session via the toggle; that choice is not
    // restored on the next launch — every fresh start begins in English.
    let currentLang = DEFAULT_LANG;
    const listeners = new Set();

    // ============================================================
    //  UI STRING DICTIONARY  (en is the source of truth / fallback)
    // ============================================================
    const STRINGS = {
        // Brand / header
        'app.title':            { en: 'PediCalc - Pediatric Dose Calculator', fa: 'پدی‌کلک - محاسبه‌گر دوز کودکان' },
        'app.description':      { en: 'PediCalc - Pediatric Drug Dose Calculator', fa: 'پدی‌کلک - محاسبه‌گر دوز داروی کودکان' },
        'header.menu':          { en: 'Menu', fa: 'منو' },
        'header.lang':          { en: 'فارسی', fa: 'English' }, // label shows the OTHER language to switch to
        'header.langAria':      { en: 'Switch to Persian', fa: 'تغییر به انگلیسی' },

        // Categories section
        'categories.title':     { en: 'Drug Categories', fa: 'دسته‌بندی داروها' },
        'categories.loading':   { en: 'Loading...', fa: 'در حال بارگذاری...' },

        // Search
        'search.label':         { en: 'Search drugs', fa: 'جستجوی داروها' },
        'search.placeholder':   { en: 'Search drug name, indication, or form...', fa: 'جستجوی نام دارو، اندیکاسیون یا شکل دارویی...' },
        'search.clear':         { en: 'Clear search', fa: 'پاک کردن جستجو' },

        // Drug list
        'drugs.title':          { en: 'Select Drug', fa: 'انتخاب دارو' },
        'drugs.count':          { en: '{n} Drugs', fa: '{n} دارو' },
        'drugs.items':          { en: '{n} items', fa: '{n} مورد' },
        'drugs.none.title':     { en: 'No Drug Found', fa: 'دارویی یافت نشد' },
        'drugs.none.body':      { en: 'Please change the category or search term.', fa: 'لطفاً دسته‌بندی یا عبارت جستجو را تغییر دهید.' },
        'drugs.calculate':      { en: 'Calculate Dose', fa: 'محاسبه دوز' },
        'drugs.unlock':         { en: 'Unlock / Activate', fa: 'قفل / فعال‌سازی' },
        'drugs.closeCalc':      { en: 'Close Calculator', fa: 'بستن محاسبه‌گر' },
        'drugs.close':          { en: 'Close', fa: 'بستن' },

        // Calculator panel
        'calc.baseDose':        { en: 'Base Dose:', fa: 'دوز پایه:' },
        'calc.standardOrAge':   { en: 'Standard or Age-based', fa: 'استاندارد یا بر اساس سن' },
        'calc.concentration':   { en: 'Concentration:', fa: 'غلظت:' },
        'calc.per':             { en: 'per', fa: 'در' },
        'calc.selectIndication':{ en: 'Select Clinical Indication:', fa: 'انتخاب اندیکاسیون بالینی:' },
        'calc.enterDetails':    { en: 'Enter patient details:', fa: 'اطلاعات بیمار را وارد کنید:' },
        'calc.noDetails':       { en: 'No patient details required:', fa: 'نیازی به اطلاعات بیمار نیست:' },
        'calc.weight':          { en: 'Weight (kg)', fa: 'وزن (کیلوگرم)' },
        'calc.height':          { en: 'Height (cm) - Optional', fa: 'قد (سانتی‌متر) - اختیاری' },
        'calc.age':             { en: 'Age in years (e.g., 0.08 for 1 mo)', fa: 'سن به سال (مثلاً ۰.۰۸ برای ۱ ماه)' },
        'calc.showInstructions':{ en: 'Show Instructions', fa: 'نمایش دستورالعمل' },
        'calc.perDose':         { en: 'Per Dose Amount:', fa: 'مقدار هر دوز:' },
        'calc.frequency':       { en: 'Frequency:', fa: 'دفعات مصرف:' },
        'calc.adminGuide':      { en: 'Administration Guide', fa: 'راهنمای تجویز' },
        'calc.fixErrors':       { en: 'Please fix the errors above.', fa: 'لطفاً خطاهای بالا را برطرف کنید.' },
        'calc.badConc':         { en: 'Please enter valid positive numbers for concentration.', fa: 'لطفاً برای غلظت اعداد مثبت معتبر وارد کنید.' },

        // Advanced clinical settings
        'adv.title':            { en: 'Advanced Clinical Settings', fa: 'تنظیمات بالینی پیشرفته' },
        'adv.pma':              { en: 'Post Menstrual Age (PMA) - Neonates (weeks):', fa: 'سن پس از قاعدگی (PMA) - نوزادان (هفته):' },
        'adv.pmaHint':          { en: '(Gestational Age at birth + Chronological Age)', fa: '(سن بارداری هنگام تولد + سن تقویمی)' },
        'adv.pmaPlaceholder':   { en: 'e.g., 32', fa: 'مثلاً ۳۲' },
        'adv.renal':            { en: 'Renal Impairment', fa: 'نارسایی کلیوی' },
        'adv.hepatic':          { en: 'Hepatic Impairment', fa: 'نارسایی کبدی' },
        'adv.allergies':        { en: 'Patient Allergies:', fa: 'آلرژی‌های بیمار:' },
        'adv.penicillins':      { en: 'Penicillins', fa: 'پنی‌سیلین‌ها' },
        'adv.cephalosporins':   { en: 'Cephalosporins', fa: 'سفالوسپورین‌ها' },
        'adv.nsaids':           { en: 'NSAIDs', fa: 'ان‌سایدها (NSAID)' },
        'adv.macrolides':       { en: 'Macrolides', fa: 'ماکرولیدها' },

        // Cart / active prescriptions
        'cart.add':             { en: 'Add to Active Prescription (Check Interactions)', fa: 'افزودن به نسخه فعال (بررسی تداخلات)' },
        'cart.remove':          { en: 'Remove from Active Prescription', fa: 'حذف از نسخه فعال' },
        'cart.active':          { en: 'Active Prescriptions ({n})', fa: 'نسخه‌های فعال ({n})' },
        'cart.autocheck':       { en: '* Interactions will be checked automatically for these drugs.', fa: '* تداخلات این داروها به‌صورت خودکار بررسی می‌شود.' },

        // Safety badges
        'badge.noInteraction':  { en: 'No Known Interaction', fa: 'بدون تداخل شناخته‌شده' },
        'badge.caution':        { en: 'Caution', fa: 'احتیاط' },
        'badge.monitor':        { en: 'Monitor', fa: 'پایش' },

        // IV guideline block
        'iv.title':             { en: 'IV Infusion Guidelines', fa: 'دستورالعمل انفوزیون وریدی' },
        'iv.rate':              { en: 'Infusion Rate:', fa: 'سرعت انفوزیون:' },
        'iv.maxConc':           { en: 'Max Concentration:', fa: 'حداکثر غلظت:' },
        'iv.warning':           { en: 'Warning:', fa: 'هشدار:' },

        // Formula box
        'formula.title':        { en: 'Formula:', fa: 'فرمول:' },
        'formula.volume':       { en: 'Volume to Administer:', fa: 'حجم قابل تجویز:' },
        // Kept in English on purpose: this label sits inside the LTR formula box
        // next to English units/numbers, per product decision.
        'formula.dailyMax':     { en: 'Daily Max:', fa: 'Daily Max:' },
        'formula.fixedDesc':    { en: 'Age-based, Topical, or Standard Dose', fa: 'دوز بر اساس سن، موضعی یا استاندارد' },
        'formula.capped':       { en: '(Capped)', fa: '(محدودشده)' },

        // Home guide fallbacks
        'guide.asPrescribed':   { en: 'Use as prescribed by physician.', fa: 'طبق دستور پزشک مصرف شود.' },
        'guide.concZero':       { en: 'Error: Concentration cannot be zero.', fa: 'خطا: غلظت نمی‌تواند صفر باشد.' },

        // Intervals
        'interval.single':      { en: 'Single Dose / As needed', fa: 'دوز منفرد / در صورت نیاز' },
        'interval.hours':       { en: 'Every {h} hours', fa: 'هر {h} ساعت' },

        // Volume unit for the administration guide (translated in fa so the whole
        // guide line reads cleanly right-to-left without Latin/RTL scrambling).
        'unit.ml':              { en: 'ml', fa: 'میلی‌لیتر' },

        // Dose units — localized so the per-dose amount reads cleanly in Persian
        // (unit written once, in Persian: e.g. «۱۲۰ تا ۱۸۰ میلی‌گرم»).
        'unit.mg':              { en: 'mg', fa: 'میلی‌گرم' },
        'unit.g':               { en: 'g', fa: 'گرم' },
        'unit.mcg':             { en: 'mcg', fa: 'میکروگرم' },
        'unit.meq':             { en: 'mEq', fa: 'میلی‌اکی‌والان' },
        'unit.units':           { en: 'Units', fa: 'واحد' },

        // Per-kilogram base-dose units (shown under "Base Dose"), localized in fa.
        'unitkg.mg':            { en: 'mg/kg', fa: 'میلی‌گرم بر کیلوگرم' },
        'unitkg.g':             { en: 'g/kg', fa: 'گرم بر کیلوگرم' },
        'unitkg.mcg':           { en: 'mcg/kg', fa: 'میکروگرم بر کیلوگرم' },
        'unitkg.meq':           { en: 'mEq/kg', fa: 'میلی‌اکی‌والان بر کیلوگرم' },
        'unitkg.units':         { en: 'Units/kg', fa: 'واحد بر کیلوگرم' },

        // Help / App Guide modal
        'help.title':           { en: 'App Guide', fa: 'راهنمای برنامه' },
        'help.item1.title':     { en: 'Scientific Pediatric Dosing', fa: 'دوزبندی علمی کودکان' },
        'help.item1.body':      { en: 'Doses are calculated based on the latest pediatric references (Nelson) and accurate patient weight and age.', fa: 'دوزها بر اساس جدیدترین مراجع کودکان (نلسون) و وزن و سن دقیق بیمار محاسبه می‌شوند.' },
        'help.item2.title':     { en: 'Transparent Calculations', fa: 'محاسبات شفاف' },
        'help.item2.body':      { en: 'The exact calculation formula is displayed for each patient to ensure accuracy of values.', fa: 'فرمول دقیق محاسبه برای هر بیمار نمایش داده می‌شود تا از صحت مقادیر اطمینان حاصل شود.' },
        'help.item3.title':     { en: 'Dropdown Mode', fa: 'حالت کشویی' },
        'help.item3.body':      { en: 'Click the calculate dose button to open the calculator directly under the selected drug.', fa: 'روی دکمه محاسبه دوز بزنید تا محاسبه‌گر دقیقاً زیر داروی انتخاب‌شده باز شود.' },

        // Premium modal
        'premium.title':        { en: 'PediCalc Premium', fa: 'نسخه ویژه PediCalc' },
        'premium.subtitle':     { en: 'Unlimited access to all clinical features', fa: 'دسترسی نامحدود به تمامی امکانات بالینی' },
        'premium.feat1':        { en: 'Access to all locked drugs', fa: 'دسترسی به تمامی داروهای قفل شده' },
        'premium.feat2':        { en: 'Smart drug-interaction checking', fa: 'بررسی هوشمند تداخلات دارویی' },
        'premium.feat3':        { en: 'Preterm neonate settings (PMA)', fa: 'تنظیمات نوزادان نارس (PMA)' },
        'premium.feat4':        { en: 'Dose adjustment in renal & hepatic impairment', fa: 'تنظیم دوز در نارسایی کلیوی و کبدی' },
        'premium.buy':          { en: 'Activate & Purchase', fa: 'فعال‌سازی و خرید' },
        'premium.securePay':    { en: 'Secure payment via Cafebazaar', fa: 'پرداخت امن از طریق کافه‌بازار' },

        // Side nav
        'nav.terms':            { en: 'Terms & Disclaimer', fa: 'شرایط و سلب مسئولیت' },
        'nav.about':            { en: 'About Us', fa: 'درباره ما' },
        'nav.contact':          { en: 'Contact Us', fa: 'تماس با ما' },
        'nav.closeMenu':        { en: 'Close Menu', fa: 'بستن منو' },

        // Dynamic clinical templates (calculator.js). {..} are interpolated at call time.
        'dyn.nicu':             { en: 'Based on NICU protocol (PMA {pma} weeks), ', fa: 'بر اساس پروتکل NICU (PMA {pma} هفته)، ' },
        'dyn.nicuDoseInterval': { en: 'dose adjusted to {dose} mg/kg and interval to every {interval} hours.', fa: 'دوز به {dose} mg/kg و فاصله به هر {interval} ساعت تنظیم شد.' },
        'dyn.nicuInterval':     { en: 'dose interval adjusted to every {interval} hours.', fa: 'فاصله دوز به هر {interval} ساعت تنظیم شد.' },
        'dyn.renalAdjust':      { en: 'Requires Renal Dose Adjustment', fa: 'نیاز به تنظیم دوز کلیوی' },
        'dyn.hepaticAdjust':    { en: 'Requires Hepatic Dose Adjustment', fa: 'نیاز به تنظیم دوز کبدی' },
        'dyn.critInteraction':  { en: 'Critical Interaction with {drug}:', fa: 'تداخل بحرانی با {drug}:' },
        'dyn.majorInteraction': { en: 'Major Interaction with {drug}:', fa: 'تداخل عمده با {drug}:' },
        'dyn.interaction':      { en: 'Interaction with {drug}:', fa: 'تداخل با {drug}:' },
        'dyn.recommend':        { en: 'Recommendation: {form} is more suitable for {drug}.', fa: 'توصیه: {form} برای {drug} مناسب‌تر است.' },
        'dyn.maxDaily':         { en: ' (Max daily: {max} {unit})', fa: ' (حداکثر روزانه: {max} {unit})' },
        'dyn.ibwWarn':          { en: "Patient's actual weight is >120% of Ideal Body Weight ({ibw} kg).", fa: 'وزن واقعی بیمار بیش از ۱۲۰٪ وزن ایده‌آل بدن ({ibw} kg) است.' },
        'dyn.adjbw':            { en: 'Hydrophilic Drug in Obesity:', fa: 'داروی آبدوست در چاقی:' },
        'dyn.adjbwBody':        { en: ' Dose calculated based on Adjusted Body Weight (AdjBW = {w} kg) to prevent toxicity/underdosing.', fa: ' دوز بر اساس وزن تعدیل‌شده بدن (AdjBW = {w} kg) محاسبه شد تا از سمیت/کم‌دوزی جلوگیری شود.' },
        'dyn.capped':           { en: 'Dose exceeded absolute adult max. Capped at {max} {unit}/dose.', fa: 'دوز از حداکثر مطلق بزرگسالان فراتر رفت. به {max} {unit} در هر دوز محدود شد.' },
        'dyn.dailyCapped':      { en: 'Calculated daily dose (Weight &times; {unit}/kg) was {orig} {unit}. It has been capped to the adult maximum limit of {max} {unit}. Please review administration frequency.', fa: 'دوز روزانه محاسبه‌شده (وزن &times; {unit}/kg) برابر {orig} {unit} بود. به حداکثر مجاز بزرگسالان یعنی {max} {unit} محدود شد. لطفاً دفعات تجویز را بازبینی کنید.' },
        'dyn.highDaily':        { en: 'Daily dose ({daily} {unit}) is generally high, verify with max daily allowance.', fa: 'دوز روزانه ({daily} {unit}) عموماً بالاست، با حداکثر مجاز روزانه بررسی کنید.' },
        'dyn.applyThin':        { en: 'Apply thin layer', fa: 'لایه نازک بمالید' },

        // Allergy sentences (clinical-engine.js)
        'allergy.absolute':     { en: 'Absolute Contraindication! Patient is allergic to {class} class.', fa: 'منع مصرف مطلق! بیمار به دسته {class} حساسیت دارد.' },
        'allergy.penToCeph':    { en: 'Caution: Patient is allergic to Penicillin. There is a 3-5% risk of cross-reactivity with Cephalosporins ({drug}).', fa: 'احتیاط: بیمار به پنی‌سیلین حساسیت دارد. خطر ۳ تا ۵ درصدی واکنش متقاطع با سفالوسپورین‌ها ({drug}) وجود دارد.' },
        'allergy.cephToPen':    { en: 'Caution: Patient is allergic to Cephalosporins. There is a risk of cross-reactivity with Penicillins ({drug}).', fa: 'احتیاط: بیمار به سفالوسپورین‌ها حساسیت دارد. خطر واکنش متقاطع با پنی‌سیلین‌ها ({drug}) وجود دارد.' },

        // Validation messages (validation.js)
        'val.weightRequired':   { en: 'Please enter the weight.', fa: 'لطفاً وزن را وارد کنید.' },
        'val.weightPositive':   { en: 'Weight must be a valid positive number.', fa: 'وزن باید یک عدد مثبت معتبر باشد.' },
        'val.weightTooLow':     { en: 'Weight is too low (minimum 0.5 kg).', fa: 'وزن بسیار پایین است (حداقل ۰.۵ کیلوگرم).' },
        'val.weightTooHigh':    { en: 'Weight is too high (maximum 150 kg).', fa: 'وزن بسیار بالاست (حداکثر ۱۵۰ کیلوگرم).' },
        'val.neonatalPrecision':{ en: 'Neonatal weight (<2.5kg) requires extreme precision.', fa: 'وزن نوزادی (<۲.۵ کیلوگرم) نیازمند دقت بسیار بالاست.' },
        'val.aboveAdult':       { en: 'Weight above 35kg - patient may be adolescent or adult.', fa: 'وزن بالای ۳۵ کیلوگرم - بیمار ممکن است نوجوان یا بزرگسال باشد.' },
        'val.ageRequired':      { en: 'Please enter the age (this drug requires age).', fa: 'لطفاً سن را وارد کنید (این دارو نیازمند سن است).' },
        'val.agePositive':      { en: 'Age must be a valid positive number.', fa: 'سن باید یک عدد مثبت معتبر باشد.' },
        'val.ageTooHigh':       { en: 'Age above 18 years - this drug is for children.', fa: 'سن بالای ۱۸ سال - این دارو برای کودکان است.' },
        'val.ageUnder6mo':      { en: 'Age under 6 months - requires physician consultation.', fa: 'سن زیر ۶ ماه - نیازمند مشورت با پزشک است.' },
        'val.heightPositive':   { en: 'Height must be a valid positive number.', fa: 'قد باید یک عدد مثبت معتبر باشد.' },
        'val.heightRange':      { en: 'Height must be between 30 and 250 cm.', fa: 'قد باید بین ۳۰ تا ۲۵۰ سانتی‌متر باشد.' },
        'val.weightVeryLow':    { en: 'Weight entered is very low! Please recheck.', fa: 'وزن واردشده بسیار پایین است! لطفاً بازبینی کنید.' },

        // Recommended-form messages
        'form.dropBetter':      { en: 'For infants, drop or suspension form is more suitable.', fa: 'برای شیرخواران، شکل قطره یا سوسپانسیون مناسب‌تر است.' },
        'form.syrupBetter':     { en: 'For older children, syrup form is more convenient.', fa: 'برای کودکان بزرگ‌تر، شکل شربت راحت‌تر است.' },
        'form.drop':            { en: 'Drop', fa: 'قطره' },
        'form.syrup':           { en: 'Syrup', fa: 'شربت' }
    };

    /** Interpolate {token} placeholders in a template with values from `vars`. */
    function interpolate(template, vars) {
        if (!vars) return template;
        return template.replace(/\{(\w+)\}/g, (m, key) => (key in vars ? String(vars[key]) : m));
    }

    /**
     * Join a low/high range with the language-appropriate word: "to" (en) / "تا" (fa).
     * The numeric parts stay as given; only the connecting word is localized.
     */
    function joinRange(low, high) {
        const sep = currentLang === 'fa' ? 'تا' : 'to';
        return `${low} ${sep} ${high}`;
    }

    /** Current language code ('en' | 'fa'). */
    function getLang() {
        return currentLang;
    }

    /** Whether the current language is right-to-left. */
    function isRTL() {
        return currentLang === 'fa';
    }

    /**
     * Translate a UI string key. Falls back to English, then to the key itself.
     * @param {string} key dotted key from STRINGS
     * @param {Record<string, unknown>} [vars] interpolation values
     */
    function t(key, vars) {
        const entry = STRINGS[key];
        if (!entry) return key;
        const template = entry[currentLang] ?? entry.en ?? key;
        return interpolate(template, vars);
    }

    /**
     * Resolve a per-record localized field. For language 'fa' it prefers
     * `record[field + 'Fa']`; otherwise (or if missing) it returns `record[field]`.
     * This keeps English as a guaranteed fallback for any untranslated data.
     */
    function localized(record, field) {
        if (!record) return '';
        if (currentLang === 'fa') {
            const faVal = record[field + 'Fa'];
            if (faVal !== undefined && faVal !== null && faVal !== '') return faVal;
        }
        return record[field];
    }

    /** Register a callback fired whenever the language changes. Returns an unsubscribe fn. */
    function onLangChange(cb) {
        listeners.add(cb);
        return () => listeners.delete(cb);
    }

    /** Apply <html> lang/dir for the current language (call once on boot and on change). */
    function applyLanguage() {
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.lang = currentLang;
            document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
        }
    }

    /** Set the active language, persist it, apply dir/lang, and notify listeners. */
    function setLang(lang) {
        if (!SUPPORTED.includes(lang) || lang === currentLang) return;
        currentLang = lang;
        try {
            if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
        } catch { /* ignore */ }
        applyLanguage();
        listeners.forEach(cb => {
            try { cb(lang); } catch { /* a bad listener must not break others */ }
        });
    }

    /** Toggle between English and Persian. */
    function toggleLang() {
        setLang(currentLang === 'en' ? 'fa' : 'en');
    }

    // Expose a tiny global for the bundle / WebView bridge and quick debugging.
    if (typeof window !== 'undefined') {
        window.PediCalcI18n = { t, getLang, setLang, toggleLang, localized, onLangChange, applyLanguage, isRTL };
    }

    // ===== src/data/translations.fa.js =====
    // src/data/translations.fa.js
    // Persian (fa) translations for DATA strings that live in the drug/clinical
    // databases: drug names, dosage forms hints, indications, indication-dose
    // labels, and clinical/interaction/IV/adjustment messages.
    //
    // Kept separate from the (English) source data so the large data files stay
    // untouched and every Persian string is reviewable in one place. Lookups are
    // keyed by the exact English source string; anything missing here falls back
    // to English automatically (see resolveFa()).
    //
    // ⚠️ Clinical accuracy of these translations must be verified by a qualified
    // professional. Units, numbers and formula tokens are intentionally NOT here.

    // --- Drug names (transliterated per common Iranian pharmacy usage) ---
    const DRUG_NAME_FA = {
        'Acetaminophen': 'استامینوفن',
        'Acetaminophen (Apotel)': 'استامینوفن (آپوتل)',
        'Acetylcysteine': 'استیل‌سیستئین',
        'Activated Charcoal': 'زغال فعال',
        'Acyclovir': 'آسیکلوویر',
        'Adenosine': 'آدنوزین',
        'Aloe Vera': 'آلوئه‌ورا',
        'Amikacin': 'آمیکاسین',
        'Amiodarone': 'آمیودارون',
        'Amoxicillin': 'آموکسی‌سیلین',
        'Ampicillin': 'آمپی‌سیلین',
        'Ampicillin-Sulbactam (Unasyn)': 'آمپی‌سیلین-سولباکتام (یوناسین)',
        'Atropine': 'آتروپین',
        'Azithromycin': 'آزیترومایسین',
        'Beclomethasone': 'بکلومتازون',
        'Betamethasone': 'بتامتازون',
        'Betamethasone LA': 'بتامتازون LA',
        'Bisacodyl': 'بیزاکودیل',
        'Bromhexine': 'برم‌هگزین',
        'Budesonide': 'بودزوناید',
        'Budesonide (Pulmicort)': 'بودزوناید (پولمیکورت)',
        'Calcium (as Carbonate/Glubionate)': 'کلسیم (کربنات/گلوبیونات)',
        'Calcium Gluconate': 'کلسیم گلوکونات',
        'Carbamazepine': 'کاربامازپین',
        'Cefadroxil': 'سفادروکسیل',
        'Cefazoline': 'سفازولین',
        'Cefdinir': 'سفدینیر',
        'Cefepime': 'سفپیم',
        'Cefixime': 'سفیکسیم',
        'Cefotaxime': 'سفوتاکسیم',
        'Ceftazidime': 'سفتازیدیم',
        'Ceftizoxim': 'سفتیزوکسیم',
        'Ceftriaxone': 'سفتریاکسون',
        'Cefuroxime': 'سفوروکسیم',
        'Cephalexin': 'سفالکسین',
        'Cetirizine': 'ستیریزین',
        'Chloral Hydrate': 'کلرال هیدرات',
        'Chloramphenicol': 'کلرامفنیکل',
        'Chlorpheniramine': 'کلرفنیرامین',
        'Cimetidine': 'سایمتیدین',
        'Ciprofloxacin': 'سیپروفلوکساسین',
        'Clarithromycin': 'کلاریترومایسین',
        'Clindamycin': 'کلیندامایسین',
        'Clobazam': 'کلوبازام',
        'Clobutinol': 'کلوبوتینول',
        'Clonazepam': 'کلونازپام',
        'Clotrimazole': 'کلوتریمازول',
        'Co-Amoxiclav': 'کو-آموکسی‌کلاو',
        'Co-trimoxazole': 'کوتریموکسازول',
        'Colistin (Colistimethate)': 'کلیستین (کلیستی‌متات)',
        'Desloratadine': 'دسلوراتادین',
        'Dexamethasone': 'دگزامتازون',
        'Dextromethorphan': 'دکسترومتورفان',
        'Diazepam': 'دیازپام',
        'Diclofenac': 'دیکلوفناک',
        'Dicyclomine': 'دی‌سیکلومین',
        'Dimeticon': 'دی‌متیکون',
        'Diphenhydramine': 'دیفن‌هیدرامین',
        'Domperidone': 'دومپریدون',
        'Doxycycline': 'داکسی‌سایکلین',
        'Epinephrine': 'اپی‌نفرین',
        'Epinephrine (L-Epi)': 'اپی‌نفرین (L-Epi)',
        'Epinephrine Auto-injector': 'اپی‌نفرین اتوانژکتور',
        'Erythromycin': 'اریترومایسین',
        'Famotidine': 'فاموتیدین',
        'Fentanyl': 'فنتانیل',
        'Ferrous Sulfate': 'سولفات فروس (آهن)',
        'Fexofenadine': 'فکسوفنادین',
        'Fluconazole': 'فلوکونازول',
        'Flumazenil': 'فلومازنیل',
        'Fluticasone': 'فلوتیکازون',
        'Fluticasone/Salmeterol (Seretide)': 'فلوتیکازون/سالمترول (سرتاید)',
        'Furazolidone': 'فورازولیدون',
        'Furosemide': 'فوروزماید',
        'Gabapentin': 'گاباپنتین',
        'Gentamicin': 'جنتامایسین',
        'Guaifenesin': 'گوایفنزین',
        'Hydrocortisone': 'هیدروکورتیزون',
        'Hydroxyzine': 'هیدروکسی‌زین',
        'Hyoscine (Buscopan)': 'هیوسین (بوسکوپان)',
        'Hypertonic Saline 3%': 'سالین هایپرتونیک ۳٪',
        'IVIG': 'ایمونوگلوبولین وریدی (IVIG)',
        'Ibuprofen': 'ایبوپروفن',
        'Imipenem/Cilastatin': 'ایمی‌پنم/سیلاستاتین',
        'Indomethacin': 'ایندومتاسین',
        'Ipratropium': 'ایپراتروپیوم',
        'Ipratropium Bromide': 'ایپراتروپیوم بروماید',
        'Iron Polymaltose': 'آهن پلی‌مالتوز',
        'Ketamine': 'کتامین',
        'Ketorolac': 'کتورولاک',
        'Ketotifen': 'کتوتیفن',
        'Kidylact': 'کیدی‌لاکت',
        'Lactulose': 'لاکتولوز',
        'Levetiracetam (Keppra)': 'لِوِتیراستام (کپرا)',
        'Levothyroxine': 'لووتیروکسین',
        'Lidocaine': 'لیدوکائین',
        'Linezolid': 'لینزولید',
        'Liposomal Iron (e.g. Sidereal)': 'آهن لیپوزومال (مثل سیدرال)',
        'Loratadine': 'لوراتادین',
        'Lorazepam': 'لورازپام',
        'Magnesium Sulfate': 'سولفات منیزیم',
        'Mefenamic Acid': 'مفنامیک اسید',
        'Meropenem': 'مروپنم',
        'Methylphenidate': 'متیل‌فنیدیت',
        'Methylprednisolone': 'متیل‌پردنیزولون',
        'Metoclopramide': 'متوکلوپرامید',
        'Metronidazole': 'مترونیدازول',
        'Miconazole': 'میکونازول',
        'Midazolam': 'میدازولام',
        'Montelukast': 'مونته‌لوکاست',
        'Morphine': 'مورفین',
        'Mupirocin': 'موپیروسین',
        'Naloxone': 'نالوکسان',
        'Nitrofurantoin': 'نیتروفورانتوئین',
        'Nystatin': 'نیستاتین',
        'ORS': 'او‌آر‌اس (ORS)',
        'Omeprazole': 'امپرازول',
        'Ondansetron': 'اوندانسترون',
        'Oseltamivir (Tamiflu)': 'اوسلتامیویر (تامی‌فلو)',
        'Oxcarbazepine': 'اکس‌کاربازپین',
        'PEG (Polyethylene Glycol)': 'پلی‌اتیلن گلیکول (PEG)',
        'Pantoprazole': 'پنتوپرازول',
        'Pedi-Lax Glycerin': 'گلیسیرین پدی‌لاکس',
        'Pediatric Cold': 'سرماخوردگی کودکان',
        'Pediatric Multivitamin': 'مولتی‌ویتامین کودکان',
        'Penicillin': 'پنی‌سیلین',
        'Penicillin 6.3.3': 'پنی‌سیلین ۶.۳.۳',
        'Penicillin V': 'پنی‌سیلین وی (V)',
        'Phenobarbital': 'فنوباربیتال',
        'Phenytoin': 'فنی‌توئین',
        'Piperacillin-Tazobactam (Zosyn)': 'پیپراسیلین-تازوباکتام (زوسین)',
        'Piperazine': 'پیپرازین',
        'Potassium Chloride (KCl)': 'کلرید پتاسیم (KCl)',
        'Prednisolone': 'پردنیزولون',
        'Probiotic': 'پروبیوتیک',
        'Promethazine': 'پرومتازین',
        'Propofol': 'پروپوفول',
        'Propranolol': 'پروپرانولول',
        'Pseudoephedrine': 'سودوافدرین',
        'Rifampin': 'ریفامپین',
        'Risperidone': 'ریسپریدون',
        'Salbutamol': 'سالبوتامول',
        'Saline': 'سالین (نمکی)',
        'Silver Sulfadiazine': 'سیلور سولفادیازین',
        'Sodium Bicarbonate 7.5%': 'بی‌کربنات سدیم ۷.۵٪',
        'Theophylline-G': 'تئوفیلین-G',
        'Topiramate': 'توپیرامات',
        'Valproic Acid': 'والپروئیک اسید',
        'Vancomycin': 'ونکومایسین',
        'Vitamin A+D': 'ویتامین A+D',
        'Vitamin D3': 'ویتامین D3',
        'Voriconazole': 'ووریکونازول',
        'Xylometazoline': 'زایلومتازولین',
        'Zinc': 'زینک (روی)',
        'Zinc Oxide': 'اکسید روی',
        'Zinc Sulfate': 'سولفات روی'
    };

    // --- Indications (chips shown on each drug card) ---
    const INDICATION_FA = {
        'ADHD': 'بیش‌فعالی/کم‌توجهی (ADHD)',
        'AOM': 'عفونت گوش میانی حاد (AOM)',
        'Abdominal Cramps': 'دل‌پیچه شکمی',
        'Acetaminophen Toxicity': 'مسمومیت با استامینوفن',
        'Acne': 'آکنه',
        'Adrenal Insufficiency': 'نارسایی آدرنال',
        'Adrenal Insufficiency (CAH)': 'نارسایی آدرنال (CAH)',
        'Allergic Reaction': 'واکنش آلرژیک',
        'Allergic Rhinitis': 'رینیت آلرژیک',
        'Allergy': 'آلرژی',
        'Amebiasis': 'آمیبیاز',
        'Anaerobic Infection': 'عفونت بی‌هوازی',
        'Analgesia': 'ضددرد',
        'Anaphylaxis': 'آنافیلاکسی',
        'Anaphylaxis adjunct': 'کمکی در آنافیلاکسی',
        'Anesthesia Induction': 'القای بیهوشی',
        'Anxiety': 'اضطراب',
        'Asthma': 'آسم',
        'Asthma (Maintenance)': 'آسم (نگهدارنده)',
        'Asthma Exacerbation': 'تشدید آسم',
        'Asthma Prophylaxis': 'پیشگیری از آسم',
        'Atypical Pneumonia': 'پنومونی آتیپیک',
        'Bacterial Diarrhea': 'اسهال باکتریایی',
        'Bacterial Infection': 'عفونت باکتریایی',
        'Benzodiazepine Overdose': 'مسمومیت با بنزودیازپین',
        'Bone Infection': 'عفونت استخوان',
        'Bradycardia': 'برادی‌کاردی',
        'Bronchiolitis': 'برونشیولیت',
        'Bronchospasm': 'اسپاسم برونش',
        'Burns': 'سوختگی',
        'C. difficile Enterocolitis (Oral)': 'انتروکولیت کلستریدیوم دیفیسیل (خوراکی)',
        'Candidemia': 'کاندیدمی',
        'Candidiasis': 'کاندیدیازیس',
        'Cardiac Arrest': 'ایست قلبی',
        'Chickenpox': 'آبله‌مرغان',
        'Chronic Urticaria': 'کهیر مزمن',
        'Cold symptoms': 'علائم سرماخوردگی',
        'Colic': 'قولنج (کولیک)',
        'Constipation': 'یبوست',
        'Cough': 'سرفه',
        'Croup': 'کروپ',
        'Dehydration': 'کم‌آبی بدن',
        'Diaper Rash': 'سوختگی پوشک',
        'Diarrhea': 'اسهال',
        'Dietary Supplementation': 'مکمل غذایی',
        'Dry Cough': 'سرفه خشک',
        'Dry Nose': 'خشکی بینی',
        'Eczema': 'اگزما',
        'Edema': 'ادم (تورم)',
        'Epilepsy': 'صرع',
        'Esophagitis': 'ازوفاژیت',
        'Febrile Neutropenia': 'نوتروپنی تب‌دار',
        'Fecal Impaction': 'انسداد مدفوعی',
        'Fever': 'تب',
        'Fever (Resistant)': 'تب (مقاوم)',
        'Focal Seizures': 'تشنج کانونی',
        'Fungal Infection': 'عفونت قارچی',
        'GERD': 'ریفلاکس معده به مری (GERD)',
        'GI Bleeding (NPO)': 'خونریزی گوارشی (NPO)',
        'GI Spasm': 'اسپاسم گوارشی',
        'GI Ulcer': 'زخم گوارشی',
        'Gas': 'نفخ',
        'Gastroenteritis': 'گاستروانتریت',
        'Giardia': 'ژیاردیا',
        'Gram-negative Infection': 'عفونت گرم‌منفی',
        'Gram-negative Infections': 'عفونت‌های گرم‌منفی',
        'Gut Health': 'سلامت روده',
        'Heart Failure': 'نارسایی قلبی',
        'Hemangioma': 'همانژیوم',
        'Herpes Simplex': 'تبخال (هرپس سیمپلکس)',
        'Hypocalcemia': 'هیپوکلسمی',
        'Hypokalemia': 'هیپوکالمی',
        'Hypomagnesemia': 'هیپومنیزیمی',
        'Hypothyroidism': 'کم‌کاری تیروئید',
        'Immunodeficiency': 'نقص ایمنی',
        'Impetigo': 'زرد‌زخم (ایمپتیگو)',
        'Inflammation': 'التهاب',
        'Influenza Treatment': 'درمان آنفلوانزا',
        'Invasive Aspergillosis': 'آسپرژیلوز مهاجم',
        'Iron Deficiency Anemia': 'کم‌خونی فقر آهن',
        'JIA': 'آرتریت ایدیوپاتیک نوجوانان (JIA)',
        'Joint Pain': 'درد مفصل',
        'Kawasaki Disease': 'بیماری کاوازاکی',
        'Local Anesthesia': 'بی‌حسی موضعی',
        'MDR Gram-negative Infections': 'عفونت‌های گرم‌منفی مقاوم به چنددارو',
        'MDR Infections': 'عفونت‌های مقاوم به چنددارو',
        'MRSA': 'ام‌آر‌اس‌ای (MRSA)',
        'MRSA Infection': 'عفونت MRSA',
        'Maintenance Supplementation': 'مکمل نگهدارنده',
        'Meningitis': 'مننژیت',
        'Migraine': 'میگرن',
        'Migraine Prophylaxis': 'پیشگیری از میگرن',
        'Mild Pain': 'درد خفیف',
        'Moderate to Severe Pain': 'درد متوسط تا شدید',
        'Mucolytic': 'خلط‌آور (موکولیتیک)',
        'Muscle Spasm': 'اسپاسم عضلانی',
        'Nasal Congestion': 'گرفتگی بینی',
        'Nausea': 'تهوع',
        'Neuropathic Pain': 'درد نوروپاتیک',
        'Neutropenic Fever': 'تب نوتروپنیک',
        'Opioid Overdose': 'مسمومیت با اوپیوئید',
        'Oral Thrush': 'برفک دهان',
        'Osteomyelitis': 'استئومیلیت',
        'Otitis Media': 'عفونت گوش میانی',
        'PCP': 'پنومونی پنوموسیستیس (PCP)',
        'PDA Closure': 'بستن مجرای شریانی باز (PDA)',
        'Pain': 'درد',
        'Pain (NPO)': 'درد (NPO)',
        'Pain (NPO/Vomiting)': 'درد (NPO/استفراغ)',
        'Peptic Ulcer': 'زخم پپتیک',
        'Pharyngitis': 'فارنژیت',
        'Pinworm': 'کرمک (اکسیور)',
        'Pneumonia': 'پنومونی',
        'Poisoning': 'مسمومیت',
        'Pre-procedure Sedation': 'آرام‌بخشی پیش از پروسیجر',
        'Probiotic': 'پروبیوتیک',
        'Procedural Sedation': 'آرام‌بخشی حین پروسیجر',
        'Productive Cough': 'سرفه خلط‌دار',
        'Pruritus': 'خارش',
        'Pseudomonas Infection': 'عفونت سودوموناس',
        'Psychiatric Disorders': 'اختلالات روان‌پزشکی',
        'Refractory Seizures': 'تشنج مقاوم',
        'Refractory VF/Pulseless VT': 'VF مقاوم/VT بدون نبض',
        'Resistant Fever': 'تب مقاوم',
        'Resistant Infection': 'عفونت مقاوم',
        'Respiratory Infection': 'عفونت تنفسی',
        'Rickets': 'راشیتیسم',
        'Rickets Prophylaxis': 'پیشگیری از راشیتیسم',
        'Rickets Treatment': 'درمان راشیتیسم',
        'Roundworm': 'کرم گرد (آسکاریس)',
        'Routine Supplementation': 'مکمل روتین',
        'SVT': 'تاکی‌کاردی فوق‌بطنی (SVT)',
        'SVT (Supraventricular Tachycardia)': 'تاکی‌کاردی فوق‌بطنی (SVT)',
        'Sedation': 'آرام‌بخشی',
        'Seizures': 'تشنج',
        'Sepsis': 'سپسیس',
        'Severe Allergic Reaction': 'واکنش آلرژیک شدید',
        'Severe Asthma': 'آسم شدید',
        'Severe Asthma Exacerbation': 'تشدید شدید آسم',
        'Severe Infection': 'عفونت شدید',
        'Severe Inflammation': 'التهاب شدید',
        'Severe Malabsorption': 'سوءجذب شدید',
        'Severe Metabolic Acidosis': 'اسیدوز متابولیک شدید',
        'Severe Pain': 'درد شدید',
        'Severe Refractory Asthma': 'آسم مقاوم شدید',
        'Severe Sepsis': 'سپسیس شدید',
        'Severe Vitamin D Deficiency': 'کمبود شدید ویتامین D',
        'Sinusitis': 'سینوزیت',
        'Skin Infection': 'عفونت پوستی',
        'Skin Infections': 'عفونت‌های پوستی',
        'Skin Irritation': 'تحریک پوستی',
        'Skin Protection': 'محافظت از پوست',
        'Spasm': 'اسپاسم',
        'Status Epilepticus': 'صرع پایدار (استاتوس اپی‌لپتیکوس)',
        'Streptococcal': 'استرپتوکوکی',
        'Stridor': 'استریدور',
        'Sunburn': 'آفتاب‌سوختگی',
        'Supplementation': 'مکمل',
        'Systemic Fungal': 'عفونت قارچی سیستمیک',
        'Teething Pain': 'درد دندان‌درآوردن',
        'Tinea': 'کچلی (تینه‌آ)',
        'Tuberculosis': 'سل',
        'UTI': 'عفونت ادراری (UTI)',
        'UTI Prophylaxis': 'پیشگیری از عفونت ادراری',
        'UTI Treatment': 'درمان عفونت ادراری',
        'Ulcerative Colitis': 'کولیت اولسراتیو',
        'Urticaria': 'کهیر',
        'VRE Infections': 'عفونت‌های VRE',
        'Varicella': 'آبله‌مرغان (واریسلا)',
        'Vitamin Deficiency': 'کمبود ویتامین',
        'Vomiting': 'استفراغ',
        'Wound Infection': 'عفونت زخم',
        'Zinc Deficiency': 'کمبود روی'
    };

    // --- Indication-dose labels (shown in the clinical-indication dropdown) ---
    const INDICATION_DOSE_FA = {
        'AOM/Pneumonia: Day 1': 'AOM/پنومونی: روز ۱',
        'AOM/Pneumonia: Days 2-5': 'AOM/پنومونی: روزهای ۲ تا ۵',
        'AOM: 3-Day Regimen': 'AOM: رژیم ۳ روزه',
        'Acute Loading Dose (IV)': 'دوز بارگیری حاد (وریدی)',
        'Acute Otitis Media (AOM) / High Dose': 'عفونت گوش میانی حاد (AOM) / دوز بالا',
        'Amebiasis': 'آمیبیاز',
        'Anaerobic Bacterial Infection': 'عفونت باکتریایی بی‌هوازی',
        'Asthma Exacerbation': 'تشدید آسم',
        'Bacterial Meningitis': 'مننژیت باکتریایی',
        'Croup (Single Dose)': 'کروپ (دوز منفرد)',
        'Extended-Interval (Once Daily)': 'فاصله طولانی (روزی یک‌بار)',
        'Fecal Impaction Clean-out (1 - 1.5 g/kg/day)': 'پاکسازی انسداد مدفوعی (۱ تا ۱.۵ g/kg/day)',
        'Fever / Mild-Moderate Pain': 'تب / درد خفیف تا متوسط',
        'Fever / Pain': 'تب / درد',
        'Giardiasis': 'ژیاردیازیس',
        'Juvenile Idiopathic Arthritis (JIA)': 'آرتریت ایدیوپاتیک نوجوانان (JIA)',
        'Maintenance (0.4 - 1 g/kg/day)': 'نگهدارنده (۰.۴ تا ۱ g/kg/day)',
        'Maintenance Dose': 'دوز نگهدارنده',
        'Meningitis': 'مننژیت',
        'Meningitis / Severe Infection': 'مننژیت / عفونت شدید',
        'Meningitis / Severe MRSA': 'مننژیت / MRSA شدید',
        'Mild-Moderate Infection': 'عفونت خفیف تا متوسط',
        'Muscle Spasm': 'اسپاسم عضلانی',
        'Once Daily Dosing': 'دوز روزی یک‌بار',
        'Oropharyngeal Candidiasis: Day 1': 'کاندیدیازیس دهانی-حلقی: روز ۱',
        'Oropharyngeal Candidiasis: Maintenance': 'کاندیدیازیس دهانی-حلقی: نگهدارنده',
        'Pharyngitis / Tonsillitis (5 Days)': 'فارنژیت / تونسیلیت (۵ روز)',
        'Physiologic Replacement': 'جایگزینی فیزیولوژیک',
        'Pneumocystis jirovecii (PCP) Treatment': 'درمان پنوموسیستیس (PCP)',
        'Prophylaxis': 'پیشگیری',
        'Severe Infection': 'عفونت شدید',
        'Severe Infection / AOM (High Dose)': 'عفونت شدید / AOM (دوز بالا)',
        'Severe Infection / MRSA': 'عفونت شدید / MRSA',
        'Severe Infection / Osteomyelitis': 'عفونت شدید / استئومیلیت',
        'Severe Inflammation': 'التهاب شدید',
        'Standard (8mg/kg/day)': 'استاندارد (8mg/kg/day)',
        'Standard / Mild-Mod Infection': 'استاندارد / عفونت خفیف تا متوسط',
        'Standard / Moderate Infection': 'استاندارد / عفونت متوسط',
        'Standard / Severe Infection': 'استاندارد / عفونت شدید',
        'Standard Infection': 'عفونت استاندارد',
        'Standard Infection (Amox Component)': 'عفونت استاندارد (جزء آموکسی‌سیلین)',
        'Standard Infection (Mild to Moderate)': 'عفونت استاندارد (خفیف تا متوسط)',
        'Standard Infection (Skin/Soft Tissue)': 'عفونت استاندارد (پوست/بافت نرم)',
        'Status Asthmaticus': 'استاتوس آسمااتیکوس',
        'Status Asthmaticus / Anaphylaxis': 'استاتوس آسمااتیکوس / آنافیلاکسی',
        'Status Epilepticus (IV)': 'صرع پایدار (وریدی)',
        'Systemic Infection / Meningitis': 'عفونت سیستمیک / مننژیت',
        'Traditional Dosing': 'دوزبندی سنتی',
        'Treatment': 'درمان',
        'UTI / AOM / Shigellosis': 'عفونت ادراری / AOM / شیگلوز'
    };

    // --- Clinical messages: drug warnings, age alerts, IV guideline text,
    //     organ-impairment adjustments, and drug-drug interaction messages.
    //     Keyed by the exact English source string. ⚠️ Verify clinically. ---
    const CLINICAL_MSG_FA = {
        // Drug `warning` fields
        '6-11mo: 1mg | 1-5yr: 1.25mg | 6-11yr: 2.5mg once daily.': '۶ تا ۱۱ ماه: ۱mg | ۱ تا ۵ سال: ۱.۲۵mg | ۶ تا ۱۱ سال: ۲.۵mg روزی یک‌بار.',
        '<15kg: 30mg | 15-23kg: 45mg | 23-40kg: 60mg | >40kg: 75mg twice daily.': 'زیر ۱۵kg: ۳۰mg | ۱۵ تا ۲۳kg: ۴۵mg | ۲۳ تا ۴۰kg: ۶۰mg | بالای ۴۰kg: ۷۵mg دو بار در روز.',
        'Administer 30-45 minutes before procedure.': '۳۰ تا ۴۵ دقیقه پیش از پروسیجر تجویز شود.',
        'Administer after feeding.': 'پس از تغذیه تجویز شود.',
        'Administer slowly. Monitor for reactions. (2 g/kg as single dose for Kawasaki)': 'به‌آهستگی تجویز شود. واکنش‌ها پایش شوند. (۲ g/kg به‌صورت دوز منفرد برای کاوازاکی)',
        'Administer with full glass of water.': 'با یک لیوان پر آب تجویز شود.',
        'Apply to affected area 3 times daily.': 'روزی ۳ بار روی ناحیه آسیب‌دیده بمالید.',
        'Better GI tolerance. Dose based on elemental iron.': 'تحمل گوارشی بهتر. دوز بر اساس آهن عنصری.',
        'Can induce bronchospasm; sometimes given with a bronchodilator.': 'ممکن است اسپاسم برونش ایجاد کند؛ گاهی همراه با یک برونکودیلاتور داده می‌شود.',
        'Check specific brand concentration carefully before use.': 'پیش از مصرف، غلظت برند مربوطه را به‌دقت بررسی کنید.',
        'Children 2-12 years: 9 mg/kg IV q12h. Monitor liver function.': 'کودکان ۲ تا ۱۲ سال: ۹ mg/kg وریدی هر ۱۲ ساعت. عملکرد کبد پایش شود.',
        'Contains Acetaminophen, Pseudoephedrine, and Chlorpheniramine. Do not give with other acetaminophen products.': 'حاوی استامینوفن، سودوافدرین و کلرفنیرامین است. همراه با سایر فرآورده‌های استامینوفن مصرف نشود.',
        'Contraindicated in children under 1 year.': 'در کودکان زیر ۱ سال منع مصرف دارد.',
        'Contraindicated in children under 18 years for routine use.': 'برای مصرف روتین در کودکان زیر ۱۸ سال منع مصرف دارد.',
        'Contraindicated in neonates with jaundice.': 'در نوزادان مبتلا به زردی منع مصرف دارد.',
        'Contraindicated under 1 year. Use with extreme caution due to risk of severe hypothermia and GI bleed.': 'زیر ۱ سال منع مصرف دارد. به‌دلیل خطر افت شدید دمای بدن و خونریزی گوارشی با احتیاط بسیار زیاد مصرف شود.',
        'Contraindicated under 2 years.': 'زیر ۲ سال منع مصرف دارد.',
        'Contraindicated under 6 months.': 'زیر ۶ ماه منع مصرف دارد.',
        'Dilute with normal saline before nebulization.': 'پیش از نبولایز با نرمال سالین رقیق شود.',
        'Dissolve in 200ml water. Administer based on dehydration severity.': 'در ۲۰۰ml آب حل شود. بر اساس شدت کم‌آبی تجویز شود.',
        'Dissolve in water or milk.': 'در آب یا شیر حل شود.',
        'Dose adjust based on severity.': 'دوز بر اساس شدت تنظیم شود.',
        'Dose based on Ampicillin component.': 'دوز بر اساس جزء آمپی‌سیلین.',
        'Dose based on Piperacillin component. Infuse over 30 mins.': 'دوز بر اساس جزء پیپراسیلین. طی ۳۰ دقیقه انفوزیون شود.',
        'Dose based on TMP component (40mg TMP / 5ml). Concentration calculation uses TMP.': 'دوز بر اساس جزء TMP (۴۰mg TMP در ۵ml). محاسبه غلظت بر اساس TMP است.',
        'Dose based on elemental calcium. Check bottle for exact elemental Ca/ml.': 'دوز بر اساس کلسیم عنصری. مقدار دقیق Ca عنصری در هر ml را روی بطری بررسی کنید.',
        'Dose based on elemental iron (25mg/5ml elemental).': 'دوز بر اساس آهن عنصری (۲۵mg در ۵ml عنصری).',
        'Dose based on elemental iron (25mg/ml elemental).': 'دوز بر اساس آهن عنصری (۲۵mg در ml عنصری).',
        'Dose based on elemental iron.': 'دوز بر اساس آهن عنصری.',
        'Dose depends on severity. May require higher doses for meningitis.': 'دوز به شدت بیماری بستگی دارد. برای مننژیت ممکن است دوز بالاتری لازم باشد.',
        'Dose equivalent to 1-3 ml/kg/day. Adjust based on clinical response.': 'دوز معادل ۱ تا ۳ ml/kg/day. بر اساس پاسخ بالینی تنظیم شود.',
        'Dose in IU/kg/day divided q8h. Adjust in renal impairment.': 'دوز به IU/kg/day تقسیم بر هر ۸ ساعت. در نارسایی کلیوی تنظیم شود.',
        'Dose in mEq/kg. (7.5% solution = 0.89 mEq/ml).': 'دوز به mEq/kg. (محلول ۷.۵٪ = ۰.۸۹ mEq/ml).',
        'Dose in micrograms (mcg)! Push slowly to avoid chest wall rigidity. 1-2 mcg/kg/dose.': 'دوز به میکروگرم (mcg)! برای جلوگیری از سفتی دیواره قفسه سینه به‌آهستگی تزریق شود. ۱ تا ۲ mcg/kg در هر دوز.',
        'Dose in units/kg. Severe infections may require higher doses.': 'دوز به واحد/kg. عفونت‌های شدید ممکن است دوز بالاتری لازم داشته باشند.',
        'Dose in units/kg. Use with caution in penicillin allergy.': 'دوز به واحد/kg. در آلرژی به پنی‌سیلین با احتیاط مصرف شود.',
        'Dose should be adjusted in renal impairment. (50-100 mg/kg/day div q8h)': 'دوز در نارسایی کلیوی باید تنظیم شود. (۵۰ تا ۱۰۰ mg/kg/day تقسیم بر هر ۸ ساعت)',
        'Dose varies by age. Infants (10-15 mcg/kg/day), Children (4-6 mcg/kg/day).': 'دوز بر اساس سن متفاوت است. شیرخواران (۱۰ تا ۱۵ mcg/kg/day)، کودکان (۴ تا ۶ mcg/kg/day).',
        'Dose varies by severity.': 'دوز بر اساس شدت متفاوت است.',
        'Dosing depends on indication and day of therapy.': 'دوزبندی به اندیکاسیون و روز درمان بستگی دارد.',
        'Emergency use only.': 'فقط برای مصرف اورژانسی.',
        'Emergency use only. Dilute appropriately for IV vs IM.': 'فقط مصرف اورژانسی. برای تزریق وریدی و عضلانی به‌طور مناسب رقیق شود.',
        'Emergency use only. May precipitate withdrawal.': 'فقط مصرف اورژانسی. ممکن است علائم ترک را تسریع کند.',
        'Emergency use. Can be administered IV, IM, or Buccal.': 'مصرف اورژانسی. قابل تجویز وریدی، عضلانی یا داخل‌گونه‌ای است.',
        'Emergency use. Dilute with equal volume of diluent before IV push.': 'مصرف اورژانسی. پیش از تزریق وریدی با حجم مساوی حلال رقیق شود.',
        'Extremely high dose! Not for daily routine supplementation without explicit physician order.': 'دوز بسیار بالا! بدون دستور صریح پزشک برای مکمل روتین روزانه مناسب نیست.',
        'For children 6 months to 5 years.': 'برای کودکان ۶ ماه تا ۵ سال.',
        'For children 6 to 14 years.': 'برای کودکان ۶ تا ۱۴ سال.',
        'For children < 12 years: 10 mg/kg q8h. For > 12 years: 10 mg/kg q12h (max 600mg).': 'کودکان زیر ۱۲ سال: ۱۰ mg/kg هر ۸ ساعت. بالای ۱۲ سال: ۱۰ mg/kg هر ۱۲ ساعت (حداکثر ۶۰۰mg).',
        'For children weighing 15-30 kg. >30 kg use 0.3 mg.': 'برای کودکان با وزن ۱۵ تا ۳۰ کیلوگرم. بالای ۳۰ کیلوگرم از ۰.۳ mg استفاده شود.',
        'For intramuscular (IM) use only. Extremely high dose.': 'فقط برای مصرف عضلانی (IM). دوز بسیار بالا.',
        'For occasional use only. Not for routine use.': 'فقط برای مصرف گاه‌به‌گاه. برای مصرف روتین نیست.',
        'High-dose required for AOM.': 'برای عفونت گوش میانی حاد (AOM) دوز بالا لازم است.',
        'Highly bioavailable, usually lower dose needed.': 'زیست‌فراهمی بالا؛ معمولاً دوز کمتری لازم است.',
        'IV push slowly. May cause emergence delirium.': 'تزریق وریدی به‌آهستگی. ممکن است دلیریوم پس از بیهوشی ایجاد کند.',
        'Infuse over 20-30 mins for asthma. Default calculation uses 20% (200mg/ml) concentration.': 'برای آسم طی ۲۰ تا ۳۰ دقیقه انفوزیون شود. محاسبه پیش‌فرض بر اساس غلظت ۲۰٪ (۲۰۰mg/ml) است.',
        'Infuse over 20-60 mins (except in cardiac arrest). Monitor BP and ECG.': 'طی ۲۰ تا ۶۰ دقیقه انفوزیون شود (به‌جز در ایست قلبی). فشار خون و ECG پایش شود.',
        'Initial dose. Monitor serum levels.': 'دوز اولیه. سطح سرمی پایش شود.',
        'Loading dose is required for acute control.': 'برای کنترل حاد، دوز بارگیری لازم است.',
        'Loading dose: 150 mg/kg over 60 min. Follow standard 3-bag IV protocol.': 'دوز بارگیری: ۱۵۰ mg/kg طی ۶۰ دقیقه. طبق پروتکل استاندارد سه‌کیسه‌ای وریدی ادامه یابد.',
        'Maintenance dose.': 'دوز نگهدارنده.',
        'Maintenance dose. Monitor serum levels.': 'دوز نگهدارنده. سطح سرمی پایش شود.',
        'Maintenance dose. Shake bottle extremely well before use.': 'دوز نگهدارنده. پیش از مصرف بطری را بسیار خوب تکان دهید.',
        'Max 5 days of use. Avoid in bleeding risk or renal impairment.': 'حداکثر ۵ روز مصرف. در خطر خونریزی یا نارسایی کلیوی پرهیز شود.',
        'Max 8 puffs/day. Use spacer device for children.': 'حداکثر ۸ پاف در روز. برای کودکان از اسپیسر استفاده شود.',
        'Max dose 800mg/dose.': 'حداکثر دوز ۸۰۰mg در هر نوبت.',
        'May cause CNS effects in neonates.': 'ممکن است در نوزادان عوارض سیستم عصبی مرکزی ایجاد کند.',
        'May cause drowsiness. Administer cautiously in infants.': 'ممکن است خواب‌آلودگی ایجاد کند. در شیرخواران با احتیاط تجویز شود.',
        'Mix in water or juice. 1000mg = 1g': 'در آب یا آبمیوه مخلوط شود. ۱۰۰۰mg = ۱g',
        'Monitor blood counts. Risk of aplastic anemia.': 'شمارش خونی پایش شود. خطر کم‌خونی آپلاستیک.',
        'Monitor calcium levels. Dilute before IV use.': 'سطح کلسیم پایش شود. پیش از مصرف وریدی رقیق شود.',
        'Monitor electrolyte balance.': 'تعادل الکترولیت‌ها پایش شود.',
        'Monitor renal function and hearing.': 'عملکرد کلیه و شنوایی پایش شود.',
        'Monitor renal function and hearing. (15 mg/kg/day div q12h)': 'عملکرد کلیه و شنوایی پایش شود. (۱۵ mg/kg/day تقسیم بر هر ۱۲ ساعت)',
        'Monitor side effects.': 'عوارض جانبی پایش شود.',
        'NEVER give IV push! Must be diluted and infused slowly. Dose in mEq/kg.': 'هرگز به‌صورت تزریق سریع وریدی داده نشود! باید رقیق و به‌آهستگی انفوزیون شود. دوز به mEq/kg.',
        'Nebulized dose: 0.5 ml/kg of 1:1000 solution (Max 5 ml).': 'دوز نبولایز: ۰.۵ ml/kg از محلول ۱:۱۰۰۰ (حداکثر ۵ ml).',
        'Neonates may require lower doses in first week of life.': 'نوزادان ممکن است در هفته اول زندگی به دوز کمتری نیاز داشته باشند.',
        'Not for use more than 3 days.': 'بیش از ۳ روز مصرف نشود.',
        'Not for use on face or diaper area.': 'روی صورت یا ناحیه پوشک استفاده نشود.',
        'Not recommended for children under 12 years.': 'برای کودکان زیر ۱۲ سال توصیه نمی‌شود.',
        'Not recommended for children under 6 months. Take with food.': 'برای کودکان زیر ۶ ماه توصیه نمی‌شود. با غذا مصرف شود.',
        'Not recommended under 2 years without physician advice.': 'زیر ۲ سال بدون توصیه پزشک توصیه نمی‌شود.',
        'Not recommended under 2 years.': 'زیر ۲ سال توصیه نمی‌شود.',
        'Not recommended under 6 months.': 'زیر ۶ ماه توصیه نمی‌شود.',
        'Often mixed with Salbutamol for nebulization.': 'اغلب برای نبولایز با سالبوتامول مخلوط می‌شود.',
        'Oral form is for local GI effect only.': 'شکل خوراکی فقط برای اثر موضعی گوارشی است.',
        'Physiologic replacement is 8-10 mg/m2/day divided q8h. Stress doses are higher.': 'جایگزینی فیزیولوژیک ۸ تا ۱۰ mg/m2/day تقسیم بر هر ۸ ساعت است. دوزهای استرس بالاترند.',
        'Potent steroid. Use sparingly.': 'استروئید قوی. با احتیاط و کم مصرف شود.',
        'Prepare fresh daily.': 'روزانه تازه تهیه شود.',
        'Rapid IV push followed by rapid saline flush. First dose: 0.1 mg/kg. Second: 0.2 mg/kg.': 'تزریق سریع وریدی و به‌دنبال آن فلاش سریع سالین. دوز اول: ۰.۱ mg/kg. دوم: ۰.۲ mg/kg.',
        'Requires serum level monitoring.': 'نیازمند پایش سطح سرمی است.',
        'Rinse mouth after use to prevent oral thrush.': 'برای جلوگیری از برفک دهان، پس از مصرف دهان شسته شود.',
        'Rinse mouth after use.': 'پس از مصرف دهان شسته شود.',
        'Risk of Propofol Infusion Syndrome (PRIS). Extreme caution in young children.': 'خطر سندرم انفوزیون پروپوفول (PRIS). احتیاط بسیار زیاد در کودکان خردسال.',
        'Risk of QT prolongation. Use lowest effective dose.': 'خطر طولانی‌شدن فاصله QT. کمترین دوز مؤثر مصرف شود.',
        'Risk of drowsiness.': 'خطر خواب‌آلودگی.',
        'Risk of liver toxicity with overdose.': 'خطر سمیت کبدی در مصرف بیش از حد.',
        'Risk of liver toxicity with overdose. Max 75mg/kg/day.': 'خطر سمیت کبدی در مصرف بیش از حد. حداکثر ۷۵mg/kg/day.',
        'Risk of respiratory depression. Have resuscitation equipment ready.': 'خطر دپرسیون تنفسی. تجهیزات احیا آماده باشد.',
        'Risk of respiratory depression. Use with caution.': 'خطر دپرسیون تنفسی. با احتیاط مصرف شود.',
        'Safe and effective antiemetic.': 'داروی ضدتهوع ایمن و مؤثر.',
        'Safe and effective for gastroenteritis.': 'برای گاستروانتریت ایمن و مؤثر.',
        'Safe for all ages.': 'برای همه سنین ایمن است.',
        'Standard daily dose for infants under 15-24 months.': 'دوز روزانه استاندارد برای شیرخواران زیر ۱۵ تا ۲۴ ماه.',
        'Standard dose. High-dose for AOM is 80-90 mg/kg/day divided q12h.': 'دوز استاندارد. دوز بالا برای AOM برابر ۸۰ تا ۹۰ mg/kg/day تقسیم بر هر ۱۲ ساعت است.',
        'Standard dose: 1 Sachet daily. Dissolve in cool water, milk, or juice.': 'دوز استاندارد: روزی ۱ ساشه. در آب خنک، شیر یا آبمیوه حل شود.',
        'Start low (0.5-1 mg/kg/day) and titrate up.': 'با دوز پایین (۰.۵ تا ۱ mg/kg/day) شروع و به‌تدریج افزایش یابد.',
        'Start treatment early.': 'درمان زودهنگام آغاز شود.',
        'Start with low dose and titrate. (Concentration: 2.5 mg/ml)': 'با دوز پایین شروع و به‌تدریج تنظیم شود. (غلظت: ۲.۵ mg/ml)',
        'Starting dose 10-15 mg/kg/day. Monitor LFTs.': 'دوز شروع ۱۰ تا ۱۵ mg/kg/day. آزمایش‌های عملکرد کبد (LFT) پایش شود.',
        'Starting dose 8-10 mg/kg/day divided q12h.': 'دوز شروع ۸ تا ۱۰ mg/kg/day تقسیم بر هر ۱۲ ساعت.',
        'Starting dose. May be increased as per physician.': 'دوز شروع. طبق نظر پزشک قابل افزایش است.',
        'Symptomatic relief of gas and colic.': 'تسکین علامتی نفخ و قولنج.',
        'Take with food.': 'با غذا مصرف شود.',
        'Take with food. Not recommended under 6 months.': 'با غذا مصرف شود. زیر ۶ ماه توصیه نمی‌شود.',
        'Taper if used >5 days.': 'در صورت مصرف بیش از ۵ روز، به‌تدریج قطع شود.',
        'Taper when discontinuing.': 'هنگام قطع، به‌تدریج کاهش داده شود.',
        'Use daily for best effect.': 'برای بهترین اثر روزانه مصرف شود.',
        'Use lowest effective dose.': 'کمترین دوز مؤثر مصرف شود.',
        'Use only small amounts in infants.': 'در شیرخواران فقط مقادیر کم استفاده شود.',
        'Use with caution in children under 2 years.': 'در کودکان زیر ۲ سال با احتیاط مصرف شود.',
        'Use with caution in children.': 'در کودکان با احتیاط مصرف شود.',
        'Use with caution in neonates.': 'در نوزادان با احتیاط مصرف شود.',
        'Use with caution in severe diarrhea.': 'در اسهال شدید با احتیاط مصرف شود.',
        'Used in acute poisoning. Administer within 1 hour of ingestion.': 'در مسمومیت حاد استفاده می‌شود. ظرف ۱ ساعت پس از بلع تجویز شود.',
        'Used in neonates only under specialist supervision.': 'در نوزادان فقط تحت نظر متخصص استفاده شود.',

        // IV guideline warnings
        'ABSOLUTE CONTRAINDICATION FOR IV PUSH! Must be diluted and infused slowly. Continuous ECG monitoring required.': 'منع مصرف مطلق برای تزریق سریع وریدی! باید رقیق و به‌آهستگی انفوزیون شود. پایش مداوم ECG لازم است.',
        "Co-administration with calcium-containing solutions (e.g., Ringer's Lactate) is strictly prohibited (risk of fatal precipitation).": 'مصرف هم‌زمان با محلول‌های حاوی کلسیم (مانند رینگر لاکتات) اکیداً ممنوع است (خطر رسوب کشنده).',
        'Dilute only with Normal Saline (NS). Precipitates in dextrose solutions. Risk of cardiac arrhythmias with rapid injection.': 'فقط با نرمال سالین (NS) رقیق شود. در محلول‌های دکستروز رسوب می‌کند. خطر آریتمی قلبی در تزریق سریع.',
        'Direct IV injection (undiluted) is recommended. Do not dilute due to incompatibility with most IV fluids.': 'تزریق مستقیم وریدی (بدون رقیق‌سازی) توصیه می‌شود. به‌دلیل ناسازگاری با بیشتر مایعات وریدی رقیق نشود.',
        'High risk of nephrotoxicity. Adjust dose in renal failure.': 'خطر بالای سمیت کلیوی. دوز در نارسایی کلیوی تنظیم شود.',
        'Incompatible with normal saline in some concentrations; usually mixed in D5W. Monitor ECG for bradycardia/AV block.': 'در برخی غلظت‌ها با نرمال سالین ناسازگار است؛ معمولاً در D5W مخلوط می‌شود. ECG برای برادی‌کاردی/بلوک AV پایش شود.',
        'Low stability after reconstitution; inject immediately.': 'پایداری پایین پس از حل‌شدن؛ بلافاصله تزریق شود.',
        'May cause false-positive Galactomannan test.': 'ممکن است آزمایش گالاکتومانان را مثبت کاذب کند.',
        'Never infuse in the same line with penicillins (causes drug inactivation).': 'هرگز در یک خط با پنی‌سیلین‌ها انفوزیون نشود (باعث غیرفعال‌شدن دارو می‌شود).',
        'Rapid IV injection may cause respiratory depression or hypotension. Resuscitation equipment must be available.': 'تزریق سریع وریدی ممکن است دپرسیون تنفسی یا افت فشار خون ایجاد کند. تجهیزات احیا باید در دسترس باشد.',
        'Rapid IV push may cause chest wall rigidity and severe respiratory depression.': 'تزریق سریع وریدی ممکن است سفتی دیواره قفسه سینه و دپرسیون تنفسی شدید ایجاد کند.',
        'Rapid administration may cause respiratory depression. Protect airway.': 'تجویز سریع ممکن است دپرسیون تنفسی ایجاد کند. راه هوایی محافظت شود.',
        'Rapid injection causes bradycardia and cardiac arrest. Cardiac monitoring is mandatory during infusion.': 'تزریق سریع باعث برادی‌کاردی و ایست قلبی می‌شود. پایش قلبی حین انفوزیون الزامی است.',
        'Requires strict monitoring of renal function and serum levels.': 'نیازمند پایش دقیق عملکرد کلیه و سطوح سرمی است.',
        'Risk of Red Man Syndrome with rapid infusion. Use of a Central Venous Catheter (CVC) is recommended for concentrations higher than 5mg/ml.': 'خطر سندرم مرد قرمز (Red Man) با انفوزیون سریع. برای غلظت‌های بالاتر از ۵mg/ml استفاده از کاتتر ورید مرکزی (CVC) توصیه می‌شود.',

        // Organ-impairment adjustment warnings
        'Adjust dose and interval if GFR < 50 ml/min.': 'در صورت GFR کمتر از ۵۰ ml/min، دوز و فاصله تنظیم شود.',
        'Highly dependent on renal function. Dosing intervals may extend to 24 to 48 hours.': 'به‌شدت وابسته به عملکرد کلیه. فاصله دوز ممکن است تا ۲۴ تا ۴۸ ساعت افزایش یابد.',
        'If GFR < 10, reduce the dose by 50%.': 'در صورت GFR کمتر از ۱۰، دوز ۵۰٪ کاهش یابد.',
        'If GFR < 30, change 8-hour dosing to 12-hour intervals.': 'در صورت GFR کمتر از ۳۰، دوز هر ۸ ساعت به فاصله ۱۲ ساعت تغییر یابد.',
        'If GFR < 30, increase dosing interval to 12 or 24 hours.': 'در صورت GFR کمتر از ۳۰، فاصله دوز به ۱۲ یا ۲۴ ساعت افزایش یابد.',
        'If GFR < 50, the maintenance dose should be halved after the loading dose.': 'در صورت GFR کمتر از ۵۰، دوز نگهدارنده پس از دوز بارگیری نصف شود.',
        'Reduce dose by up to 50% in severe hepatic impairment.': 'در نارسایی شدید کبدی، دوز تا ۵۰٪ کاهش یابد.',
        'Reduce dose or extend interval if GFR < 30 ml/min.': 'در صورت GFR کمتر از ۳۰ ml/min، دوز کاهش یا فاصله افزایش یابد.',
        'Requires strict dose and interval adjustment based on creatinine clearance and serum levels (TDM).': 'نیازمند تنظیم دقیق دوز و فاصله بر اساس کلیرانس کراتینین و سطوح سرمی (TDM) است.',
        'Use with extreme caution or reduce dose in severe hepatic impairment.': 'در نارسایی شدید کبدی با احتیاط بسیار زیاد مصرف یا دوز کاهش یابد.',

        // Contraindication warnings (from validation.js)
        'Ibuprofen is contraindicated in infants under 6 months or weight < 6kg!': 'ایبوپروفن در شیرخواران زیر ۶ ماه یا وزن کمتر از ۶ کیلوگرم منع مصرف دارد!',
        'In neonates under 2.5kg, dose must be determined by physician.': 'در نوزادان زیر ۲.۵ کیلوگرم، دوز باید توسط پزشک تعیین شود.',
        'Contraindicated in neonates (< 28 days), especially with jaundice or if receiving IV calcium!': 'در نوزادان (کمتر از ۲۸ روز) منع مصرف دارد، به‌ویژه در زردی یا دریافت کلسیم وریدی!',
        'Requires close monitoring of renal function and hearing in neonates and infants!': 'نیازمند پایش دقیق عملکرد کلیه و شنوایی در نوزادان و شیرخواران است!',
        'Use in neonates requires serum level monitoring!': 'مصرف در نوزادان نیازمند پایش سطح سرمی است!',
        'Contraindicated in children under 2 years due to risk of fatal respiratory depression.': 'در کودکان زیر ۲ سال به‌دلیل خطر دپرسیون تنفسی کشنده منع مصرف دارد.',
        'Contraindicated in children under 1 year.': 'در کودکان زیر ۱ سال منع مصرف دارد.',
        'Risk of respiratory depression. Use with caution in neonates.': 'خطر دپرسیون تنفسی. در نوزادان با احتیاط مصرف شود.',
        'Use with caution in penicillin-allergic patients.': 'در بیماران حساس به پنی‌سیلین با احتیاط مصرف شود.',
        'According to AAP/Nelson guidelines, short courses (<21 days) are safe for all ages. Long courses are contraindicated under 8 yrs.': 'طبق راهنمای AAP/نلسون، دوره‌های کوتاه (کمتر از ۲۱ روز) برای همه سنین ایمن است. دوره‌های طولانی زیر ۸ سال منع مصرف دارد.',
        'Not recommended for routine use in children under 18 years.': 'برای مصرف روتین در کودکان زیر ۱۸ سال توصیه نمی‌شود.',
        'Risk of gray baby syndrome in neonates. Monitor blood counts.': 'خطر سندرم کودک خاکستری در نوزادان. شمارش خونی پایش شود.',

        // Drug-drug interaction messages
        'Contraindicated: Concurrent use of multiple NSAIDs increases GI adverse effects without added benefit.': 'منع مصرف: مصرف هم‌زمان چند NSAID عوارض گوارشی را بدون فایده اضافی افزایش می‌دهد.',
        'Contraindicated: Concurrent use of multiple NSAIDs significantly increases GI and renal toxicity.': 'منع مصرف: مصرف هم‌زمان چند NSAID سمیت گوارشی و کلیوی را به‌طور قابل‌توجهی افزایش می‌دهد.',
        'Critical Risk: Additive QT prolongation leading to life-threatening arrhythmias (Torsades de Pointes).': 'خطر بحرانی: طولانی‌شدن تجمعی QT که به آریتمی‌های تهدیدکننده حیات (تورساد دو پوانت) منجر می‌شود.',
        'Critical Risk: Additive QT prolongation leading to life-threatening arrhythmias.': 'خطر بحرانی: طولانی‌شدن تجمعی QT که به آریتمی‌های تهدیدکننده حیات منجر می‌شود.',
        'Critical Risk: Carbamazepine significantly reduces Voriconazole levels. Co-administration is contraindicated.': 'خطر بحرانی: کاربامازپین سطح ووریکونازول را به‌طور قابل‌توجهی کاهش می‌دهد. مصرف هم‌زمان منع دارد.',
        'Critical Risk: Non-selective MAOI activity of Linezolid combined with pseudoephedrine can cause severe hypertensive crisis.': 'خطر بحرانی: فعالیت MAOI غیرانتخابی لینزولید همراه با سودوافدرین می‌تواند بحران شدید فشار خون ایجاد کند.',
        'Critical Risk: Phenobarbital significantly reduces Voriconazole levels. Co-administration is contraindicated.': 'خطر بحرانی: فنوباربیتال سطح ووریکونازول را به‌طور قابل‌توجهی کاهش می‌دهد. مصرف هم‌زمان منع دارد.',
        'Critical Risk: Phenytoin reduces Voriconazole levels while Voriconazole increases Phenytoin levels.': 'خطر بحرانی: فنی‌توئین سطح ووریکونازول را کاهش می‌دهد و ووریکونازول سطح فنی‌توئین را افزایش می‌دهد.',
        'Critical Risk: Rifampin profoundly reduces Voriconazole levels. Co-administration is contraindicated.': 'خطر بحرانی: ریفامپین سطح ووریکونازول را به‌شدت کاهش می‌دهد. مصرف هم‌زمان منع دارد.',
        'Critical Risk: Severe QT prolongation and CYP3A4 inhibition leading to lethal arrhythmias.': 'خطر بحرانی: طولانی‌شدن شدید QT و مهار CYP3A4 که به آریتمی‌های کشنده منجر می‌شود.',
        'Critical Risk: Severe QT prolongation and cardiotoxicity. Combination contraindicated.': 'خطر بحرانی: طولانی‌شدن شدید QT و سمیت قلبی. این ترکیب منع مصرف دارد.',
        'Critical Risk: Severe QT prolongation and potential fatal Torsades de Pointes arrhythmias.': 'خطر بحرانی: طولانی‌شدن شدید QT و احتمال آریتمی کشنده تورساد دو پوانت.',
        'Critical Risk: Severe QT prolongation and risk of Torsades de Pointes.': 'خطر بحرانی: طولانی‌شدن شدید QT و خطر تورساد دو پوانت.',
        'Critical Risk: Severe QT prolongation and risk of fatal Torsades de Pointes. Combination contraindicated.': 'خطر بحرانی: طولانی‌شدن شدید QT و خطر تورساد دو پوانت کشنده. این ترکیب منع مصرف دارد.',
        'Critical Risk: Severe QT prolongation and risk of fatal Torsades de Pointes. Contraindicated.': 'خطر بحرانی: طولانی‌شدن شدید QT و خطر تورساد دو پوانت کشنده. منع مصرف دارد.',
        'Critical Risk: Severe QT prolongation. Combination contraindicated.': 'خطر بحرانی: طولانی‌شدن شدید QT. این ترکیب منع مصرف دارد.',
        'Critical Risk: Severe bradycardia, hypotension, and cardiac output depression.': 'خطر بحرانی: برادی‌کاردی شدید، افت فشار خون و کاهش برون‌ده قلبی.',
        'Critical Risk: Severe synergistic QT prolongation. Monitor ECG closely for Torsades de Pointes.': 'خطر بحرانی: طولانی‌شدن هم‌افزای شدید QT. ECG برای تورساد دو پوانت به‌دقت پایش شود.',
        'Critical Risk: Severe synergistic QT prolongation. Monitor ECG closely.': 'خطر بحرانی: طولانی‌شدن هم‌افزای شدید QT. ECG به‌دقت پایش شود.',
        'Critical Risk: Synergistic QT prolongation leading to lethal ventricular arrhythmias.': 'خطر بحرانی: طولانی‌شدن هم‌افزای QT که به آریتمی‌های بطنی کشنده منجر می‌شود.',
        'Critical Risk: Synergistic QT prolongation leading to life-threatening arrhythmias (Torsades de Pointes).': 'خطر بحرانی: طولانی‌شدن هم‌افزای QT که به آریتمی‌های تهدیدکننده حیات (تورساد دو پوانت) منجر می‌شود.',
        'Critical Risk: Synergistic QT prolongation leading to life-threatening arrhythmias.': 'خطر بحرانی: طولانی‌شدن هم‌افزای QT که به آریتمی‌های تهدیدکننده حیات منجر می‌شود.',
        'Critical Risk: Synergistic QT prolongation. Extreme caution advised or avoid combination.': 'خطر بحرانی: طولانی‌شدن هم‌افزای QT. احتیاط بسیار زیاد توصیه می‌شود یا از این ترکیب پرهیز شود.',
        'Fatal Risk: Precipitation of ceftriaxone-calcium in lungs and kidneys, especially in neonates.': 'خطر کشنده: رسوب سفتریاکسون-کلسیم در ریه‌ها و کلیه‌ها، به‌ویژه در نوزادان.',
        'Fatal Risk: Severe hyperkalemia causing cardiac arrest.': 'خطر کشنده: هایپرکالمی شدید که باعث ایست قلبی می‌شود.',
        'High Risk: Additive CNS and respiratory depression.': 'خطر بالا: دپرسیون تجمعی سیستم عصبی مرکزی و تنفسی.',
        'High Risk: Additive CNS and severe respiratory depression risk.': 'خطر بالا: خطر دپرسیون تجمعی سیستم عصبی مرکزی و دپرسیون تنفسی شدید.',
        'High Risk: Additive QT prolongation and potential for serious cardiac arrhythmias.': 'خطر بالا: طولانی‌شدن تجمعی QT و احتمال آریتمی‌های قلبی جدی.',
        'High Risk: Additive QT prolongation risk.': 'خطر بالا: خطر طولانی‌شدن تجمعی QT.',
        'High Risk: Additive prolongation of the QT interval. Monitor ECG closely.': 'خطر بالا: طولانی‌شدن تجمعی فاصله QT. ECG به‌دقت پایش شود.',
        'High Risk: Amiodarone inhibits CYP2C9, significantly increasing Phenytoin levels and risk of toxicity.': 'خطر بالا: آمیودارون CYP2C9 را مهار می‌کند و سطح فنی‌توئین و خطر سمیت را به‌طور قابل‌توجهی افزایش می‌دهد.',
        'High Risk: Bacteriostatic drugs (Doxycycline) may interfere with the bactericidal action of Penicillins.': 'خطر بالا: داروهای باکتریواستاتیک (داکسی‌سایکلین) ممکن است با اثر باکتریسیدال پنی‌سیلین‌ها تداخل کنند.',
        'High Risk: Calcium decreases Levothyroxine absorption. Separate administration.': 'خطر بالا: کلسیم جذب لووتیروکسین را کاهش می‌دهد. زمان مصرف جدا شود.',
        'High Risk: Calcium severely decreases Ciprofloxacin absorption. Separate administration times.': 'خطر بالا: کلسیم جذب سیپروفلوکساسین را به‌شدت کاهش می‌دهد. زمان مصرف جدا شود.',
        'High Risk: Calcium severely decreases Doxycycline absorption. Separate administration by hours.': 'خطر بالا: کلسیم جذب داکسی‌سایکلین را به‌شدت کاهش می‌دهد. مصرف را چند ساعت جدا کنید.',
        'High Risk: Carbamazepine increases toxic metabolite of acetaminophen, elevating risk of hepatotoxicity.': 'خطر بالا: کاربامازپین متابولیت سمی استامینوفن را افزایش می‌دهد و خطر سمیت کبدی را بالا می‌برد.',
        'High Risk: Carbamazepine induces metabolism of Doxycycline, decreasing its half-life.': 'خطر بالا: کاربامازپین متابولیسم داکسی‌سایکلین را القا می‌کند و نیمه‌عمر آن را کاهش می‌دهد.',
        'High Risk: Carbamazepine induces metabolism of Levothyroxine, potentially increasing thyroid hormone requirements.': 'خطر بالا: کاربامازپین متابولیسم لووتیروکسین را القا می‌کند و ممکن است نیاز به هورمون تیروئید را افزایش دهد.',
        'High Risk: Carbamazepine induces metabolism of corticosteroids, decreasing their blood levels and efficacy.': 'خطر بالا: کاربامازپین متابولیسم کورتیکواستروئیدها را القا می‌کند و سطح خونی و اثربخشی آن‌ها را کاهش می‌دهد.',
        'High Risk: Carbapenems markedly decrease Valproic Acid serum levels, precipitating breakthrough seizures.': 'خطر بالا: کارباپنم‌ها سطح سرمی والپروئیک اسید را به‌شدت کاهش می‌دهند و باعث بروز تشنج می‌شوند.',
        'High Risk: Carbapenems rapidly and significantly decrease Valproic Acid serum levels, risking breakthrough seizures.': 'خطر بالا: کارباپنم‌ها به‌سرعت و به‌طور قابل‌توجهی سطح سرمی والپروئیک اسید را کاهش می‌دهند و خطر بروز تشنج دارند.',
        'High Risk: Cimetidine inhibits hepatic metabolism of Diazepam, leading to accumulation and prolonged sedation.': 'خطر بالا: سایمتیدین متابولیسم کبدی دیازپام را مهار می‌کند و به تجمع و آرام‌بخشی طولانی منجر می‌شود.',
        'High Risk: Cimetidine inhibits metabolism of Midazolam, leading to prolonged CNS depression.': 'خطر بالا: سایمتیدین متابولیسم میدازولام را مهار می‌کند و به دپرسیون طولانی سیستم عصبی مرکزی منجر می‌شود.',
        'High Risk: Cimetidine inhibits metabolism, leading to Phenytoin toxicity (ataxia, nystagmus).': 'خطر بالا: سایمتیدین متابولیسم را مهار می‌کند و به سمیت فنی‌توئین (آتاکسی، نیستاگموس) منجر می‌شود.',
        'High Risk: Cimetidine inhibits metabolism, leading to Theophylline toxicity (seizures, arrhythmias).': 'خطر بالا: سایمتیدین متابولیسم را مهار می‌کند و به سمیت تئوفیلین (تشنج، آریتمی) منجر می‌شود.',
        'High Risk: Ciprofloxacin inhibits theophylline metabolism, leading to severe seizures and arrhythmia.': 'خطر بالا: سیپروفلوکساسین متابولیسم تئوفیلین را مهار می‌کند و به تشنج شدید و آریتمی منجر می‌شود.',
        'High Risk: Clarithromycin inhibits CYP3A4, increasing Loratadine levels.': 'خطر بالا: کلاریترومایسین CYP3A4 را مهار می‌کند و سطح لوراتادین را افزایش می‌دهد.',
        'High Risk: Clarithromycin inhibits CYP3A4, significantly increasing Fentanyl levels and respiratory depression.': 'خطر بالا: کلاریترومایسین CYP3A4 را مهار می‌کند و سطح فنتانیل و دپرسیون تنفسی را به‌طور قابل‌توجهی افزایش می‌دهد.',
        'High Risk: Clarithromycin inhibits metabolism of Carbamazepine, causing severe toxicity (ataxia, lethargy).': 'خطر بالا: کلاریترومایسین متابولیسم کاربامازپین را مهار می‌کند و باعث سمیت شدید (آتاکسی، بی‌حالی) می‌شود.',
        'High Risk: Complex CYP450 interactions leading to altered levels of both drugs and increased toxicity.': 'خطر بالا: تداخلات پیچیده CYP450 که به تغییر سطح هر دو دارو و افزایش سمیت منجر می‌شود.',
        'High Risk: Complex alteration of phenytoin binding and metabolism leading to toxicity.': 'خطر بالا: تغییر پیچیده در اتصال و متابولیسم فنی‌توئین که به سمیت منجر می‌شود.',
        'High Risk: Concomitant use increases the risk of tendinitis and tendon rupture.': 'خطر بالا: مصرف هم‌زمان خطر التهاب و پارگی تاندون را افزایش می‌دهد.',
        'High Risk: Concomitant use may increase the risk of nephrotoxicity.': 'خطر بالا: مصرف هم‌زمان ممکن است خطر سمیت کلیوی را افزایش دهد.',
        'High Risk: Concurrent use may enhance neuromuscular blockade leading to respiratory depression.': 'خطر بالا: مصرف هم‌زمان ممکن است بلوک عصبی‌عضلانی را تشدید و به دپرسیون تنفسی منجر کند.',
        'High Risk: Concurrent use of fluoroquinolones and NSAIDs increases the risk of CNS stimulation and seizures.': 'خطر بالا: مصرف هم‌زمان فلوروکینولون‌ها و NSAIDها خطر تحریک سیستم عصبی مرکزی و تشنج را افزایش می‌دهد.',
        'High Risk: Enhanced risk of renal failure and hearing loss.': 'خطر بالا: افزایش خطر نارسایی کلیه و کاهش شنوایی.',
        'High Risk: Erythromycin dramatically increases Carbamazepine plasma concentrations.': 'خطر بالا: اریترومایسین غلظت پلاسمایی کاربامازپین را به‌شدت افزایش می‌دهد.',
        'High Risk: Erythromycin inhibits CYP3A4, increasing Loratadine levels and potential for adverse effects.': 'خطر بالا: اریترومایسین CYP3A4 را مهار می‌کند و سطح لوراتادین و احتمال عوارض را افزایش می‌دهد.',
        'High Risk: Erythromycin inhibits CYP3A4, significantly increasing Fentanyl levels and respiratory depression.': 'خطر بالا: اریترومایسین CYP3A4 را مهار می‌کند و سطح فنتانیل و دپرسیون تنفسی را به‌طور قابل‌توجهی افزایش می‌دهد.',
        'High Risk: Erythromycin inhibits metabolism of Valproic Acid, leading to potential toxicity.': 'خطر بالا: اریترومایسین متابولیسم والپروئیک اسید را مهار می‌کند و ممکن است به سمیت منجر شود.',
        'High Risk: Fluconazole inhibits CYP enzymes, increasing Diazepam concentrations.': 'خطر بالا: فلوکونازول آنزیم‌های CYP را مهار می‌کند و غلظت دیازپام را افزایش می‌دهد.',
        'High Risk: Fluconazole inhibits CYP3A4, increasing Fentanyl concentrations and toxicity risk.': 'خطر بالا: فلوکونازول CYP3A4 را مهار می‌کند و غلظت فنتانیل و خطر سمیت را افزایش می‌دهد.',
        'High Risk: Fluconazole inhibits CYP3A4, increasing Midazolam plasma concentrations and risk of prolonged sedation.': 'خطر بالا: فلوکونازول CYP3A4 را مهار می‌کند و غلظت پلاسمایی میدازولام و خطر آرام‌بخشی طولانی را افزایش می‌دهد.',
        'High Risk: Fluconazole inhibits CYP3A4, significantly increasing Carbamazepine toxicity.': 'خطر بالا: فلوکونازول CYP3A4 را مهار می‌کند و سمیت کاربامازپین را به‌طور قابل‌توجهی افزایش می‌دهد.',
        'High Risk: Fluconazole inhibits phenytoin metabolism, increasing the risk of phenytoin toxicity.': 'خطر بالا: فلوکونازول متابولیسم فنی‌توئین را مهار می‌کند و خطر سمیت فنی‌توئین را افزایش می‌دهد.',
        'High Risk: In vitro antagonism. Both drugs compete for the same 50S ribosomal binding site.': 'خطر بالا: آنتاگونیسم آزمایشگاهی. هر دو دارو بر سر جایگاه اتصال ریبوزومی ۵۰S رقابت می‌کنند.',
        'High Risk: Increased ototoxicity and nephrotoxicity.': 'خطر بالا: افزایش سمیت شنوایی و کلیوی.',
        'High Risk: Increased risk of Serotonin Syndrome or hypertensive crisis.': 'خطر بالا: افزایش خطر سندرم سروتونین یا بحران فشار خون.',
        'High Risk: Increased risk of Serotonin Syndrome.': 'خطر بالا: افزایش خطر سندرم سروتونین.',
        'High Risk: Increased risk of acute kidney injury (AKI). Monitor renal function closely.': 'خطر بالا: افزایش خطر آسیب حاد کلیه (AKI). عملکرد کلیه به‌دقت پایش شود.',
        'High Risk: Increased risk of extrapyramidal symptoms (EPS) and neuroleptic malignant syndrome.': 'خطر بالا: افزایش خطر علائم اکستراپیرامیدال (EPS) و سندرم بدخیم نورولپتیک.',
        'High Risk: Increased risk of hyperammonemia with or without encephalopathy.': 'خطر بالا: افزایش خطر هایپرآمونمی با یا بدون انسفالوپاتی.',
        'High Risk: Increased risk of ototoxicity and permanent hearing impairment.': 'خطر بالا: افزایش خطر سمیت شنوایی و آسیب دائمی شنوایی.',
        'High Risk: Increased risk of severe CNS depression and respiratory failure.': 'خطر بالا: افزایش خطر دپرسیون شدید سیستم عصبی مرکزی و نارسایی تنفسی.',
        'High Risk: Iron decreases Levothyroxine absorption. Separate administration by at least 4 hours.': 'خطر بالا: آهن جذب لووتیروکسین را کاهش می‌دهد. مصرف را حداقل ۴ ساعت جدا کنید.',
        'High Risk: Iron severely decreases Ciprofloxacin absorption. Separate administration.': 'خطر بالا: آهن جذب سیپروفلوکساسین را به‌شدت کاهش می‌دهد. زمان مصرف جدا شود.',
        'High Risk: Iron severely decreases Doxycycline absorption. Separate administration.': 'خطر بالا: آهن جذب داکسی‌سایکلین را به‌شدت کاهش می‌دهد. زمان مصرف جدا شود.',
        "High Risk: Linezolid's MAOI activity can enhance the sympathomimetic effects of Salbutamol (tachycardia/hypertension).": 'خطر بالا: فعالیت MAOI لینزولید می‌تواند اثرات سمپاتومیمتیک سالبوتامول (تاکی‌کاردی/فشار خون) را تشدید کند.',
        'High Risk: Macrolides inhibit CYP3A4, significantly increasing Midazolam levels and prolonging sedation/respiratory depression.': 'خطر بالا: ماکرولیدها CYP3A4 را مهار می‌کنند و سطح میدازولام را به‌طور قابل‌توجهی افزایش و آرام‌بخشی/دپرسیون تنفسی را طولانی می‌کنند.',
        'High Risk: Magnesium severely decreases Ciprofloxacin absorption. Separate administration times.': 'خطر بالا: منیزیم جذب سیپروفلوکساسین را به‌شدت کاهش می‌دهد. زمان مصرف جدا شود.',
        'High Risk: Magnesium severely decreases Doxycycline absorption. Separate administration times.': 'خطر بالا: منیزیم جذب داکسی‌سایکلین را به‌شدت کاهش می‌دهد. زمان مصرف جدا شود.',
        'High Risk: Markedly increases Theophylline serum levels, precipitating toxicity.': 'خطر بالا: سطح سرمی تئوفیلین را به‌طور چشمگیری افزایش و سمیت را ایجاد می‌کند.',
        'High Risk: Metronidazole inhibits CYP3A4, increasing Carbamazepine levels and risk of toxicity.': 'خطر بالا: مترونیدازول CYP3A4 را مهار می‌کند و سطح کاربامازپین و خطر سمیت را افزایش می‌دهد.',
        'High Risk: Metronidazole inhibits Phenytoin metabolism, potentially leading to toxic serum levels.': 'خطر بالا: مترونیدازول متابولیسم فنی‌توئین را مهار می‌کند و ممکن است به سطوح سرمی سمی منجر شود.',
        'High Risk: Mutual induction of metabolism, leading to unpredictable serum levels.': 'خطر بالا: القای متقابل متابولیسم که به سطوح سرمی غیرقابل‌پیش‌بینی منجر می‌شود.',
        'High Risk: Mutual metabolic inhibition significantly increasing serum levels of both drugs.': 'خطر بالا: مهار متقابل متابولیک که سطح سرمی هر دو دارو را به‌طور قابل‌توجهی افزایش می‌دهد.',
        'High Risk: NSAIDs blunt diuretic effect and increase risk of acute renal failure.': 'خطر بالا: NSAIDها اثر مدر را کاهش و خطر نارسایی حاد کلیه را افزایش می‌دهند.',
        'High Risk: NSAIDs reduce the efficacy of loop diuretics and increase nephrotoxicity.': 'خطر بالا: NSAIDها اثربخشی مدرهای لوپ را کاهش و سمیت کلیوی را افزایش می‌دهند.',
        'High Risk: Omeprazole inhibits CYP2C19, decreasing Diazepam clearance and prolonging its effects.': 'خطر بالا: امپرازول CYP2C19 را مهار می‌کند و کلیرانس دیازپام را کاهش و اثر آن را طولانی می‌کند.',
        'High Risk: Phenobarbital induces CYP enzymes, increasing acetaminophen hepatotoxic metabolites.': 'خطر بالا: فنوباربیتال آنزیم‌های CYP را القا می‌کند و متابولیت‌های کبدی‌سمی استامینوفن را افزایش می‌دهد.',
        'High Risk: Phenobarbital induces hepatic metabolism of Theophylline, significantly reducing its serum levels.': 'خطر بالا: فنوباربیتال متابولیسم کبدی تئوفیلین را القا می‌کند و سطح سرمی آن را به‌طور قابل‌توجهی کاهش می‌دهد.',
        'High Risk: Phenobarbital induces hepatic metabolism of corticosteroids, reducing efficacy.': 'خطر بالا: فنوباربیتال متابولیسم کبدی کورتیکواستروئیدها را القا و اثربخشی را کاهش می‌دهد.',
        'High Risk: Phenobarbital induces metabolism of Doxycycline, decreasing its half-life.': 'خطر بالا: فنوباربیتال متابولیسم داکسی‌سایکلین را القا و نیمه‌عمر آن را کاهش می‌دهد.',
        'High Risk: Phenobarbital induces metabolism of Metronidazole, potentially leading to treatment failure.': 'خطر بالا: فنوباربیتال متابولیسم مترونیدازول را القا می‌کند و ممکن است به شکست درمان منجر شود.',
        'High Risk: Phenytoin decreases steroid blood levels, compromising therapeutic efficacy.': 'خطر بالا: فنی‌توئین سطح خونی استروئید را کاهش و اثربخشی درمانی را مختل می‌کند.',
        'High Risk: Phenytoin increases the metabolism and clearance of Levothyroxine.': 'خطر بالا: فنی‌توئین متابولیسم و کلیرانس لووتیروکسین را افزایش می‌دهد.',
        'High Risk: Phenytoin increases toxic metabolite of acetaminophen, elevating risk of hepatotoxicity.': 'خطر بالا: فنی‌توئین متابولیت سمی استامینوفن را افزایش و خطر سمیت کبدی را بالا می‌برد.',
        'High Risk: Phenytoin induces hepatic metabolism of corticosteroids, reducing efficacy.': 'خطر بالا: فنی‌توئین متابولیسم کبدی کورتیکواستروئیدها را القا و اثربخشی را کاهش می‌دهد.',
        'High Risk: Phenytoin induces metabolism of Doxycycline, decreasing its half-life.': 'خطر بالا: فنی‌توئین متابولیسم داکسی‌سایکلین را القا و نیمه‌عمر آن را کاهش می‌دهد.',
        'High Risk: Phenytoin strongly induces the metabolism of Theophylline, potentially reducing its efficacy and asthma control.': 'خطر بالا: فنی‌توئین متابولیسم تئوفیلین را به‌شدت القا می‌کند و ممکن است اثربخشی آن و کنترل آسم را کاهش دهد.',
        'High Risk: Potent synergistic respiratory depression and severe hypotension.': 'خطر بالا: دپرسیون تنفسی هم‌افزای قوی و افت شدید فشار خون.',
        'High Risk: Profound additive CNS and respiratory depression.': 'خطر بالا: دپرسیون تجمعی عمیق سیستم عصبی مرکزی و تنفسی.',
        'High Risk: Profound central nervous system (CNS) and respiratory depression.': 'خطر بالا: دپرسیون عمیق سیستم عصبی مرکزی (CNS) و تنفسی.',
        'High Risk: Profound central nervous system (CNS) and severe respiratory depression.': 'خطر بالا: دپرسیون عمیق سیستم عصبی مرکزی (CNS) و دپرسیون تنفسی شدید.',
        'High Risk: Propranolol antagonizes bronchodilation and decreases Theophylline clearance, increasing toxicity.': 'خطر بالا: پروپرانولول با گشادی برونش مقابله و کلیرانس تئوفیلین را کاهش می‌دهد و سمیت را افزایش می‌دهد.',
        'High Risk: Rifampin increases clearance of corticosteroids, markedly reducing efficacy.': 'خطر بالا: ریفامپین کلیرانس کورتیکواستروئیدها را افزایش و اثربخشی را به‌طور چشمگیری کاهش می‌دهد.',
        'High Risk: Rifampin increases clearance of corticosteroids, requiring higher steroid doses.': 'خطر بالا: ریفامپین کلیرانس کورتیکواستروئیدها را افزایش می‌دهد و به دوز استروئید بالاتری نیاز است.',
        'High Risk: Rifampin induces hepatic metabolism, decreasing Doxycycline half-life and efficacy.': 'خطر بالا: ریفامپین متابولیسم کبدی را القا می‌کند و نیمه‌عمر و اثربخشی داکسی‌سایکلین را کاهش می‌دهد.',
        'High Risk: Rifampin strongly induces metabolism of Phenytoin, significantly reducing seizure control.': 'خطر بالا: ریفامپین متابولیسم فنی‌توئین را به‌شدت القا می‌کند و کنترل تشنج را به‌طور قابل‌توجهی کاهش می‌دهد.',
        'High Risk: Rifampin strongly induces metabolism, significantly decreasing Fluconazole levels.': 'خطر بالا: ریفامپین متابولیسم را به‌شدت القا می‌کند و سطح فلوکونازول را به‌طور قابل‌توجهی کاهش می‌دهد.',
        'High Risk: Severe extrapyramidal reactions (EPS), dystonia, and neuroleptic malignant syndrome risk.': 'خطر بالا: واکنش‌های شدید اکستراپیرامیدال (EPS)، دیستونی و خطر سندرم بدخیم نورولپتیک.',
        'High Risk: Severe respiratory depression and airway compromise. Resuscitation equipment must be ready.': 'خطر بالا: دپرسیون تنفسی شدید و اختلال راه هوایی. تجهیزات احیا باید آماده باشد.',
        'High Risk: Severe respiratory depression and hypotension. Monitor airway continuously.': 'خطر بالا: دپرسیون تنفسی شدید و افت فشار خون. راه هوایی به‌طور مداوم پایش شود.',
        'High Risk: Significantly increases Theophylline serum levels, increasing risk of toxicity.': 'خطر بالا: سطح سرمی تئوفیلین را به‌طور قابل‌توجهی افزایش و خطر سمیت را بالا می‌برد.',
        'High Risk: Synergistic CNS and respiratory depression.': 'خطر بالا: دپرسیون هم‌افزای سیستم عصبی مرکزی و تنفسی.',
        'High Risk: Synergistic CNS and respiratory depression. Monitor patient closely.': 'خطر بالا: دپرسیون هم‌افزای سیستم عصبی مرکزی و تنفسی. بیمار به‌دقت پایش شود.',
        'High Risk: Synergistic CNS and severe respiratory depression risk.': 'خطر بالا: خطر دپرسیون هم‌افزای سیستم عصبی مرکزی و دپرسیون تنفسی شدید.',
        'High Risk: Synergistic CNS depression leading to prolonged recovery times.': 'خطر بالا: دپرسیون هم‌افزای سیستم عصبی مرکزی که به طولانی‌شدن زمان ریکاوری منجر می‌شود.',
        'High Risk: Synergistic CNS depression.': 'خطر بالا: دپرسیون هم‌افزای سیستم عصبی مرکزی.',
        'High Risk: Synergistic central nervous system (CNS) and respiratory depression.': 'خطر بالا: دپرسیون هم‌افزای سیستم عصبی مرکزی (CNS) و تنفسی.',
        'High Risk: Synergistic nephrotoxicity and ototoxicity. Monitor serum levels and renal function closely.': 'خطر بالا: سمیت کلیوی و شنوایی هم‌افزا. سطوح سرمی و عملکرد کلیه به‌دقت پایش شود.',
        'High Risk: Synergistic nephrotoxicity. Strict monitoring required.': 'خطر بالا: سمیت کلیوی هم‌افزا. پایش دقیق لازم است.',
        'High Risk: Synergistic potassium depletion. Increased risk of severe hypokalemia.': 'خطر بالا: تخلیه هم‌افزای پتاسیم. افزایش خطر هیپوکالمی شدید.',
        'High Risk: Synergistic severe respiratory depression and hemodynamic instability.': 'خطر بالا: دپرسیون تنفسی شدید هم‌افزا و ناپایداری همودینامیک.',
        'High Risk: Synergistic severe respiratory depression and profound hypotension.': 'خطر بالا: دپرسیون تنفسی شدید هم‌افزا و افت عمیق فشار خون.',
        'High Risk: Trimethoprim acts as a potassium-sparing diuretic, significantly increasing the risk of hyperkalemia.': 'خطر بالا: تری‌متوپریم مانند یک مدر نگهدارنده پتاسیم عمل می‌کند و خطر هایپرکالمی را به‌طور قابل‌توجهی افزایش می‌دهد.',
        'High Risk: Unopposed alpha-adrenergic activity leading to severe hypertension and reflex bradycardia.': 'خطر بالا: فعالیت آلفا-آدرنرژیک بدون مهار که به فشار خون شدید و برادی‌کاردی رفلکسی منجر می‌شود.',
        'High Risk: Valproate increases Phenobarbital levels significantly, causing severe sedation and coma.': 'خطر بالا: والپروات سطح فنوباربیتال را به‌طور قابل‌توجهی افزایش می‌دهد و باعث آرام‌بخشی شدید و کوما می‌شود.',
        'High Risk: Voriconazole inhibits CYP3A4, significantly increasing Fentanyl levels and respiratory depression.': 'خطر بالا: ووریکونازول CYP3A4 را مهار می‌کند و سطح فنتانیل و دپرسیون تنفسی را به‌طور قابل‌توجهی افزایش می‌دهد.',
        "Moderate Risk: Additive CNS depression and potential antagonism of Metoclopramide's prokinetic effect.": 'خطر متوسط: دپرسیون تجمعی سیستم عصبی مرکزی و احتمال مقابله با اثر پروکینتیک متوکلوپرامید.',
        'Moderate Risk: Antagonistic effect. Non-selective beta-blockers negate bronchodilating effect of Salbutamol.': 'خطر متوسط: اثر آنتاگونیستی. بتابلاکرهای غیرانتخابی اثر گشادکننده برونش سالبوتامول را خنثی می‌کنند.',
        'Moderate Risk: Anticholinergic effects of Diphenhydramine antagonize the GI motility effects of Metoclopramide. Additive CNS depression.': 'خطر متوسط: اثرات آنتی‌کولینرژیک دیفن‌هیدرامین با اثرات حرکتی گوارشی متوکلوپرامید مقابله می‌کنند. دپرسیون تجمعی سیستم عصبی مرکزی.',
        'Moderate Risk: Calcium significantly impairs oral iron absorption. Separate administration by 2 hours.': 'خطر متوسط: کلسیم جذب خوراکی آهن را به‌طور قابل‌توجهی مختل می‌کند. مصرف را ۲ ساعت جدا کنید.',
        'Moderate Risk: Decreased gastric acidity lowers absorption of elemental iron.': 'خطر متوسط: کاهش اسیدیته معده جذب آهن عنصری را کاهش می‌دهد.',
        'Moderate Risk: Ibuprofen may displace Valproic Acid from protein binding, altering its free levels.': 'خطر متوسط: ایبوپروفن ممکن است والپروئیک اسید را از اتصال پروتئینی جابه‌جا کند و سطح آزاد آن را تغییر دهد.',
        'Moderate Risk: Increased gastric pH decreases absorption of oral Cefuroxime.': 'خطر متوسط: افزایش pH معده جذب سفوروکسیم خوراکی را کاهش می‌دهد.',
        'Moderate Risk: Increased risk of gastrointestinal bleeding and ulceration.': 'خطر متوسط: افزایش خطر خونریزی و زخم گوارشی.',
        'Moderate Risk: Markedly increased risk of gastrointestinal mucosal ulceration and bleeding.': 'خطر متوسط: افزایش چشمگیر خطر زخم و خونریزی مخاط گوارشی.',
        'Moderate Risk: PPIs increase gastric pH, which may decrease the absorption of Levothyroxine.': 'خطر متوسط: PPIها pH معده را افزایش می‌دهند که ممکن است جذب لووتیروکسین را کاهش دهد.',
        'Moderate Risk: Synergistic GI toxicity and ulceration risk.': 'خطر متوسط: سمیت گوارشی هم‌افزا و خطر زخم.',
        'Moderate Risk: Valproic Acid decreases the clearance of Lorazepam, potentially increasing its effects.': 'خطر متوسط: والپروئیک اسید کلیرانس لورازپام را کاهش می‌دهد و ممکن است اثرات آن را افزایش دهد.',
        'Moderate Risk: Valproic Acid displaces Diazepam from protein binding sites and inhibits its metabolism.': 'خطر متوسط: والپروئیک اسید دیازپام را از جایگاه‌های اتصال پروتئینی جابه‌جا و متابولیسم آن را مهار می‌کند.'
    };


    // --- Fixed-dose administration instructions (topical, sprays, drops, sachets,
    //     powders, etc.) — the `fixedDose` field shown as the result for drugs that
    //     are not weight/age calculated. Numbers/units kept; wording translated. ---
    const FIXED_DOSE_FA = {
        'Apply thin layer': 'لایه نازک بمالید',
        'Apply 5 times daily': 'روزی ۵ بار بمالید',
        'Apply small amount': 'مقدار کمی بمالید',
        'Apply as needed': 'در صورت نیاز بمالید',
        '1 spray each nostril': '۱ اسپری در هر سوراخ بینی',
        '1-2 sprays': '۱ تا ۲ اسپری',
        '1 suppository PRN': '۱ شیاف در صورت نیاز',
        '5-10 mg (for children over 6 years)': '۵ تا ۱۰ میلی‌گرم (برای کودکان بالای ۶ سال)',
        '10-20 mg/dose': '۱۰ تا ۲۰ میلی‌گرم در هر دوز',
        '1 ml daily': 'روزی ۱ میلی‌لیتر',
        '1 ml (400 IU) daily': 'روزی ۱ میلی‌لیتر (۴۰۰ واحد)',
        '1-2 ml (100000-200000U) 4 times daily': 'روزی ۴ بار، ۱ تا ۲ میلی‌لیتر (۱۰۰۰۰۰ تا ۲۰۰۰۰۰ واحد)',
        '0.3-0.6 ml': '۰.۳ تا ۰.۶ میلی‌لیتر',
        '1 Sachet': '۱ ساشه',
        'As per weight': 'بر اساس وزن',
        '1 sachet in 200ml water': '۱ ساشه در ۲۰۰ میلی‌لیتر آب',
        '1 sachet daily': 'روزی ۱ ساشه',
        '10-20 mg daily': 'روزی ۱۰ تا ۲۰ میلی‌گرم',
        '4 mg daily': 'روزی ۴ میلی‌گرم',
        '5 mg daily': 'روزی ۵ میلی‌گرم',
        'Based on Age/Weight': 'بر اساس سن/وزن',
        'Age-Based Dose': 'دوز بر اساس سن',
        'Weight-based tier': 'رده بر اساس وزن',
        '2 puffs (as needed)': '۲ پاف (در صورت نیاز)',
        '200-400 mcg twice daily': 'روزی دو بار ۲۰۰ تا ۴۰۰ میکروگرم',
        '2 puffs 4 times daily': 'روزی ۴ بار، ۲ پاف',
        '125-250 mcg twice daily': 'روزی دو بار ۱۲۵ تا ۲۵۰ میکروگرم',
        '50-100 mcg twice daily': 'روزی دو بار ۵۰ تا ۱۰۰ میکروگرم',
        '1-2 puffs twice daily': 'روزی دو بار ۱ تا ۲ پاف',
        '0.25 - 1 mg/dose (Asthma) / 2 mg (Croup)': '۰.۲۵ تا ۱ میلی‌گرم در هر دوز (آسم) / ۲ میلی‌گرم (کروپ)',
        '250 mcg (<20kg) | 500 mcg (>20kg)': '۲۵۰ میکروگرم (زیر ۲۰kg) | ۵۰۰ میکروگرم (بالای ۲۰kg)',
        '3 to 4 ml via nebulizer': '۳ تا ۴ میلی‌لیتر با نبولایزر',
        'Single IM injection': 'یک تزریق عضلانی منفرد',
        '0.15 mg IM (for 15-30 kg weight)': '۰.۱۵ میلی‌گرم عضلانی (برای وزن ۱۵ تا ۳۰ کیلوگرم)',
        '1 pearl weekly/monthly (Based on deficiency)': '۱ پرل هفتگی/ماهانه (بر اساس شدت کمبود)',
        '1 pearl daily': 'روزی ۱ پرل',
        '10-15 mg/kg (max 1000mg)': '۱۰ تا ۱۵ mg/kg (حداکثر ۱۰۰۰ میلی‌گرم)'
    };

    /**
     * Resolve a localized version of a data string. In Persian mode it looks the
     * exact English source up in the relevant map and returns the Persian text if
     * present; in English mode (or when no translation exists) it returns the
     * original English string unchanged — so English is always a safe fallback.
     * @param {'drug'|'indication'|'indicationDose'|'clinical'|'fixedDose'} kind
     * @param {string} en the exact English source string
     */
    function resolveFa(kind, en) {
        if (getLang() !== 'fa') return en;
        const map = kind === 'drug' ? DRUG_NAME_FA
            : kind === 'indication' ? INDICATION_FA
            : kind === 'indicationDose' ? INDICATION_DOSE_FA
            : kind === 'clinical' ? CLINICAL_MSG_FA
            : kind === 'fixedDose' ? FIXED_DOSE_FA
            : null;
        if (!map) return en;
        return map[en] ?? en;
    }

    if (typeof window !== 'undefined') {
        window.PediCalcFa = { DRUG_NAME_FA, INDICATION_FA, INDICATION_DOSE_FA, CLINICAL_MSG_FA, resolveFa };
    }

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
            if (hours === 0) return t('interval.single');
            return t('interval.hours', { h: hours });
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
                if (!activeConc || activeConc <= 0) return `<strong style="color: var(--danger-500);"><i class="fas fa-exclamation-triangle"></i> ${escapeHtml(t('guide.concZero'))}</strong>`;

                const minCc = parseFloat((minDose / activeConc).toFixed(2)).toString();
                const maxCc = parseFloat((maxDose / activeConc).toFixed(2)).toString();
                // In the guide, `تا` sits between the two numbers and the volume unit
                // is localized (ml → میلی‌لیتر) so the whole Persian line reads cleanly
                // right-to-left with no Latin/RTL scrambling.
                const mlUnit = t('unit.ml');
                const value = (minCc === maxCc) ? `${minCc} ${mlUnit}` : `${joinRange(minCc, maxCc)} ${mlUnit}`;
                return `<strong class="dose-value">${escapeHtml(value)}</strong> <span class="dose-freq">${escapeHtml(intervalText)}</span>`;
            }

            if (validation.isFixedDose) {
                return `<strong class="dose-value">${escapeHtml(validation.calculatedFixedDose)}</strong> <span class="dose-freq">${escapeHtml(intervalText)}</span>`;
            }

            return escapeHtml(t('guide.asPrescribed'));
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

    // ===== src/core/clinical-engine.js =====
    // src/core/clinical-engine.js
    // Behavioural layer over ClinicalRulesDB: IV guidelines, organ-impairment
    // adjustments, allergy cross-reactivity, drug-drug interactions and neonatal
    // PMA protocols. This module holds logic only; all data lives in
    // src/data/clinical-rules.data.js.


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

    const AdvancedClinicalEngine = {
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
            result.calculatedFixedDose = this.drug.fixedDose ? resolveFa('fixedDose', this.drug.fixedDose) : t('dyn.applyThin');
            result.displayResult = result.calculatedFixedDose;
            return result;
        }

        _calculateFixedOrAgeBased(result) {
            result.isFixedDose = true;
            result.calculatedFixedDose = resolveFa('fixedDose', this.drug.fixedDose);

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
                    result.calculatedFixedDose = `${joinRange(parsedMin, parsedMax)} ${unitLabel}`;
                }
            }

            result.displayResult = result.calculatedFixedDose;
            return result;
        }

        _calculatePowderFixed(result) {
            result.isFixedDose = true;
            result.calculatedFixedDose = resolveFa('fixedDose', this.drug.fixedDose);
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
                result.displayResult = this._formatRange(result.minDose, result.maxDose);
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
                        <div class="formula-line volume-line" style="background: var(--primary-100); padding: 8px; border-radius: var(--radius-sm); margin-top: 8px; border: 1px solid var(--primary-300);">
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
                            <span class="f-result">= <strong>${escapeHtml(this._formatNumEn(result.minDose))}</strong></span>
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
                        <span class="f-result">= <strong>${escapeHtml(this._formatNumEn(result.minDose))}</strong></span>
                    </div>
                    <div class="formula-line">
                        <span class="f-desc">Max: ${escapeHtml(weightStr)} × ${escapeHtml(max)} ${perKgUnit} ${isCappedMax ? escapeHtml(t('formula.capped')) : ''}</span>
                        <span class="f-result">= <strong>${escapeHtml(this._formatNumEn(result.maxDose))}</strong></span>
                    </div>
                    ${result.dailyMaxDisplay && result.dailyMax > 0 ? `<div class="formula-line"><span class="f-desc">${escapeHtml(t('formula.dailyMax'))}</span><span class="f-result"><strong>${escapeHtml(result.dailyMax)}${dailyMaxUnit}</strong></span></div>` : ''}
                    ${volumeHTML}
                </div>
            `;
        }

        /**
         * Split a formatted dose into its numeric value and its (English) unit token.
         * Returns e.g. { value: '120', unit: 'mg' } or { value: '1.2', unit: 'g' }.
         * The unit token is the canonical English label; localize it with _unitLabel().
         */
        _formatParts(n) {
            const unit = Utils.resolveDoseUnit(this.drug).toLowerCase();

            if (unit === 'units' || unit === 'iu' || unit === 'u') {
                return { value: n.toLocaleString(), unit: 'Units' };
            }
            if (unit === 'meq') {
                return { value: parseFloat(n.toFixed(2)).toString(), unit: 'mEq' };
            }
            if (unit === 'mcg') {
                return { value: parseFloat(n.toFixed(1)).toString(), unit: 'mcg' };
            }

            if (n >= 1000) return { value: (n / 1000).toFixed(1), unit: 'g' };
            if (n < 0.1) return { value: parseFloat(n.toFixed(3)).toString(), unit: 'mg' }; // micro-dosing < 0.1
            if (n < 1) return { value: parseFloat(n.toFixed(2)).toString(), unit: 'mg' };   // micro-dosing < 1.0
            return { value: parseFloat(n.toFixed(1)).toString(), unit: 'mg' };
        }

        /** Localize an English unit token ('mg','g','mcg','mEq','Units') for display. */
        _unitLabel(unitToken) {
            const key = {
                'mg': 'unit.mg', 'g': 'unit.g', 'mcg': 'unit.mcg',
                'mEq': 'unit.meq', 'Units': 'unit.units'
            }[unitToken];
            return key ? t(key) : unitToken;
        }

        /** Language-aware "value unit" (localized unit). Used for the per-dose amount. */
        _formatNum(n) {
            const { value, unit } = this._formatParts(n);
            return `${value} ${this._unitLabel(unit)}`;
        }

        /** Always-English "value unit". Used inside the LTR formula box. */
        _formatNumEn(n) {
            const { value, unit } = this._formatParts(n);
            return `${value} ${unit}`;
        }

        /**
         * Build the displayed per-dose amount. In every language the unit is written
         * once at the end when both bounds share the same unit
         * (e.g. «۱۲۰ تا ۱۸۰ میلی‌گرم» / "120 to 180 mg"). If the two bounds resolve to
         * different units (e.g. 800 mg vs 1.2 g) each keeps its own unit.
         */
        _formatRange(min, max) {
            if (nearlyEqual(min, max)) return this._formatNum(min);
            const a = this._formatParts(min);
            const b = this._formatParts(max);
            // In Persian, write the unit ONCE at the end (localized) when both bounds
            // share it, e.g. «۱۲۰ تا ۱۸۰ میلی‌گرم». In English keep the original
            // per-value form ("120 mg to 180 mg"). If the two bounds resolve to
            // different units (e.g. 800 mg vs 1.2 g) always keep the unit on both.
            if (getLang() === 'fa' && a.unit === b.unit) {
                return `${joinRange(a.value, b.value)} ${this._unitLabel(a.unit)}`;
            }
            return joinRange(this._formatNum(min), this._formatNum(max));
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


    function featureListItem(text) {
        return `
            <li style="display: flex; align-items: center; margin-bottom: 14px; color: #374151; font-size: 0.9rem; font-weight: 600;">
                <i class="fas fa-check-circle" style="color: #10b981; margin-left: 12px; margin-right: 12px; font-size: 1.2rem;"></i>
                ${Utils.escapeHtml(text)}
            </li>`;
    }

    function buildModalMarkup() {
        const features = [t('premium.feat1'), t('premium.feat2'), t('premium.feat3'), t('premium.feat4')];
        const dir = isRTL() ? 'rtl' : 'ltr';
        const align = isRTL() ? 'right' : 'left';
        return `
    <div class="modal-container" style="border-radius: 20px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.2); padding: 0; max-width: 90%; width: 360px; margin: auto; align-self: center;">
        <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); padding: 35px 20px 25px; text-align: center; position: relative; border-bottom: 1px solid #fde68a;">
            <button class="modal-close premium-close-btn-top" style="position: absolute; top: 15px; right: 15px; background: white; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer;">
                <i class="fas fa-times" style="color: #9ca3af; font-size: 14px;"></i>
            </button>
            <div style="width: 75px; height: 75px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); border: 4px solid white;">
                <i class="fas fa-crown" style="color: white; font-size: 34px;"></i>
            </div>
            <h3 style="color: #92400e; font-size: 1.5rem; font-weight: 900; margin: 0; font-family: inherit;">${Utils.escapeHtml(t('premium.title'))}</h3>
            <p style="color: #b45309; font-size: 0.85rem; margin-top: 8px; font-weight: 600;">${Utils.escapeHtml(t('premium.subtitle'))}</p>
        </div>
        <div class="modal-body" style="padding: 25px 25px 20px; background: white; text-align: ${align}; direction: ${dir};">
            <ul style="list-style: none; padding: 0; margin: 0 0 25px 0;">
                ${features.map(featureListItem).join('')}
            </ul>
            <button id="buyPremiumBtn" style="width: 100%; padding: 14px; font-size: 1.05rem; font-weight: 800; font-family: inherit; color: white; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 15px rgba(217, 119, 6, 0.35); display: flex; align-items: center; justify-content: center; gap: 8px;">
                <i class="fas fa-gem"></i> ${Utils.escapeHtml(t('premium.buy'))}
            </button>
            <div style="text-align: center; margin-top: 15px;">
                <span style="font-size: 0.7rem; color: #9ca3af; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
                    <i class="fas fa-shield-alt"></i> ${Utils.escapeHtml(t('premium.securePay'))}
                </span>
            </div>
        </div>
    </div>`;
    }

    /** Show the premium upsell modal, (re)building its markup in the current language. */
    function showPremiumModal() {
        let modal = document.getElementById('premium-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'premium-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }
        // Rebuild every time so the content matches the current language.
        modal.innerHTML = buildModalMarkup();

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

        modal.classList.add('active');
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
                <i class="fas fa-file-medical"></i> ${Utils.escapeHtml(t('cart.active', { n: State.prescriptionList.length }))}
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; padding-top: 8px;">
                ${State.prescriptionList.map(name => `
                    <div style="position: relative; background: white; padding: 6px 14px; border-radius: var(--radius-sm); font-size: 0.75rem; font-weight: 700; border: 1px solid var(--danger-200); color: var(--danger-800); box-shadow: var(--shadow-sm);">
                        ${Utils.escapeHtml(resolveFa('drug', name))}
                        <div class="remove-from-cart" data-name="${Utils.escapeHtml(name)}" style="position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; background: var(--danger-500); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.2s; z-index: 2;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="font-size: 0.65rem; color: var(--danger-600); margin-top: 12px;">
                ${Utils.escapeHtml(t('cart.autocheck'))}
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
                                activeCartBtn.innerHTML = `<i class="fas fa-plus-circle"></i> ${Utils.escapeHtml(t('cart.add'))}`;
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

    /** Localized "per kg" unit label for a drug's base dose (e.g. mg/kg → میلی‌گرم بر کیلوگرم). */
    function perKgUnitLabel(drug) {
        const key = {
            'mg': 'unitkg.mg', 'g': 'unitkg.g', 'mcg': 'unitkg.mcg',
            'mEq': 'unitkg.meq', 'Units': 'unitkg.units'
        }[Utils.resolveDoseUnit(drug)];
        return key ? t(key) : 'mg/kg';
    }

    /** Format a base per-kg dose range: "min[ تا max] <localized unit/kg>". */
    function formatBaseDose(min, max, drug) {
        const range = (min === max) ? `${min}` : joinRange(min, max);
        return `${range} ${perKgUnitLabel(drug)}`;
    }

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

    function renderDrugs() {
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
            <input type="number" class="calc-age-input" step="0.01" min="0" max="18" placeholder="${esc(t('calc.age'))}" autocomplete="off" />
        ` : '';

        const weightInputHTML = requiresWeight ? `
            <input type="number" class="calc-weight-input" step="0.1" min="0.5" max="150" placeholder="${esc(t('calc.weight'))}" autocomplete="off" />
            <input type="number" class="calc-height-input" step="1" min="30" max="250" placeholder="${esc(t('calc.height'))}" autocomplete="off" />
        ` : `<input type="hidden" class="calc-weight-input" value="0" />`;

        // Base-dose display: unit is localized (fa: «میلی‌گرم بر کیلوگرم») and the
        // range uses تا in Persian / to in English; "Standard or Age-based" is translated.
        const baseDoseDisplay = (drug.indicationDoses && drug.indicationDoses.length > 0)
            ? formatBaseDose(drug.indicationDoses[0].minMgPerKg, drug.indicationDoses[0].maxMgPerKg, drug)
            : (drug.fixedDose ? t('calc.standardOrAge') : formatBaseDose(drug.minMgPerKg, drug.maxMgPerKg, drug));

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
        const buttonContent = (!requiresWeight && !drug.requiresAge) ? `<i class="fas fa-file-prescription" style="margin-right: 6px;"></i> ${esc(t('calc.showInstructions'))}` : '<img src="assets/arrow.png" alt="Calculate" class="calc-arrow-icon" style="width: 24px; height: 24px; object-fit: contain; display: block;" />';

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
                    dynamicBaseDoseDisplay.textContent = formatBaseDose(selectedIndicationObj.minMgPerKg, selectedIndicationObj.maxMgPerKg, drug);

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
            // Topical / spray / sachet / powder doses are fixed instructions, not a
            // weight×dose calculation, so the formula box is redundant — hide it.
            const showFormula = !['ointment', 'cream', 'gel', 'spray', 'sachet', 'powder'].includes(drug.category);

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
                ${showFormula ? calculator.getFormulaHTML(doseResult) : ''}

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

    // ===== src/ui/i18n-dom.js =====
    // src/ui/i18n-dom.js
    // Applies translations to the STATIC markup in index.html that carries
    // data-i18n* attributes, and wires the header language-toggle button.
    //
    // Attributes supported on any element:
    //   data-i18n="key"                 -> sets textContent
    //   data-i18n-placeholder="key"     -> sets placeholder
    //   data-i18n-aria="key"            -> sets aria-label
    //   data-i18n-content="key"         -> sets the content attribute (e.g. <meta>)
    //   data-i18n-args='{"n":0}'        -> optional JSON interpolation args for the key


    function argsFor(el) {
        const raw = el.getAttribute('data-i18n-args');
        if (!raw) return undefined;
        try { return JSON.parse(raw); } catch { return undefined; }
    }

    /** Translate every element in the document that carries a data-i18n* attribute. */
    function applyStaticTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.getAttribute('data-i18n'), argsFor(el));
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
        });
        document.querySelectorAll('[data-i18n-aria]').forEach(el => {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
        });
        document.querySelectorAll('[data-i18n-content]').forEach(el => {
            el.setAttribute('content', t(el.getAttribute('data-i18n-content')));
        });
    }

    /**
     * Wire the header language toggle. `onChange` is invoked after the language
     * switches so the caller can re-render the dynamic parts (categories, drug list).
     */
    function setupLanguageToggle(onChange) {
        applyLanguage(); // set <html> lang/dir for the persisted/default language
        applyStaticTranslations();

        const btn = document.getElementById('langToggleBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                toggleLang();
            });
        }

        onLangChange(() => {
            applyStaticTranslations();
            if (typeof onChange === 'function') onChange(getLang());
        });
    }

    // ===== src/main.js =====
    // src/main.js
    // Application entry point. Imported as an ES module from index.html.
    // Importing the data modules first ensures the window.* globals used by the
    // Android WebView bridge are populated before any UI runs.



    async function init() {
        // Apply persisted language (dir/lang + static strings) and wire the toggle.
        // When the language changes, re-render the dynamic UI so it follows suit.
        setupLanguageToggle(async () => {
            await renderCategories();
            renderDrugs();
            updateCartUI();
        });

        await renderCategories();
        renderDrugs();
        updateCartUI();
        setupEvents();
        initDisclaimerLogic();
    }

    document.addEventListener('DOMContentLoaded', init);

})();
