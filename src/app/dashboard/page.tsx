import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {trialEnd} from "@/lib/trial";
import Dashboard from "./ui";
export default async function Page(){const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");const now=new Date().toISOString();const {data:sub}=await s.from("subscriptions").select("plan,expires_at").eq("user_id",user.id).lte("starts_at",now).gt("expires_at",now).is("revoked_at",null).maybeSingle();return <Dashboard email={user.email||""} trialExpiresAt={trialEnd(user.created_at)} paidExpiresAt={sub?Date.parse(sub.expires_at):0} paidPlan={sub?.plan||""}/>;}