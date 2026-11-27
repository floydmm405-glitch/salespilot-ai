export const TRIAL_MS=72*60*60*1000;
export function trialEnd(createdAt:string){return Date.parse(createdAt)+TRIAL_MS;}
export function trialActive(createdAt:string,now=Date.now()){const end=trialEnd(createdAt);return Number.isFinite(end)&&now<end;}
