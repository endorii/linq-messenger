import { ChatLayoutWrapper } from "@/features/chats/components/ChatLayoutWrapper";

export default async function ChatSlugLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ chatSlug: string }>;
}) {
    const { chatSlug } = await params;

    return (
        <ChatLayoutWrapper chatSlug={chatSlug}>{children}</ChatLayoutWrapper>
    );
}
