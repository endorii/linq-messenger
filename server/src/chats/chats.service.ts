import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChannelDto, CreateGroupChatDto, CreatePrivateChatDto } from "./dto/create-chat.dto";
import { ChatType, MemberRole } from "generated/prisma";
// import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
    constructor(private readonly prisma: PrismaService) {}
    async createPrivateChat(userId: string, createPrivateChatDto: CreatePrivateChatDto) {
        const existingChat = await this.prisma.chat.findFirst({
            where: {
                type: ChatType.PRIVATE,
                members: { every: { userId: { in: [userId, createPrivateChatDto.userId] } } },
            },
        });

        if (existingChat) {
            return { message: "Chat already exists", data: existingChat };
        }

        const privateChat = await this.prisma.chat.create({
            data: {
                members: {
                    create: [
                        { userId, role: "MEMBER" },
                        { userId: createPrivateChatDto.userId, role: "MEMBER" },
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
                adminId: userId,
                type: ChatType.GROUP,
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
                adminId: userId || "",
                type: ChatType.CHANNEL,
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

    async getChats(userId: string) {
        const chats = await this.prisma.chat.findMany({
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

        return chats.map((chat) => {
            if (chat.type === "PRIVATE") {
                // Знаходимо іншого учасника

                const otherMember = chat.members.find((m) => m.userId !== userId);
                if (otherMember) {
                    chat.name =
                        `${otherMember.user.firstName || otherMember.user.username} ${otherMember.user.lastName || ""}`.trim();
                }
                chat.avatar = otherMember?.user.avatarUrl ?? null;
            }
            return chat;
        });
    }

    async getChat(userId: string, chatId: string) {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                members: {
                    include: { user: true },
                },
                // lastMessage: true,
            },
        });

        if (!chat) {
            throw new NotFoundException("Chat not found");
        }

        const isPrivate = chat.type === "PRIVATE";
        const isMember = chat.members.some((member) => member.userId === userId);

        if (isPrivate && !isMember) {
            throw new ForbiddenException("Access denied to this private chat");
        }

        // Для приватного чату підставляємо ім'я співрозмовника
        if (isPrivate) {
            const otherMember = chat.members.find((m) => m.userId !== userId);
            if (otherMember) {
                chat.name =
                    `${otherMember.user.firstName || otherMember.user.username} ${otherMember.user.lastName || ""}`.trim();
            }
            chat.avatar = otherMember?.user.avatarUrl ?? null;
        }

        return chat;
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
}
