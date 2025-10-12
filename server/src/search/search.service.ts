import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) {}

    async globalSearch(query: string, userId: string) {
        if (!query || query.trim().length === 0) {
            return {
                chats: [],
                users: [],
                contacts: [],
                messages: [],
            };
        }

        const searchTerm = query.trim();

        const [chats, users, messages] = await Promise.all([
            this.searchChats(searchTerm, userId),
            this.searchUsers(searchTerm, userId),
            this.searchMessages(searchTerm, userId),
        ]);

        return {
            chats,
            users,
            messages,
        };
    }

    private async searchChats(query: string, userId: string) {
        return this.prisma.chat.findMany({
            where: {
                AND: [
                    {
                        isDeleted: false,
                        isActive: true,
                    },
                    {
                        members: {
                            some: {
                                userId: userId,
                                leftAt: null,
                            },
                        },
                    },
                    {
                        OR: [
                            {
                                name: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                description: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                ],
            },
            take: 5,
            include: {
                members: {
                    where: {
                        leftAt: null,
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                                isOnline: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        messages: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
    }

    private async searchUsers(query: string, userId: string) {
        return this.prisma.user.findMany({
            where: {
                AND: [
                    {
                        id: {
                            not: userId,
                        },
                    },
                    {
                        OR: [
                            {
                                username: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                phone: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                email: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                firstName: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                            {
                                lastName: {
                                    contains: query,
                                    mode: "insensitive",
                                },
                            },
                        ],
                    },
                ],
            },
            take: 5,
            select: {
                id: true,
                username: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                isOnline: true,
                lastSeenAt: true,
            },
        });
    }

    private async searchMessages(query: string, userId: string) {
        return this.prisma.message.findMany({
            where: {
                AND: [
                    { isRevoked: false },
                    { type: { not: "SYSTEM" } },
                    {
                        chat: {
                            isDeleted: false,
                            isActive: true,
                            members: {
                                some: {
                                    userId: userId,
                                    leftAt: null,
                                },
                            },
                        },
                    },
                    {
                        content: {
                            contains: query,
                            mode: "insensitive",
                        },
                    },
                    {
                        deletedMessages: {
                            none: {
                                userId: userId,
                            },
                        },
                    },
                ],
            },
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        avatarUrl: true,
                    },
                },
                chat: {
                    include: {
                        members: {
                            where: { leftAt: null },
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        username: true,
                                        firstName: true,
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        reactions: true,
                    },
                },
            },
        });
    }
}
