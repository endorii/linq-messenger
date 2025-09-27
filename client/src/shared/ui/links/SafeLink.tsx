"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SafeLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent) => {
        if (pathname === href) {
            e.preventDefault();
        }
    };

    return (
        <Link href={href} onClick={handleClick}>
            {children}
        </Link>
    );
}
