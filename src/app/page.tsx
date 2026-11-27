import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function Home(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(user)redirect("/dashboard");
 return <main className="auth-shell"><div className="auth-card"><div className="brand"><div className="brand-mark">S</div>SalesPilot <span>AI</span></div><div className="eyebrow">YOUR SALES WORKSPACE</div><h1>Never miss a lead again.</h1><p>Capture enquiries, qualify prospects, and keep every customer conversation organised in one place.</p><div className="auth-actions"><Link className="primary-link" href="/signup">Create your workspace</Link><Link className="secondary-link" href="/login">Sign in</Link></div><small>Built for ambitious service businesses.</small></div></main>;
}
