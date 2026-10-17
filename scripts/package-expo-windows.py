"""Package a source-only Windows EAS launcher; never include caches or credentials."""
from pathlib import Path
import hashlib, io, json, subprocess, zipfile
root=Path(__file__).resolve().parent.parent
out=Path('/workspace/shared/expo-windows-download');out.mkdir(parents=True,exist_ok=True)
files=subprocess.check_output(['git','ls-files','--cached','--others','--exclude-standard','-z'],cwd=root).decode().split('\0')
assets=sorted(p for p in files if p.startswith('apps/client/src/web/assets/') and (root/p).is_file())
buckets=[[],[]];sizes=[0,0]
for name in sorted(assets,key=lambda n:(root/n).stat().st_size,reverse=True):
 i=min(range(2),key=lambda i:sizes[i]);buckets[i].append(name);sizes[i]+=(root/name).stat().st_size
parts=[]
for i,names in enumerate(buckets,1):
 b=io.BytesIO()
 with zipfile.ZipFile(b,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for name in sorted(names):z.write(root/name,name)
 data=b.getvalue();sha=hashlib.sha256(data).hexdigest();name=f'assets-{i:02}-{sha[:12]}.zip'
 assert len(data)<24*1024*1024
 (out/name).write_bytes(data);parts.append(dict(name=name,bytes=len(data),sha256=sha))
manifest=json.dumps(dict(parts=parts),indent=2)
source=out/'RANDOM-life-Expo-Windows.zip'
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for name in files:
  p=root/name
  if not p.is_file() or name in assets:continue
  if name.startswith(('apps/','packages/','services/')) and p.suffix in ('.ts','.tsx','.json','.css','.png','.ttf','.mjs','.cjs','.sql','.js'):
   assert not any(part in ('.expo','node_modules','android','ios','generated') for part in p.relative_to(root).parts),name
   z.write(p,name)
 for name in ['package.json','package-lock.json','tsconfig.json','.gitignore','scripts/build-preview.mjs']:
  z.write(root/name,name)
 z.writestr('.easignore',(root/'.gitignore').read_text()+'\n.random-downloads/\n*.zip\napps/client/android/\napps/client/ios/\n')
 for name in ['POKRENI-APK.cmd','pokreni-apk.mjs','PROCITAJ.txt']:z.write(root/'scripts/android-windows'/name,name)
 z.writestr('assets-manifest.json',manifest)
# Validate ZIP CRCs and the entry allowlist, including the required EAS config.
with zipfile.ZipFile(source) as z:
 assert z.testzip() is None
 names=z.namelist();assert len(names)==len(set(names))
 for name in names:
  assert not name.startswith('/') and '..' not in Path(name).parts
  assert not any(part in ('node_modules','.git','.expo','generated') for part in Path(name).parts)
  assert Path(name).suffix not in ('.p12','.jks','.key','.pem')
  assert not Path(name).name.startswith('.env')
 config=json.loads(z.read('apps/client/app.json'))['expo']
 assert config['slug']=='random' and config['extra']['eas']['projectId']=='04bf570d-5e7b-4c51-b1ae-65e6fc60cf5a'
 assert json.loads(z.read('apps/client/eas.json'))['build']['preview']['android']['buildType']=='apk'
sha=hashlib.sha256(source.read_bytes()).hexdigest()
(out/'SHA256SUMS.txt').write_text(f'{sha}  {source.name}\n'+''.join(f'{p["sha256"]}  {p["name"]}\n' for p in parts))
print(json.dumps(dict(zip=source.name,bytes=source.stat().st_size,sha256=sha,assets=len(assets),parts=parts),indent=2))
