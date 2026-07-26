# Postmortem: the "medistore" boot crash

## How I approach debugging like this

1. **Reproduce first, don't theorize first.** Before touching anything, I ran the exact failing command (`npm run seed`, then `npm run dev`) to see the real error and confirm it wasn't a one-off fluke.
2. **Trust what changed over what's convenient to blame.** A previous session had already tried a fix (pinning Medusa to `2.17.2`) and left notes assuming it worked. I didn't take that on faith — I re-verified the pinned versions were actually installed, then re-ran the failing command anyway. It still failed. That single check threw out a whole branch of prior "known cause" assumptions instead of wasting time re-applying a fix that was never confirmed.
3. **Rule out the boring explanations before the interesting ones.** Corrupted `npm install` and a stale lockfile were real, cheap things to check, so I checked and fixed them first (`npm ci` failing on a lockfile mismatch was a genuine, separate bug worth fixing on its own). Only once a clean, verified install still reproduced the crash did I treat it as a real upstream/logic bug rather than "just reinstall it."
4. **Search for prior art before re-deriving everything from scratch.** I searched GitHub issues for the exact error string and found a closed issue with the maintainers' own root-cause analysis of a similar case. It turned out to be a *different* bug than mine, but it told me where in the codebase to look (the module's joiner/query config) and saved a lot of blind reading.
5. **When the error message and the stack trace disagree with reality, get empirical.** The static config said the module was registered. The runtime said it wasn't. Rather than guess which was lying, I added temporary `console.log` instrumentation directly into the installed library code to print the actual in-memory state at the exact moment of failure. That's what surfaced the real signal: the module's `alias` list was silently empty.
6. **Follow the data structure back to its source, not just the stack trace.** An empty `alias` array isn't a crash by itself — I had to trace *why* it was empty, which meant reading the code that builds it, not just the code that consumes it.
7. **Once you have a mechanism, test the mechanism directly.** Rather than assume "renaming the folder will fix it," I instrumented the exact function responsible and printed its intermediate values (the computed file path, the guessed directory, whether it existed on disk) to watch the bug happen in real time, character by character, before proposing a fix.
8. **Clean up after yourself.** All debugging instrumentation (console.logs in `node_modules`, temporary scripts) was reverted/deleted once it had done its job — none of it should ship or linger.
9. **Prefer the fix that removes the failure class, not just this instance of it.** Patching the installed library would have "worked" for this one machine, but the same bug would resurface on every `npm install` and on any deploy target whose path also happened to contain "dist". Renaming the project folder removes the actual precondition, permanently.
10. **Verify the fix against reality, not against the absence of an error.** "It didn't crash" isn't proof. I confirmed the storefront was serving genuine database-backed product IDs (`prod_...`) rather than its hardcoded fallback catalog (`fb-...`), and clicked "Add to cart" in an actual browser to watch the cart count change, before calling it done.

## How this specific problem was created in the first place

The project folder is named **`medistore`**. Read closely, that name contains the substring **"dist"**: **me-DIST-ore**.

Medusa (the e-commerce backend framework this project uses) needs to find each of its internal modules' data-model definitions on disk at startup. To do that, one of its internal helper functions (`defineJoinerConfig`) walks up the JavaScript call stack to find the file path of whichever module is currently being loaded, then does something like:

```js
fullPath.split("dist")[0] + "dist"
```

The intent is: "find the module's compiled `dist/` build folder, then look for a `models/` folder next to it." That logic assumes the literal text `"dist"` only ever appears once in the path — as the actual build-output folder name.

But the full path being searched was something like:

```
C:\Users\sikha\medistore\backend\node_modules\@medusajs\api-key\dist\joiner-config.js
```

`.split("dist")` splits on **every** occurrence of that text, and the code only looks at the **first** one. The first occurrence of "dist" in that path isn't the real `dist\` folder near the end — it's the one hiding inside "me**dist**ore" near the beginning. So the code computed a nonsense folder path (`C:\Users\sikha\medist\models`), which doesn't exist, found nothing, and silently gave up — leaving that module (and, since every module lives under the same "medistore" parent folder, *every other module too*) with no registered "alias," i.e. no way for the rest of the app to look it up by name.

The app didn't crash immediately, because nothing tries to look anything up by name until the very first real operation — which happened to be Medusa's own internal "create default data" step that runs automatically on every boot, querying for something called `api_key`. That's the first place the missing alias got *used*, so that's where the crash appeared — even though the actual defect had already happened silently, earlier, for every module, the moment the app started loading.

**In short:** a coincidence of naming (a demo project for a "medi-store" happening to spell out "dist" inside its own name) collided with a fragile assumption in a third-party library (that a build path only ever contains the word "dist" once). Nothing in this project's actual code was wrong; the fix was renaming the folder to `medi-store` so the word "dist" no longer appears as a substring anywhere in the path.

## Secondary bug found along the way (unrelated)

Separately, `backend/src/scripts/seed.ts` assumed a "shipping profile" already existed in the database and just queried for it, without ever creating one. On a genuinely fresh database that assumption was wrong. Fixed by querying first and only creating one if none is found.
