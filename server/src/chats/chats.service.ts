import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChatDto, CreatePrivateChatDto } from "./dto/create-chat.dto";
import { ChatType, MemberRole, MessageType } from "generated/prisma";
import { UpdateChatDto } from "./dto/update-chat.dto";

@Injectable()
export class ChatsService {
    constructor(private readonly prisma: PrismaService) {}

    async getChats(userId: string) {
        return await this.prisma.chat.findMany({
            where: {
                members: { some: { userId, leftAt: null } },
                isActive: true,
                deletedChats: { none: { userId } },
            },
            include: {
                members: {
                    where: { leftAt: null },
                    include: { user: true },
                },
                lastMessage: true,
                messages: { take: 1, orderBy: { createdAt: "desc" } },
            },
            orderBy: { updatedAt: "desc" },
        });
    }

    async getChat(userId: string, chatId: string) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                id: chatId,
                members: { some: { userId, leftAt: null } },
            },
            include: {
                members: {
                    where: { leftAt: null },
                    include: { user: true },
                },
                messages: { orderBy: { createdAt: "desc" }, take: 50 },
            },
        });

        if (!chat) return null;

        return chat;
    }

    async createPrivateChat(userId: string, createPrivateChatDto: CreatePrivateChatDto) {
        const { otherUserId } = createPrivateChatDto;

        const existingChat = await this.prisma.chat.findFirst({
            where: {
                type: "PRIVATE",
                members: {
                    every: { userId: { in: [userId, otherUserId] } },
                },
            },
            include: { members: true },
        });

        if (existingChat) return existingChat;

        const companion = await this.prisma.user.findUnique({
            where: { id: otherUserId },
        });

        if (!companion) throw new NotFoundException("User not found");

        const privateChat = await this.prisma.chat.create({
            data: {
                type: "PRIVATE",
                members: {
                    create: [{ userId }, { userId: otherUserId }],
                },
            },
            include: { members: { include: { user: true } } },
        });

        return { message: "Chat created successfully", data: privateChat };
    }

    async createChat(userId: string, createChatDto: CreateChatDto) {
        const groupChat = await this.prisma.chat.create({
            data: {
                name: createChatDto.name,
                description: createChatDto.description,
                avatar: createChatDto.avatar,
                type: createChatDto.type,
                adminId: userId,
                messages: {
                    create: [
                        {
                            type: MessageType.SYSTEM,
                            content: `${createChatDto.type.charAt(0).toUpperCase()}${createChatDto.type.slice(1).toLowerCase()} "${createChatDto.name}" created`,
                            senderId: null,
                        },
                    ],
                },
                members: {
                    create: [
                        ...(createChatDto.memberIds ?? [])
                            .filter((id) => id !== userId)
                            .map((id) => ({
                                role: MemberRole.MEMBER,
                                user: { connect: { id } },
                            })),
                        {
                            role: MemberRole.ADMIN,
                            user: { connect: { id: userId } },
                        },
                    ],
                },
            },
        });

        return {
            message: `${createChatDto.type.charAt(0).toUpperCase()}${createChatDto.type.slice(1).toLowerCase()} created successfully`,
            data: groupChat,
        };
    }

    async findChat(chatId: string) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                id: chatId,
            },
        });

        if (!chat) {
            throw new NotFoundException("Chat not found");
        }
        return chat;
    }

    async updateChat(userId: string, chatId: string, updateChatDto: UpdateChatDto) {
        const existingChat = await this.prisma.chat.findUnique({
            where: {
                id: chatId,
                adminId: userId,
            },
        });

        if (!existingChat) throw new NotFoundException("Chat not found or access denied");

        await this.prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                name: updateChatDto.name,
                description: updateChatDto.description,
                ...updateChatDto,
            },
        });

        return {
            message: "Chat data updated successfully",
        };
    }

    async leaveChat(userId: string, chatId: string) {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: { members: true, admin: true },
        });

        if (!chat) throw new NotFoundException("Chat not found");

        if (chat.type === ChatType.PRIVATE) {
            return this.prisma.deletedChat.create({ data: { chatId, userId } });
        }

        if (chat.type === ChatType.GROUP || chat.type === ChatType.CHANNEL) {
            const member = chat.members.find((m) => m.userId === userId);
            if (!member) throw new ForbiddenException("You are not a member");

            await this.prisma.chatMember.update({
                where: { userId_chatId: { userId, chatId } },
                data: { leftAt: new Date() },
            });

            return { message: "You successfully leave the chat" };
        }
    }

    async deleteChat(userId: string, chatId: string, deleteForMe: boolean) {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: { members: true },
        });

        if (!chat) throw new NotFoundException("Chat not found");

        if (
            (chat.type === ChatType.GROUP || chat.type === ChatType.CHANNEL) &&
            chat.adminId !== userId
        ) {
            throw new ForbiddenException("Only admin can delete this chat");
        }

        if (chat.type === ChatType.PRIVATE) {
            if (deleteForMe) {
                await this.prisma.deletedChat.create({ data: { chatId, userId } });
                return { message: "Chat deleted only for you" };
            } else {
                const operations = chat.members.map((m) =>
                    this.prisma.deletedChat.create({ data: { chatId, userId: m.userId } })
                );
                await this.prisma.$transaction(operations);
                return { message: "Private chat deleted for all" };
            }
        }

        if (chat.type === ChatType.GROUP || chat.type === ChatType.CHANNEL) {
            await this.prisma.$transaction([
                this.prisma.message.deleteMany({ where: { chatId } }),
                this.prisma.chatMember.deleteMany({ where: { chatId } }),
                this.prisma.deletedChat.deleteMany({ where: { chatId } }),
                this.prisma.chat.delete({ where: { id: chatId } }),
            ]);
            return { message: "Chat deleted for all" };
        }
    }
}
