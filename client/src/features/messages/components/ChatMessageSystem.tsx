import { IMessage } from "@/shared/interfaces";

export function ChatMessageSystem({ msg }: { msg: IMessage }) {
    return (
        <div className="self-center text-sm dark:text-gray-300 my-3 bg-neutral-200 dark:bg-neutral-900 px-3 py-1 rounded-md text-black">
            {msg.content}
        </div>
    );
}
