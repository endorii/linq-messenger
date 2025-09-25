import { Injectable } from "@nestjs/common";
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

    async getUserChats(userId: string) {
        return this.prisma.chat.findMany({
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
    }
}
