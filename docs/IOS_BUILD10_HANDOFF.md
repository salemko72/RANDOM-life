# LifeSpinner 1.1.1 (10) — organized profile and settings

User explicitly requested a new build10 on25 November2026 after popup layout corrections. Own branch `codex/salem-ios-build10`, base80ec1125c71c168ee48192b17ac9d4c53df7064c; popup application source3b1a70a849203d724254ba726ac03b4716ba214d. Claim7abbf97 pushed before version edit.

## Included

- Main menu title, My profile and Saved picks above language, units and remaining settings. Diagnostics/build remain in bottom footer.
- Profile/settings grouped with consistent spacing and thin dividers. Four secondary profile actions are transparent black-text outline buttons in2×2 layout below Edit Answers; web3-action fallback, catalogue clear/status styling and all original callbacks preserved.
- All existing9 behavior: EN/BS/ES/PT-BR/DE/IT UI and online/cache/reserve content, regional units/manual override, detail scroll fade/Back touch protection, renderer recovery, category repeat, cinema5 and five-completed-spins/next-explicit-Spin ad policy.
- Existing **testflight** profile with **test ads**, Xcode27.2 image and native scene support. Marketing version remains1.1.1; only iOS build number changes9→10. Android code12 remains a separately unconfirmed candidate.

## Validation and preflight

Popup application source was already validated:431tests/65files, TypeScript/preview and real-app six-language390/320px layout/order/dividers/clear/delete-cancel/privacy/share/webfallback PASS. No new UI logic in the build10 preparation. Fresh preview/TypeScript PASS, build-metadata/native-assets11tests/2files PASS, six native locale declarations/iPhone-only/portrait PASS; no unnecessary duplicate full suite for a numeric build bump.

Fresh EAS inventory latest9/no10; Free iOS9/15,total13/30,estimated/overage0. Existing APP_STORE signer certificate serialCC1209C468F7ABC54F45E3BFA7E67FB and active provisioning profile expire3 November2027. Use frozen original credentials and exact clean source SHA recorded after commit; no new signer or paid resource.

This task requests **build-only**, not Apple upload/public release. No auto-submit, duplicate9 upload, Android native build, merge, web/DB deploy or production publication. Record actual EAS10/native archive result; build completion alone is not TestFlight availability. Physical QA still required, especially popup scroll/layout, native share/privacy and inherited background/Spin-ad behavior.

Source/result/ZIP and PR compare follow below. GitHub PR API previously403; never claim an uncreated PR exists.

## Frozen source and scheduled archive

Clean EAS/application source **09eb6116050a69b12f07f253fc289a1ca86e2ae4**, pushed on `codex/salem-ios-build10`. [Buildc4ef113d](https://expo.dev/accounts/salemko/projects/random/builds/c4ef113d-35cd-4915-abaa-98e3907d4e73), **1.1.1 (10)**, initiallyIN_QUEUE/errornull. [Safe result](reviews/ios10-result.json). Reuse this ID, do not schedule another archive. No auto-submit.

[Download frozen source ZIP](https://github.com/salemko72/RANDOM-life/archive/09eb6116050a69b12f07f253fc289a1ca86e2ae4.zip). Local archive `/workspace/shared/LifeSpinner-1.1.1-build10-source.zip`, SHA256 `89cf4b40f893f10ccc5760d39abe32e1f1591bce7c434bd6a4446d944cf951a8` (GitHub ZIP container can differ; source SHA is authoritative). Root `npm ci` regenerates ignored native preview HTML. Ahmed can use this same shared source after his own Play versionCode/quota/signer checks; no Android archive or Play upload performed here.

Apple profile validation returned403; CLI continued using the unchanged locally valid frozen existing profile. GitHub draft PR creation also returned `Post https://api.github.com/graphql: Forbidden` (403); no PR was created. Branch push succeeded. [Create PR against popup branch](https://github.com/salemko72/RANDOM-life/compare/codex/salem-profile-action-buttons...codex/salem-ios-build10?expand=1). API access failure, not an automatic approval-review rejection.

## Completed archive

**FINISHED**, errornull, completed25 November2026 at14:22CET. Build **1.1.1 (10)**, EAS **c4ef113d-35cd-4915-abaa-98e3907d4e73**, frozen source **09eb6116050a69b12f07f253fc289a1ca86e2ae4**. This supersedes the initial IN_QUEUE status. Actual Xcode log confirms `iPhoneOS27.2.sdk` and `ARCHIVE SUCCEEDED`; decoded logSHA256 `7299ee3ebab583ac7b92ef792a25e68489358674a0ba065115fcaeb1691e3921`. Independent IPA download from this environment returnsHTTP403, so no IPA hash or embedded metadata assertion. Free usage afterbuild: iOS10/15,total14/30,estimated/overage0.

**No TestFlight upload requested for10.** Submit this existing ID once separately authorized; do not rebuild to upload it. Apple processing/group availability and physical QA remain separate. No public AppStore release, DB/web deploy or merge. Application behaviour is now packaged in the completed10 archive; it cannot appear in older9 installs.

## Authorized TestFlight upload —25 November2026

User explicitly says “salji da testiram”. Claimed IOS-SUBMIT-010, commit99ec0cc pushed before scheduling upload. Exact FINISHED1.1.1(10) archive/source/target verified; last20iOS submissions had no existing10 upload. [Submissiona751bc73](https://expo.dev/accounts/salemko/projects/random/submissions/a751bc73-c295-4309-8634-b2d53904264e) accepted and initiallyIN_QUEUE, errornull. Uses the existing archive c4ef113d-35cd-4915-abaa-98e3907d4e73 and original remote submission key; no rebuild or credential copying. [Safe result](reviews/ios10-submission-result.json).

Automatic client TestFlight group setup skipped afterApple403; remote upload scheduled successfully despite that. Monitor this submission, never duplicate it to get faster processing. Apple processing/compliance/internal group/tester availability must be distinguished from successful upload. No public AppStore release/review submission, new costs, merge, web or DB deployment. This supersedes earlier build-only/no-upload authorization statements.
