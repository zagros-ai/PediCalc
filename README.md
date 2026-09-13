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

## Running locally

Because the app uses ES modules, it must be served over HTTP (opening
`index.html` via `file://` will be blocked by the browser's module CORS policy).

```bash
# any static server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

The `assets/` images (icons, category art) are provided by the host app/build
and are referenced by path; missing images degrade gracefully to Font Awesome
icons.

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
