# PLANNING.md — AuthCheck

---

## Screens and Navigation

---

### Screen 1: Home
**URL:** `/`

**What's on it:**
- App name and tagline
- Single CTA button: "Authenticate an Item"

**Does NOT include:**
- Login or signup prompt
- Category grid — that's the next screen
- Explanation of how it works
- Past results or history
- Any pricing or marketing copy

**Where it connects:** CTA → Category Selection

---

### Screen 2: Category Selection
**URL:** `/category`

**What's on it:**
- Screen title: "What are you authenticating?"
- One active card: **Sneakers**
- Three locked cards: Handbags, Watches, Luxury Accessories — each with a lock icon and "Coming Soon" label

**Does NOT include:**
- Search or filter
- Explanations of what each category covers
- Any authentication flow elements

**Where it connects:** Sneakers card → Product Entry

---

### Screen 3: Product Entry
**URL:** `/authenticate/product`

**What's on it:**
- Screen title: "What's the item?"
- Text input with placeholder: "e.g. Nike Air Jordan 1 Retro High OG Chicago"
- Helper text: "Be specific — include colorway name"
- Inline amber warning if product name is unrecognized: "We don't have this model in our database yet — confidence will be capped at 70%"
- CTA: "Continue" — disabled when input is empty

**Does NOT include:**
- Dropdown or autocomplete — free text only
- Size or condition fields
- Purchase price
- Photo upload on this screen

**Where it connects:** Continue → Photo Upload

---

### Screen 4: Photo Upload
**URL:** `/authenticate/photos`

**What's on it:**
- Screen title: "Upload your photos"
- 6 labeled slots: Front, Back, Left Side, Right Side, Sole, Tag / Barcode
- Each empty slot shows a ghost illustration of the angle to capture
- Click any slot or drag-and-drop to upload or replace
- Photo count: "4/6 slots filled — minimum 5 required"
- Per-slot quality indicator: green checkmark (pass) or red warning (unusable) shown after validation
- Rejection reason shown below failed slot
- CTA: "Authenticate" — disabled until 5+ slots filled
- Small text below CTA: "Analysis takes up to 30 seconds"
- Mismatch error (if product name doesn't match uploaded photos): shown above CTA in red

**Does NOT include:**
- Webcam or camera capture — file picker and drag-and-drop only
- Video upload
- Any AI analysis preview on this screen
- Progress bar

**Where it connects:** Authenticate → Processing

---

### Screen 5: Processing
**URL:** `/authenticate/processing`

**What's on it:**
- Pulsing logo animation — subtle, not a spinner
- Text: "Analyzing your [Product Name]..."
- Subtext: "Checking authentication markers"
- No cancel button — submission is already sent

**Does NOT include:**
- Partial results
- Estimated time countdown
- Any user input

**Where it connects:** Analysis complete → Result | Timeout or error → Error state (inline, no URL change)

---

### Screen 6: Result
**URL:** `/authenticate/result`

**What's on it:**
- Large verdict badge: ✅ Authentic, ❌ Likely Fake, or ⚠️ Inconclusive — color coded
- Confidence % — large and prominent: "88% Confident"
- Confidence note in small text beneath the percentage
- Check table: Check Name | Result (✅ / ❌ / ⚠️)
- Fail and Inconclusive rows expand on click to show one-line reason
- Next Step card: plain-English recommendation
- Two buttons: "Start New Authentication" | "Share Result"

**Does NOT include:**
- Option to dispute or appeal the result
- Link to buy authentic version
- Save to history
- Methodology explanation

**Where it connects:** Start New → Home | Share → native share API or clipboard copy

---

### Screen 7: Error State
**URL:** No separate URL — inline on Processing screen

**What's on it:**
- "Something went wrong. Your photos were not analyzed."
- Specific error if available: "Analysis timed out" or "Images could not be processed"
- Single CTA: "Try Again" — returns to Photo Upload with images still loaded
- Small text: "No charge if analysis failed"

**Does NOT include:**
- Technical error codes
- Support contact

**Where it connects:** Try Again → Photo Upload (images retained)

---

## System Prompt

```
You are AuthCheck, an expert sneaker authenticator. You analyze photos of sneakers to determine whether they are authentic or counterfeit. You have deep, model-specific knowledge of construction details, manufacturing tells, and known replica patterns for popular sneaker models.

TONE: Direct, precise, confident. You are a knowledgeable expert, not a cautious bureaucrat. When you know, you say so. When you don't, you say exactly why.

HARD RULES:
- Never exceed 95% confidence. Photo-based authentication cannot verify internal materials, weight, or smell — always acknowledge this ceiling.
- Always name at least 5 specific checks. Never give a verdict without itemized evidence.
- Always tie confidence score to the quality and coverage of images provided. Poor sole photo = lower confidence, stated explicitly.
- Never pass an item if images don't match the named product.
- Never claim to have checked something you cannot verify from photos (material composition, weight, smell).
- If verdict is Inconclusive, explain specifically why — never use it as a default hedge.

OUTPUT FORMAT (always return as structured JSON):
{
  "verdict": "Authentic" | "Likely Fake" | "Inconclusive",
  "confidence": [integer 0–95],
  "confidence_note": "[one sentence explaining what limits certainty]",
  "checks": [
    {
      "name": "[specific check name]",
      "result": "Pass" | "Fail" | "Inconclusive",
      "detail": "[one sentence — what you saw and why it matters for this model]"
    }
  ],
  "next_step": "[plain English recommendation — 1–2 sentences]"
}

SUPPORTED MODELS (v1):
High-replica-volume hype models:
Air Jordan 1 Retro High OG (all colorways), Nike Dunk Low (all colorways),
Air Jordan 4, Air Jordan 3, Air Force 1 Low, Yeezy Boost 350 V2,
Nike SB Dunk, New Balance 550, Air Jordan 11, Nike Phantom GX 2 Academy TF

Mainstream everyday models:
Nike Air Max 90, Nike Air Max 95, Nike Air Max 97, Nike React Infinity Run,
Adidas Ultraboost (all generations), Adidas Stan Smith, Adidas Superstar,
Converse Chuck Taylor All Star, Vans Old Skool, Vans Sk8-Hi,
New Balance 574, New Balance 990v5, Reebok Classic Leather, Reebok Club C,
Puma Suede Classic, Asics Gel-Kayano, Asics Gel-Nimbus

For unrecognized models: attempt authentication on visible construction details
but flag that model-specific reference data is limited — cap confidence at 70%.

FEW-SHOT EXAMPLES:

Example 1 — Authentic Dunk Low Panda:
Input: 7 clear photos of Nike Dunk Low Panda (DD1391-100)
Output:
{
  "verdict": "Authentic",
  "confidence": 88,
  "confidence_note": "5 of 5 checks passed. Capped at 88% — internal materials cannot be verified from photos.",
  "checks": [
    {"name": "Heel tab font & sizing", "result": "Pass", "detail": "Font weight and position match Nike Dunk production spec."},
    {"name": "Outsole squiggle pattern", "result": "Pass", "detail": "Pattern density and depth consistent with authentic — replicas typically flatten the squiggle texture."},
    {"name": "Tongue label stitching", "result": "Pass", "detail": "Stitch count and label alignment consistent with authentic Dunk Low production."},
    {"name": "SKU barcode (DD1391-100)", "result": "Pass", "detail": "Barcode matches correct SKU for Panda colorway."},
    {"name": "Toe box shape", "result": "Pass", "detail": "Curvature matches authentic last — replica Pandas are typically 3–4mm wider at the toe."}
  ],
  "next_step": "You're good. Keep the receipt and original box — they add resale value."
}

Example 2 — Fake Jordan 1 Chicago:
Input: 6 photos of Jordan 1 Retro High OG Chicago (555088-101)
Output:
{
  "verdict": "Likely Fake",
  "confidence": 91,
  "confidence_note": "3 of 5 checks failed. One check inconclusive due to photo angle.",
  "checks": [
    {"name": "Heel tab font & sizing", "result": "Fail", "detail": "Font is 15% thicker than authentic Jordan Brand spec — common on Chicago replicas from 2022 batch."},
    {"name": "Red panel leather grain", "result": "Fail", "detail": "Smooth grain inconsistent with authentic Nike full-grain leather used on OG Chicago run."},
    {"name": "SKU barcode (555088-101)", "result": "Fail", "detail": "Barcode does not return correct SKU for Chicago colorway."},
    {"name": "Outsole stamp placement", "result": "Pass", "detail": "Air unit stamp positioned correctly at heel."},
    {"name": "Toe box shape", "result": "Inconclusive", "detail": "Photo angle insufficient to measure curvature accurately."}
  ],
  "next_step": "Do not accept this item. Document the heel tab and barcode failures — use these specifics when requesting a refund."
}

SAFETY:
- If images don't show sneakers: return Inconclusive, confidence 0, next_step "Please upload photos of the sneaker you want authenticated."
- If product name is a request for counterfeit guidance or is not a real product: return Inconclusive, confidence 0, no engagement with the request.
```

---

## Design Direction

**Feel:** Premium and clinical — like a lab report designed by a sneaker brand. Verdict is the hero. Every element either supports the verdict or gets cut. Reference: CheckCheck's verdict clarity, Poizon's premium surface.

**Colors:**
| Role | Hex |
|---|---|
| Background | `#F8F8F6` |
| Primary text | `#111111` |
| Muted text | `#8A8A8A` |
| CTA / active | `#111111` |
| Authentic / Pass | `#1A7A4A` |
| Fake / Fail | `#C0392B` |
| Inconclusive / Warning | `#D4820A` |
| Card background | `#FFFFFF` |
| Border / divider | `#E8E8E4` |

**Typography:**
- Font: Inter (Google Fonts), system-ui fallback
- Body: 16px / 1.5 line height
- Captions and labels: 13px
- Verdict text: 32px bold
- Confidence %: 48px bold

**Spacing:**
- Screen padding: 20px horizontal
- Card padding: 16px
- Section gap: 24px
- Element gap: 12px

**Reference apps:** CheckCheck (verdict-first clarity), Poizon (premium material feel), Apple Health (data table readability)

---

## Implementation Notes

**Tech stack:**
- Frontend: Next.js 15 (App Router, TypeScript) + Tailwind CSS v4
- AI: Anthropic Claude claude-sonnet-4-6 via `@anthropic-ai/sdk` — vision-capable, structured JSON output
- Image handling: HTML `<input type="file">` with drag-and-drop → FileReader API → base64 → API route
- No database — stateless, no persistence
- Hosting: Vercel (frontend + API routes in one deployment)

**Technical defaults:**
- App Router with TypeScript throughout — file-based routing matches the screen structure exactly
- API key kept server-side only — two Next.js API routes: `/api/validate-images` and `/api/authenticate`
- State management: React Context (`AuthProvider`) wrapping the layout — holds product name, images, validation results, and auth result across the multi-step flow; no Zustand or Redux needed
- Image validation call: `max_tokens: 500`, lightweight prompt, runs before the main auth call
- Authentication call: `max_tokens: 2048`, full system prompt with few-shot examples
- JSON extraction: depth-counter parser (not greedy regex) — strips markdown fences, tracks brace depth while skipping string literals, so trailing commentary from the model never corrupts the parse
- 30s client-side timeout via `AbortController` on the fetch in the processing page
- `useRef` guard in processing page `useEffect` to prevent double API call in React StrictMode

**Data handling:**
Images are base64-encoded in the browser via FileReader and sent in the request body. They are not written to disk, stored, or logged anywhere. The API route processes the request and returns the result — nothing persists after the response is sent. No user data is retained between sessions.
