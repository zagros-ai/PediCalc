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

let currentLang = DEFAULT_LANG;
const listeners = new Set();

// Read any previously persisted choice (guarded for non-browser/test contexts).
try {
    if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && SUPPORTED.includes(saved)) currentLang = saved;
    }
} catch { /* ignore storage errors */ }

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
    'formula.dailyMax':     { en: 'Daily Max:', fa: 'حداکثر روزانه:' },
    'formula.fixedDesc':    { en: 'Age-based, Topical, or Standard Dose', fa: 'دوز بر اساس سن، موضعی یا استاندارد' },
    'formula.capped':       { en: '(Capped)', fa: '(محدودشده)' },

    // Home guide fallbacks
    'guide.asPrescribed':   { en: 'Use as prescribed by physician.', fa: 'طبق دستور پزشک مصرف شود.' },
    'guide.concZero':       { en: 'Error: Concentration cannot be zero.', fa: 'خطا: غلظت نمی‌تواند صفر باشد.' },

    // Intervals
    'interval.single':      { en: 'Single Dose / As needed', fa: 'دوز منفرد / در صورت نیاز' },
    'interval.hours':       { en: 'Every {h} hours', fa: 'هر {h} ساعت' },

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

/** Current language code ('en' | 'fa'). */
export function getLang() {
    return currentLang;
}

/** Whether the current language is right-to-left. */
export function isRTL() {
    return currentLang === 'fa';
}

/**
 * Translate a UI string key. Falls back to English, then to the key itself.
 * @param {string} key dotted key from STRINGS
 * @param {Record<string, unknown>} [vars] interpolation values
 */
export function t(key, vars) {
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
export function localized(record, field) {
    if (!record) return '';
    if (currentLang === 'fa') {
        const faVal = record[field + 'Fa'];
        if (faVal !== undefined && faVal !== null && faVal !== '') return faVal;
    }
    return record[field];
}

/** Register a callback fired whenever the language changes. Returns an unsubscribe fn. */
export function onLangChange(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

/** Apply <html> lang/dir for the current language (call once on boot and on change). */
export function applyLanguage() {
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.lang = currentLang;
        document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';
    }
}

/** Set the active language, persist it, apply dir/lang, and notify listeners. */
export function setLang(lang) {
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
export function toggleLang() {
    setLang(currentLang === 'en' ? 'fa' : 'en');
}

// Expose a tiny global for the bundle / WebView bridge and quick debugging.
if (typeof window !== 'undefined') {
    window.PediCalcI18n = { t, getLang, setLang, toggleLang, localized, onLangChange, applyLanguage, isRTL };
}
