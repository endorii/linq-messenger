import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/shared/components/providers/QueryProvider";
import { Toaster } from "sonner";
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
                className={`${roboto.className} bg-neutral-200 dark:bg-neutral-800 selection:bg-purple-900 selection:text-white`}
            >
                <QueryProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Toaster theme="dark" />
                        {children}
                    </ThemeProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
