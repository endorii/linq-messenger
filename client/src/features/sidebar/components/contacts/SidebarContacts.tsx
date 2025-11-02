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
            <div className="text-center text-neutral-600 py-4">No contacts</div>
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
                <button
                    onClick={() => {
                        useGetOrCreatePrivateChatMutation.mutateAsync(
                            contact.contact?.id
                        );
                        setSidebarTab("chats");
                    }}
                    key={contact.id}
                    className="flex items-center gap-[13px] text-black dark:text-white hover:bg-neutral-900/5 dark:hover:bg-white/5 p-[10px] rounded-xl"
                    disabled={useGetOrCreatePrivateChatMutation.isPending}
                >
                    {contact.contact?.avatarUrl && (
                        <img
                            src={contact.contact.avatarUrl}
                            alt="avatar"
                            className="w-[55px] h-[55px]  object-cover bg-neutral-600 rounded-full"
                        />
                    )}

                    <div className="flex flex-col gap-[3px] text-left min-w-0 ">
                        <div className="font-semibold truncate">
                            {contact.nickname || contact.contact?.username}
                        </div>

                        <div
                            className={`text-sm truncate ${
                                contact.contact?.isOnline
                                    ? "text-green-500"
                                    : "text-neutral-500 dark:text-neutral-400"
                            }`}
                        >
                            {contact.contact?.isOnline
                                ? "Online"
                                : "last seen recently"}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}
