#!/bin/bash
# Compatible with Apple's /bin/bash 3.2. No credentials embedded.
set -u
set -o pipefail

PAUSE=1
if [ "${1:-}" = "--no-pause" ]; then PAUSE=0; fi
cd -- "$(dirname -- "$0")" || exit 1
BASE=$(pwd -P)
REMOTE='https://github.com/salemko72/RANDOM-life.git'
ROOT="$BASE/REPOZITORIJI"
FAILURES=0
UPDATED=0

finish() {
  code=$?
  trap - EXIT
  if [ "$PAUSE" = 1 ] && [ -t 0 ]; then
    printf '\nPritisni Enter za zatvaranje... '
    read -r ignored || true
  fi
  exit "$code"
}
trap finish EXIT

if ! command -v git >/dev/null 2>&1 || ! git --version >/dev/null 2>&1; then
  printf 'Git nije dostupan. U Terminalu pokreni: xcode-select --install\nPotom ponovo pokreni ovu datoteku.\n'
  exit 1
fi
if [ -L "$ROOT" ]; then
  printf 'REPOZITORIJI je simbolicki link. Zaustavljeno radi zastite postojecih foldera.\n'
  exit 1
fi
mkdir -p "$ROOT" "$BASE/IZVJESTAJI" || exit 1
LOG="$BASE/IZVJESTAJI/azuriranje-$(date '+%Y%m%d-%H%M%S')-$$.txt"
# Git output is captured separately and not copied into the public log: credentials
# can be present in an existing origin URL or a credential-helper error.
exec > >(tee -a "$LOG") 2>&1
export GIT_TERMINAL_PROMPT=0
export GIT_LFS_SKIP_SMUDGE=1

g() { git -c core.hooksPath=/dev/null "$@"; }
fail() { printf '  PRESKOCENO: %s\n' "$1"; FAILURES=$((FAILURES+1)); }

sync_one() {
  folder=$1
  branch=$2
  dest="$ROOT/$folder"
  printf '\n%s\nGrana: %s\n' "$folder" "$branch"
  if [ -L "$dest" ]; then fail 'Folder je simbolicki link; nije mijenjan.'; return; fi
  if [ ! -e "$dest" ]; then
    # A failed clone remains as a separate temporary directory for inspection.
    stage="$ROOT/.preuzimanje-$folder-$$"
    if g clone --quiet --single-branch --branch "$branch" --depth 1 -- "$REMOTE" "$stage" >/dev/null 2>&1; then
      if [ -e "$dest" ]; then fail 'Odredisni folder je nastao tokom preuzimanja; nije prepisan.'; return; fi
      mv -- "$stage" "$dest" || { fail 'Preuzeto, ali premjestanje foldera nije uspjelo.'; return; }
    else
      fail 'GitHub preuzimanje nije uspjelo. Provjeri internet/pristup repozitoriju. Ponovi pokretanje.'
      return
    fi
  else
    if [ ! -d "$dest/.git" ] || [ -L "$dest/.git" ]; then fail 'Postojeci folder nije zaseban Git checkout; nije mijenjan.'; return; fi
    actual=$(g -C "$dest" rev-parse --show-toplevel 2>/dev/null) || { fail 'Git checkout nije ispravan.'; return; }
    if [ "$actual" != "$dest" ]; then fail 'Git root ne odgovara ocekivanom folderu.'; return; fi
    origin=$(g -C "$dest" remote get-url origin 2>/dev/null) || { fail 'Nema origin remotea.'; return; }
    if [ "$origin" != "$REMOTE" ]; then fail 'Origin se razlikuje od ocekivanog; nije mijenjan.'; return; fi
    current=$(g -C "$dest" symbolic-ref --quiet --short HEAD 2>/dev/null) || { fail 'Detached HEAD; nije mijenjan.'; return; }
    if [ "$current" != "$branch" ]; then fail 'Aktivna grana je promijenjena; nije mijenjana.'; return; fi
    dirty=$(g -C "$dest" status --porcelain --untracked-files=normal 2>/dev/null) || { fail 'Nije moguce provjeriti lokalne izmjene.'; return; }
    if [ -n "$dirty" ]; then fail 'Postoje lokalne izmjene ili nove datoteke. Sacuvane su; ovaj checkout nije azuriran.'; return; fi
    for marker in MERGE_HEAD CHERRY_PICK_HEAD REVERT_HEAD rebase-apply rebase-merge; do
      if [ -e "$dest/.git/$marker" ]; then fail 'Git operacija je u toku; nije nastavljena niti prekinuta.'; return; fi
    done
    if ! g -C "$dest" fetch --quiet origin "refs/heads/$branch:refs/remotes/origin/$branch" >/dev/null 2>&1; then
      fail 'Fetch nije uspio; lokalne datoteke nisu mijenjane.'; return
    fi
    if ! g -C "$dest" merge-base --is-ancestor HEAD "refs/remotes/origin/$branch" 2>/dev/null; then
      fail 'Postoje lokalni commitovi ili su se historije razisle. Nema reseta niti automatskog spajanja.'; return
    fi
    if ! g -C "$dest" merge --quiet --ff-only "refs/remotes/origin/$branch" >/dev/null 2>&1; then
      fail 'Fast-forward nije uspio. Nema force/reset operacije.'; return
    fi
  fi
  sha=$(g -C "$dest" rev-parse HEAD 2>/dev/null) || { fail 'Nije moguce procitati source SHA.'; return; }
  printf '  SPREMNO: %s\n  Folder: %s\n' "$sha" "$dest"
  UPDATED=$((UPDATED+1))
}

printf 'LIFE SPINNER — GitHub azuriranje za Mac\n'
printf 'Preuzima izvorni kod i dokumentaciju; ne instalira pakete i ne objavljuje aplikaciju.\n'
printf 'Svaka grana ostaje u posebnom folderu. Postojece kopije izvan ovog paketa nisu mijenjane.\n'
sync_one '01-APP-ADMOB' 'codex/ahmed-admob-finish'
sync_one '02-STABILNI-MAIN' 'main'
sync_one '03-ONBOARDING-BUTTONS' 'codex/salem-onboarding-buttons'
sync_one '04-RECIPE-TEXT-DRAFT' 'codex/salem-recipe-wording'
sync_one '05-RIGHTS-AUDIT' 'codex/salem-rights-residual-audit'
printf '\nSpremnih kopija: %s / 5. Preskoceno: %s.\nIzvjestaj: %s\n' "$UPDATED" "$FAILURES" "$LOG"
printf 'Nije radjen push, PR merge, build, deploy ili izmjena online baze.\n'
if [ "$FAILURES" -gt 0 ]; then exit 1; fi
