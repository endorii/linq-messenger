import {
    Controller,
    Post,
    UploadedFiles,
    Body,
    UseInterceptors,
    BadRequestException,
    UseGuards,
    Req,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";

@Controller("files")
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}
    @Post("upload-avatar")
    @UseInterceptors(FilesInterceptor("avatar", 1))
    async uploadAvatar(
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: AuthenticatedRequest
    ): Promise<{ avatarUrl: string }> {
        if (!files || files.length === 0) {
            throw new BadRequestException("No file provided");
        }

        const avatar = await this.filesService.uploadAvatar(files[0], req.user.id);
        return { avatarUrl: avatar.url };
    }

    @Post("upload")
    @UseInterceptors(FilesInterceptor("files"))
    async uploadFiles(
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: AuthenticatedRequest,
        @Body("messageId") messageId: string
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException("No files provided");
        }
        if (!req.user.id || !messageId) {
            throw new BadRequestException("userId, chatId and messageId are required");
        }

        return this.filesService.uploadMultipleFiles(files, req.user.id, messageId);
    }
}
