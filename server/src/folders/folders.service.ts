import { ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFolderDto } from "./dto/create-folder.dto";
import { UpdateFolderDto } from "./dto/update-folder.dto";
import { AddChatToFolderDto } from "./dto/add-chat-to-folder.dto";

@Injectable()
export class FoldersService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUserFolders(userId: string) {
        return await this.prisma.folder.findMany({
            where: { userId },
            include: {
                chats: {
                    include: {
                        chat: {
                            include: {
                                messages: true,
                                members: { include: { user: true } },
                            },
                        },
                    },
                },
            },
        });
    }

    async createFolder(userId: string, createFolderDto: CreateFolderDto) {
        const existingFolder = await this.prisma.folder.findFirst({
            where: {
                userId,
                name: createFolderDto.name,
            },
        });

        if (existingFolder) {
            throw new ConflictException("Folder with this name already exists");
        }

        const newFolder = await this.prisma.folder.create({
            data: {
                userId,
                name: createFolderDto.name,
            },
        });

        return { message: "Folder created", data: newFolder };
    }

    async updateFolder(userId: string, folderId: string, updateFolderDto: UpdateFolderDto) {
        const existingFolder = await this.prisma.folder.findUnique({
            where: {
                id: folderId,
                userId,
            },
        });

        if (!existingFolder) {
            throw new ConflictException("Folder do not exist");
        }

        const updateFolder = await this.prisma.folder.update({
            where: {
                id: folderId,
                userId,
            },
            data: {
                name: updateFolderDto.name,
            },
        });

        return { message: "Folder updated", data: updateFolder };
    }

    async deleteFolder(userId: string, folderId: string) {
        const existingFolder = await this.prisma.folder.findUnique({
            where: {
                id: folderId,
                userId,
            },
        });

        if (!existingFolder) {
            throw new ConflictException("Folder do not exist");
        }

        await this.prisma.folder.delete({
            where: {
                id: folderId,
                userId,
            },
        });

        return { message: "Folder deleted" };
    }

    async addChatToFolder(
        userId: string,
        folderId: string,
        addChatToFolderDto: AddChatToFolderDto
    ) {
        const folder = await this.prisma.folder.findUnique({
            where: {
                id: folderId,
                userId,
            },
        });

        if (!folder) {
            throw new Error("Folder not found or access denied");
        }

        await this.prisma.folderChat.create({
            data: {
                folderId,
                chatId: addChatToFolderDto.chatId,
            },
        });

        return { message: "Chat successfully added to folder" };
    }

    async removeChatFromFolder(userId: string, folderId: string, chatId: string) {
        const folder = await this.prisma.folder.findUnique({
            where: {
                id: folderId,
                userId,
            },
        });

        if (!folder) {
            throw new Error("Folder not found or access denied");
        }

        const deletedFolderChat = await this.prisma.folderChat.delete({
            where: {
                chatId_folderId: {
                    chatId,
                    folderId,
                },
            },
        });

        if (!deletedFolderChat) {
            throw new Error("Chat not found in this folder");
        }

        return { message: "Chat successfully removed from folder" };
    }
}
