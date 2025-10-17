"use client";

import {
    useUpdateContact,
    useDeleteContact,
} from "@/features/contacts/hooks/useContacts";
import { Input } from "@/shared/components/ui/input";
import { usePrivateChat } from "@/shared/hooks";
import { CloseIcon, PlusIcon, TrashIcon } from "@/shared/icons";
import { IChat } from "@/shared/interfaces";
import { useChatSidebarStore } from "@/store";
import { Label } from "@radix-ui/react-dropdown-menu";

import { useForm } from "react-hook-form";
import { NotificationSwitch } from "../ui/NotificationSwitch";

export function EditContact({ chat }: { chat: IChat }) {
    const useUpdateContactMutation = useUpdateContact();
    const useDeleteContactMutation = useDeleteContact();

    const { setChatSidebarTab } = useChatSidebarStore();

    const { isPrivate, otherMember, contact, meMember } = usePrivateChat(chat);

    if (!contact) {
        setChatSidebarTab("info");
        return null;
    }

    const {
        handleSubmit,
        register,
        formState: { errors, isDirty },
    } = useForm<{ customContactName: string }>({
        defaultValues: {
            customContactName: contact.nickname || "",
        },
    });

    const onSubmit = (data: { customContactName: string }) => {
        if (!contact) return;
        const newNickname = data.customContactName.trim();

        useUpdateContactMutation.mutateAsync({
            chatId: chat.id,
            contactId: contact.contactId,
            updateContactPayload: {
                nickname: newNickname,
            },
        });
    };

    const handleDeleteContact = () => {
        try {
            useDeleteContactMutation.mutateAsync(contact.id);
            setChatSidebarTab("info");
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <div className="relative flex flex-col h-full">
            <div className="flex gap-[20px] justify-between p-[18px]">
                <div className="flex gap-[20px] items-center">
                    <button onClick={() => setChatSidebarTab("info")}>
                        <CloseIcon className="rotate-180 w-[26px] fill-none stroke-2 stroke-white cursor-pointer" />
                    </button>
                    <div className="text-xl font-semibold text-nowrap">
                        Edit Contact
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-[20px] items-center p-[20px]">
                <div className="w-[120px] h-[120px] bg-neutral-600 rounded-full overflow-hidden">
                    <img
                        src={
                            isPrivate
                                ? otherMember?.user?.avatarUrl
                                : chat.avatar
                        }
                        alt="avatar2"
                        className="rounded-full"
                    />
                </div>
                <div className="flex flex-col gap-[5px] items-center text-center">
                    <div className="text-xl font-semibold">
                        {contact.user?.username}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-[20px] px-[30px] py-[10px]">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-[7px]">
                        <Label>Contact name (Nickname)</Label>
                        <Input
                            placeholder="Set custom nickname"
                            {...register("customContactName")}
                            errorMessage={errors.customContactName?.message}
                        />
                    </div>
                    {isDirty && (
                        <button
                            type="submit"
                            className="absolute top-4 right-4 bg-purple-gradient rounded-xl p-[8px] cursor-pointer"
                        >
                            <PlusIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                        </button>
                    )}
                </form>

                <hr className="border-neutral-800" />

                {meMember && (
                    <NotificationSwitch chatId={chat.id} meMember={meMember} />
                )}

                <button
                    className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center"
                    onClick={handleDeleteContact}
                >
                    <TrashIcon className="w-[30px] fill-none stroke-2 stroke-red-600" />
                    <div className="text-red-600 bg-transparent font-medium">
                        Delete contact
                    </div>
                </button>
            </div>
        </div>
    );
}
