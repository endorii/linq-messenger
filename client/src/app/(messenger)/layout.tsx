import Sidebar from "@/features/sidebar/components/Sidebar";

export default function messengerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            {children}
        </div>
    );
}
