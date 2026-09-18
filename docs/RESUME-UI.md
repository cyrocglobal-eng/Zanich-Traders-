# Resume Zanich local UI review

Branch: codex/zanich-ui-redesign. Original rollback point: 9cf4893.
Project: C:/Users/Kali Kid/Desktop/project Zanich/app.

The owner requested pausing at the advanced-model limit and keeping work resumable.
The limit reset and work resumed on 18 September 2026. Read DESIGN.md and
UI-REDESIGN.md first, then inspect git status. Preserve this local redesign.

Local development: npm run dev -- --hostname 127.0.0.1 --port 3000.
Local production preview: npm run build, then npm run start -- --hostname 127.0.0.1 --port 3001.
Screenshots and Playwright CLI review scripts: .local/ui-review/ (ignored).

Checks: npm run lint; npm run typecheck; npm test; npm run build.
Windows sandbox may fail tsx user lookup; escalate the same test command if necessary.

No push, AWS changes, database changes, domain changes or production release occurred.
Next step after final local checks: owner visual review, then separately authorized
GitHub push/release. Keep existing production deployment intact.
