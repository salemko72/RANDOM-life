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
