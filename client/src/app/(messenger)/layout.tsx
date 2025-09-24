import AuthLayout from "@/features/auth/components/AuthLayout";

export default function MessengerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthLayout>{children}</AuthLayout>;
}
