import Sidebar from "@/features/sidebar/components/Sidebar";

export default function messengerLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex w-screen h-screen px-[5%] bg-neutral-950">
            <Sidebar />
            {children}
        </div>
    );
}
