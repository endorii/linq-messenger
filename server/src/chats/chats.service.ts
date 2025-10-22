import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateChatDto, CreatePrivateChatDto } from "./dto/create-chat.dto";
import { ChatType, MemberRole, MessageType } from "generated/prisma";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { ChatMembersService } from "src/chat-members/chat-members.service";
import { IEnrichedChat } from "./interfaces/interfaces";

@Injectable()
export class ChatsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatMembersService: ChatMembersService
    ) {}

    private async findExistingChat(chatId: string, includeMembers = true) {
        const chat = await this.prisma.chat.findUnique({
            where: { id: chatId },
            include: includeMembers ? { members: true } : undefined,
        });
        if (!chat) throw new NotFoundException("Chat not found");
        return chat;
    }

    private async handleOwnerLeaving(chatId: string, ownerId: string) {
        const nextAdmin =
            (await this.prisma.chatMember.findFirst({
                where: {
                    chatId,
                    leftAt: null,
                    userId: { not: ownerId },
                    role: MemberRole.ADMIN,
                },
                orderBy: { joinedAt: "asc" },
            })) ||
            (await this.prisma.chatMember.findFirst({
                where: { chatId, leftAt: null, userId: { not: ownerId } },
                orderBy: { joinedAt: "asc" },
            }));

        if (nextAdmin)
            await this.prisma.$transaction([
                this.prisma.chatMember.update({
                    where: { id: nextAdmin.id },
                    data: { role: MemberRole.OWNER },
                }),
                this.prisma.chat.update({
                    where: { id: chatId },
                    data: { adminId: nextAdmin.userId },
                }),
            ]);
        else await this.prisma.chat.delete({ where: { id: chatId } });
    }

    async getChats(userId: string) {
        const chats = await this.prisma.chat.findMany({
            where: {
                isActive: true,
                isDeleted: false,
                deletedChats: { none: { userId } },
                members: { some: { userId, leftAt: null } },
            },
            include: {
                members: { where: { leftAt: null }, include: { user: true } },
                folders: true,
                messages: {
                    take: 1,
                    where: { isRevoked: false, deletedMessages: { none: { userId } } },
                    orderBy: { createdAt: "desc" },
                    include: { sender: true },
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        const chatsWithUnread = await Promise.all(
            chats.map(async (chat) => {
                const member = chat.members.find((m) => m.userId === userId);
                const lastReadAt = member?.lastReadAt ?? new Date(0);

                const unreadCount = await this.prisma.message.count({
                    where: {
                        chatId: chat.id,
                        isRevoked: false,
                        createdAt: { gt: lastReadAt },
                        deletedMessages: { none: { userId } },
                    },
                });

                return {
                    ...chat,
                    lastMessage: chat.messages[0] || null,
                    unreadCount,
                };
            })
        );

        return chatsWithUnread;
    }

    async getChatsForForward(userId: string) {
        return await this.prisma.chat.findMany({
            where: {
                isActive: true,
                isDeleted: false,
                deletedChats: { none: { userId } },
                OR: [
                    {
                        AND: [
                            { type: { in: ["PRIVATE", "GROUP"] } },
                            { members: { some: { userId, leftAt: null } } },
                        ],
                    },

                    {
                        AND: [
                            { type: "CHANNEL" },
                            { members: { some: { userId, role: "ADMIN", leftAt: null } } },
                        ],
                    },
                ],
            },
            include: {
                members: { where: { leftAt: null }, include: { user: true } },
            },
            orderBy: { updatedAt: "desc" },
        });
    }

    async getChat(userId: string, chatId: string) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                id: chatId,
                isActive: true,
                isDeleted: false,
                deletedChats: { none: { userId } },
                members: { some: { userId, leftAt: null } },
            },
            include: {
                members: {
                    where: { leftAt: null },
                    include: { user: true },
                },
                pinnedMessages: {
                    include: {
                        message: {
                            include: {
                                pinnedMessages: true,
                            },
                        },
                    },
                },
            },
        });

        if (!chat) throw new NotFoundException("Chat not found or access denied");

        const enrichedPinnedMessages = chat.pinnedMessages.map((pm) => ({
            ...pm,
            message: {
                ...pm.message,
                isMine: pm.message.senderId === userId,
            },
        }));

        const meMember = chat.members.find((m) => m.userId === userId) || null;
        const otherMembers = chat.members.filter((m) => m.userId !== userId);
        const otherMember = otherMembers[0] || null;

        const enrichedChat: IEnrichedChat = {
            ...chat,
            pinnedMessages: enrichedPinnedMessages,
            privateChat: null,
            blockingInfo: {
                isBlocked: false,
                isBlockedByOther: false,
                interlocutorId: null,
            },
        };

        if (chat.type === "PRIVATE" && meMember && otherMember) {
            const contact = await this.prisma.contact.findFirst({
                where: { userId, contactId: otherMember.userId },
            });

            const currentUser = await this.prisma.user.findUnique({
                where: { id: userId },
                include: { blockedUsers: true, blockedByUsers: true },
            });

            enrichedChat.privateChat = {
                meMember,
                otherMember,
                contact: contact || null,
            };

            enrichedChat.blockingInfo = {
                isBlocked: !!currentUser?.blockedUsers.some(
                    (b) => b.blockedId === otherMember.userId
                ),
                isBlockedByOther: !!currentUser?.blockedByUsers.some(
                    (b) => b.blockerId === otherMember.userId
                ),
                interlocutorId: otherMember.userId,
            };
        }

        return enrichedChat;
    }

    async getChatsByFolder(userId: string, folderId: string) {
        const chats = await this.prisma.folderChat.findMany({
            where: {
                folderId,
                chat: {
                    isActive: true,
                    isDeleted: false,
                    deletedChats: { none: { userId } },
                    members: { some: { userId, leftAt: null } },
                },
            },
            include: {
                chat: {
                    include: {
                        members: { where: { leftAt: null }, include: { user: true } },
                        messages: {
                            where: { isRevoked: false, deletedMessages: { none: { userId } } },
                            orderBy: { createdAt: "desc" },
                        },
                    },
                },
            },
            orderBy: {
                chat: {
                    updatedAt: "desc",
                },
            },
        });

        return chats.map((chat) => {
            const lastMessage = chat.chat.messages[0] || null;

            return {
                ...chat.chat,
                lastMessage,
            };
        });
    }

    async createPrivateChat(userId: string, { otherUserId }: CreatePrivateChatDto) {
        const existingChat = await this.prisma.chat.findFirst({
            where: {
                type: ChatType.PRIVATE,
                members: { every: { userId: { in: [userId, otherUserId] } } },
            },
            include: { members: true, deletedChats: true },
        });

        if (existingChat) {
            if (existingChat.isDeleted) {
                await this.prisma.$transaction([
                    this.prisma.message.deleteMany({ where: { chatId: existingChat.id } }),
                    this.prisma.chat.update({
                        where: { id: existingChat.id },
                        data: { isDeleted: false },
                    }),
                ]);
                return { message: "Chat restored (was deleted)", data: existingChat };
            }

            const deletedForUser = existingChat.deletedChats.find((d) => d.userId === userId);
            const member = existingChat.members.find((m) => m.userId === userId);

            const updates: any[] = [];
            if (deletedForUser)
                updates.push(
                    this.prisma.deletedChat.delete({
                        where: { userId_chatId: { userId, chatId: existingChat.id } },
                    })
                );
            if (member?.leftAt)
                updates.push(
                    this.prisma.chatMember.update({
                        where: { userId_chatId: { userId, chatId: existingChat.id } },
                        data: { leftAt: null },
                    })
                );
            if (updates.length) await this.prisma.$transaction(updates);

            return { message: "Chat restored", data: existingChat };
        }

        const privateChat = await this.prisma.chat.create({
            data: {
                type: ChatType.PRIVATE,
                members: { create: [{ userId }, { userId: otherUserId }] },
            },
            include: { members: { include: { user: true } } },
        });
        return { message: "New private chat created", data: privateChat };
    }

    async createChat(userId: string, dto: CreateChatDto) {
        const chat = await this.prisma.chat.create({
            data: {
                name: dto.name,
                description: dto.description,
                type: dto.type,
                adminId: userId,
                avatar:
                    dto.avatar ||
                    `https://api.dicebear.com/9.x/initials/svg?seed=${dto.name}&backgroundType=gradientLinear&backgroundColor=7C3AED,4F46E5,9333EA,8B5CF6,C026D3,FB7185&fontSize=50&scale=75
`,
                messages: {
                    create: [
                        { type: MessageType.SYSTEM, content: `${dto.type} "${dto.name}" created` },
                    ],
                },
                members: {
                    create: [
                        ...(dto.memberIds ?? [])
                            .filter((id) => id !== userId)
                            .map((id) => ({ role: MemberRole.MEMBER, user: { connect: { id } } })),
                        { role: MemberRole.OWNER, user: { connect: { id: userId } } },
                    ],
                },
            },
        });
        return { message: `${dto.type} created successfully`, data: chat };
    }

    async updateChat(userId: string, chatId: string, dto: UpdateChatDto) {
        const chat = await this.prisma.chat.findUnique({ where: { id: chatId, adminId: userId } });
        if (!chat) throw new NotFoundException("Chat not found or access denied");

        const oldName = chat.name;
        await this.prisma.chat.update({ where: { id: chatId }, data: dto });

        if (dto.name && dto.name !== oldName) {
            await this.prisma.message.create({
                data: {
                    chatId,
                    type: MessageType.SYSTEM,
                    content: `Chat name changed on "${dto.name}"`,
                },
            });
        }
        return { message: "Chat updated successfully" };
    }

    async leaveChat(userId: string, chatId: string) {
        const chat = await this.findExistingChat(chatId);
        const member = await this.chatMembersService.ensureMembership(chatId, userId);

        if (chat.type === ChatType.PRIVATE) {
            const alreadyHidden = await this.prisma.deletedChat.findUnique({
                where: { userId_chatId: { userId, chatId } },
            });
            if (alreadyHidden) throw new ForbiddenException("Chat already hidden");

            await this.prisma.deletedChat.create({ data: { chatId, userId } });
            // await this.prisma.message.create({
            //     data: {
            //         chatId,
            //         type: MessageType.SYSTEM,
            //         content: `${member.user.firstName || member.user.username} has hidden chat for himself.`,
            //         systemData: { userId, action: "hidden" },
            //     },
            // });
            return { message: "Chat hidden" };
        }

        if (member.leftAt) throw new ForbiddenException("You already left this chat");
        if (member.role === MemberRole.OWNER) await this.handleOwnerLeaving(chatId, userId);

        await this.prisma.chatMember.update({
            where: { userId_chatId: { userId, chatId } },
            data: { leftAt: new Date() },
        });

        if (chat.type !== ChatType.CHANNEL) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            await this.prisma.message.create({
                data: {
                    chatId,
                    type: MessageType.SYSTEM,
                    content: `${user?.username || "User"} left the chat`,
                    systemData: { userId, action: "left" },
                },
            });
        }

        return { message: "You left the chat" };
    }

    async deleteChat(userId: string, chatId: string) {
        const chat = await this.findExistingChat(chatId);
        if (chat.type === ChatType.PRIVATE) {
            await this.chatMembersService.ensureMembership(chatId, userId);
            await this.prisma.chat.update({ where: { id: chatId }, data: { isDeleted: true } });
            return { message: "Private chat deleted" };
        }
        if (chat.adminId !== userId)
            throw new ForbiddenException("Only admin can delete this chat");
        await this.prisma.chat.update({ where: { id: chatId }, data: { isDeleted: true } });
        await this.prisma.message.updateMany({
            where: {
                chatId,
            },
            data: {
                isRevoked: true,
            },
        });
        return { message: "Chat deleted" };
    }
}
