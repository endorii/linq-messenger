"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Зберігаємо токен в localStorage
            localStorage.setItem("accessToken", token);
            // Редірект на головну
            router.replace("/");
        } else {
            // Якщо токена немає, редірект на /signin
            router.replace("/signin");
        }
    }, [searchParams, router]);

    return <div>Redirecting...</div>;
}
