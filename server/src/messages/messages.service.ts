import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ChatsService } from "src/chats/chats.service";

@Injectable()
export class MessagesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatsService: ChatsService
    ) {}

    async getChatMessages(userId: string, chatId: string) {
        await this.chatsService.findChat(chatId);

        const messages = await this.prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { id: true, username: true, avatarUrl: true } } },
        });

        const messagesWithIsMine = messages.map((msg) => ({
            ...msg,
            isMine: msg.senderId === userId,
        }));

        return messagesWithIsMine;
    }

    async postMessage(userId: string, chatId: string, createMessageDto: CreateMessageDto) {
        return this.prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    ...createMessageDto,
                    chatId,
                    senderId: userId,
                },
            });

            await tx.chat.update({
                where: { id: chatId },
                data: { lastMessageId: message.id },
            });

            return message;
        });
    }
}
