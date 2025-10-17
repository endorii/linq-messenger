import { useToggleMuteChat } from "@/features/chats-members/hooks/useChatMembers";
import { Switch } from "@/shared/components/ui/switch";
import { NotifcationIcon } from "@/shared/icons";
import { IChatMember } from "@/shared/interfaces";
import { useState } from "react";

export function NotificationSwitch({
    chatId,
    meMember,
}: {
    chatId: string;
    meMember: IChatMember;
}) {
    const [enabled, setEnabled] = useState<boolean>(!meMember?.isMuted);

    const toggleMuteChatMutation = useToggleMuteChat();

    const handleToggle = async () => {
        const newValue = !enabled;
        setEnabled(newValue);

        if (!meMember) return;

        await toggleMuteChatMutation.mutateAsync({
            chatId,
            updateChatMemberPayload: {
                isMuted: !newValue,
                muteUntil: null,
            },
        });
    };

    return (
        <div
            className="p-[10px] hover:bg-white/5 rounded-xl flex gap-[30px] items-center justify-between cursor-pointer"
            onClick={handleToggle}
        >
            <div className="flex gap-[30px] items-center">
                <NotifcationIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                <div>Notifications</div>
            </div>
            <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}
