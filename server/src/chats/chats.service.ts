import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChannelDto, CreateGroupChatDto, CreatePrivateChatDto } from "./dto/create-chat.dto";
import { ChatType, MemberRole, MessageType } from "generated/prisma";

@Injectable()
export class ChatsService {
    constructor(private readonly prisma: PrismaService) {}

    async getChats(userId: string) {
        return await this.prisma.chat.findMany({
            where: {
                members: { some: { userId } },
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
            where: {
                id: chatId,
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 50,
                },
            },
        });

        if (!chat) return null;

        return chat;
    }

    async createPrivateChat(userId: string, createPrivateChatDto: CreatePrivateChatDto) {
        const existingChat = await this.prisma.chat.findFirst({
            where: {
                type: ChatType.PRIVATE,
                AND: [
                    { members: { some: { userId } } },
                    { members: { some: { userId: createPrivateChatDto.otherUserId } } },
                ],
            },
        });

        if (existingChat) {
            return { message: "Chat already exists", data: existingChat };
        }

        const companion = await this.prisma.user.findUnique({
            where: { id: createPrivateChatDto.otherUserId },
        });

        if (!companion) {
            throw new NotFoundException("Cmpanion not found");
        }

        const privateChat = await this.prisma.chat.create({
            data: {
                name: companion.username,
                avatar: companion.avatarUrl,
                members: {
                    create: [
                        { userId, role: "ADMIN" },
                        { userId: createPrivateChatDto.otherUserId, role: "ADMIN" },
                    ],
                },
                type: ChatType.PRIVATE,
            },
        });
        return { message: "Chat created successfully", data: privateChat };
    }

    async createGroupChat(userId: string, createGroupChatDto: CreateGroupChatDto) {
        const groupChat = await this.prisma.chat.create({
            data: {
                name: createGroupChatDto.name,
                description: createGroupChatDto.description,
                avatar: createGroupChatDto.avatar,
                type: ChatType.GROUP,
                messages: {
                    create: [
                        {
                            type: MessageType.SYSTEM,
                            content: `Group "${createGroupChatDto.name}" created`,
                            senderId: null,
                        },
                    ],
                },
                members: {
                    create: [
                        ...createGroupChatDto.memberIds
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

        return { message: "Group created successfully", data: groupChat };
    }

    async createChannel(userId: string, createChannelDto: CreateChannelDto) {
        console.log(createChannelDto);

        if (!userId) throw new BadRequestException("userId is required");
        const channel = await this.prisma.chat.create({
            data: {
                name: createChannelDto.name,
                description: createChannelDto.description,
                avatar: createChannelDto.avatar,
                type: ChatType.CHANNEL,
                messages: {
                    create: [
                        {
                            type: MessageType.SYSTEM,
                            content: `Channel "${createChannelDto.name}" created`,
                            senderId: null,
                        },
                    ],
                },
                members: {
                    create: [
                        ...createChannelDto.memberIds
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
        return { message: "Channel created successfully", data: channel };
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

    async deleteChat(userId: string, chatId: string) {
        const existingChat = await this.prisma.chat.findUnique({
            where: {
                id: chatId,
                members: {
                    some: {
                        userId,
                        role: "ADMIN",
                    },
                },
            },
        });

        if (!existingChat) throw new NotFoundException("Chat not found");

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
