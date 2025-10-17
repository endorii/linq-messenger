"use client";

export function ChatHeaderSkeleton() {
    return (
        <div className="absolute top-0 w-full h-[65px] z-10 flex justify-between items-center bg-neutral-950 px-[20px] py-[10px] pr-[50px]">
            <div className="flex gap-[20px] w-full animate-pulse">
                <div className="w-[45px] h-[45px] rounded-full bg-neutral-800" />
                <div className="flex flex-col gap-[6px]">
                    <div className="h-[18px] w-[120px] bg-neutral-800 rounded" />
                    <div className="h-[14px] w-[80px] bg-neutral-900 rounded" />
                </div>
            </div>
            <div className="flex gap-[25px]">
                <div className="w-[24px] h-[24px] bg-neutral-900 rounded" />
                <div className="w-[24px] h-[24px] bg-neutral-900 rounded" />
            </div>
        </div>
    );
}
