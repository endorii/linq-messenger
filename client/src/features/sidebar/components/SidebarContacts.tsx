"use client";

import { useContacts } from "@/features/contacts/hooks/useContacts";

function SidebarContacts() {
    const { data: contacts, isPending: isContactsPending } = useContacts();

    if (isContactsPending) return <div>Завантаження...</div>;
    if (!contacts || contacts.length === 0) return <div>Контакти відсутні</div>;

    return (
        <div className="flex flex-col px-[10px] py-[5px] overflow-hidden">
            {contacts.map((contact) => (
                <div
                    key={contact.id}
                    className={`flex gap-[10px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer`}
                >
                    <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0">
                        <img
                            src={contact.contact?.avatarUrl}
                            alt="avatar"
                            className="rounded-full"
                        />
                    </div>

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div className="flex justify-between gap-[2px]">
                            <div className="font-semibold truncate">
                                {contact.nickname || contact.contact?.username}
                            </div>
                        </div>

                        <div
                            className={` font-base truncate ${
                                contact.contact?.isOnline
                                    ? "text-green-500"
                                    : "text-neutral-400"
                            }`}
                        >
                            {contact.contact?.isOnline
                                ? "Online"
                                : "last seen recently"}
                        </div>
                        <div></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SidebarContacts;
