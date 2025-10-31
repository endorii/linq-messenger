import { useChatAttachments } from "@/features/chats/hooks/useChats";
import dayjs from "dayjs";

export function ChatVoices({
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
        <div className="flex flex-col gap-[3px] ">
            {attachments.map((attachment, i) => (
                <div
                    key={i}
                    className="flex flex-col gap-[3px] p-[5px] hover:bg-neutral-900/5 hover:dark:bg-white/5 rounded-xl"
                >
                    <div className="flex gap-[5px] items-end justify-between px-[10px] ">
                        <div className="font-medium">{attachment.fileName}</div>
                        <div className="text-sm text-neutral-500">
                            {dayjs(attachment.createdAt).format(
                                "YYYY.MM.DD HH:mm"
                            )}
                        </div>
                    </div>
                    <audio
                        className="w-full"
                        src={attachment.url}
                        controls
                    ></audio>
                </div>
            ))}
        </div>
    );
}
