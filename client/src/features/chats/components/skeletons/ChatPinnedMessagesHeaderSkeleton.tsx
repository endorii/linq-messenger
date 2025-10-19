"use client";

export function ChatPinnedMessagesHeaderSkeleton() {
    return (
        <div className="absolute top-0 w-full h-[65px] z-10 flex justify-between items-center bg-neutral-950 px-[20px] py-[10px] pr-[50px]">
            <div className="flex gap-[20px] w-full animate-pulse items-center">
                <div className="w-[24px] h-[24px] rounded-xl bg-neutral-800" />
                <div className="h-[28px] w-[175px] bg-neutral-800 rounded" />
            </div>
        </div>
    );
}
