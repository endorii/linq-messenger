import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/shared/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { AuthWrapper } from "@/features/auth/components/AuthWrapper";

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
        <html lang="en">
            <body className={`${roboto.className} bg-neutral-800`}>
                <AuthWrapper>
                    <QueryProvider>
                        <Toaster theme="dark" />
                        {children}
                    </QueryProvider>
                </AuthWrapper>
            </body>
        </html>
    );
}
