import { useChatAttachments } from "@/features/chats/hooks/useChats";
import { VideoThumbnail } from "@/shared/components/VideoThumbnail";
import Image from "next/image";

export function ChatMedia({
    chatId,
    type,
}: {
    chatId: string;
    type: "media" | "voice" | "files";
}) {
    const {
        data: attachments,
        isPending,
        error,
    } = useChatAttachments(chatId, type);

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error loading attachments</div>;
    if (!Array.isArray(attachments) || attachments.length === 0)
        return (
            <div className="text-center text-neutral-600 py-4">
                No attachments
            </div>
        );

    return (
        <div className="grid grid-cols-3 gap-[3px]">
            {attachments.map((attachment, i) =>
                attachment.mimetype?.startsWith("video/") ? (
                    <VideoThumbnail key={attachment.id} url={attachment.url} />
                ) : (
                    <Image
                        key={attachment.id}
                        src={attachment.url}
                        alt={`attachment_${type}_${i}`}
                        width={200}
                        height={200}
                        className="w-full h-[140px] object-cover bg-neutral-900/30"
                    />
                )
            )}
        </div>
    );
}
