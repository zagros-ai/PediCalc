# PediCalc — Pediatric Drug Dose Calculator

PediCalc is an offline-first, vanilla-JavaScript web app that helps clinicians
calculate weight-, age-, and indication-based pediatric drug doses. It also
surfaces clinical safety information: contraindications, allergy
cross-reactivity, drug–drug interactions, IV administration guidelines, organ
(renal/hepatic) impairment adjustments, and neonatal PMA protocols.

It is designed to run inside a mobile WebView (with an optional native `Android`
bridge for premium entitlement and in-app purchase) as well as in any modern
browser.

> ⚠️ **Medical disclaimer.** PediCalc is a calculation aid for qualified
> healthcare professionals only. It does **not** replace clinical judgement.
> Every dose must be independently verified against authoritative references and
> the individual patient before administration. See the in-app "Terms &
> Disclaimer" for the full agreement.

## Features

- **Dosing engine** — weight-based, fixed/age-based, topical, and powder dose
  types, with per-dose and daily-maximum caps.
- **Unit handling** — mg / g / mcg / mEq / Units, with automatic gram
  conversion and safe micro-dose formatting.
- **Ideal/Adjusted Body Weight** — hydrophilic drugs in obesity are dosed on
  AdjBW (Traub–Johnson IBW).
- **Clinical safety layer** — contraindications, allergy cross-reactivity,
  interaction matrix, IV guidelines, renal/hepatic adjustments, neonatal PMA
  protocols.
- **Search & categories**, custom concentration input, and an "active
  prescriptions" list that auto-checks interactions.

## Project structure

The codebase is organised as native ES modules (no bundler, no build step):

```
index.html                     # App shell; loads src/main.js as a module
style.css                      # Styles
src/
  main.js                      # Entry point (wires everything on DOMContentLoaded)
  data/
    drugs.data.js              # categoriesDB + drugsDB (pure data)
    clinical-rules.data.js     # ClinicalRulesDB: interactions, allergies, IV, PMA (pure data)
  core/
    utils.js                   # escapeHtml, unit resolution, formatting, DOM/UX helpers
    validation.js              # ValidationEngine: input/patient validation + contraindications
    clinical-engine.js         # AdvancedClinicalEngine: logic over ClinicalRulesDB
    calculator.js              # DrugDoseCalculator: the core dosing engine
    state.js                   # Shared UI state + premium detection
  ui/
    dom.js                     # Cached element references
    renderers.js               # Category grid, drug list, calculator dropdown
    events.js                  # Global event wiring
    cart.js                    # "Active prescriptions" banner
    premium-modal.js           # Premium upsell modal
    disclaimer.js              # First-run legal disclaimer
tests/
  calculator.test.js           # Unit tests for the dosing engine
```

**Separation of concerns:** `data/` holds only data, `core/` holds pure logic
(no DOM access — this is what the tests exercise), and `ui/` holds everything
that touches the DOM. Data modules also mirror their exports onto `window`
(`window.drugsDB`, `window.AdvancedClinicalEngine`, …) so the Android WebView
bridge and any non-module consumers keep working.

## Two ways to run the app

The same UI can load in two forms:

| Target | Script tag in `index.html` | Notes |
|--------|----------------------------|-------|
| **Android WebView / offline** | `<script src="dist/app.bundle.js">` (default) | A single classic script. Works from `file:///android_asset/`. |
| **Development over HTTP** | `<script type="module" src="src/main.js">` | Native ES modules; requires an HTTP server. |

`index.html` ships wired to the **bundle** so it works inside an Android
WebView out of the box. The module tag is kept, commented out, right above it.

### Running locally over HTTP (module mode)

Native ES modules must be served over HTTP (opening `index.html` via `file://`
is blocked by the browser's module CORS policy). Switch `index.html` to the
module tag, then:

```bash
python3 -m http.server 8000   # any static server works
# open http://localhost:8000
```

The `assets/` images (icons, category art) are provided by the host app/build
and are referenced by path; missing images degrade gracefully to Font Awesome
icons.

## Building the WebView bundle

The bundle is a generated single classic script (no ES modules) so it runs in
an Android WebView loaded from `file:///android_asset/`, where module imports
are blocked and would otherwise leave a blank screen.

```bash
npm run build          # node build/bundle.mjs  ->  dist/app.bundle.js
npm run smoke:bundle   # rebuild + boot-test the bundle in a stubbed DOM
```

Re-run `npm run build` whenever you change anything under `src/`.
`dist/app.bundle.js` is committed so the app is usable without a build step.

## Using it in Android Studio

1. Put the whole project folder inside your app's assets, e.g.
   `app/src/main/assets/pedicalc/` (include `index.html`, `dist/`, `style.css`,
   `assets/`, and the `fontawesome/` + `vazirmatn/` font folders).
2. Load it in your `WebView`:

   ```java
   WebView webView = findViewById(R.id.webView);
   WebSettings s = webView.getSettings();
   s.setJavaScriptEnabled(true);            // required — the app is all JS
   s.setDomStorageEnabled(true);            // required — disclaimer uses localStorage
   s.setAllowFileAccess(true);
   webView.loadUrl("file:///android_asset/pedicalc/index.html");
   ```

3. The optional native bridge is used if present. Expose it via
   `addJavascriptInterface(obj, "Android")` implementing:
   - `isPremium()` → boolean (unlocks all drugs / advanced settings)
   - `purchasePremium()` → starts your in-app purchase flow

   Without the bridge the app runs in free mode (Acetaminophen & Ibuprofen
   unlocked) and simply never calls it.

**All paths are relative** (`dist/app.bundle.js`, `style.css`, `assets/…`,
`fontawesome/…`, `vazirmatn/…`), so everything resolves correctly under
`file:///android_asset/…` with no code changes needed.

> Blank screen troubleshooting: it almost always means either (a) `index.html`
> was pointing at the `type="module"` tag instead of the bundle, or (b)
> JavaScript / DOM storage is disabled in `WebSettings`. Both are handled by
> the steps above.

## Testing

Unit tests run on Node's built-in test runner — no dependencies to install:

```bash
npm test        # == node --test
```

The tests cover the core dosing engine: weight-based ranges, single-value
doses, per-dose and daily-dose caps, fixed/age-based tiers, unit formatting
(mg/g/mcg/Units), contraindications, drug interactions, allergy
cross-reactivity, neonatal PMA overrides, adjusted body weight, and
indication selection.

There is also an optional boot smoke test that stubs a minimal DOM and runs the
real `main.js` entry chain to confirm the app initialises and renders without
runtime errors:

```bash
npm run smoke   # == node tests/boot.smoke.mjs
```

## Security note

All dynamic values interpolated into `innerHTML` are passed through
`escapeHtml()` (`src/core/utils.js`). Clinical warning/interaction messages that
intentionally contain markup (e.g. `<strong>`) are escaped at their dynamic
boundaries in `calculator.js` before the surrounding markup is added, so the
UI renders them without re-escaping.

## Credits

- **Scientific supervisor:** Dr. Amir Salari
- **Development:** Tavakol Piri

## License

MIT
