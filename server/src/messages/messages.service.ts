import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { ChatType } from "generated/prisma";
import { ChatMembersService } from "src/chat-members/chat-members.service";
import { CreateForwardMessageDto } from "./dto/create-forward-message.dto";

@Injectable()
export class MessagesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatsMembersService: ChatMembersService
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
                    },
                },
                pinnedMessages: true,
                forwardedMessage: { include: { sender: true } },
                messagesRead: true,
            },
        });

        return messages.map((msg) => ({
            ...msg,
            isMine: msg.senderId === userId,
        }));
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

    async postMessage(userId: string, chatId: string, createMessageDto: CreateMessageDto) {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                members: {
                    where: { leftAt: null },
                },
            },
        });

        if (!chat) throw new NotFoundException("Chat not found");

        const isMember = chat.members.some((m) => m.userId === userId);
        if (!isMember) throw new ForbiddenException("You are not a member of this chat");

        if (chat.type === "PRIVATE") {
            const currentUser = await this.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    blockedUsers: true,
                    blockedByUsers: true,
                },
            });

            const interlocutor = chat.members.find((m) => m.userId !== userId);

            const isBlocked = currentUser?.blockedUsers.some(
                (b) => b.blockedId === interlocutor?.userId
            );
            if (isBlocked) {
                throw new ForbiddenException("You have blocked this user");
            }

            const isBlockedByOther = currentUser?.blockedByUsers.some(
                (b) => b.blockerId === interlocutor?.userId
            );
            if (isBlockedByOther) {
                throw new ForbiddenException("This user has blocked you");
            }
        }

        if (chat.type === "CHANNEL") {
            if (chat.adminId !== userId) {
                throw new ForbiddenException("Only admin can send messages in channel");
            }
        }

        const message = await this.prisma.message.create({
            data: {
                ...createMessageDto,
                chatId,
                senderId: userId,
            },
            include: { sender: true },
        });

        return message;
    }

    async updateMessage(userId: string, messageId: string, updateMessageDto: UpdateMessageDto) {
        await this.prisma.message.update({
            where: { id: messageId, senderId: userId },
            data: { ...updateMessageDto },
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
}
