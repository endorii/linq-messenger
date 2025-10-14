"use client";

import { Button } from "@/shared/components/ui/button";
import useEscapeKeyClose from "@/shared/hooks/useEscapeKeyClose";
import ModalWrapper from "@/shared/components/wrappers/ModalWrapper";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useContacts } from "@/features/contacts/hooks/useContacts";

interface CreateProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMembersToChat({ isOpen, onClose }: CreateProps) {
    const { data: contacts } = useContacts();

    const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

    // const useCreateChatMutation = useCreateChat();

    const handleClose = () => {
        onClose();
    };

    const onSubmit = async () => {
        // await useCreateChatMutation.mutateAsync({
        //     name: data.name,
        //     type,
        //     description: data.description || "",
        //     memberIds: selectedContacts,
        // });
        handleClose();
    };

    useEscapeKeyClose({ isOpen, onClose });

    if (!isOpen) return null;

    const modalContent = (
        <ModalWrapper onClose={handleClose} modalTitle={`Add members`}>
            <div
                className="flex flex-col gap-[15px]"
                // onSubmit={handleSubmit(onSubmit)}
            >
                <div className="flex flex-col items-center gap-[15px]">
                    {contacts && contacts.length > 0
                        ? contacts.map((contact) => (
                              <div
                                  key={contact.id}
                                  className={`flex items-center gap-[25px] text-white hover:bg-white/5 p-[10px] rounded-xl cursor-pointer min-w-[320px] ${
                                      contact.contact?.id &&
                                      selectedContacts.includes(
                                          contact.contact.id
                                      )
                                          ? "bg-purple-gradient"
                                          : ""
                                  }`}
                                  onClick={() => {
                                      const userId = contact.contact?.id;
                                      if (!userId) return;
                                      setSelectedContacts((prev) =>
                                          prev.includes(userId)
                                              ? prev.filter(
                                                    (id) => id !== userId
                                                )
                                              : [...prev, userId]
                                      );
                                  }}
                              >
                                  <div className="w-[55px] h-[55px] bg-neutral-600 rounded-full flex-shrink-0">
                                      <img
                                          src={contact.contact?.avatarUrl}
                                          alt="avatar"
                                          className="rounded-full"
                                      />
                                  </div>

                                  <div className="flex flex-col justify-between flex-1 min-w-0">
                                      <div className="flex justify-between gap-[2px]">
                                          <div className="font-semibold truncate">
                                              {contact.nickname ||
                                                  contact.contact?.username}
                                          </div>
                                      </div>

                                      <div
                                          className={` font-base truncate ${
                                              contact.contact?.isOnline
                                                  ? "text-green-500"
                                                  : "text-neutral-400"
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

                <div className="flex justify-end gap-[5px]">
                    <Button
                        type="button"
                        onClick={() => handleClose()}
                        className="flex items-center justify-center bg-neutral-800 border border-white/5 cursor-pointer"
                    >
                        <div>Cancel</div>
                    </Button>
                    <Button
                        onClick={() => {}}
                        className="cursor-pointer bg-purple-gradient border-none transition-all duration-200"
                    >
                        Add Members
                    </Button>
                </div>
            </div>
        </ModalWrapper>
    );

    return createPortal(modalContent, document.body);
}
