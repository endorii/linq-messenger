import { OwnerIcon } from "@/shared/icons/OwnerIcon";
import { IChatMember } from "@/shared/interfaces";

export function ChatMembers({
    members,
    handleOpenOrCreatePrivateChat,
}: {
    members: IChatMember[];
    handleOpenOrCreatePrivateChat: (userId: string) => void;
}) {
    return (
        <div className="flex flex-col gap-[2px] w-full">
            {members.map((member, i) => (
                <div
                    key={member.userId || i}
                    className="flex gap-[10px] p-[10px] items-center hover:bg-neutral-900/5 dark:hover:bg-white/5 cursor-pointer rounded-xl"
                    onClick={() => handleOpenOrCreatePrivateChat(member.userId)}
                >
                    <div className="w-[50px] h-[50px] bg-neutral-600 rounded-full overflow-hidden">
                        <img
                            src={member.user?.avatarUrl}
                            alt="a"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex gap-[7px] font-semibold items-center">
                            <div>{member.user?.username}</div>
                            {member.role === "OWNER" && (
                                <OwnerIcon className="w-[20px] stroke-2 stroke-blue-500 dark:stroke-violet-500 fill-none" />
                            )}
                        </div>
                        <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                            last seen recently
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
