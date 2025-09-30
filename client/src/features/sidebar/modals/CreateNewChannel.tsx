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

interface CreateNewChannelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    channelName: string;
    channelDescription?: string;
}

export default function CreateNewChannel({
    isOpen,
    onClose,
}: CreateNewChannelProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            channelName: "",
            channelDescription: "",
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
                error.response.data.message || "Error during creating channel"
            );
        }
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper onClose={onClose} modalTitle="Create channel">
            <form
                className="flex flex-col gap-[15px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex items-center gap-[15px]">
                    <label
                        htmlFor="picture"
                        className="relative bg-neutral-950 p-[20px] rounded-full cursor-pointer border border-white/5 flex items-center justify-center"
                    >
                        <CameraIcon className="w-[40px] h-[40px] fill-none stroke-2 stroke-neutral-200" />
                        <Input
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
                        placeholder="Channel name"
                        {...register("channelName", {
                            required: "Enter channel name",
                            minLength: {
                                value: 3,
                                message: "Minimum 3 symbols",
                            },
                        })}
                        errorMessage={errors.channelName?.message}
                        className="h-[45px] border-white/5"
                    />
                </div>

                <Textarea
                    placeholder="Description (optional)"
                    {...register("channelDescription")}
                    errorMessage={errors.channelDescription?.message}
                    className="h-[45px] max-w-[500px] border-neutral-800"
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
