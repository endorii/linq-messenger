import {
    Controller,
    Post,
    UploadedFiles,
    Body,
    UseInterceptors,
    BadRequestException,
    UseGuards,
    Req,
    UploadedFile,
    Param,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { AuthenticatedRequest } from "src/auth/interfaces/authenticated-request.interface";

@Controller("files")
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private readonly filesService: FilesService) {}
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

    @Post("upload-avatar")
    @UseInterceptors(FileInterceptor("avatar"))
    async uploadAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Req() req: AuthenticatedRequest
    ) {
        if (!file) {
            throw new BadRequestException("No file provided");
        }

        return await this.filesService.uploadAvatar(file, req.user.id);
    }

    @Post("upload-chat-avatar/:chatId")
    @UseInterceptors(FileInterceptor("avatar"))
    async uploadChatAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Param("chatId") chatId: string,
        @Req() req: AuthenticatedRequest
    ) {
        if (!file) {
            throw new BadRequestException("No file provided");
        }

        return await this.filesService.uploadChatAvatar(file, req.user.id, chatId);
    }
}
