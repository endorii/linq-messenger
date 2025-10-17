import { MessageIcon } from "@/shared/icons";
import { useCreateMessage } from "../hooks/useMessages";

export function ChatEmptyWindow({ chatId }: { chatId: string }) {
    const useCreateMessageMutation = useCreateMessage();
    const handleSend = (msg: string) => {
        useCreateMessageMutation.mutateAsync({
            chatId,
            messagePayload: { content: msg },
        });
    };
    const messagesForEmptyChat = ["Hi👋", "Welcome", ":)"];
    return (
        <div className="flex w-full flex-col items-center justify-center h-full ">
            <div className="flex flex-col p-[20px] border border-white/5 rounded-xl backdrop-blur-[5px] max-w-[300px]">
                <div className="font-bold text-center">
                    No messages here yet...
                </div>
                <div className="text-center">
                    Sent a message or choose one below
                </div>
                <div className="flex flex-col gap-[10px] mt-[20px]">
                    {messagesForEmptyChat.map((msg, i) => (
                        <div
                            className="group flex gap-[10px] items-center border-2 border-white/5 hover:border-violet-500 p-[10px] rounded-xl transition-all duration-200 cursor-pointer hover:bg-neutral-950"
                            key={i}
                            onClick={() => handleSend(msg)}
                        >
                            <MessageIcon className="w-[25px] fill-none stroke-2 stroke-white/60 group-hover:stroke-white" />
                            <div>{`"${msg}"`}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
