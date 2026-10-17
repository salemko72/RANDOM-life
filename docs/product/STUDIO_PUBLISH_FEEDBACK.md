# Studio image updates and publication feedback — 17 October 2026

Replacing artwork in an existing item retains its ID/version and updates D1 through
the ordinary guarded save. After saving, the existing item stays open, displaying
its saved image and the returned version. A new item still clears the form, including
when saved for review, as requested for consecutive imports.

Publish now displays the outcome beside the action, with title, ID and version:
published, saved for review with concrete server issues, duplicate, or save failure.
It scrolls into view. A successful save followed by a failed library refresh is
reported as saved, rather than masquerading as a failed save.

A reimport of an existing title is a duplicate, not an image update. Previously
this response cleared the pending cover and form while leaving the existing item
unchanged. It now retains the complete pending input and artwork. An explicit
“Apply these changes to the existing item” action selects the returned existing
ID/version without discarding the pending changes; the ordinary Publish action
then saves them with concurrency protection. Nothing silently overwrites a duplicate.

API/database access protection and human verification requirements remain in force.
Errors keep the pending input intact. Replacement image upload clears the old
publication confirmation so it cannot be mistaken for a save of the new image.

Verification: `scripts/smoke-poster-publish.mjs` uses mocked artwork search/download
at the browser boundary and a real Miniflare D1 worker for media and content writes.
It reproduced the duplicate form/image loss before the fix. It checks preservation,
explicit duplicate update, persisted replacement image, public media, stable ID,
version increments and visible review issues. `smoke-access-links.mjs` also checks
that existing items remain open after publication.

Production search probes found and downloaded Breaking Bad and Harry Potter
covers. The exact movie query “Dunje” returned no candidates, with or without 1983.
That private D1 item cannot be inspected with the currently available credentials;
no title/year/identity change has been made to it and no substitute film assumed.
