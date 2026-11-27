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

test('theme selection persists and follows system',async({page})=>{await page.emulateMedia({colorScheme:'dark'});await page.goto('/');const picker=page.getByTestId('theme-picker');await expect(picker).toHaveValue('system');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await picker.selectOption('light');await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.reload();await expect(picker).toHaveValue('light');await expect(page.locator('html')).toHaveAttribute('data-theme','light');await picker.selectOption('dark');await expect(page.locator('body')).toHaveCSS('background-color','rgb(14, 22, 37)');await page.reload();await expect(picker).toHaveValue('dark');await picker.selectOption('system');await page.emulateMedia({colorScheme:'light'});await expect(page.locator('html')).toHaveAttribute('data-theme','light');});

test('approved pricing is visible',async({page})=>{await page.goto('/');const pricing=page.locator('#pricing');await expect(pricing.getByRole('heading',{name:'0 USDT',exact:true})).toBeVisible();await expect(pricing.getByRole('heading',{name:'19 USDT / 30 days',exact:true})).toBeVisible();await expect(pricing.getByRole('heading',{name:'190 USDT / year',exact:true})).toBeVisible();await expect(pricing.getByText('Save 16.7%',{exact:true})).toBeVisible();});
