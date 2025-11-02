import { MessageIcon } from "@/shared/icons";
import { useCreateMessageWithFiles } from "../hooks/useMessages";

export function ChatEmptyWindow({ chatId }: { chatId: string }) {
    const useCreateMessageMutation = useCreateMessageWithFiles();
    const handleSend = (msg: string) => {
        useCreateMessageMutation.mutateAsync({
            chatId,
            messagePayload: { content: msg },
        });
    };
    const messagesForEmptyChat = ["Hi👋", "Welcome", ":)"];
    return (
        <div className="flex w-full flex-col items-center justify-center h-full ">
            <div className="flex flex-col p-[20px] border border-neutral-900/10 dark:border-white/5 rounded-xl backdrop-blur-[5px] max-w-[300px] bg-neutral-100 dark:bg-neutral-900">
                <div className="font-bold text-center">
                    No messages here yet...
                </div>
                <div className="text-center">
                    Sent a message or choose one below
                </div>
                <div className="flex flex-col gap-[10px] mt-[20px]">
                    {messagesForEmptyChat.map((msg, i) => (
                        <button
                            className="group flex gap-[10px] items-center border-2 border-neutral-900/10 dark:border-white/5 hover:border-blue-500 dark:hover:border-violet-500 p-[10px] rounded-xl transition-all duration-200 cursor-pointer hover:dark:bg-neutral-950"
                            key={i}
                            onClick={() => handleSend(msg)}
                            disabled={useCreateMessageMutation.isPending}
                        >
                            <MessageIcon className="w-[25px] fill-none stroke-2 stroke-neutral-900/70 group-hover:stroke-neutral-900 dark:stroke-white/60 dark:group-hover:stroke-white" />
                            <div>{`"${msg}"`}</div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
