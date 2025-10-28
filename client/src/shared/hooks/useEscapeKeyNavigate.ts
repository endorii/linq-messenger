"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function useEscapeKeyNavigate() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key !== "Escape" || pathname === "/") return;

            const activeEl = document.activeElement;
            const isTyping =
                activeEl &&
                (activeEl.tagName === "INPUT" ||
                    activeEl.tagName === "TEXTAREA" ||
                    activeEl.getAttribute("contenteditable") === "true");

            const modalOpen = !!document.querySelector(
                ".modal-wrapper, [data-modal-wrapper], [role='dialog'], [role='alertdialog'], [data-state='open']"
            );

            const dropdownOpen = !!document.querySelector(
                ".dropdown, [data-dropdown], .context-menu, [data-context-menu], .menu, [data-menu], [role='menu'], [data-state='open'], [aria-expanded='true']"
            );

            if (isTyping || modalOpen || dropdownOpen) return;

            router.push("/");
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [router, pathname]);
}
