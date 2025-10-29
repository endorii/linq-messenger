"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    CheckIcon,
    CloseIcon,
    NotifcationIcon,
    TrashIcon,
} from "@/shared/icons";
import { IChat } from "@/shared/interfaces/IChat";
import { useUpdateChat } from "../../../hooks/useChats";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { ChatEnum } from "@/shared/enums/enums";
import { useModalStore, useChatSidebarStore } from "@/store";
import { ButtonIcon } from "@/shared/components/ui/buttons";

interface FormData {
    name: string;
    description: string;
}

export function EditChat({ chat }: { chat: IChat }) {
    const updateChatMutation = useUpdateChat();
    const { setActiveModal } = useModalStore();
    const { setChatSidebarTab } = useChatSidebarStore();
    const { data: me } = useProfile();
    const isPrivateChat = chat.type === ChatEnum.PRIVATE;

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormData>({
        defaultValues: {
            name: chat.name,
            description: chat.description,
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await updateChatMutation.mutateAsync({
                chatId: chat.id,
                updateChatPayload: {
                    name: data.name,
                    description: data.description,
                },
            });

            reset(data);
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <div className="relative flex flex-col h-full">
            <div className="flex gap-[20px] justify-between p-[10px]">
                <div className="flex gap-[20px] items-center">
                    <ButtonIcon onClick={() => setChatSidebarTab("info")}>
                        <CloseIcon className="w-[24px] fill-none stroke-2 stroke-neutral-800 dark:stroke-white " />
                    </ButtonIcon>
                    <div className="text-xl font-semibold text-nowrap">
                        Edit
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-[20px] items-center p-[20px]">
                <div className="w-[120px] h-[120px] bg-neutral-600 rounded-full overflow-hidden">
                    <img
                        src={
                            isPrivateChat
                                ? chat.members.find((m) => m.userId !== me?.id)
                                      ?.user?.avatarUrl
                                : chat.avatar
                        }
                        alt="avatar2"
                        className="rounded-full"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-[20px] px-[30px] py-[10px]">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-[20px]"
                >
                    <div className="flex flex-col gap-[7px]">
                        <Label>
                            {chat.type.charAt(0).toUpperCase()}
                            {chat.type.slice(1).toLowerCase()} name
                        </Label>
                        <Input
                            className="h-[45px]"
                            placeholder="Group name"
                            {...register("name", {
                                required: "Group name required",
                            })}
                            errorMessage={errors.name?.message}
                        />
                    </div>
                    <div className="flex flex-col gap-[7px]">
                        <Label>Description</Label>
                        <Input
                            className="h-[45px]"
                            placeholder="Description"
                            {...register("description")}
                            errorMessage={errors.description?.message}
                        />
                    </div>

                    {isDirty && (
                        <button
                            type="submit"
                            className="absolute top-4 right-4 bg-theme-gradient rounded-xl p-[8px] cursor-pointer"
                        >
                            <CheckIcon className="w-[30px] stroke-2 stroke-white fill-none" />
                        </button>
                    )}
                </form>

                <hr className="border-neutral-300 dark:border-neutral-800" />

                <div className="flex flex-col gap-[10px]">
                    <div className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center justify-between">
                        <div className="flex gap-[30px] items-center">
                            <NotifcationIcon className="w-[30px] stroke-2 stroke-neutral-900 dark:stroke-white/70 fill-none" />
                            <div className="flex flex-col">
                                <div>Members</div>
                                <div className="text-sm text-neutral-500">
                                    3
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center justify-between">
                        <div className="flex gap-[30px] items-center">
                            <NotifcationIcon className="w-[30px] stroke-2 stroke-neutral-900 dark:stroke-white/70 fill-none" />
                            <div className="flex flex-col">
                                <div>Administrators</div>
                                <div className="text-sm text-neutral-500">
                                    1
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center justify-between">
                        <div className="flex gap-[30px] items-center">
                            <NotifcationIcon className="w-[30px] stroke-2 stroke-neutral-900 dark:stroke-white/70 fill-none" />
                            <div className="flex flex-col">
                                <div>Invite links</div>
                                <div className="text-sm text-neutral-500">
                                    1
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-neutral-300 dark:border-neutral-800" />

                <button
                    className="p-[10px] hover:bg-neutral-900/5 dark:hover:bg-white/5 rounded-xl cursor-pointer flex gap-[30px] items-center"
                    onClick={() => setActiveModal("deleteChat")}
                >
                    <TrashIcon className="w-[30px] fill-none stroke-2 stroke-red-600" />
                    <div className="text-red-600 bg-transparent font-medium">
                        Delete {chat.type.toLowerCase()}
                    </div>
                </button>
            </div>
        </div>
    );
}
