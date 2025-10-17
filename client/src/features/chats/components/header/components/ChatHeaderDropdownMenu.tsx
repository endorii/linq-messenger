import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { OptionsIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces";
import { useChatSidebarStore, useModalStore } from "@/store";

interface ChatHeaderDropdownMenuProps {
    isPrivate: boolean;
    meId: string | undefined;
    meMemberIsMuted: boolean;
    chat: IChat;
    contactActionLabel: string;
    contactActionHandler: () => void;
    handleBlockUser: () => void;
    toggleMuteChat: () => void;
    destructiveAction?: { label: string; onClick: () => void };
}

export function ChatHeaderDropdownMenu({
    isPrivate,
    meId,
    meMemberIsMuted,
    chat,
    contactActionLabel,
    contactActionHandler,
    handleBlockUser,
    toggleMuteChat,
    destructiveAction,
}: ChatHeaderDropdownMenuProps) {
    const { setChatSidebarOpened, setChatSidebarTab } = useChatSidebarStore();
    const { setActiveModal } = useModalStore();

    const handleMuteChat = () => setActiveModal("muteChat");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="cursor-pointer">
                    <OptionsIcon className="w-[21px] fill-neutral-300" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56">
                {isPrivate && (
                    <DropdownMenuItem onClick={contactActionHandler}>
                        {contactActionLabel}
                    </DropdownMenuItem>
                )}

                {!isPrivate && chat.adminId === meId && (
                    <DropdownMenuItem
                        onClick={() => {
                            setChatSidebarOpened(true);
                            setChatSidebarTab("editChat");
                        }}
                    >
                        Edit
                    </DropdownMenuItem>
                )}

                {isPrivate && (
                    <>
                        <DropdownMenuItem>Video Call</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleBlockUser}>
                            {chat.blockingInfo?.isBlocked
                                ? "Unblock user"
                                : "Block user"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}

                {meMemberIsMuted ? (
                    <DropdownMenuItem onClick={toggleMuteChat}>
                        Unmute
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={handleMuteChat}>
                        Mute
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem>Select messages</DropdownMenuItem>

                {destructiveAction && (
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={destructiveAction.onClick}
                    >
                        {destructiveAction.label}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
