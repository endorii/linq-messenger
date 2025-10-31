import { ConflictException, Injectable } from "@nestjs/common";
import { CreatePinnedMessageDto } from "./dto/create-pinned-message.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PinnedMessagesService {
    constructor(private readonly prisma: PrismaService) {}
    async getPinnedMessages(userId: string, chatId: string) {
        const pinnedMessages = await this.prisma.pinnedMessage.findMany({
            where: { chatId },
            include: {
                message: {
                    include: {
                        pinnedMessages: true,
                        sender: true,
                        forwardedMessage: { include: { sender: true } },
                        replyTo: {
                            include: {
                                sender: true,
                                forwardedMessage: { include: { sender: true } },
                                attachments: true,
                            },
                        },
                        reactions: {
                            include: {
                                user: true,
                            },
                        },
                        messagesRead: true,
                        attachments: true,
                    },
                },
            },
        });
        return pinnedMessages.map((msg) => ({
            ...msg,
            isMine: msg.message.senderId === userId,
        }));
    }

    async createPinMessage(
        userId: string,
        chatId: string,
        createPinnedMessageDto: CreatePinnedMessageDto
    ) {
        const pinnedMessage = await this.prisma.pinnedMessage.findFirst({
            where: {
                chatId,
                messageId: createPinnedMessageDto.messageId,
            },
        });

        if (pinnedMessage) throw new ConflictException("Message is already pinned");

        await this.prisma.pinnedMessage.create({
            data: {
                userId,
                chatId,
                messageId: createPinnedMessageDto.messageId,
            },
        });

        return { message: "Message pinned successfully" };
    }

    async unpinAllMessages(chatId: string) {
        await this.prisma.pinnedMessage.deleteMany({
            where: {
                chatId,
            },
        });

        return { message: "All messages unpinned successfully" };
    }

    async deletePinnedMessage(chatId: string, pinnedMessageId: string) {
        const pinnedMessage = await this.prisma.pinnedMessage.findFirst({
            where: {
                chatId,
                id: pinnedMessageId,
            },
        });

        if (!pinnedMessage) throw new ConflictException("Message is not pinned");

        await this.prisma.pinnedMessage.delete({
            where: {
                id: pinnedMessage.id,
            },
        });

        return { message: "Message unpinned successfully" };
    }
}
