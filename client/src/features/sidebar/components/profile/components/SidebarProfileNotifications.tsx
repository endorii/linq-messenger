"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import React, { useState } from "react";

const notificationItems = [
    {
        id: "private",
        title: "Private Chats",
        label: "Notifications for private chats",
        description: "Enabled",
    },
    {
        id: "groups",
        title: "Groups",
        label: "Notifications for groups",
        description: "Enabled",
    },
    {
        id: "channels",
        title: "Channels",
        label: "Notifications for channels",
        description: "Enabled",
    },
];

export function SidebarProfileNotifications() {
    const [checked, setChecked] = useState<Record<string, boolean>>({
        private: true,
        groups: true,
        channels: true,
    });

    const toggle = (id: string) => {
        setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="flex flex-col gap-5 px-2 py-2">
            {notificationItems.map((item) => (
                <div key={item.id}>
                    <div className="px-4 font-semibold text-neutral-400 mb-2">
                        {item.title}
                    </div>
                    <div
                        onClick={() => toggle(item.id)}
                        className="flex items-center gap-[15px] p-[15px] hover:bg-white/5 cursor-pointer rounded-xl w-full"
                    >
                        <Checkbox checked={checked[item.id]} />
                        <div className="flex flex-col">
                            <Label className="font-semibold text-base cursor-pointer">
                                {item.label}
                            </Label>
                            <div className="text-xs text-neutral-400 text-left">
                                {item.description}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
