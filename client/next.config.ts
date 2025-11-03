import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "kdatgcshniehabvhtcgj.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "**.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
