"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import ModalWrapper from "@/shared/components/wrappers/ModalWrapper";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useCreateContact } from "@/features/contacts/hooks/useContacts";

interface AddContactProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    contactUsername: string;
    contactCustomName?: string;
}

export default function AddContact({ isOpen, onClose }: AddContactProps) {
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

    const [modalMessage, setModalMessage] = useState("");

    const createContactMutation = useCreateContact();

    const handleClose = () => {
        reset();
        setModalMessage("");
        onClose();
    };

    const onSubmit = async (data: FormData) => {
        try {
            await createContactMutation.mutateAsync({
                username: data.contactUsername,
                nickname: data.contactCustomName,
            });
            reset();
            handleClose();
        } catch (error: any) {
            // Зробити так у всіх компонентах (обробка помилок)
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
                        className="h-[45px] border-white/5"
                    />
                    <Input
                        type="text"
                        placeholder="Custom name (optional)"
                        {...register("contactCustomName")}
                        errorMessage={errors.contactCustomName?.message}
                        className="h-[45px] border-white/5"
                    />
                </div>
                {modalMessage && (
                    <p className="text-red-500 text-sm">{modalMessage}</p>
                )}
                <div className="flex justify-end gap-[5px]">
                    <Button
                        type="button"
                        onClick={() => {
                            onClose();
                            reset();
                        }}
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
