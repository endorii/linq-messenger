"use client";

export function ChatPinnedMessagesSkeleton() {
    const messages = [
        { id: 1, isMine: true, widths: [200, 150] },
        { id: 2, isMine: false, widths: [180] },
        { id: 3, isMine: true, widths: [220, 180, 160] },
        { id: 4, isMine: false, widths: [200, 170] },
        { id: 5, isMine: true, widths: [180] },
        { id: 6, isMine: false, widths: [220, 200, 150] },
        { id: 7, isMine: true, widths: [200, 150] },
        { id: 8, isMine: false, widths: [180] },
        { id: 9, isMine: true, widths: [220, 180] },
        { id: 10, isMine: false, widths: [200, 170] },
        { id: 11, isMine: true, widths: [180] },
        { id: 12, isMine: false, widths: [220, 180, 150] },
        { id: 13, isMine: true, widths: [200, 170] },
    ];

    return (
        <div className="flex flex-col h-full w-full pt-[65px]">
            <div className="flex-1 flex flex-col-reverse gap-[10px] overflow-y-auto px-[15%] py-[20px]">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.isMine ? "justify-end" : "justify-start"
                        } mt-3 animate-pulse`}
                    >
                        <div
                            className={`flex flex-col relative ${
                                msg.isMine ? "items-end" : "items-start"
                            } gap-2`}
                        >
                            {!msg.isMine && (
                                <div className="absolute bottom-0 left-[-40px] w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                            )}

                            <div
                                className={`flex flex-col bg-neutral-200 dark:bg-neutral-900 rounded-xl p-3 ${
                                    msg.isMine
                                        ? "ml-auto rounded-br-none"
                                        : "rounded-bl-none"
                                }`}
                            >
                                {msg.widths.map((w, idx) => (
                                    <div
                                        key={idx}
                                        className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded mb-1"
                                        style={{ width: `${w}px` }}
                                    />
                                ))}

                                <div className="h-3 w-10 bg-neutral-200 dark:bg-neutral-800 rounded self-end mt-1"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="w-full px-[15%] py-[15px] flex justify-center gap-[10px] bg-transparent">
                <div className="w-[195px] h-[54px] bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse flex-shrink-0" />
            </div>
        </div>
    );
}
