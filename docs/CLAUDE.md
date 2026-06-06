# CLAUDE.md — AuthCheck

---

## Product Context

AuthCheck is a web dashboard (Next.js + Tailwind CSS) that helps sneaker collectors and buyers verify whether an item they've received is authentic or counterfeit. The user selects the Sneakers category, enters the product name and model, uploads 5–8 photos of all angles and barcodes via drag-and-drop or file picker, and receives a verdict — Authentic, Likely Fake, or Inconclusive — with a confidence percentage, an itemized check table, and a plain-English next step. No accounts. No stored data. Results in under 30 seconds. Accessible via browser — no app install required.

**Core user flow:**
1. Home — click "Authenticate an Item"
2. Category Selection — select Sneakers
3. Product Entry — enter brand and model name
4. Photo Upload — upload 5–8 photos across required angles via drag-and-drop or file picker [AI MOMENT — image validation]
5. Processing — backend calls Claude claude-sonnet-4-6 with images and product name [AI MOMENT — authentication]
6. Result — verdict + confidence % + check table + next step

---

## AI Behavior Rules

**The AI always:**
- Names at least 5 specific checks with a one-line reason per check (e.g., "Heel tab font — 15% thicker than Jordan Brand spec")
- Ties confidence percentage to image quality and coverage — poor images = lower confidence, stated explicitly
- Caps confidence at 95% — photo authentication cannot verify internal materials
- Returns a plain-English next step: "You're good," "Request a refund," or "Resubmit with clearer photos"

**The AI never:**
- Issues a verdict with fewer than 4 named checks
- Claims to have verified something it cannot see in photos (material composition, weight, smell)
- Uses "appears to be" or "seems real" as the primary verdict — the verdict is always direct
- Returns 100% confidence under any circumstances
- Forces a verdict when evidence is genuinely ambiguous — uses Inconclusive with a specific named reason

---

## Coding Behavior Rules

**1. Think before coding.**
State assumptions explicitly before implementing. If a task has multiple valid interpretations, name them and pick one — don't implement silently. If something in the spec is unclear, stop and ask. Never hide confusion in working code.

**2. Simplicity first.**
Write the minimum code that solves the problem. No features beyond what's in PRD.md. No abstractions for single-use code. No "flexibility" added speculatively. If you've written 200 lines and it could be 50, rewrite it.

**3. Surgical changes.**
Touch only what the current milestone requires. Do not refactor adjacent code, reformat files you didn't write, or "improve" things that aren't broken. If you notice unrelated dead code, mention it — don't delete it.

**4. Stay aligned with specs.**
Before starting any milestone, re-read TASKS.md and PRD.md. Never add pages, fields, or UI elements not listed in PLANNING.md. When in doubt, check the spec. If the spec doesn't cover it, ask before building.

**5. Use your engineering judgment.**
For any technical decision not covered in these specs — package choices, file structure, naming conventions, implementation patterns — make the call yourself. Don't ask the PM about engineering details. If a decision has product implications, flag it. If it's purely technical, just pick the best option and move on.

---

## File Locations

All spec docs live in `/docs`:

| File | Purpose |
|---|---|
| `docs/PRD.md` | What we're building, output quality definition, test set |
| `docs/PLANNING.md` | Screens, system prompt, design tokens, tech stack |
| `docs/TASKS.md` | Milestones with success criteria and test case references |
| `docs/CLAUDE.md` | This file — persistent rules for every coding session |
| `docs/DECISIONS.md` | Log of product decisions made during build |
