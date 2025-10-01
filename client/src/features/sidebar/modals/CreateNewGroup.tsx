"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import CameraIcon from "@/shared/icons/CameraIcon";
import ModalWrapper from "@/shared/components/wrappers/ModalWrapper";
import { Textarea } from "@/shared/components/ui/textarea";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";

interface CreateNewGroupProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    groupName: string;
    groupDescription?: string;
}

export default function CreateNewGroup({
    isOpen,
    onClose,
}: CreateNewGroupProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            groupName: "",
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
            // Зробити так у всіх компонентах (обробка помилок)
            setModalMessage(
                error.response.data.message || "Error during creating group"
            );
        }
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper onClose={onClose} modalTitle="Create group">
            <form
                className="flex flex-col gap-[15px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex items-center gap-[15px]">
                    <label
                        htmlFor="picture"
                        className="relative bg-neutral-900 p-[20px] rounded-full cursor-pointer border border-white/5 flex items-center justify-center"
                    >
                        <CameraIcon className="w-[40px] h-[40px] fill-none stroke-[1.5] stroke-neutral-300" />
                        <input
                            id="picture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                            }}
                        />
                    </label>

                    <Input
                        type="text"
                        placeholder="Group name"
                        {...register("groupName", {
                            required: "Enter group name",
                            minLength: {
                                value: 1,
                                message: "Minimum 1 symbols",
                            },
                        })}
                        errorMessage={errors.groupName?.message}
                        className="h-[45px]"
                    />
                </div>

                <Textarea
                    placeholder="Description (optional)"
                    {...register("groupDescription")}
                    errorMessage={errors.groupDescription?.message}
                    className="h-[45px] max-w-[500px] text-base!"
                />

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
                        className=" cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="cursor-pointer bg-purple-gradient border-none transition-all duration-200"
                    >
                        Create
                    </Button>
                </div>
            </form>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
