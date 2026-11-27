import {defineConfig,devices} from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:60000,workers:1,retries:0,reporter:'list',use:{baseURL:process.env.E2E_BASE_URL||'https://salespilot-ai-nb6m.onrender.com',navigationTimeout:90000},projects:[{name:'desktop',use:{...devices['Desktop Chrome']}},{name:'mobile',use:{...devices['iPhone 13'],defaultBrowserType:'webkit'}}]});
