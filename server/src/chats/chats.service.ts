import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePrivateChatDto } from "./dto/create-chat.dto";
// import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
    constructor(private readonly prisma: PrismaService) {}
    async createPrivateChat(userId: string, createPrivateChatDto: CreatePrivateChatDto) {
        const existingChat = await this.prisma.chat.findFirst({
            where: {
                type: "PRIVATE",
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
                type: "PRIVATE",
            },
        });
        return { message: "Chat created successfully", data: privateChat };
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
