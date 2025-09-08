import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

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
            <body className={`${roboto.className}`}>{children}</body>
        </html>
    );
}
