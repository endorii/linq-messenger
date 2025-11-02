"use client";

import { useCreateChat } from "@/features/chats/hooks/useChats";
import { useContacts } from "@/features/contacts/hooks/useContacts";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ModalWrapper } from "@/shared/components/wrappers/ModalWrapper";
import { ChatEnum } from "@/shared/enums/enums";
import { useEscapeKeyClose } from "@/shared/hooks";
import { CameraIcon } from "@/shared/icons/CameraIcon";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";

interface CreateProps {
    isOpen: boolean;
    onClose: () => void;
    type: ChatEnum;
}

interface FormData {
    name: string;
    description?: string;
}

export function CreateGroupOrChannel({ isOpen, onClose, type }: CreateProps) {
    const {
        trigger,
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const { data: contacts } = useContacts();

    const [modalMessage, setModalMessage] = useState("");
    const [step, setStep] = useState(1);
    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    const useCreateChatMutation = useCreateChat();

    const nextStep = async () => {
        const valid = await trigger(["name"]);
        if (valid) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => setStep((prev) => prev - 1);

    const handleClose = () => {
        reset();
        setModalMessage("");
        setStep(1);
        onClose();
    };

    const onSubmit = async (data: FormData) => {
        try {
            await useCreateChatMutation.mutateAsync({
                name: data.name,
                type,
                description: data.description || "",
                memberIds: selectedContacts,
            });
            handleClose();
        } catch (error: any) {
            setModalMessage(
                error.response.data.message ||
                    `Error during creating ${String(type).toLowerCase()}`
            );
        }
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const entityLabel = type === ChatEnum.CHANNEL ? "Channel" : "Group";

    const modalContent = (
        <ModalWrapper onClose={handleClose} modalTitle={`New ${entityLabel}`}>
            <form
                className="flex flex-col gap-[15px]"
                onSubmit={handleSubmit(onSubmit)}
            >
                {step === 1 && (
                    <>
                        <div className="flex items-center gap-[15px]">
                            <label
                                htmlFor="picture"
                                className="relative bg-neutral-200 dark:bg-neutral-900 p-[20px] rounded-full cursor-pointer border border-white/5 flex items-center justify-center"
                            >
                                <CameraIcon className="w-[40px] h-[40px] fill-none stroke-[1.5] stroke-neutral-800 dark:stroke-neutral-300" />
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
                                placeholder={`${entityLabel} name`}
                                {...register("name", {
                                    required: `Enter ${entityLabel.toLowerCase()} name`,
                                    minLength: {
                                        value: 1,
                                        message: "Minimum 1 symbol",
                                    },
                                })}
                                errorMessage={errors.name?.message}
                                className="h-[45px]"
                            />
                        </div>

                        <Textarea
                            placeholder="Description (optional)"
                            {...register("description")}
                            errorMessage={errors.description?.message}
                            className="h-[45px] max-w-[500px] text-base!"
                        />

                        <div className="flex justify-end gap-[5px]">
                            <Button
                                type="button"
                                onClick={handleClose}
                                className="text-black dark:text-white hover:bg-neutral-900/5 dark:hover:bg-white/5"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={nextStep}
                                className="cursor-pointer bg-theme-gradient border-none transition-all duration-200"
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="flex flex-col items-center gap-[15px]">
                            {contacts && contacts.length > 0
                                ? contacts.map((contact) => (
                                      <div
                                          key={contact.id}
                                          className={`flex items-center gap-[25px] text-white hover:bg-neutral-900/5 dark:hover:bg-white/5 p-[10px] rounded-xl cursor-pointer min-w-[320px] ${
                                              contact.contact?.id &&
                                              selectedContacts.includes(
                                                  contact.contact.id
                                              )
                                                  ? "bg-theme-gradient"
                                                  : ""
                                          }`}
                                          onClick={() => {
                                              const userId =
                                                  contact.contact?.id;
                                              if (!userId) return;
                                              setSelectedContacts((prev) =>
                                                  prev.includes(userId)
                                                      ? prev.filter(
                                                            (id) =>
                                                                id !== userId
                                                        )
                                                      : [...prev, userId]
                                              );
                                          }}
                                      >
                                          <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0">
                                              <img
                                                  src={
                                                      contact.contact?.avatarUrl
                                                  }
                                                  alt="avatar"
                                                  className="rounded-full"
                                              />
                                          </div>

                                          <div className="flex flex-col justify-between flex-1 min-w-0">
                                              <div className="flex justify-between gap-[2px]">
                                                  <div className="font-semibold truncate">
                                                      {contact.nickname ||
                                                          contact.contact
                                                              ?.username}
                                                  </div>
                                              </div>

                                              <div
                                                  className={` font-base truncate ${
                                                      contact.contact?.isOnline
                                                          ? "text-green-500"
                                                          : "text-neutral-500 dark:text-neutral-400"
                                                  }`}
                                              >
                                                  {contact.contact?.isOnline
                                                      ? "Online"
                                                      : "last seen recently"}
                                              </div>
                                          </div>
                                      </div>
                                  ))
                                : "No contacts found"}
                        </div>

                        {modalMessage && (
                            <p className="text-red-500 text-sm">
                                {modalMessage}
                            </p>
                        )}

                        <div className="flex justify-end gap-[5px]">
                            <Button
                                type="button"
                                onClick={prevStep}
                                className="text-black dark:text-white hover:bg-neutral-900/5 dark:hover:bg-white/5 flex items-center justify-center border-white/5 cursor-pointer"
                            >
                                Go back
                            </Button>
                            <Button
                                type="submit"
                                className="cursor-pointer bg-theme-gradient border-none transition-all duration-200"
                                disabled={useCreateChatMutation.isPending}
                            >
                                Create {entityLabel}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
