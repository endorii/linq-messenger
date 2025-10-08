import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        domains: ["onetreeplanted.org"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "encrypted-tbn0.gstatic.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
