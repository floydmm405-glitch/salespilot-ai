import {test,expect} from '@playwright/test';
test('six languages, persistence, RTL and layout',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');const picker=page.getByRole('combobox',{name:'Language'});
 await expect(picker).toHaveValue('en');
 for(const [lang,title] of [['zh','将更多咨询转化为商机。'],['es','Convierte más consultas en oportunidades.'],['ar','حوّل المزيد من الاستفسارات إلى فرص.'],['fr','Transformez davantage de demandes en opportunités.'],['pt','Transforme mais consultas em oportunidades.'],['en','Turn more enquiries into opportunities.']]){
 await picker.selectOption(lang);await expect(page.locator('h1')).toHaveText(title);await expect(page.locator('html')).toHaveAttribute('dir',lang==='ar'?'rtl':'ltr');await page.reload();await expect(picker).toHaveValue(lang);await expect(page.locator('h1')).toHaveText(title);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
 }expect(errors).toEqual([]);
});
test('registration and login forms, protected dashboard and API',async({page,request})=>{
 await page.goto('/signup');await expect(page.locator('input[name=company]')).toBeVisible();await expect(page.locator('input[name=password]')).toHaveAttribute('minlength','8');
 await page.goto('/login');await expect(page.locator('input[name=email]')).toBeVisible();
 await page.goto('/dashboard');await expect(page).toHaveURL(/\/login/);
 expect((await request.post('/api/analyze',{data:{id:'test'}})).status()).toBe(401);
});
