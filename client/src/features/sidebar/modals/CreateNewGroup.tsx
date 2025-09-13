"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import CameraIcon from "@/shared/icons/CameraIcon";
import ModalWrapper from "@/shared/ui/wrappers/ModalWrapper";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";

interface CreateNewGroupProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    groupName: string;
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
            setModalMessage(error?.message || "Помилка при створенні групи");
        }
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper onClose={onClose}>
            <form
                className="flex flex-col gap-[15px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex items-center gap-[20px]">
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
                        placeholder="Group name"
                        {...register("groupName", {
                            required: "Enter group name",
                            minLength: {
                                value: 3,
                                message: "Minimum 3 symbols",
                            },
                        })}
                        errorMessage={errors.groupName?.message}
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
