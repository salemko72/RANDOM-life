#!/bin/bash
set -eu
cd -- "$(dirname -- "$0")/.."
python3 - <<'PY'
import subprocess as sp,tempfile,pathlib,shutil,os
source=pathlib.Path('tools/mac-updater/AZURIRAJ.command').read_text()
branches=['codex/ahmed-admob-finish','main','codex/salem-onboarding-buttons','codex/salem-recipe-wording','codex/salem-rights-residual-audit']
folders=['01-APP-ADMOB','02-STABILNI-MAIN','03-ONBOARDING-BUTTONS','04-RECIPE-TEXT-DRAFT','05-RIGHTS-AUDIT']
def git(*args,cwd=None):
 return sp.check_output(['git','-c','user.name=Updater Test','-c','user.email=test@example.invalid',*args],cwd=cwd,stderr=sp.DEVNULL,text=True).strip()
with tempfile.TemporaryDirectory(prefix='mac updater test ') as tmp:
 root=pathlib.Path(tmp);remote=root/'remote.git';work=root/'producer';bundle=root/'Mac Folder'
 git('init','--bare',str(remote));git('init',str(work));(work/'file.txt').write_text('one\n')
 git('add','file.txt',cwd=work);git('commit','-m','base',cwd=work)
 git('remote','add','origin',remote.as_uri(),cwd=work)
 for b in branches:
  git('branch','-f',b,'HEAD',cwd=work);git('push','origin',b,cwd=work)
 bundle.mkdir();script=bundle/'AZURIRAJ.command';script.write_text(source.replace('https://github.com/salemko72/RANDOM-life.git',remote.as_uri()))
 def run(expect=0):
  result=sp.run(['bash',str(script),'--no-pause'],stdout=sp.PIPE,stderr=sp.STDOUT,text=True)
  assert result.returncode==expect,(result.returncode,result.stdout)
  return result.stdout
 run();checkouts=[bundle/'REPOZITORIJI'/f for f in folders]
 for d,b in zip(checkouts,branches):assert git('branch','--show-current',cwd=d)==b
 print('PASS clone: five branches, separate copies, path with spaces')
 git('checkout',branches[0],cwd=work);(work/'file.txt').write_text('two\n');git('add','file.txt',cwd=work);git('commit','-m','advance',cwd=work);git('push','origin',branches[0],cwd=work)
 hook=checkouts[0]/'.git/hooks/post-merge';marker=root/'hook-ran';hook.write_text('#!/bin/sh\ntouch "'+str(marker)+'"\n');hook.chmod(0o755)
 run();assert (checkouts[0]/'file.txt').read_text()=='two\n';assert not marker.exists()
 print('PASS fast-forward; repository hook not executed')
 d=checkouts[1];before=git('rev-parse','HEAD',cwd=d);(d/'file.txt').write_text('LOCAL\n');(d/'new.txt').write_text('KEEP\n')
 out=run(1);assert 'lokalne izmjene' in out;assert git('rev-parse','HEAD',cwd=d)==before;assert (d/'file.txt').read_text()=='LOCAL\n';assert (d/'new.txt').read_text()=='KEEP\n'
 print('PASS dirty and untracked files preserved; remaining copies processed')
 # Make this test clone clean by committing its intentional local work, never resetting.
 git('add','file.txt','new.txt',cwd=d);git('commit','-m','local work',cwd=d);local=git('rev-parse','HEAD',cwd=d)
 out=run(1);assert 'lokalni commitovi' in out;assert git('rev-parse','HEAD',cwd=d)==local
 print('PASS local commits preserved without reset or merge')
 d2=checkouts[2];git('checkout','-b','my-work',cwd=d2);out=run(1);assert 'Aktivna grana' in out;assert git('branch','--show-current',cwd=d2)=='my-work'
 print('PASS unexpected branch preserved')
 d3=checkouts[3];git('remote','set-url','origin','https://example.invalid/PRIVATE_SECRET_MARKER',cwd=d3);out=run(1);assert 'Origin se razlikuje' in out;assert 'PRIVATE_SECRET_MARKER' not in out
 for log in (bundle/'IZVJESTAJI').glob('*.txt'):assert 'PRIVATE_SECRET_MARKER' not in log.read_text()
 print('PASS wrong origin refused; origin credential marker not logged')
 d4=checkouts[4];git('checkout','--detach',cwd=d4);out=run(1);assert 'Detached HEAD' in out
 print('PASS detached HEAD refused')
 # A separate package points at the first one: it must never traverse that link.
 other=root/'symlink package';other.mkdir();s=other/'AZURIRAJ.command';s.write_text(script.read_text());(other/'REPOZITORIJI').symlink_to(bundle/'REPOZITORIJI',target_is_directory=True)
 r=sp.run(['bash',str(s),'--no-pause'],stdout=sp.PIPE,text=True);assert r.returncode==1 and 'simbolicki link' in r.stdout
 print('PASS symlink root refused')
print('All Mac updater Git integration scenarios PASS (Linux Bash; no physical Mac run).')
PY
