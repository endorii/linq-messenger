"use client";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import React, { useState } from "react";

const notificationGroups = [
    {
        title: "Private Chats",
        items: [
            {
                label: "Notifications for private chats",
                description: "Enabled",
            },
        ],
    },
    {
        title: "Groups",
        items: [{ label: "Notifications for groups", description: "Enabled" }],
    },
    {
        title: "Channels",
        items: [
            { label: "Notifications for channels", description: "Enabled" },
        ],
    },
];

function SidebarProfileNotifications() {
    const [checkedState, setCheckedState] = useState(
        notificationGroups.map((group) => group.items.map(() => true))
    );

    const toggleCheckbox = (groupIndex: number, itemIndex: number) => {
        const updated = [...checkedState];
        updated[groupIndex][itemIndex] = !updated[groupIndex][itemIndex];
        setCheckedState(updated);
    };

    return (
        <div className="flex flex-col gap-5 px-2 py-2">
            {notificationGroups.map((group, groupIndex) => (
                <div key={group.title}>
                    <div className="px-4 font-semibold text-neutral-400 mb-2">
                        {group.title}
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                        {group.items.map((item, itemIndex) => (
                            <button
                                key={item.label}
                                type="button"
                                onClick={() =>
                                    toggleCheckbox(groupIndex, itemIndex)
                                }
                                className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer rounded-xl w-full"
                            >
                                <Checkbox
                                    checked={
                                        checkedState[groupIndex][itemIndex]
                                    }
                                />
                                <div className="flex flex-col">
                                    <Label className="font-semibold text-base cursor-pointer">
                                        {item.label}
                                    </Label>
                                    <div className="text-xs text-neutral-400 text-left">
                                        {item.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SidebarProfileNotifications;
