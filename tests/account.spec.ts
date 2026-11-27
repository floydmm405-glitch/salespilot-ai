import {test,expect,Page} from '@playwright/test';
const a=process.env.E2E_EMAIL_A,b=process.env.E2E_EMAIL_B,pa=process.env.E2E_PASSWORD_A,pb=process.env.E2E_PASSWORD_B;
async function login(page:Page,email:string,password:string){await page.goto('/login');await page.locator('input[name=email]').fill(email);await page.locator('input[name=password]').fill(password);await page.getByRole('button',{name:'Sign in',exact:true}).click();await expect(page).toHaveURL(/\/dashboard/);}
test('lead lifecycle, isolation, AI history and quota',async({page,browser})=>{
 test.skip(!a||!b||!pa||!pb||a===b,'Requires two dedicated test accounts in separate workspaces');
 test.skip(test.info().project.name!=='desktop','Avoid duplicate quota consumption');
 test.setTimeout(240000);
 await login(page,a!,pa!);const name='E2E-'+crypto.randomUUID();await page.locator('input[name=name]').first().fill(name);await page.getByRole('button',{name:'Save lead',exact:true}).click();const lead=page.locator('article').filter({has:page.getByText(name,{exact:true})});await expect(lead).toBeVisible();const id=(await lead.getAttribute('id'))!.replace('lead-','');
 try{
 const other=await browser.newContext();try{const p=await other.newPage();await login(p,b!,pb!);await expect(p.getByText(name,{exact:true})).toHaveCount(0);expect((await p.request.post('/api/analyze',{data:{id,summary:'Website project',confirmed:true}})).status()).toBe(404);}finally{await other.close();}
 const payload={id,summary:'Website project, scope and timeline to clarify',confirmed:true,lang:'en'};
 expect((await page.request.post('/api/analyze',{data:{...payload,confirmed:false}})).status()).toBe(400);
 if(process.env.E2E_RUN_AI==='true'){const res=await page.request.post('/api/analyze',{data:payload});expect(res.status()).toBe(200);await page.reload();await expect(lead.getByText(/Analysis history/)).toBeVisible();let limited=false;for(let i=0;i<10;i++){const r=await page.request.post('/api/analyze',{data:payload});if(r.status()===429){limited=true;break;}expect(r.status()).toBe(200);}expect(limited).toBeTruthy();}
 }finally{page.once('dialog',d=>d.accept());await lead.getByRole('button',{name:'Delete lead'}).click();await expect(lead).toHaveCount(0);}
});
