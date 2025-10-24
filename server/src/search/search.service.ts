import { Injectable } from "@nestjs/common";
import { PrivacyLevel, PrivacySettings } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) {}

    async globalSearch(query: string, userId: string) {
        if (!query || query.trim().length === 0) {
            return {
                chats: [],
                users: [],
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

    private readonly defaultPrivacySettings = {
        phoneVisibility: "EVERYBODY",
        addMe: "EVERYBODY",
        bioVisibility: "EVERYBODY",
        lastSeenVisibility: "EVERYBODY",
        messages: "EVERYBODY",
        usernameVisibility: "EVERYBODY",
    } as PrivacySettings;

    private async searchUsers(query: string, userId: string) {
        const queryLower = query.toLowerCase();

        const users = await this.prisma.user.findMany({
            where: {
                id: { not: userId },
                OR: [
                    { username: { contains: query, mode: "insensitive" } },
                    { phone: { contains: query, mode: "insensitive" } },
                    { email: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                privacySettings: true,
                contacts: { where: { contactId: userId } },
            },
            take: 10,
        });

        return users
            .filter((user) => {
                const isContact = user.contacts.length > 0;
                const privacy = user.privacySettings ?? this.defaultPrivacySettings;

                const usernameVisible =
                    privacy.usernameVisibility === "EVERYBODY" ||
                    (privacy.usernameVisibility === "MY_CONTACTS" && isContact);
                const phoneVisible =
                    privacy.phoneVisibility === "EVERYBODY" ||
                    (privacy.phoneVisibility === "MY_CONTACTS" && isContact);
                const emailVisible =
                    privacy.addMe === "EVERYBODY" || (privacy.addMe === "MY_CONTACTS" && isContact);

                return (
                    (usernameVisible && user.username?.toLowerCase().includes(queryLower)) ||
                    (phoneVisible && user.phone?.includes(query)) ||
                    (emailVisible && user.email?.toLowerCase().includes(queryLower))
                );
            })
            .map((user) => {
                const isContact = user.contacts.length > 0;
                const privacy = user.privacySettings ?? this.defaultPrivacySettings;

                const filterByPrivacy = (level: PrivacyLevel, value: string | null) => {
                    if (!value) return null;
                    if (level === "EVERYBODY") return value;
                    if (level === "MY_CONTACTS" && isContact) return value;
                    return null;
                };

                return {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatarUrl: user.avatarUrl,
                    isOnline:
                        privacy.lastSeenVisibility === "EVERYBODY" ||
                        (privacy.lastSeenVisibility === "MY_CONTACTS" && isContact)
                            ? user.isOnline
                            : null,
                    phone: filterByPrivacy(privacy.phoneVisibility, user.phone || ""),
                    email: filterByPrivacy(privacy.addMe, user.email),
                };
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
