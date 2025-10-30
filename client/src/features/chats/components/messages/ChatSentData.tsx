"use client";

import {
    useCreateMessageWithFiles,
    useUpdateMessage,
} from "@/features/messages/hooks/useMessages";
import {
    ClipIcon,
    CloseIcon,
    EditIcon,
    EmojiIcon,
    MicrophoneIcon,
    ReplyIcon,
    SendIcon,
} from "@/shared/icons";
import { useChatInputStore } from "@/store";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState, useEffect, useRef } from "react";
import { ChatTextarea } from "./ChatTextarea";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { ButtonActive, ButtonIcon } from "@/shared/components/ui/buttons";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { usePostFiles } from "@/shared/hooks/useFiles";

interface ChatSentDataProps {
    chatId: string;
}

export function ChatSentData({ chatId }: ChatSentDataProps) {
    const [inputValue, setInputValue] = useState<string>("");
    const [isFocused, setIsFocused] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const mediaInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);

    const createMessageWithFilesMutation = useCreateMessageWithFiles();
    const updateMessageMutation = useUpdateMessage();
    const { theme } = useTheme();

    const {
        chatSentType,
        messageForEdit,
        messageForReply,
        setChatSentType,
        setMessageForEdit,
        setMessageForReply,
    } = useChatInputStore();

    const postFilesMutation = usePostFiles();

    useEffect(() => {
        if (chatSentType === "edit" && messageForEdit) {
            setInputValue(messageForEdit.content);
        }
    }, [chatSentType, messageForEdit]);

    useEffect(() => {
        setChatSentType("sent");
        setMessageForEdit(null);
        setMessageForReply(null);
        setInputValue("");
        setSelectedFiles([]);
    }, [chatId]);

    const handleMediaClick = () => mediaInputRef.current?.click();
    const handleDocumentClick = () => documentInputRef.current?.click();

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);
            toast.info(`Вибрано ${files.length} файл(ів)`);
        }
        e.target.value = "";
    };

    const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setSelectedFiles((prev) => [...prev, ...files]);
            toast.info(`Вибрано ${files.length} файл(ів)`);
        }
        e.target.value = "";
    };

    const removeFile = (index: number) =>
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));

    const handleSend = async (value: string) => {
        if (!value.trim() && selectedFiles.length === 0) return;
        setIsUploading(true);

        try {
            let message;

            if (chatSentType === "edit" && messageForEdit) {
                // редагуємо існуюче повідомлення
                message = await updateMessageMutation.mutateAsync({
                    chatId,
                    messageId: messageForEdit.id,
                    messagePayload: { content: value },
                });
            } else {
                await createMessageWithFilesMutation.mutateAsync({
                    chatId,
                    messagePayload: {
                        content: value,
                        replyToId:
                            chatSentType === "reply"
                                ? messageForReply?.id
                                : undefined,
                        files: selectedFiles,
                    },
                });
            }

            // Очищаємо стан після повного завершення
            setInputValue("");
            setSelectedFiles([]);
            setChatSentType("sent");
            setMessageForEdit(null);
            setMessageForReply(null);
            toast.success("Повідомлення відправлено");
        } catch (error) {
            console.error(error);
            toast.error("Помилка при відправці повідомлення");
        } finally {
            setIsUploading(false);
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) =>
        setInputValue((prev) => prev + emojiData.emoji);
    const getFilePreview = (file: File) =>
        file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

    return (
        <div className="w-full px-[15%] flex flex-col gap-[10px] py-[15px] bg-transparent">
            {/* Прев'ю вибраних файлів */}
            {selectedFiles.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                    {selectedFiles.map((file, index) => {
                        const preview = getFilePreview(file);
                        return (
                            <div key={index} className="relative flex-shrink-0">
                                <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-800 rounded-lg flex items-center justify-center overflow-hidden">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-xs text-center px-2 truncate w-full">
                                            {file.name}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Основний інпут */}
            <div className="w-full flex items-end gap-[10px] justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="bg-theme-gradient rounded-xl p-[11px] cursor-pointer">
                            <ClipIcon className="w-[24px] h-[24px] fill-white" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={handleMediaClick}>
                            Photo or Video
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDocumentClick}>
                            Document
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <input
                    ref={mediaInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={handleMediaChange}
                />
                <input
                    ref={documentInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.zip,.rar,.xlsx,.xls,.ppt,.pptx"
                    multiple
                    className="hidden"
                    onChange={handleDocumentChange}
                />

                <div className="w-full relative rounded-xl group bg-neutral-200 dark:bg-neutral-800 focus-within:bg-gradient-to-br focus-within:from-blue-600 focus-within:to-sky-600 dark:focus-within:from-violet-600 dark:focus-within:to-indigo-600 p-[2px] transition-all duration-300 flex items-center">
                    <div className="flex flex-col w-full gap-[3px]">
                        {chatSentType === "reply" && messageForReply && (
                            <div className="flex gap-[5px] px-[10px] py-[3px]">
                                <ReplyIcon
                                    className={`w-[30px] stroke-2 fill-none mx-[10px] ${
                                        isFocused
                                            ? "stroke-white"
                                            : "stroke-neutral-900 dark:stroke-white"
                                    }`}
                                />
                                <div
                                    className={`px-[15px] py-[4px] bg-blue-100/20 dark:bg-purple-100/20 w-full rounded-xl border-l-4 transition-colors duration-300 ${
                                        isFocused
                                            ? "text-white"
                                            : "text-neutral-900 dark:text-white"
                                    }`}
                                >
                                    <div className="font-bold text-sm">
                                        {messageForReply.sender.username}
                                    </div>
                                    <div className="text-sm">{`${messageForReply.content.slice(
                                        0,
                                        100
                                    )}${
                                        messageForReply.content.length > 100
                                            ? "..."
                                            : ""
                                    }`}</div>
                                </div>
                                <ButtonIcon
                                    onClick={() => {
                                        setInputValue("");
                                        setMessageForReply(null);
                                        setChatSentType("sent");
                                    }}
                                >
                                    <CloseIcon
                                        className={`w-[20px] stroke-3 fill-none mx-[4px] ${
                                            isFocused
                                                ? "stroke-white"
                                                : "stroke-neutral-900 dark:stroke-white"
                                        }`}
                                    />
                                </ButtonIcon>
                            </div>
                        )}
                        {chatSentType === "edit" && messageForEdit && (
                            <div className="flex gap-[5px] px-[10px] py-[3px]">
                                <EditIcon
                                    className={`w-[30px] stroke-2 fill-none mx-[10px] ${
                                        isFocused
                                            ? "stroke-white"
                                            : "stroke-neutral-900 dark:stroke-white"
                                    }`}
                                />
                                <div
                                    className={`px-[15px] py-[4px] dark:bg-neutral-950/40 w-full rounded-xl border-l-4 ${
                                        isFocused
                                            ? "text-white"
                                            : "text-neutral-900 dark:text-white"
                                    }`}
                                >
                                    <div className="font-bold text-sm">
                                        Edit message
                                    </div>
                                    <div className="text-sm ">{`${messageForEdit.content.slice(
                                        0,
                                        100
                                    )}${
                                        messageForEdit.content.length > 100
                                            ? "..."
                                            : ""
                                    }`}</div>
                                </div>
                                <ButtonIcon
                                    onClick={() => {
                                        setInputValue("");
                                        setMessageForEdit(null);
                                        setChatSentType("sent");
                                    }}
                                >
                                    <CloseIcon
                                        className={`w-[20px] stroke-3 fill-none mx-[4px] ${
                                            isFocused
                                                ? "stroke-white"
                                                : "stroke-neutral-900 dark:stroke-white"
                                        }`}
                                    />
                                </ButtonIcon>
                            </div>
                        )}
                        <ChatTextarea
                            value={inputValue}
                            onChange={setInputValue}
                            onEnter={() => handleSend(inputValue)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="absolute bottom-[14px] right-[15px] transition-all duration-300 cursor-pointer">
                                <EmojiIcon className="w-[20px] h-[20px] fill-neutral-400 dark:fill-white group-focus-within:fill-neutral-800 dark:group-focus-within:fill-white" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-0 border-none shadow-lg">
                            <EmojiPicker
                                onEmojiClick={handleEmojiClick}
                                autoFocusSearch={false}
                                theme={
                                    theme === "dark"
                                        ? Theme.DARK
                                        : theme === "light"
                                        ? Theme.LIGHT
                                        : Theme.AUTO
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {inputValue.length > 0 || selectedFiles.length > 0 ? (
                    <ButtonActive
                        onClick={() => handleSend(inputValue)}
                        className="relative! flex items-center justify-center h-full w-full"
                    >
                        {isUploading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <SendIcon className="w-[28px] fill-none stroke-2 stroke-white" />
                        )}
                    </ButtonActive>
                ) : (
                    <ButtonActive
                        onClick={() => console.log("voice")}
                        className="relative! flex items-center justify-center h-full w-full"
                    >
                        <MicrophoneIcon className="w-[28px] fill-none stroke-2 stroke-white" />
                    </ButtonActive>
                )}
            </div>
        </div>
    );
}
