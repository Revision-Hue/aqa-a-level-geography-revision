# AQA A-level Geography Revision

Public revision app: https://revision-hue.github.io/aqa-a-level-geography-revision/

Continues the existing Geography app while preserving its original case IDs, note indices and browser-storage keys. Existing progress at this GitHub Pages origin is retained.

Includes all eleven AQA 7037 topics/options, 255 knowledge cards, 62 case studies, 66 quiz questions and 33 guided essay prompts. Smart Revision, Revision+, Study Lab, NEA statistics, retries, custom/bulk flashcards, annotations, model comparison, timed writing, global search, bookmarks and backup/sync are integrated with the Geography diagnostic and skills suites.

Exam Boost provides paper/course diagnostics, source-based statistics, AO3 resources and a fictional OS-style map. Geo Practice provides edited-case recall, topic diagnostics, AO2 evaluation and OS calculations.

Progress and teacher resources are browser-local. Use JSON backup/import or a sync code to transfer them to another device; revision-set links share topic choices only.

## Checks

With Node 24+, run `npm install`, `npm run build`, then `npm test`.

115 automated checks cover 34 regression cases, 76 DOM workflows and 5 offline/package checks. DOM tests mock dialogs, print, clipboard, downloads and timers. Rendered browser/device layout and operating-system installation/printing are not verified by these tests.

The production app is buildless and served from the repository root by GitHub Pages. `dist` is an optional validated copy for packaging; it is not tracked. No Sites-specific identity, credentials or access metadata is included.
