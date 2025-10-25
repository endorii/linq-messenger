"use client";

export function ChatListSkeleton() {
    return (
        <div className="flex flex-col gap-[3px] overflow-y-auto h-full">
            {Array.from({ length: 9 }).map((_, i) => (
                <div
                    className="flex gap-[10px] text-white p-[10px] rounded-xl cursor-pointer dark:bg-neutral-950 animate-pulse"
                    key={i}
                >
                    <div className="w-[55px] h-[55px] bg-neutral-200 dark:bg-neutral-800 rounded-full flex-shrink-0 overflow-hidden" />

                    <div className="flex flex-col justify-between flex-1 min-w-0 gap-1">
                        <div className="flex justify-between gap-[5px]">
                            <div className="flex gap-[5px] font-semibold truncate items-center">
                                <div className="truncate w-[80px] h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 w-8 h-3 bg-neutral-200 dark:bg-neutral-900 rounded" />
                        </div>

                        <div className="flex gap-[10px] items-center justify-between">
                            <div className="font-base truncate text-neutral-500 dark:text-neutral-400 w-[120px] h-3 bg-neutral-200 dark:bg-neutral-900 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
