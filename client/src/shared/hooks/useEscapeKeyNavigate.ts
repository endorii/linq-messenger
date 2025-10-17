"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function useEscapeKeyNavigate() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && pathname !== "/") {
                router.push("/");
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [router, pathname]);
}
