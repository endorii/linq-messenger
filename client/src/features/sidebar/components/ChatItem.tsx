function ChatItem({ chat }: { chat?: any }) {
    return (
        <div className="flex gap-[10px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer">
            <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0"></div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
                <div className="flex justify-between gap-[2px]">
                    <div className="font-semibold truncate">
                        {chat.name ?? "Chat name"}
                    </div>
                    <div className="text-xs text-neutral-400">14:50</div>
                </div>

                <div className="text-neutral-400 font-light truncate">
                    A little test text to check and adjust the content, there
                    should be a lot of text here, as if it were a real post. I
                    think that much will be enough.
                </div>
                <div></div>
            </div>
        </div>
    );
}

export default ChatItem;
