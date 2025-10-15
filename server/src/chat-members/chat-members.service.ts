import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { UpdateChatMemberDto } from "./dto/update-chat-member.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as dayjs from "dayjs";
import { AddNewMembersDto } from "./dto/add-new-members.dto";

@Injectable()
export class ChatMembersService {
    constructor(private readonly prisma: PrismaService) {}

    async ensureMembership(chatId: string, userId: string) {
        const member = await this.prisma.chatMember.findUnique({
            where: { userId_chatId: { userId, chatId } },
            include: {
                user: true,
            },
        });
        if (!member) throw new ForbiddenException("You are not a member of this chat");
        return member;
    }

    async toggleMarkMember(
        userId: string,
        chatId: string,
        updateChatMemberDto: UpdateChatMemberDto
    ) {
        const chatMember = await this.prisma.chatMember.findUnique({
            where: {
                userId_chatId: {
                    userId,
                    chatId,
                },
            },
        });

        if (!chatMember)
            throw new NotFoundException("You are not member of this chat or chat do not exist");

        const updated = await this.prisma.chatMember.update({
            where: {
                userId_chatId: {
                    userId,
                    chatId,
                },
            },
            include: {
                chat: true,
            },
            data: {
                isMarked: updateChatMemberDto.isMarked,
            },
        });

        return {
            message: `Chat successfully ${updateChatMemberDto.isMarked ? "marked" : "unmarked"}`,
            data: updated,
        };
    }

    async toggleMuteMember(
        userId: string,
        chatId: string,
        updateChatMemberDto: UpdateChatMemberDto
    ) {
        const chatMember = await this.prisma.chatMember.findUnique({
            where: {
                userId_chatId: {
                    userId,
                    chatId,
                },
            },
        });

        if (!chatMember)
            throw new NotFoundException("You are not member of this chat or chat do not exist");

        const updated = await this.prisma.chatMember.update({
            where: {
                userId_chatId: {
                    userId,
                    chatId,
                },
            },
            include: {
                chat: true,
            },
            data: {
                isMuted: updateChatMemberDto.isMuted,
                muteUntil: updateChatMemberDto.muteUntil,
            },
        });

        const formattedDate = updated.muteUntil
            ? dayjs(updated.muteUntil).format("DD MMM YYYY, HH:mm")
            : null;

        return {
            message: `Chat successfully ${updateChatMemberDto.isMuted ? `muted ${formattedDate ? `until ${formattedDate}` : ""}` : "unmuted"} `,
            data: updated,
        };
    }

    async addMembersToChat(userId: string, chatId: string, addNewMembers: AddNewMembersDto) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                id: chatId,
                members: {
                    some: {
                        userId,
                    },
                },
            },
        });

        if (!chat) throw new ConflictException("Chat not found or you not member of this chat");

        const data = addNewMembers.memberIds.map((id) => ({
            userId: id,
            chatId,
        }));

        await this.prisma.chatMember.createMany({
            data,
            skipDuplicates: true,
        });

        return { message: `Users successfully added to chat ${chat?.name}` };
    }
}
