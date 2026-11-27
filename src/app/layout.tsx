import type { Metadata } from "next";
import "./globals.css";
import ThemePicker from "./theme";
import LanguagePicker from "./language";
export const metadata: Metadata = {title:"SalesPilot AI — Your AI sales assistant",description:"Capture, qualify, and follow up with every lead."};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><div className="preferences"><ThemePicker/><LanguagePicker/></div>{children}</body></html>;}
