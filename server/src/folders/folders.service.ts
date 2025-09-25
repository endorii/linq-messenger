import { Injectable } from "@nestjs/common";
// import { CreateFolderDto } from "./dto/create-folder.dto";
// import { UpdateFolderDto } from "./dto/update-folder.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FoldersService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllUserFolders(userId: string) {
        return await this.prisma.chatFolder.findMany({
            where: { userId },
            include: { chats: true },
        });
    }
}
