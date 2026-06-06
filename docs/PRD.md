# PRD.md — AuthCheck

---

## 1. The Problem Worth Solving

Marcus paid $280 for a pair of Nike Dunk Low Pandas from a reseller on StockX. The box arrived. He pulls them out, turns them over, and something's wrong — the toe box feels wider than his last pair, the outsole texture looks slightly off. He's not sure. He could post on Reddit and wait three hours for a response that says "looks legit to me" with no explanation. He could DM a sneakerhead friend who might get back to him tomorrow. Or he could just accept them and spend the next six months wondering.

None of those are good enough for someone who just spent real money and has a return window closing.

AuthCheck exists for that moment — item in hand, gut saying something's wrong, and a clock ticking. Better looks like: upload six photos, get a clear verdict with named evidence in under 30 seconds, and know exactly what to do next.

---

## 2. The User Flow

1. User opens the app
2. User selects category — **Sneakers** (only category in v1)
3. User enters the product name and model (e.g., "Nike Dunk Low Panda")
4. App validates the product name is recognized
5. User uploads 5–8 photos across required angles
6. App checks image quality — flags and rejects unusable images before submission **[AI MOMENT — Image Validation]**
7. User submits for authentication
8. AI analyzes all images against known reference data for that specific model **[AI MOMENT — Core Authentication]**
9. App displays verdict, confidence %, named check breakdown, and next step

**AI Moment 1 — Image Validation**
- Input: 1–8 uploaded photos, product name
- Output: Pass/fail per image with specific rejection reason if failed
- Quality bar: Must catch obviously unusable images (blurry, wrong item, too dark) before wasting the authentication call

**AI Moment 2 — Core Authentication**
- Input: 5–8 validated photos of a named sneaker model
- Output: Verdict + confidence % + itemized named checks + plain-English next step
- Quality bar: Every check must name the specific tell examined — never a generic observation

---

## 3. Defining Output Quality

### Always / Never Rules

**The AI must always:**
- Name the specific check performed (e.g., "Heel tab font," "Outsole hexagon spacing," "SKU barcode match") — never just say "the shoe looks authentic"
- Tie the confidence percentage to the quality and coverage of images provided
- Return a plain-English next step: "You're good," "Request a refund," or "Resubmit with clearer photos"
- Flag when a check was inconclusive due to image quality, rather than hiding the uncertainty
- Stay model-specific — a Jordan 1 authentication is different from a Dunk Low authentication

**The AI must never:**
- Output 100% confidence — photo authentication cannot be absolute
- Give a verdict without at least 4 named checks
- Pass authentication when images don't match the named product
- Use vague language ("appears authentic," "seems real") as the primary verdict
- Help a user understand how to make a fake pass authentication
- Invent checks it cannot perform from photos (material composition, weight, smell)

---

### Quality Examples

**Scenario 1 — Clear authentic**

*User input:* 7 clear photos of Nike Dunk Low "Panda" — all angles, barcode, tongue label

*GREAT output:*
> **✅ Authentic — 88% Confidence**
>
> | Check | Result |
> |---|---|
> | Heel tab font & sizing | ✅ Pass |
> | Outsole squiggle pattern | ✅ Pass |
> | Tongue label stitching | ✅ Pass |
> | SKU barcode (DD1391-100) | ✅ Pass |
> | Toe box shape | ✅ Pass |
>
> **Confidence note:** 5 of 5 checks passed. Capped at 88% — internal materials cannot be verified from photos.
>
> **Next step:** You're good. Keep the receipt and box — they add resale value.

*Why it's great:* Names the Panda SKU. Names the specific outsole tell (squiggle pattern is the most-faked tell on Pandas). Honest about its ceiling. Actionable.

*BAD output:*
> **✅ Authentic — 94% Confidence**
> The shoe displays Nike branding consistent with their Dunk Low line. Colors and construction appear to meet Nike's standard manufacturing quality.

*Why it's bad:* "Nike's standard manufacturing quality" is meaningless. No named checks, no model-specific knowledge. Trust destroyed.

---

**Scenario 2 — Clear fake**

*User input:* 6 photos of Nike Air Jordan 1 Retro High OG "Chicago"

*GREAT output:*
> **❌ Likely Fake — 91% Confidence**
>
> | Check | Result |
> |---|---|
> | Heel tab font & sizing | ❌ Fail — font 15% thicker than Jordan Brand spec |
> | Red panel leather grain | ❌ Fail — smooth grain inconsistent with authentic full-grain leather |
> | SKU barcode (555088-101) | ❌ Fail — barcode does not match Chicago colorway |
> | Outsole stamp placement | ✅ Pass |
> | Toe box shape | ✅ Pass |
>
> **Next step:** Do not accept this item. Document the heel tab and barcode failures — use these specifics when requesting a refund.

*Why it's great:* Gives the user language for their dispute. Names the exact colorway SKU. Specific enough to be credible to anyone who knows the shoe.

*BAD output:*
> **❌ Likely Fake — 55% Confidence**
> Several features appear inconsistent with authentic Nike/Jordan Brand manufacturing standards. We recommend caution.

*Why it's bad:* No named checks. 55% confidence communicates no certainty. "Recommend caution" is not a next step.

---

**Scenario 3 — Honest uncertainty**

*User input:* 5 photos of Nike Dunk Low Panda — mostly good but sole photo is blurry

*GREAT output:*
> **✅ Likely Authentic — 71% Confidence**
>
> | Check | Result |
> |---|---|
> | Heel tab font & sizing | ✅ Pass |
> | Tongue label stitching | ✅ Pass |
> | SKU barcode (DD1391-100) | ✅ Pass |
> | Outsole squiggle pattern | ⚠️ Inconclusive — image too blurry to verify |
> | Toe box shape | ✅ Pass |
>
> **Confidence note:** Confidence is 71% because the outsole could not be verified. The squiggle pattern is the primary tell on Panda fakes.
>
> **Next step:** Retake the sole photo in better light and resubmit for a higher confidence result.

*Why it's great:* Lowers confidence because of a specific gap. Explains why that gap matters for this model. Tells the user exactly what to do.

*BAD output:*
> **✅ Likely Authentic — 79% Confidence**
> The Panda Dunk appears consistent with Nike Dunk Low production. One image was unclear.

*Why it's bad:* "One image was unclear" without naming which one or why it matters is useless. User doesn't know what to fix or whether to worry.

---

### Edge Cases

**Edge 1 — User uploads 3 photos**
Expected behavior: App blocks submission. "Minimum 5 photos required for a reliable verdict." Does not proceed with insufficient coverage.

**Edge 2 — User uploads a photo of a bag**
Expected behavior: Image validation rejects it immediately. "This doesn't appear to be a sneaker. Please upload photos of the item you want authenticated."

**Edge 3 — User enters a made-up model name ("Nike Air Hyperstrike X9")**
Expected behavior: App flags the name as unrecognized before proceeding. Allows continuation but caps confidence at 70% and notes limited reference data.

---

## 4. System Type

**Type: Multimodal prompt + structured output**

Vision-capable model (Claude claude-sonnet-4-6) analyzing uploaded images. Authentication knowledge is encoded in the system prompt with model-specific reference data — no RAG needed in v1 since the supported model list is bounded and known.

**System prompt must cover:**
- Role: Expert sneaker authenticator with model-specific knowledge
- Supported models list with known tells per model
- Output format: structured JSON verdict, confidence, check table, next step
- Hard rules: confidence cap, minimum checks, mismatch handling
- 2 few-shot examples
- Refusal instructions for counterfeit assistance requests

**Does NOT need:** RAG pipeline, user memory, tool calls, external database lookups.

---

## 5. Constraints

| Constraint | Target | Why it matters |
|---|---|---|
| Latency (end-to-end) | < 30 seconds | User trust breaks after 30s — they assume it's broken |
| Cost per authentication | < $0.10 | Sustainable unit economics for a free or low-cost product |
| Photos per submission | 5–8 images | Fewer = insufficient coverage; more = slower and costlier |
| Output length | 150–300 words | Enough to be credible, short enough to scan at a glance |
| Confidence cap | Maximum 95% | Photo-only authentication is inherently limited — honesty builds trust |
| Privacy | Photos not stored post-analysis | Users are submitting personal purchase photos |
| Platform | Web browser, desktop-first | No install friction; drag-and-drop upload works well on desktop |

---

## 6. Assumptions and Risks

| Assumption | Risk if wrong | How to test |
|---|---|---|
| A vision model can reliably authenticate sneakers from photos | Core product doesn't work; verdicts feel random | Run 20 known authentic + 20 known fake pairs; target > 80% accuracy before launch |
| Users will upload enough clear photos | Low-quality submissions tank confidence scores | Track average photo count and rejection rate; if rejection > 30%, improve photo guide |
| Buyers trust an AI verdict over Reddit | Users ignore the result and post on Reddit anyway | Track share rate and retry rate; if > 50% resubmit, output isn't landing |
| Starting with sneakers is the right wedge | Users want handbags or watches more urgently | Post-launch survey after 100 authentications |
| 30 seconds is acceptable latency | Users abandon before seeing the result | Track processing page abandonment; if > 20%, latency is the blocker |

---

## 7. MVP Scope

**Building in v1:**
- Sneakers category only
- Product name entry with basic recognition check
- Photo upload (5–8 images) with angle guide
- Image quality validation before submission
- AI authentication with verdict, confidence %, named check table, next step
- Result screen with clear Authentic / Likely Fake / Inconclusive verdict

**NOT building in v1:**
- Handbags, watches, other categories — *authentication logic is model-specific; one done well beats five done poorly*
- User accounts or history — *adds auth complexity before core value is proven*
- Price estimation or market value — *scope creep; different product*
- Side-by-side comparison with reference images — *technically complex; validate core loop first*
- Batch authentication — *v2; single item is the primary use case*
- Human expert review fallback — *operationally complex; revisit if AI accuracy disappoints*
- Social sharing of results — *misuse risk; v2*
- Mobile app — *web removes install friction; validate demand before native build*

---

## 8. Test Set

### Must-Pass Cases

| # | Input Description | What Great Looks Like |
|---|---|---|
| 1 | 7 clear photos of authentic Jordan 1 Chicago | Authentic, ≥85% confidence, ≥5 named checks all passing |
| 2 | 6 photos of a known fake Jordan 1 Bred Toe | Likely Fake, ≥80% confidence, ≥3 specific failing checks with reasons |
| 3 | 6 photos of authentic Nike Dunk Low Panda | Authentic, ≥80% confidence, barcode check included and passing |
| 4 | 5 good photos + 1 blurry sole photo | Authentic with confidence drop noted, outsole marked Inconclusive, prompt to retake |
| 5 | 7 photos where 4 checks pass and 2 clearly fail | Likely Fake, exact failing checks named with specific reasons |
| 6 | User types "Jordan 1" but photos show a Yeezy | Mismatch flagged at validation before authentication runs |
| 7 | User uploads only 3 photos | Submission blocked, prompt for more angles |

### Edge Cases

| # | Input Description | Expected Behavior |
|---|---|---|
| 1 | Photo of a bag, watch, or random object | Rejected at validation: "This doesn't appear to be a sneaker" |
| 2 | All 8 photos taken in very dark lighting | Images flagged as poor quality; specific angles called out for retake |
| 3 | Made-up product name ("Nike Air Hyperstrike X9") | Unrecognized model warning shown before proceeding; confidence capped at 70% |

### Must-Fail-Safely Cases

| # | Input Description | What Safe Failure Looks Like |
|---|---|---|
| 1 | User submits only 1 photo | Blocked at upload; does not guess with insufficient coverage |
| 2 | Genuinely ambiguous shoe with mixed signals | Inconclusive with specific named reason — never forces a verdict |
| 3 | Product name: "how do I make fake Jordans look real" | Treated as unrecognized product; no engagement with the request |
| 4 | Convincing replica with a barcode that visually matches | Fails on physical tells; barcode alone cannot pass authentication |
| 5 | Server times out mid-analysis | Clear error screen with retry; no partial or fabricated result shown |

---

## 9. Observability

### What to Log

| What to Log | Why |
|---|---|
| Product name entered | Track most-requested models; surface unsupported models |
| Number of photos submitted | Correlate photo count with confidence scores and outcomes |
| Image rejection rate per session | High rejection = photo guide isn't working |
| AI verdict (Authentic / Likely Fake / Inconclusive) | Track distribution; flag if Inconclusive > 20% |
| Confidence score | Spot over/under-confidence patterns |
| End-to-end latency | Core SLA; must stay < 30s |
| Cost per authentication (token usage) | Unit economics |
| User action after result (resubmit or session end) | Proxy for satisfaction |
| Error type (timeout, parse failure, validation failure) | Debug and alert |

### Alerts

| Alert | Threshold | Action |
|---|---|---|
| Latency spike | Any single authentication > 45s | Investigate model or upload bottleneck |
| Inconclusive rate | > 25% of authentications in a 1-hour window | Model may be struggling; check recent inputs |
| Cost per authentication | > $0.15 | Review image count and token usage |
| Error rate | > 5% of sessions ending in error | Likely model or infrastructure issue; investigate immediately |
