# DECISIONS.md — AuthCheck

## How to use this file
After every significant decision during your build, add an entry below.
A "significant decision" = choosing between alternatives, changing your plan, or cutting scope.

---

### 2026-06-06 — Sneakers only for v1

**Context:** Product vision could cover sneakers, handbags, watches, and luxury accessories — all high-fake-volume categories.

**Options considered:** Launch all categories simultaneously vs. launch one category done well.

**Decision:** Sneakers only. Other categories shown as locked "Coming Soon" on the category screen.

**Why:** Authentication logic is model-specific — knowing what makes a fake Jordan 1 is completely different from knowing what makes a fake Rolex. Doing one well beats doing four poorly. Sneakers have the largest resale market and the most motivated buyers at the moment of unboxing.

**Revisit if:** Post-launch survey shows > 50% of users primarily want a different category authenticated.

---

### 2026-06-06 — Web over mobile app

**Context:** Buyers are holding a physical item when they use this — a mobile-native experience might feel more natural.

**Options considered:** React Native mobile app vs. Next.js web dashboard.

**Decision:** Web dashboard. Desktop-first with drag-and-drop upload.

**Why:** Web removes install friction entirely — users access via URL with no App Store review cycle. Drag-and-drop file upload works well for buyers who photograph their items and transfer photos to a laptop. The core AI loop is platform-agnostic; no authentication logic changes. Faster to ship and easier to iterate on.

**Revisit if:** Post-launch data shows > 60% of traffic is mobile and conversion is meaningfully lower than desktop.

---

### 2026-06-06 — Confidence capped at 95%

**Context:** Users will ask why the app never says 100% confident.

**Options considered:** Uncapped confidence score vs. hard 95% ceiling.

**Decision:** Hard cap at 95%. The confidence note on the result screen always explains why.

**Why:** Photo-based authentication cannot verify internal materials, weight, or smell — the tells that separate a master replica from an authentic. Claiming 100% confidence from photos is dishonest and creates liability when the product is wrong. The cap is a product values decision, not a technical limitation. Collectors respect honesty about limits more than false certainty.

**Revisit if:** Never — this is a values decision, not a technical one.

---

### 2026-06-06 — No accounts or history in v1

**Context:** Users might want to save past authentication results as proof of authenticity for resale.

**Options considered:** Login with saved history vs. stateless no-login experience.

**Decision:** No login, no stored data. Upload, get result, done.

**Why:** Accounts add auth complexity, privacy obligations, and a signup wall — all friction before the core value is proven. The primary use case is immediate verification in the moment, not archival. Saved results are a v2 feature if return visit rate justifies it.

**Revisit if:** Return visit rate > 20% within a week, or users consistently ask for saved results.

---

### 2026-06-06 — Depth-counter JSON extractor over greedy regex

**Context:** Claude occasionally appends commentary after the JSON output containing braces — e.g., "Note: the {outsole pattern} is the primary tell on this model." A greedy `/\{[\s\S]*\}/` regex captures from the first `{` to the last `}`, pulling in the trailing text and breaking `JSON.parse`.

**Options considered:** Greedy regex vs. depth-counter parser that tracks brace depth while skipping string literal contents.

**Decision:** Depth-counter parser in a shared `lib/extract-json.ts` utility, used by both API routes.

**Why:** The depth-counter correctly identifies the first complete JSON object regardless of what the model appends afterward. It also strips markdown code fences before parsing, handling the case where Claude wraps output in ```json``` blocks. Greedy regex is fragile for any model output that isn't perfectly clean.

**Revisit if:** Never — the depth-counter is strictly more correct than the regex with no downside.

---

### 2026-06-06 — Inline styles over Tailwind utility classes

**Context:** PLANNING.md specifies design tokens. The project has Tailwind v4 installed.

**Options considered:** Convert all pages to Tailwind utility classes vs. keep inline styles throughout.

**Decision:** Keep inline styles. All pages were written with inline styles and the design tokens are already applied correctly.

**Why:** Converting to Tailwind classes would be pure churn — every pixel already matches the spec, and the change would touch every file with no functional benefit. Inline styles are co-located with the component they style, which is readable and easy to audit.

**Revisit if:** A shared component library or theme switching is added — at that point centralizing tokens in Tailwind config would pay off.

---

## Future Decisions
*(Continue logging here as you build.)*
