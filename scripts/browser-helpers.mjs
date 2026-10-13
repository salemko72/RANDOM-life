export async function enterDemo(page,name='QA'){
 const dialog=page.getByRole('dialog',{name:'Probna registracija u RANDOM'});
 if(!await dialog.count())return;
 await page.getByLabel('Kako da te zovemo?').fill(name);
 await page.getByRole('button',{name:'NASTAVI',exact:true}).click();
 await page.getByRole('button',{name:'NASTAVI',exact:true}).click();
 await page.getByRole('button',{name:'UĐI U RANDOM',exact:true}).click();
 await dialog.waitFor({state:'detached'});
}
