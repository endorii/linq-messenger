import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { Attachment, ChatType } from "generated/prisma";
import { ChatMembersService } from "src/chat-members/chat-members.service";
import { CreateForwardMessageDto } from "./dto/create-forward-message.dto";
import { CreateForwardMessagesDto } from "./dto/create-forward-messages.dto";
import * as dayjs from "dayjs";
import { FilesService } from "src/files/files.service";

@Injectable()
export class MessagesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatsMembersService: ChatMembersService,
        private readonly filesService: FilesService
    ) {}

    async getChatMessages(userId: string, chatId: string) {
        await this.chatsMembersService.ensureMembership(chatId, userId);

        const messages = await this.prisma.message.findMany({
            where: {
                chatId,
                isRevoked: false,
                deletedMessages: {
                    none: {
                        userId,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, username: true, avatarUrl: true } },
                replyTo: {
                    include: {
                        sender: true,
                        forwardedMessage: {
                            include: { sender: true },
                        },
                        attachments: true,
                    },
                },
                pinnedMessages: true,
                forwardedMessage: { include: { sender: true } },
                messagesRead: true,
                reactions: {
                    include: {
                        user: true,
                    },
                },
                attachments: true,
            },
        });

        return messages.map((msg) => ({
            ...msg,
            isMine: msg.senderId === userId,
        }));
    }

    async markAsRead(userId: string, messageIds: string[]) {
        await this.prisma.messageRead.createMany({
            data: messageIds.map((id) => ({ userId, messageId: id })),
            skipDuplicates: true,
        });

        const lastMessage = await this.prisma.message.findFirst({
            where: { id: { in: messageIds } },
            orderBy: { createdAt: "desc" },
        });

        if (lastMessage) {
            await this.prisma.chatMember.updateMany({
                where: { userId, chatId: lastMessage.chatId },
                data: { lastReadAt: new Date() },
            });
        }

        return { message: "Messages marked as read" };
    }

    async forwardMessage(userId: string, createForwardMessageDto: CreateForwardMessageDto) {
        const original = await this.prisma.message.findUnique({
            where: { id: createForwardMessageDto.messageId },
        });

        if (!original) throw new NotFoundException("Original message not found");

        const newMessages = await Promise.all(
            createForwardMessageDto.chatIds.map((chatId) =>
                this.prisma.message.create({
                    data: {
                        chatId,
                        senderId: userId,
                        type: original.type,
                        content: original.content,
                        forwardedMessageId: original.id,
                        forwardedById: userId,
                    },
                })
            )
        );

        return newMessages;
    }

    async forwardMessages(userId: string, createForwardMessagesDto: CreateForwardMessagesDto) {
        const originals = await this.prisma.message.findMany({
            where: {
                id: {
                    in: createForwardMessagesDto.messageIds,
                },
            },
        });

        if (originals.length !== createForwardMessagesDto.messageIds.length) {
            throw new NotFoundException("Some original messages not found");
        }

        const newMessages = await Promise.all(
            createForwardMessagesDto.chatIds.flatMap((chatId) =>
                originals.map((original) =>
                    this.prisma.message.create({
                        data: {
                            chatId,
                            senderId: userId,
                            type: original.type,
                            content: original.content,
                            forwardedMessageId: original.id,
                            forwardedById: userId,
                        },
                    })
                )
            )
        );

        return newMessages;
    }

    async postMessageWithFiles(
        userId: string,
        chatId: string,
        createMessageDto: CreateMessageDto,
        files?: Express.Multer.File[]
    ) {
        // Перевірка доступу, як у твоєму current postMessage
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: { members: { where: { leftAt: null } } },
        });
        if (!chat) throw new NotFoundException("Chat not found");
        if (!chat.members.some((m) => m.userId === userId))
            throw new ForbiddenException("Not a member");

        // Створюємо повідомлення
        const message = await this.prisma.message.create({
            data: {
                ...createMessageDto,
                chatId,
                senderId: userId,
            },
            include: { sender: true },
        });

        let attachments: Attachment[] = [];
        if (files && files.length > 0) {
            attachments = await this.filesService.uploadMultipleFiles(files, userId, message.id);
        }

        return { ...message, attachments };
    }

    async updateMessage(userId: string, messageId: string, updateMessageDto: UpdateMessageDto) {
        await this.prisma.message.update({
            where: { id: messageId, senderId: userId },
            data: { ...updateMessageDto, editedAt: dayjs().toDate() },
        });
    }

    async deleteMessageForMe(userId: string, messageId: string) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) throw new NotFoundException("Message does not exist");

        const chat = await this.prisma.chat.findUnique({
            where: { id: message.chatId },
        });

        if (!chat) throw new NotFoundException("Chat not found for this message");

        const isAuthor = message.senderId === userId;
        const isAdmin = chat.adminId === userId;

        const canDelete =
            chat.type === ChatType.PRIVATE ||
            isAuthor ||
            ((chat.type === ChatType.GROUP || chat.type === ChatType.CHANNEL) && isAdmin);

        if (!canDelete) {
            throw new ForbiddenException("You do not have permission to delete this message");
        }

        await this.prisma.deletedMessage.create({
            data: {
                userId,
                messageId,
            },
        });
    }

    async deleteMessage(userId: string, messageId: string) {
        const message = await this.prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) throw new NotFoundException("Message does not exist");

        const chat = await this.prisma.chat.findUnique({
            where: { id: message.chatId },
        });

        if (!chat) throw new NotFoundException("Chat not found for this message");

        const isAuthor = message.senderId === userId;
        const isAdmin = chat.adminId === userId;

        const canDelete =
            chat.type === ChatType.PRIVATE ||
            isAuthor ||
            ((chat.type === ChatType.GROUP || chat.type === ChatType.CHANNEL) && isAdmin);

        if (!canDelete) {
            throw new ForbiddenException("You do not have permission to delete this message");
        }

        return await this.prisma.message.update({
            where: { id: messageId },
            data: { isRevoked: true },
        });
    }

    async deleteMessagesForMeMany(userId: string, messageIds: string[]) {
        const messages = await this.prisma.message.findMany({
            where: { id: { in: messageIds } },
        });

        if (messages.length === 0) throw new NotFoundException("Messages do not exist");

        for (const message of messages) {
            const chat = await this.prisma.chat.findUnique({ where: { id: message.chatId } });
            if (!chat) throw new NotFoundException(`Chat not found for message ${message.id}`);

            const isAuthor = message.senderId === userId;
            const isAdmin = chat.adminId === userId;
            const canDelete =
                chat.type === ChatType.PRIVATE ||
                isAuthor ||
                ((chat.type === ChatType.GROUP || chat.type === ChatType.CHANNEL) && isAdmin);

            if (!canDelete) {
                throw new ForbiddenException(
                    `You do not have permission to delete message ${message.id}`
                );
            }
        }

        return await this.prisma.deletedMessage.createMany({
            data: messageIds.map((id) => ({ userId, messageId: id })),
            skipDuplicates: true,
        });
    }

    async deleteMessagesMany(userId: string, messageIds: string[]) {
        const messages = await this.prisma.message.findMany({
            where: { id: { in: messageIds } },
        });
        if (messages.length === 0) throw new NotFoundException("Messages do not exist");

        for (const message of messages) {
            const chat = await this.prisma.chat.findUnique({ where: { id: message.chatId } });
            if (!chat) throw new NotFoundException(`Chat not found for message ${message.id}`);

            const isAuthor = message.senderId === userId;
            const isAdmin = chat.adminId === userId;
            const canDelete =
                chat.type === ChatType.PRIVATE ||
                isAuthor ||
                ((chat.type === ChatType.GROUP || chat.type === ChatType.CHANNEL) && isAdmin);

            if (!canDelete) {
                throw new ForbiddenException(
                    `You do not have permission to delete message ${message.id}`
                );
            }
        }

        return await this.prisma.message.updateMany({
            where: { id: { in: messageIds } },
            data: { isRevoked: true },
        });
    }
}
