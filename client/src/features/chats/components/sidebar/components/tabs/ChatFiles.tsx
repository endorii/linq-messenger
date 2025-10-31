import { useChatAttachments } from "@/features/chats/hooks/useChats";
import dayjs from "dayjs";
import { FileIcon } from "lucide-react";
import Link from "next/link";

export function ChatFiles({
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
                    className="flex gap-[10px] items-center p-[5px] hover:bg-neutral-900/5 hover:dark:bg-white/5 rounded-xl"
                >
                    <Link href={attachment.url}>
                        <FileIcon className="w-[35px] h-[35px] " />
                    </Link>
                    <div className="w-full">
                        <div className="font-medium">{attachment.fileName}</div>
                        <div className="flex gap-[5px] justify-between text-sm text-neutral-500">
                            <div>{attachment.fileSize} B.</div>
                            <div>
                                {dayjs(attachment.createdAt).format(
                                    "YYYY.MM.DDTHH:mm"
                                )}{" "}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
