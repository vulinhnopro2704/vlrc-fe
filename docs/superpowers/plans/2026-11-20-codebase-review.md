# Codebase Review & Fix Plan — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execution is coordinator-driven: one coordinator (this session) dispatches 8 read-only review subagents in parallel, consolidates their findings, and ships a single English fix-plan document as a docs-only PR.

**Goal:** Full code review of the vlrc-fe monorepo (all 3 packages + apps/docs + root configs) producing one English fix-plan document, committed on branch `docs/codebase-review-2026-11-20` and opened as a PR to `main`. No source code is modified.

**Architecture:** 8 parallel read-only review subagents, each auditing one area against 6 fixed criteria (redundant/dead code, bugs, non-modern patterns, workarounds/tech debt, repo contract violations, type safety). Each agent writes a structured markdown part file to a temp dir. The coordinator consolidates, dedupes, assigns final finding IDs, writes the executive summary + phased fix plan, and assembles the final document. PR mechanics use the git keychain token via the GitHub REST API (`gh` is not installed).

**Tech Stack:** Read-only code analysis; deliverable is one markdown file. Inputs: `modern-web-guidance` (legacy-scan JSON + fetched guides), Web Interface Guidelines (`command.md`), the repo's own contracts (AGENTS.md + `.agents/skills/vlrc-fe-components/`).

**Spec:** Approved design, session 2026-11-20 — scope: all packages + apps/docs + root configs (~40k LOC, src + tests + stories); 6 review criteria; 8-agent split (ui a–c, ui d–k, ui l–r, ui s–t, ui u–z + root files, Form + layout, Typography + Select/Dropdown/MultiSelect, DataTable + theme + Icons + richtext + editor + hooks + apps/docs + configs); deliverable `docs/reviews/2026-11-20-codebase-review-and-fix-plan.md`; branch `docs/codebase-review-2026-11-20`; PR body = executive summary; **Plan-only PR (no code changes)**.

## Global Constraints

- **No source code changes.** The only file added to the branch is `docs/reviews/2026-11-20-codebase-review-and-fix-plan.md`.
- The final document is written **in English**.
- Every finding needs **`file:line` evidence verified by reading the file** — no guessed line numbers, no findings without a snippet.
- Severity: **P0** = wrong behavior / a11y violation / crash risk; **P1** = repo contract violation or non-modern pattern; **P2** = dead/redundant code, tech debt, minor cleanup.
- Fix risk: **safe | medium | high** (effort × regression risk).
- Review scope: `packages/*/src/**`, `apps/docs/**`, root configs (`tsconfig.json`, `vitest.config.ts`, `vitest.setup.ts`, root `package.json`, `.oxlintrc.json`, `.oxfmtrc.json`, `pnpm-workspace.yaml`). Exclude `node_modules`, `dist`, `storybook-static`, `.pnpm-store`, `.pnpm-lock`.
- Stories/tests are in scope at secondary depth: flag broken/meaningless tests and components with **no** stories at all; do not nitpick story content.
- Temp work dir: `REVIEW_TMP=/private/var/folders/yd/vz6467vx4231_8165w5mcwfdsqgwrh/T/opencode/vlrc-review`. Nothing in `REVIEW_TMP` is committed. This plan file stays untracked (not in the PR).
- Subagents are **read-only** on the repo: they never edit, build, or commit. They may run `pnpm vitest run <specific file>` only to verify a suspected bug, and at most once per agent.
- Cap: ≤30 findings per agent, ordered P0 → P2; skip thin re-export files with nothing to flag; do not report style/naming preferences; do not report Astryx upstream code.

## Review Focus

Failure modes that would make the delivered document unusable — each is pinned by a verification step:

1. **Hallucinated evidence** (finding cites a line that doesn't exist) → Task 4 Step 2: coordinator spot-checks ≥5 findings per part by reading the cited `file:line`.
2. **Undifferentiated severity** (everything "P1") → Task 4 Step 3: every finding carries severity + category + risk; the exec summary counts must match the findings sections exactly.
3. **Cross-agent duplicates** (same issue reported by two adjacent-area agents) → Task 4 Step 2: dedupe by `file:line` + category before assigning final IDs.
4. **Skimmed large files** (agent lists a file but reviews nothing in it) → Task 3: each agent prompt requires a per-file coverage list in the part's Notes section (files read in full vs. sampled).
5. **Unordered fix plan** (phases not risk-ordered, items not actionable) → Task 4 Step 4: phases ordered P0 → safe P2 → P1 → high-risk; every fix-plan item names files + one-line action; Task 4 Step 5 cross-checks plan items ↔ finding IDs.

---

### Task 1: Fetch review-criteria baselines

**Files:**

- Create: `$REVIEW_TMP/` (temp, not committed)
- Create: `$REVIEW_TMP/web-interface-guidelines.md`
- Create: `$REVIEW_TMP/legacy-scan.json`

**Interfaces:**

- Produces: the two baseline files (paths passed verbatim into every agent prompt in Task 3).

- [ ] **Step 1: Create temp dir**

```bash
mkdir -p /private/var/folders/yd/vz6467vx4231_8165w5mcwfdsqgwrh/T/opencode/vlrc-review
```

- [ ] **Step 2: Fetch Web Interface Guidelines**

Use `webfetch` on `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` and write the result to `$REVIEW_TMP/web-interface-guidelines.md`.
Expected: file contains the rule list (focus states, hover states, touch targets, etc.).

- [ ] **Step 3: Run legacy-scan over the whole repo**

```bash
cd /Users/lvtruong/personal/vlrc-fe && pnpx -y modern-web-guidance@latest legacy-scan packages apps --json > /private/var/folders/yd/vz6467vx4231_8165w5mcwfdsqgwrh/T/opencode/vlrc-review/legacy-scan.json
```

Expected: valid JSON array of findings (may be `[]`). Note in the plan's execution log the total count. If the command fails (network), retry once with `npx -y modern-web-guidance@latest`; if still failing, proceed and mark legacy-scan as unavailable in the doc's Methodology section.

- [ ] **Step 4: Read repo-contract references for the coordinator**

Read `.agents/skills/vlrc-fe-components/references/` — at minimum `stylex.md`, `a11y-and-responsive.md`, `forms.md`, `datatable.md`, `modals.md`, `icons.md` — so the consolidated doc cites contract rules accurately.

---

### Task 2: Baseline snapshot

- [ ] **Step 1: Confirm clean tree on `main`**

```bash
git -C /Users/lvtruong/personal/vlrc-fe status --porcelain
```

Expected: empty (or only untracked files that are mine, e.g. this plan). If dirty, stop and surface to the user before proceeding.

- [ ] **Step 2: Record the head SHA for the PR base**

```bash
git -C /Users/lvtruong/personal/vlrc-fe rev-parse main
```

Record the SHA; the doc's Methodology section states "reviewed at commit `<sha>`".

---

### Task 3: Dispatch 8 review agents in parallel

**Files:**

- Create (by agents, in temp): `$REVIEW_TMP/part-1-ui-ac.md` … `$REVIEW_TMP/part-8-misc.md`

**Interfaces:**

- Consumes: Task 1 baselines (paths), Task 2 SHA.
- Produces: 8 part files, each with the structure below (the coordinator parses these in Task 4).

**Shared agent prompt template** (fill `<SCOPE BLOCK>`, `<N>`, `<SLUG>`, `<SHA>`; keep everything else verbatim):

````
You are a senior frontend code reviewer auditing one area of the vlrc-fe
monorepo at /Users/lvtruong/personal/vlrc-fe (branch main, commit <SHA>).

READ-ONLY RULES: Do not edit, create, delete, build, or commit anything in
the repo. Your only write is the single output file named at the end. You may
run `pnpm vitest run <file>` at most once to verify a suspected bug.

<SCOPE BLOCK>

CONTEXT — @vlrc-fe/components v3.0.x, built on Meta's Astryx design system +
Meta StyleX (compile-time). Repo contracts (AGENTS.md, strict):
- Zero raw <div>/<span> for layout/typography: use Stack/HStack/VStack/Box/
  Grid/Row/Col/Flex for layout; Text/Title/Paragraph/Link/Code for text.
- Zero magic values: every color/spacing/radius/shadow/duration comes from
  design tokens (src/theme/tokens.stylex; --color-*, --spacing-*, --radius-*,
  --shadow-*). No #hex, rgb(), raw px, or box-shadow strings in component
  code.
- StyleX via static stylex.create() only (no runtime objects passed to stylex).
- Every wrapper exposes sx?: stylex.StyleXStyles and merges className.
- WCAG 2.1 AA: visible :focus-visible rings via tokens, full ARIA semantics,
  keyboard support, 44x44px touch targets.
- i18n: no hardcoded user-facing strings in components (Astryx handles its
  own via InternationalizationProvider; VLRC-specific strings must be
  localizable).
Deeper contract detail: .agents/skills/vlrc-fe-components/references/*.md.

CRITERIA — find all instances, each with exact file:line evidence:
1. REDUNDANT/DEAD: duplicated logic across components (name the pair of
   files), unused exports/props/params, dead branches, copy-paste blocks that
   belong in a shared helper.
2. BUGS: wrong logic, incorrect/missing hook deps, missing cleanup (timers,
   listeners, aborts), race conditions, wrong ARIA/keyboard behavior,
   unhandled null/undefined, controlled/uncontrolled state bugs, memory leaks,
   incorrect token/prop usage.
3. NON-MODERN: legacy DOM/CSS/JS patterns with modern Baseline replacements.
   Pre-fetched scan: $REVIEW_TMP/legacy-scan.json — grep it for files in your
   scope and verify each hit (drop false positives: intentional fallbacks,
   vendor lookalikes).
4. WORKAROUNDS/DEBT: TODO/FIXME/HACK/XXX comments, comments admitting
   workarounds, defensive code hiding bugs, duplicated fallbacks,
   "temporary" code, version-pin workarounds.
5. CONTRACT: violations of the contracts above (raw div/span, magic values,
   non-static StyleX, missing sx passthrough, missing focus ring/ARIA,
   hardcoded user-facing strings).
6. TYPE-SAFETY: `any` usage, unsafe casts, non-null assertions hiding bugs.

RULES:
- Verify every cited line by reading the file. No guessed line numbers.
- Severity: P0 (wrong behavior/a11y violation/crash risk), P1 (contract
  violation or non-modern pattern worth fixing), P2 (cleanup).
- Fix risk: safe | medium | high.
- Skip thin re-export/trivial-wrapper files with nothing to flag.
- Do not report naming/formatting preferences unless they hide a bug.
- Do not report Astryx upstream code (node_modules).
- Max 30 findings, ordered P0 → P2. Quality over quantity: a finding you
  cannot defend with evidence is dropped.

OUTPUT — write exactly one file: $REVIEW_TMP/part-<N>-<SLUG>.md:

# Part <N>: <area name>
## Summary
2–4 sentences: what was reviewed, overall quality, top concerns.
## Findings
### F-<NN> [P0|P1|P2] <short title>        (NN = 01, 02, … within this part)
- File: `packages/.../file.tsx:123`
- Category: BUG | REDUNDANT | NON-MODERN | WORKAROUND | CONTRACT | TYPE-SAFETY
- Risk of fix: safe | medium | high
- Evidence:
  ```tsx
  ≤6 lines of the actual code at the cited line
````

- Fix: concrete recommended fix, 1–3 sentences.

## Notes

- Files reviewed (full read vs. sampled) — one line per file group.
- Anything the coordinator must know: skipped areas, uncertainty, follow-ups.

Then reply with a 5–10 line summary: counts by severity, top 3 findings,
output file path.

````

**Scope blocks** (all under `packages/components/src/ui/` unless stated; include each component's `.stories.tsx`/`.test.tsx`):

- **Agent 1 (N=1, slug `ui-ac`):** `accordion*`, `action-bar*`, `alert-dialog.tsx`, `alert*`, `aspect-ratio.tsx`, `avatar*`, `badge-overflow*`, `badge*`, `breadcrumb.tsx`, `button*`, `calendar*`, `card*`, `carousel.tsx`, `checkbox*`, `circular-progress*`, `code-block*`, `collapsible.tsx`, `command*`, `compare-slider*`, `context-menu.tsx`, `copy-button*`
- **Agent 2 (N=2, slug `ui-dk`):** `dialog*`, `drawer*`, `dropdown-menu*`, `editable*`, `empty*`, `field.tsx`, `file-upload*`, `flex*`, `form.tsx`, `gauge*`, `grid*`, `hover-card.tsx`, `input-group*`, `input-otp*`, `input*`, `item.tsx`, `kbd*`
- **Agent 3 (N=3, slug `ui-lr`):** `label*`, `layout.stories.tsx`, `marker*`, `masonry*`, `menubar.tsx`, `navigation-menu.tsx`, `pagination*`, `popover*`, `progress*`, `questionnaire*`, `radio-group*`, `rating*`, `resizable.tsx`, `responsive-dialog*`, `row-col*`
- **Agent 4 (N=4, slug `ui-st`):** `scroll-area.tsx`, `segmented*`, `select.tsx`, `separator*`, `sheet*`, `sidebar.tsx`, `signature-pad*`, `skeleton*`, `slider*`, `sonner.tsx`, `spacing.stories.tsx`, `spinner*`, `stat*`, `stepper*`, `switch*`
- **Agent 5 (N=5, slug `ui-z-root`):** `table*`, `tabs*`, `tags-input*`, `textarea*`, `timeline*`, `toggle-group.tsx`, `toggle*`, `tooltip*`, `useBreakpoint.ts`, `index.ts` + root files outside `ui/`: `packages/components/src/Modal.tsx` (+stories/test), `packages/components/src/ConfirmModal.tsx` (+stories/test), `packages/components/src/utils.ts`, `packages/components/src/astryx.ts`, `packages/components/src/lazyLoad.tsx`, `packages/components/src/index.ts`
- **Agent 6 (N=6, slug `form-layout`):** `packages/components/src/Form/**` + `packages/components/src/layout/**`
- **Agent 7 (N=7, slug `typo-selects`):** `packages/components/src/Typography/**` + `packages/components/src/Select/**` + `packages/components/src/Dropdown/**` + `packages/components/src/MultiSelect/**`
- **Agent 8 (N=8, slug `misc`):** `packages/components/src/DataTable/**`, `packages/components/src/theme/**`, `packages/components/src/Icons/**`, `packages/components/src/richtext/**`, `packages/editor/src/**`, `packages/hooks/src/**`, `apps/docs/src/**`, root configs: `package.json`, `tsconfig.json`, `vitest.config.ts`, `vitest.setup.ts`, `.oxlintrc.json`, `.oxfmtrc.json`, `pnpm-workspace.yaml`, `packages/*/package.json`, `packages/*/vite.config.*`, `packages/*/tsconfig*.json`

**Dispatch mechanics:**

- [ ] **Step 1: Dispatch all 8 in one batch** — 8 `subagent` calls with `agent: "general"`, one per scope block above, all in a single response (parallel execution). Each prompt = shared template + its scope block + its N/slug.
- [ ] **Step 2: Wait for all 8 to return** — as each returns, log to the execution log: part file path, severity counts, any agent errors. Do not re-dispatch while others are running; if an agent fails or returns an empty/missing part file, re-dispatch just that agent once with a note about the failure.
- [ ] **Step 3: Verify all 8 part files exist**

```bash
ls -la /private/var/folders/yd/vz6467vx4231_8165w5mcwfdsqgwrh/T/opencode/vlrc-review/part-*.md
````

Expected: 8 files, each non-trivial (≥1 KB).

---

### Task 4: Consolidate and write the final document

**Files:**

- Create: `docs/reviews/2026-11-20-codebase-review-and-fix-plan.md` (written after Step 1 of this task, when the branch already exists)

**Interfaces:**

- Consumes: 8 part files (Task 3), legacy-scan JSON + Web Interface Guidelines (Task 1), base SHA (Task 2).
- Produces: the final document with the section layout below.

- [ ] **Step 1: Create the branch**

```bash
git -C /Users/lvtruong/personal/vlrc-fe checkout -b docs/codebase-review-2026-11-20
```

- [ ] **Step 2: Evidence spot-check + dedupe** — For each part file: read it; verify ≥5 cited `file:line` references by reading the actual files (drop or correct findings that don't match); mark duplicates across parts (same file:line + category) and keep the best-written one; record the dedupe list for the doc's appendix.
- [ ] **Step 3: Assign final finding IDs** — Renumber sequentially `F-001…` across the whole document, grouped by area in this order: ui (a–z), Form+layout, Typography+selects, DataTable+theme+Icons+richtext, editor, hooks, apps/docs+configs. Every finding keeps: severity, category, risk, file:line, evidence, fix.
- [ ] **Step 4: Write the fix plan** — Four phases, each item = finding ID(s) + files + one-line action + effort (S/M/L):
  - **Phase 1 — Correctness (P0 bugs):** all P0, ordered by user impact.
  - **Phase 2 — Safe cleanup (P2, risk=safe):** dead code, dedupe, small debt; groupable into few PRs.
  - **Phase 3 — Contracts & modernization (P1):** contract violations + non-modern patterns; note which can ride along in component-touching PRs.
  - **Phase 4 — High-risk / architectural (risk=high or medium with cross-file impact):** recommend separate design discussion; no items in this phase may be "safe".
- [ ] **Step 5: Assemble the document** with exactly this layout (English):

```markdown
# VLRC FE — Codebase Review & Fix Plan

Date / reviewed-at SHA / reviewer (agent-assisted) — one line each.

## 1. Executive Summary

- Scope + method in 3–4 lines.
- Findings table: counts by severity × area (8 rows).
- Top 10 issues: one line each (ID, title, file:line, why it matters).

## 2. Methodology

- Criteria (6), tools (modern-web-guidance legacy-scan count + version, Web
  Interface Guidelines URL, vlrc-fe-components runbook), 8-agent split table
  (agent, area, files, LOC), limitations (scan covers ~20% of guidance
  corpus; static review only — no runtime testing; stories secondary depth).

## 3. Findings

### 3.1 ui (a–c) … 3.8 editor/hooks/apps+configs

Each area: one-line quality verdict + its findings (F-### entries).

## 4. Consolidated Fix Plan

Phase 1 → 4 tables: | ID | Fix | Files | Effort | Notes |
Plus: suggested PR grouping (which phases → which future PRs) and a
suggested order with dependencies.

## 5. Open Questions

Items that need maintainer decisions (API changes, breaking renames,
upstream Astryx gaps).

## Appendix A — Deduplicated / dropped findings (with reasons)

## Appendix B — Coverage: files reviewed per area (from agent Notes)
```

- [ ] **Step 6: Cross-checks** — (a) exec-summary counts equal the findings sections; (b) every Phase table item references a real finding ID and vice versa (every P0 appears in Phase 1; every finding appears in exactly one phase or is explicitly deferred in Open Questions); (c) no code outside `docs/reviews/` changed.
- [ ] **Step 7: Read the final document top-to-bottom once** and fix inconsistencies (IDs, counts, English typos in headings).

---

### Task 5: Commit, push, open PR

- [ ] **Step 1: Stage only the deliverable**

```bash
git -C /Users/lvtruong/personal/vlrc-fe add docs/reviews/2026-11-20-codebase-review-and-fix-plan.md
git -C /Users/lvtruong/personal/vlrc-fe status --porcelain
```

Expected: exactly one staged file; untracked leftovers (this plan file) are NOT staged.

- [ ] **Step 2: Commit**

```bash
git -C /Users/lvtruong/personal/vlrc-fe commit -m "docs: add full codebase review and phased fix plan (2026-11-20)"
```

- [ ] **Step 3: Push the branch**

```bash
git -C /Users/lvtruong/personal/vlrc-fe push -u origin docs/codebase-review-2026-11-20
```

Expected: remote branch created (auth via osxkeychain).

- [ ] **Step 4: Create the PR via GitHub REST API** — extract the keychain token without printing it:

```bash
TOKEN=$(printf "protocol=https\nhost=github.com\n" | git credential fill | awk -F= '/^password=/{print $2}')
```

Then `POST https://api.github.com/repos/vulinhnopro2704/vlrc-fe/pulls` with `Authorization: Bearer $TOKEN`, body: `title` = `docs: codebase review and fix plan (2026-11-20)`, `head` = `docs/codebase-review-2026-11-20`, `base` = `main`, `body` = executive summary (findings table + top 10 + pointer to the doc + "docs-only, no code changes"). Expected: `201 Created` with `html_url`.
**Fallback** if the token lacks scope (401/403): `brew install gh`, then `printf '%s' "$TOKEN" | gh auth login --with-token`, then `gh pr create` with the same content. If both fail: report to the user with the exact command to run.

- [ ] **Step 5: Clean up env** — `unset TOKEN` (do not persist the token anywhere).

---

### Task 6: Verify and restore workspace

- [ ] **Step 1: Verify the branch contains exactly one file**

```bash
git -C /Users/lvtruong/personal/vlrc-fe diff --stat main...docs/codebase-review-2026-11-20
```

Expected: one file (`docs/reviews/…`), insertions only.

- [ ] **Step 2: Verify the PR** — `GET /repos/vulinhnopro2704/vlrc-fe/pulls` (same token) or the `html_url` from Step 4: state `open`, base `main`, head `docs/codebase-review-2026-11-20`.
- [ ] **Step 3: Return the working tree to `main`**

```bash
git -C /Users/lvtruong/personal/vlrc-fe checkout main
git -C /Users/lvtruong/personal/vlrc-fe status --porcelain
```

Expected: on `main`, tree clean except the untracked plan file under `docs/superpowers/plans/`.

- [ ] **Step 4: Report to user** — PR URL, doc path, findings counts, top issues, and the `### Modern Web Guidance` disclosure (legacy-scan guide IDs applied/checked during consolidation).
