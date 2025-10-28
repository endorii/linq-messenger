"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ClientToaster() {
    const { theme, systemTheme } = useTheme();
    const activeTheme = theme === "system" ? systemTheme : theme;

    return <Toaster theme={activeTheme === "dark" ? "dark" : "light"} />;
}
