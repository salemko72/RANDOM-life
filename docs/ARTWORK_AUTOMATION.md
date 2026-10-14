# Artwork automation (preview 0.18)

EAT/MOVE/GO: ChatGPT ZIP contains content.json and one generated image. READ/WATCH: ZIP can contain only content.json. Missing WATCH platform is the empty string, not an import error; no service is inferred.

Studio automatically searches Open Library (title + first author) or TMDB (English title + year + film/series). A single exact identity match is downloaded automatically. Ambiguous matches need a candidate choice. Existing packaged images remain available if the source fails. Text-only packages with no available image can be saved for review but cannot become public until a real image is available and approved.

Images are downloaded via narrowly scoped Pages routes, decoded in Studio and converted proportionally to WebP, quality 84%, longest edge at most 1440px. Smaller images are not upscaled. Real covers use contain, not crop. Provenance and attribution are saved with the image. Matching and download do not imply license permission or human approval.

## TMDB one-time connection

1. Create/sign into https://www.themoviedb.org/ . In account Settings → API, request API access appropriate to the use; check current terms and attribution requirements.
2. Obtain the API Read Access Token (not the shorter v3 API key).
3. In Cloudflare → Workers & Pages → random-life-preview → Settings → Variables and Secrets, add **TMDB_READ_TOKEN** as a secret for Production.
4. Redeploy the preview. Never put the token in ChatGPT, source code, ZIPs or client JS.

The server sends the token only to api.themoviedb.org. Studio receives candidates, never the credential. Open Library needs no configured token. These routes use the existing Pages project and Workers free request quota; no paid plan is enabled. This does not connect or migrate the local editorial database.

## Validation

125 unit tests and browser smoke checks cover JSON-only ZIP, optional platform, safe fixed image hosts, provider setup/outage, exact vs ambiguous identity, download, proportional WebP and human flags. Provider responses in tests are mocked; live catalog availability is not guaranteed. TMDB cannot be tested live until the token is configured.
