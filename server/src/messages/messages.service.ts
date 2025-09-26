import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ChatsService } from "src/chats/chats.service";
// import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatsService: ChatsService
    ) {}

    async getChatMessages(chatId: string) {
        await this.chatsService.findChat(chatId);

        const messages = await this.prisma.message.findMany({
            where: {
                chatId,
            },
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { id: true, username: true, avatarUrl: true } } },
        });

        return messages;
    }

    async postMessage(userId: string, chatId: string, createMessageDto: CreateMessageDto) {
        return this.prisma.message.create({
            data: {
                content: createMessageDto.content,
                chatId,
                senderId: userId,
            },
            include: {
                sender: { select: { id: true, email: true } },
            },
        });
    }
}
