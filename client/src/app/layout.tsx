import { ClientToaster } from "@/shared/components/ClientToaster";
import { QueryProvider } from "@/shared/components/providers/QueryProvider";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";

const roboto = Roboto({});

export const metadata: Metadata = {
    title: "Linq | Messenger",
    description: "Created by tenshi",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${roboto.className} bg-neutral-100 dark:bg-neutral-800 selection:bg-blue-700 dark:selection:bg-purple-800 selection:text-white`}
            >
                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <ClientToaster />
                        {children}
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
