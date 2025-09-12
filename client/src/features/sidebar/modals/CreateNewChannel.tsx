"use client";

import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import ModalWrapper from "@/shared/ui/wrappers/ModalWrapper";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";

interface CreateNewChannelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TodoFormData {
    groupName: string;
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
    } = useForm<TodoFormData>({
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

    const onSubmit = async (data: TodoFormData) => {
        try {
            // await addTodoItemMutation.mutateAsync({
            //     title: data.title,
            // });
            handleClose();
        } catch (error: any) {
            setModalMessage(error?.message || "Помилка при створенні завдання");
        }
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper onClose={onClose} modalTitle={"Додавання завдання"}>
            <form
                className="flex flex-col gap-[15px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div>1234</div>
                {modalMessage && (
                    <p className="text-red-500 text-sm">{modalMessage}</p>
                )}
            </form>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
