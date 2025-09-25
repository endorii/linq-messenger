import { ConflictException, Injectable } from "@nestjs/common";
// import { CreateFolderDto } from "./dto/create-folder.dto";
// import { UpdateFolderDto } from "./dto/update-folder.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFolderDto } from "./dto/create-folder.dto";

@Injectable()
export class FoldersService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUserFolders(userId: string) {
        return await this.prisma.chatFolder.findMany({
            where: { userId },
            include: { chats: true },
        });
    }

    async createFolder(userId: string, createFolderDto: CreateFolderDto) {
        const existigFolder = await this.prisma.chatFolder.findFirst({
            where: {
                userId,
                name: createFolderDto.name,
            },
        });

        if (existigFolder) {
            throw new ConflictException("Folder with this name already exists");
        }

        const newFolder = await this.prisma.chatFolder.create({
            data: {
                userId,
                name: createFolderDto.name,
            },
        });

        return { message: "Folder created", data: newFolder };
    }
}
