"use client";

import { useCreateContact } from "@/features/contacts/hooks/useContacts";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { ModalWrapper } from "@/shared/components/wrappers/ModalWrapper";
import { useEscapeKeyClose } from "@/shared/hooks";
import { useSelectionStore } from "@/store";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";

interface AddContactProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    contactUsername: string;
    contactCustomName?: string;
}

export function AddContact({ isOpen, onClose }: AddContactProps) {
    const { selectedUser, setSelectedUser } = useSelectionStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            contactUsername: "",
            contactCustomName: "",
        },
    });

    useEffect(() => {
        if (isOpen && selectedUser) {
            reset({
                contactUsername: selectedUser.username,
                contactCustomName: "",
            });
        }
    }, [isOpen, selectedUser, reset]);

    const [modalMessage, setModalMessage] = useState("");

    const createContactMutation = useCreateContact();

    const handleClose = () => {
        setSelectedUser(null);
        reset();
        setModalMessage("");
        onClose();
    };

    const { selectedChat } = useSelectionStore();

    const onSubmit = async (data: FormData) => {
        try {
            if (!selectedChat) return;
            await createContactMutation.mutateAsync({
                chatId: selectedChat.id,
                contactPayload: {
                    username: data.contactUsername,
                    nickname: data.contactCustomName,
                },
            });
            setSelectedUser(null);
            reset();
            handleClose();
        } catch (error: any) {
            setModalMessage(
                error.response.data.message || "Error during adding contact"
            );
        }
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper onClose={onClose} modalTitle="Add contact">
            <form
                className="flex flex-col gap-[15px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-[15px]">
                    <Input
                        type="text"
                        placeholder="@username"
                        {...register("contactUsername", {
                            required: "@username required",
                        })}
                        errorMessage={errors.contactUsername?.message}
                        className="h-[45px]"
                    />
                    <Input
                        type="text"
                        placeholder="Contact name (optional)"
                        {...register("contactCustomName", {
                            maxLength: {
                                value: 30,
                                message:
                                    "Conatact name length should be maximum or equels 30 symbols",
                            },
                        })}
                        errorMessage={errors.contactCustomName?.message}
                        className="h-[45px]"
                    />
                </div>
                {modalMessage && (
                    <p className="text-red-500 text-sm">{modalMessage}</p>
                )}
                <div className="flex justify-end gap-[5px]">
                    <Button
                        type="button"
                        onClick={handleClose}
                        className="cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="cursor-pointer bg-purple-gradient border-none transition-all duration-200"
                    >
                        Add
                    </Button>
                </div>
            </form>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
