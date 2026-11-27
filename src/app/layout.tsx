import type { Metadata } from "next";
import "./globals.css";
import LanguagePicker from "./language";
export const metadata: Metadata = {title:"SalesPilot AI — Your AI sales assistant",description:"Capture, qualify, and follow up with every lead."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><LanguagePicker/>{children}</body></html>;}
