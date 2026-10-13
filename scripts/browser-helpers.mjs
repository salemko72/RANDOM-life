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
