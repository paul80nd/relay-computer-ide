# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm test` — Jest (ts-jest, ESM). Currently only `tests/components/emulator/*` is covered.
- Single test: `npx jest tests/components/emulator/emu-core.test.ts` (or `-t "<pattern>"`).
- ESLint config is the flat `eslint.config.js`; the `.eslintrc.json` at the root is stale Angular config and is not used.

## Architecture conventions

### Command bus (`src/hooks/useCommandBus.ts`, `src/commands.ts`)

Cross-component coordination is routed through a typed pub/sub bus rather than prop drilling. Convention (not enforced by the bus): **one subscriber per `target`** — `App` owns `app` and `panel`, `Editor` owns `editor`, `Output` owns `output`. When adding a cross-component action, add a `CommandBase<...>` variant to the `Command` union plus a factory in the matching `*Commands` object, then subscribe in the single owner.

### Monaco / assembly wiring (`src/workers.ts`)

`workers.ts` has import-time side effects (language registration, editor worker, LSP worker boot, `rcdsm` CodeLens provider). The provider reads from the module-level `currentAssembly` cache and the `jumpToSourceCommandId` slot — these are *not* updated directly from `useAssembler`. They are populated as a side effect of `OutputApi.setAssembly` and the Output mount effect (`src/components/output/`), which means the cache is empty whenever the secondary panel is hidden. Keep that coupling in mind when touching either side. Also: `src/components/editor/editor.tsx`, `src/components/output/output.tsx` and `src/workers.ts` all import `monaco-editor/esm/vs/editor/editor.api.js`, which transitively contributes every built-in Monaco language — that's why `dist/assets/` ships chunks for languages this project never uses.

### `❌` sentinel coupling

`src/assembler.ts` prefixes failed-assembly messages with a `❌` emoji and `src/basic-languages/rcdsm.ts` matches `[/❌.*/, 'invalid']` to highlight them red in the disassembly view. Changing the glyph in one place silently breaks highlighting in the other.

### Source ↔ address mapping (`src/assembler.ts`)

`exchangeAddressForSourceLine` falls back to the **nearest** PC when no exact match exists in `pcToLocs`. Preserve that fallback — jump-to-source relies on it for addresses that don't land on an instruction boundary.

### Assembler access

Consumers should read `assembly` from `useAssembler` (debounced 300 ms) rather than calling `assemble()` directly, so all views stay in sync with the same debounced result.

## Repo layout gotchas

- `docs/` is the published GitHub Pages copy of `public/` (examples, LSP worker bundle, loadsheet, tape). Keep them in sync when changing assets under `public/`.
- The RCASM LSP worker bundle is shipped as a static asset at `public/lsp/rcasm/server.js`; it is not built from this repo.
