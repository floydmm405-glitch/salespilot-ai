import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import Dashboard from "./ui";
export default async function Page(){const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");return <Dashboard email={user.email||""}/>;}