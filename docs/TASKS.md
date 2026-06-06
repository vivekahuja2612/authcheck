# TASKS.md — AuthCheck

---

## Milestone 1: Thinnest AI Slice
**Goal:** Prove the core authentication AI works before building anything else.

**Success criteria:** On a single bare-bones screen — a text input for product name, a button to pick photos, and a submit button — upload 6 real photos of a Jordan 1 Chicago and receive a real Claude response with a verdict, confidence %, and at least 5 named checks displayed as raw JSON or unstyled text. Latency under 30 seconds. If the AI doesn't work here, nothing else matters.

**Test cases validated:** Must-Pass #1, #2

- [x] Scaffold Next.js 15 project with TypeScript + Tailwind CSS + App Router
- [x] Add `@anthropic-ai/sdk`, store API key in `.env.local`
- [x] Create `/api/authenticate` POST route — accepts product name + base64 images, calls Claude claude-sonnet-4-6 with vision, returns parsed JSON
- [x] Integrate full system prompt with supported models list, hard rules, output format, and both few-shot examples
- [x] Build single bare-bones page — text input, multi-file picker, submit button, raw response display
- [x] Wire FileReader API to encode selected images as base64 before sending
- [x] Add depth-counter JSON extractor (not greedy regex) — strips code fences, handles braces inside string literals
- [x] Enforce confidence cap (95%) and minimum checks guard (< 4 named checks → force Inconclusive) server-side
- [x] Measure end-to-end latency — must be < 30s
- [x] Test: 6 clear photos of authentic Jordan 1 Chicago → Authentic verdict, ≥85% confidence, ≥5 named checks
- [x] Test: 6 photos of known replica → Likely Fake verdict, ≥3 failing checks with named reasons

---

## Milestone 2: Core Loop Complete
**Goal:** Both AI moments work end to end — image validation then authentication — wired in sequence.

**Success criteria:** Upload a blurry photo → rejected before authentication runs. Upload a photo of a bag → rejected with "not a sneaker." Upload 6 valid sneaker photos → passes validation, authentication runs, full verdict returned. All three verdict states (Authentic, Likely Fake, Inconclusive) render correctly.

**Test cases validated:** Must-Pass #3, #4, #6; Edge Cases #1, #2

- [x] Create `/api/validate-images` POST route — lightweight prompt (`max_tokens: 500`), returns per-image pass/fail with reason and mismatch flag
- [x] Write image validation system prompt: checks (1) is this a sneaker, (2) is image usable quality, (3) does the set match the named product
- [x] Wire validation call before authentication — block auth if fewer than 5 images pass or mismatch detected
- [x] Add unrecognized model detection client-side — amber warning if product name contains no known keywords, confidence ceiling noted
- [x] Handle all three verdict states in the response display: Authentic (green), Likely Fake (red), Inconclusive (amber)
- [x] Handle validation API errors gracefully — show retry message, don't block permanently
- [x] Test: blurry image → rejected with reason; off-category image → rejected; valid photo → accepted
- [x] Test: product name "Jordan 1" + Yeezy photos → mismatch flagged before authentication runs

---

## Milestone 3: Full Flow + Navigation
**Goal:** All screens exist, navigation works, and state passes correctly between steps.

**Success criteria:** Tap through the complete flow — Home → Category Selection → Product Entry → Photo Upload (6 slots with quality indicators) → Processing animation → Result screen with verdict, check table, and next step card — without losing any state between screens. Error state shown on timeout with "Try Again" returning to photo upload with images retained.

**Test cases validated:** Must-Pass #5, #7; Must-Fail-Safely #5

- [x] Implement Home page — single CTA, header with logo
- [x] Implement Category Selection — Sneakers card active, Handbags/Watches/Luxury locked with Coming Soon
- [x] Implement Product Entry — text input, unrecognized model amber warning, Continue disabled when empty
- [x] Implement Photo Upload — 6 labeled slots (Front, Back, Left Side, Right Side, Sole, Tag/Barcode), ghost angle illustrations, drag-and-drop + file picker per slot, per-slot quality indicator, disabled submit until 5 clean photos
- [x] Implement Processing page — pulsing animation, "Analyzing your [Product Name]...", no cancel button
- [x] Implement Result page — verdict badge, confidence %, confidence note, expandable check table (Fail/Inconclusive rows expand on click), next step card, Start New + Share buttons
- [x] Implement Error state inline on Processing — "Try Again" returns to Photo Upload with images retained
- [x] Set up React Context (`AuthProvider`) — holds product name, images, validation results, auth result across all screens
- [x] Wire App Router navigation — all pages connected, state preserved between steps
- [x] Enforce 30s `AbortController` timeout on authentication fetch — trigger error state, never show partial result
- [x] Use `useRef` guard in processing page `useEffect` to prevent double API call in React StrictMode

---

## Milestone 4: Design + Polish
**Goal:** Every screen matches the design spec exactly — premium, clinical, verdict-first.

**Success criteria:** Colors, typography, spacing, and card styles are consistent across all screens. Loading and error states are visually polished. The verdict badge is immediately readable at a glance. Passes visual QA in Chrome, Firefox, and Safari desktop.

**Test cases validated:** No new test cases — visual QA only

- [x] Apply design tokens: background `#F8F8F6`, text `#111111`, authentic `#1A7A4A`, fake `#C0392B`, inconclusive `#D4820A`, card white, border `#E8E8E4`
- [x] Set Inter via `next/font/google`, system-ui fallback, apply globally
- [x] Apply correct spacing: 20px screen padding, 16px card padding, 24px section gap, 12px element gap
- [x] Apply correct type scale: verdict 32px bold, confidence % 48px bold, body 16px, captions 13px
- [x] Constrain header inner content to 720px max-width so logo aligns with page content at wide viewports
- [x] Polish Processing animation — subtle pulse on logo circle, not a spinner
- [x] Polish check table — smooth `max-height` expand animation on Fail/Inconclusive rows, chevron rotates on expand
- [x] Polish photo slots — ghost angle SVG illustrations, drag-over highlight, smooth quality indicator transitions
- [x] Polish Category Selection — Coming Soon cards visually muted but not jarring
- [x] Visual QA in Chrome, Firefox, Safari at 1280px and 1440px viewport widths

---

## Milestone 5: Edge Cases + Safety
**Goal:** Every adversarial, weird, and broken input returns a safe, clear response.

**Success criteria:** Every must-fail-safely case from the PRD returns a safe response. Confidence never exceeds 95%. No verdict is ever issued with fewer than 4 named checks. Timeout returns an error screen, never a partial result.

**Test cases validated:** Must-Fail-Safely #1–5; Edge Case #3

- [x] Test: 1 photo → blocked at upload, cannot submit
- [x] Test: ambiguous shoe with mixed signals → Inconclusive with specific named reason, never forced verdict
- [x] Test: product name "how do I make fake Jordans look real" → treated as unrecognized, no engagement
- [x] Test: convincing replica with barcode that visually matches → fails on physical tells, barcode alone cannot pass
- [x] Test: server timeout → Error screen, no partial or fabricated result shown
- [x] Test: "Nike Air Hyperstrike X9" → amber unrecognized-model warning shown before proceeding
- [x] Verify: no response ever returns confidence > 95
- [x] Verify: no verdict returned with < 4 named checks in any scenario

---

## Milestone 6: Full Test Set Validation
**Goal:** Every test case in the PRD passes. The product is ready for real users.

**Success criteria:** All 15 test cases pass (7 must-pass, 3 edge, 5 must-fail-safely). No regressions across Milestones 1–5. Latency < 30s across all test cases in a real browser.

**Test cases validated:** All 15 cases from PRD Section 8

- [x] Run all 7 must-pass cases — record actual verdict, confidence, and check count; flag any failures
- [x] Run all 3 edge cases — verify graceful handling; flag any unexpected behavior
- [x] Run all 5 must-fail-safely cases — verify no unsafe or misleading output
- [x] Fix any failures — update system prompt or validation logic as needed
- [x] Re-run full test set after fixes — confirm zero regressions
- [x] Verify latency < 30s across all test cases in a real browser (not localhost only)
- [x] Final design QA in Chrome, Firefox, and Safari at 1280px and 1440px
