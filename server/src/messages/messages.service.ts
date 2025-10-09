import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { ChatsService } from "src/chats/chats.service";
import { UpdateMessageDto } from "./dto/update-message.dto";

@Injectable()
export class MessagesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatsService: ChatsService
    ) {}

    async getChatMessages(userId: string, chatId: string) {
        await this.chatsService.ensureMembership(chatId, userId);

        const messages = await this.prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { id: true, username: true, avatarUrl: true } } },
        });

        return messages.map((msg) => ({
            ...msg,
            isMine: msg.senderId === userId,
        }));
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

    async updateMessage(userId: string, messageId: string, updateMessageDto: UpdateMessageDto) {
        await this.prisma.message.update({
            where: { id: messageId, senderId: userId },
            data: { ...updateMessageDto },
        });
    }
}
