import { IMessage } from "@/shared/interfaces";

export function ChatMessageSystem({ msg }: { msg: IMessage }) {
    return (
        <div className="self-center text-sm text-gray-300 my-3 bg-neutral-900 px-3 py-1 rounded-md">
            {msg.content}
        </div>
    );
}
