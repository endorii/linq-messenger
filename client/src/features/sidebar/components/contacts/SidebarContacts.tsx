"use client";

import { useCreatePrivateChat } from "@/features/chats/hooks/useChats";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import { useNavigationStore } from "@/store";

export function SidebarContacts({ searchValue }: { searchValue: string }) {
    const { data: contacts, isPending: isContactsPending } = useContacts();

    const { setSidebarTab } = useNavigationStore();
    const useGetOrCreatePrivateChatMutation = useCreatePrivateChat();

    if (isContactsPending) return <div>Завантаження...</div>;
    if (!contacts || contacts.length === 0)
        return (
            <div className="flex justify-center p-[10px] bg-neutral-900 mt-[10px] font-medium">
                No contacts
            </div>
        );

    const filteredContacts = contacts.filter((contact) => {
        const search = searchValue.toLowerCase().trim();

        const nickname = contact.nickname?.toLowerCase() || "";
        const username = contact.contact?.username?.toLowerCase() || "";
        const phone = contact.contact?.phone?.toLowerCase() || "";

        return (
            nickname.includes(search) ||
            username.includes(search) ||
            phone.includes(search)
        );
    });

    if (filteredContacts.length === 0) return;

    return (
        <div className="flex flex-col px-[10px] py-[5px] overflow-y-auto">
            {filteredContacts.map((contact) => (
                <div
                    onClick={() => {
                        useGetOrCreatePrivateChatMutation.mutateAsync(
                            contact.contact?.id
                        );
                        setSidebarTab("chats");
                    }}
                    key={contact.id}
                    className="flex gap-[13px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer"
                >
                    <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0 overflow-hidden">
                        {contact.contact?.avatarUrl && (
                            <img
                                src={contact.contact.avatarUrl}
                                alt="avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        )}
                    </div>

                    <div className="flex flex-col justify-center gap-[3px] flex-1 min-w-0">
                        <div className="flex justify-between gap-[2px]">
                            <div className="font-semibold truncate">
                                {contact.nickname || contact.contact?.username}
                            </div>
                        </div>

                        <div
                            className={`text-sm truncate ${
                                contact.contact?.isOnline
                                    ? "text-green-500"
                                    : "text-neutral-400"
                            }`}
                        >
                            {contact.contact?.isOnline
                                ? "Online"
                                : "last seen recently"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
