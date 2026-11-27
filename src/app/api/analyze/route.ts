import {createClient} from "@/lib/supabase/server";
export async function POST(req:Request){
 const s=await createClient(); const {data:{user}}=await s.auth.getUser();
 if(!user)return Response.json({error:"Sign in required"},{status:401});
 const body=await req.json().catch(()=>null);
 if(!body||typeof body.id!=="string")return Response.json({error:"Invalid lead"},{status:400});
 const {data:l}=await s.from("leads").select("service,status,notes,email").eq("id",body.id).single();
 if(!l)return Response.json({error:"Lead not found"},{status:404});
 if(l.email!=="john@example.com"||l.notes!=="Interested in a new website. Budget $1500."||l.service!=="Website design")return Response.json({error:"AI preview currently supports the synthetic demo lead only."},{status:400});
 const key=process.env.GROQ_API_KEY;
 if(!key)return Response.json({error:"AI not configured"},{status:503});
 try{
 const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({model:process.env.GROQ_MODEL||"llama-3.1-8b-instant",messages:[{role:"system",content:"Analyze a fictional sales lead in English. Give priority, rationale, next step and a suggested reply. Do not invent facts or promise outcomes."},{role:"user",content:"Service: Website design. Interested in a new website. Budget $1500."}],max_tokens:350}),signal:AbortSignal.timeout(20000)});
 if(!r.ok)return Response.json({error:"AI temporarily unavailable"},{status:502});
 const j=await r.json();return Response.json({analysis:j.choices?.[0]?.message?.content||"No analysis returned"});
 }catch{return Response.json({error:"AI request failed"},{status:502});}
}