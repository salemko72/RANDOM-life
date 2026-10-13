export async function enterDemo(page,name='QA',locale='bs'){
 const dialog=page.locator('.onboarding-screen');
 if(!await dialog.count())return;
 await page.getByRole('button',{name:locale==='en'?'ENG':'BHS',exact:true}).click();
 await page.locator('.onboarding-field input').first().fill(name);
 await page.getByRole('button',{name:locale==='en'?'CONTINUE':'NASTAVI',exact:true}).click();
 await page.getByRole('button',{name:locale==='en'?'CONTINUE':'NASTAVI',exact:true}).click();
 await page.getByRole('button',{name:locale==='en'?'ENTER RANDOM':'UĐI U RANDOM',exact:true}).click();
 await dialog.waitFor({state:'detached'});
}
// Seed legacy editor state for recovery tests; there is no manual JSON intake in the UI.
export async function seedEditor(page,input){
 await page.evaluate(input=>{const key='random-life.studio-editor.v1';const saved=JSON.parse(localStorage.getItem(key)||'{}');localStorage.setItem(key,JSON.stringify({...saved,json:typeof input==='string'?input:JSON.stringify(input)}));},input);
 await page.reload();
}

export async function reopenLastSaved(page){
 const id=await page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('random-editorial-preview',1);r.onsuccess=()=>{const db=r.result,q=db.transaction('content').objectStore('content').getAll();q.onsuccess=()=>{const rows=q.result.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));db.close();resolve(rows[0]?.id);};q.onerror=reject;};r.onerror=reject;}));
 if(!id)throw Error('No saved record to reopen');
 await page.waitForFunction(id=>Array.from(document.querySelectorAll('.library .item')).some(row=>row.getAttribute('data-content-id')===id&&!row.disabled),id);
 await page.locator('.library .item').evaluateAll((rows,id)=>{const button=rows.find(row=>row.getAttribute('data-content-id')===id);if(!button)throw Error('Saved record not visible');button.click();},id);
 await page.waitForFunction(id=>{try{return JSON.parse(localStorage.getItem('random-life.studio-editor.v1')).selected?.id===id;}catch{return false;}},id);
}
