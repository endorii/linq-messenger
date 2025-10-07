"use client";

import { useForm } from "react-hook-form";
import { useChatEntity } from "@/shared/hooks/useChatEntity";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { IContact } from "@/shared/interfaces/IContact";
import {
    CloseIcon,
    NotifcationIcon,
    PlusIcon,
    TrashIcon,
} from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import { ChatSidebarTabType } from "@/shared/types/types";
import {
    useDeleteContact,
    useUpdateContact,
} from "@/features/contacts/hooks/useContacts";
import { useSidebarStore } from "@/store/sidebarStore";

function ChatSidebarEditContact({ chat }: { chat: IChat }) {
    const { entity, chatName, isContact, contactId, otherUserId } =
        useChatEntity(chat);

    const useUpdateContactMutation = useUpdateContact();
    const useDeleteContactMutation = useDeleteContact();

    const { setChatSidebarTab } = useSidebarStore();

    const currentContact = isContact ? (entity as IContact) : null;

    if (!currentContact || !contactId || !otherUserId) {
        return (
            <div className="text-red-500 p-4">
                Error: Contact data not available for editing.
            </div>
        );
    }

    const initialNickname = currentContact.nickname || "";

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<{ customContactName: string }>({
        defaultValues: {
            customContactName: initialNickname,
        },
    });

    const onSubmit = (data: { customContactName: string }) => {
        try {
            const newNickname = data.customContactName.trim();

            console.log(entity);

            useUpdateContactMutation.mutateAsync({
                contactId,
                updateContactPayload: {
                    nickname: newNickname,
                },
            });
        } catch (error: any) {
            console.log(error);
        }
    };

    const handleDeleteContact = () => {
        try {
            useDeleteContactMutation.mutateAsync(contactId);
            setChatSidebarTab("info");
        } catch (error: any) {
            console.log(error);
        }
    };

    const displayContactName = chatName;

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
                        src={chat.avatar || "/default-avatar.png"}
                        alt="avatar"
                        className="rounded-full w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-[5px] items-center text-center">
                    <div className="text-xl font-semibold">
                        {displayContactName}
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
                    <button
                        type="submit"
                        className="absolute top-4 right-4 bg-purple-gradient rounded-xl p-[8px] cursor-pointer"
                    >
                        <PlusIcon className="w-[30px] stroke-white stroke-2 fill-none" />
                    </button>
                </form>

                <hr className="border-neutral-800" />

                <div className="p-[10px] hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center justify-between">
                    <div className="flex gap-[30px] items-center">
                        <NotifcationIcon className="w-[30px] stroke-2 stroke-neutral-400 fill-none" />
                        <div>Notifications</div>
                    </div>
                    <Switch className="cursor-pointer" />
                </div>

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

export default ChatSidebarEditContact;
