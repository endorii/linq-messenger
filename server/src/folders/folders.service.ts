import { ConflictException, Injectable } from "@nestjs/common";
// import { CreateFolderDto } from "./dto/create-folder.dto";
// import { UpdateFolderDto } from "./dto/update-folder.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFolderDto } from "./dto/create-folder.dto";
import { UpdateFolderDto } from "./dto/update-folder.dto";

@Injectable()
export class FoldersService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUserFolders(userId: string) {
        return await this.prisma.folder.findMany({
            where: { userId },
            include: { chats: true },
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
}
