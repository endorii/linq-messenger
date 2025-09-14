"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import CameraIcon from "@/shared/icons/CameraIcon";
import ModalWrapper from "@/shared/components/wrappers/ModalWrapper";
import { Textarea } from "@/shared/components/ui/textarea";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";

interface AddContactProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    constactName: string;
    contactSurname?: string;
    contactPhone: string;
}

export default function AddContact({ isOpen, onClose }: AddContactProps) {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            constactName: "",
            contactSurname: "",
            contactPhone: "",
        },
    });

    const [modalMessage, setModalMessage] = useState("");

    // const addTodoItemMutation = useCreateTodoItem();

    const handleClose = () => {
        reset();
        setModalMessage("");
        onClose();
    };

    const onSubmit = async (data: FormData) => {
        try {
            // await addTodoItemMutation.mutateAsync({
            //     title: data.groupName,
            //     description: data.description || "",
            // });
            handleClose();
        } catch (error: any) {
            setModalMessage(error?.message || "Помилка додавання контакту");
        }
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper onClose={onClose}>
            <form
                className="flex flex-col gap-[30px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-[20px]">
                    <Input
                        type="text"
                        placeholder="Name"
                        {...register("constactName", {
                            required: "Name required",
                            minLength: {
                                value: 1,
                                message: "Minimum 1 symbol",
                            },
                        })}
                        errorMessage={errors.constactName?.message}
                        className="h-[45px] border-white/5"
                    />
                    <Input
                        type="text"
                        placeholder="Surname"
                        {...register("contactSurname")}
                        errorMessage={errors.contactSurname?.message}
                        className="h-[45px] border-white/5"
                    />
                    <Input
                        type="text"
                        placeholder="Phone number"
                        {...register("contactPhone", {
                            required: "Phone number required",
                            pattern: {
                                value: /^\+?[0-9]{10,15}$/,
                                message: "Enter a valid phone number",
                            },
                        })}
                        errorMessage={errors.contactPhone?.message}
                        className="h-[45px] border-white/5"
                    />
                </div>

                <div className="flex justify-end gap-[5px]">
                    <Button
                        type="button"
                        onClick={() => {
                            onClose();
                            reset();
                        }}
                        className=" cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-neutral-950 border border-white/5 cursor-pointer"
                    >
                        Create
                    </Button>
                </div>

                {modalMessage && (
                    <p className="text-red-500 text-sm">{modalMessage}</p>
                )}
            </form>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
