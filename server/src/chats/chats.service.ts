import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChatDto, CreatePrivateChatDto } from "./dto/create-chat.dto";
import { MemberRole, MessageType } from "generated/prisma";
import { UpdateChatDto } from "./dto/update-chat.dto";

@Injectable()
export class ChatsService {
    constructor(private readonly prisma: PrismaService) {}

    async getChats(userId: string) {
        return await this.prisma.chat.findMany({
            where: {
                members: { some: { userId } },
                isActive: true,
            },
            include: {
                members: {
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
            where: { id: chatId, members: { some: { userId } } },
            include: {
                members: { include: { user: true } },
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

    async deleteChat(userId: string, chatId: string) {
        const existingChat = await this.prisma.chat.findUnique({
            where: {
                id: chatId,
                adminId: userId,
            },
        });

        if (!existingChat) throw new NotFoundException("Chat not found or access denied");

        await this.prisma.chat.delete({
            where: {
                id: chatId,
            },
        });

        return {
            message: "Chat deleted successfully",
        };
    }
}
