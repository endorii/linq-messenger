"use client";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import ModalWrapper from "@/shared/components/wrappers/ModalWrapper";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import {
    useCreateFolder,
    useUpdateFolder,
} from "../../folders/hooks/useFolders";
import { useSidebarStore } from "@/store/sidebarStore";

//замінити скрізь
interface CreateNewChannelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormData {
    folderName: string;
}

export default function EditFolder({ isOpen, onClose }: CreateNewChannelProps) {
    const { selectedFolder, setSelectedFolder } = useSidebarStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            folderName: selectedFolder?.name || "",
        },
    });

    useEffect(() => {
        if (selectedFolder) {
            reset({ folderName: selectedFolder.name });
        }
    }, [selectedFolder, reset]);

    const [modalMessage, setModalMessage] = useState("");

    const useUpdateFolderMutation = useUpdateFolder();

    const handleClose = () => {
        reset();
        setModalMessage("");
        onClose();
    };

    const onSubmit = async (data: FormData) => {
        try {
            await useUpdateFolderMutation.mutateAsync({
                folderId: selectedFolder?.id || "",
                folderPayload: { name: data.folderName },
            });
            setSelectedFolder(null);
            handleClose();
        } catch (error: any) {
            setModalMessage(
                error.response.data.message || "Error during creating folder"
            );
        }
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper onClose={onClose} modalTitle="Edit folder">
            <form
                className="flex flex-col gap-[15px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex items-center gap-[20px]">
                    <Input
                        type="text"
                        placeholder="Folder name"
                        {...register("folderName", {
                            required: "Enter folder name",
                            minLength: {
                                value: 2,
                                message: "Minimum 2 symbols",
                            },
                        })}
                        errorMessage={errors.folderName?.message}
                        className="h-[45px]"
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
