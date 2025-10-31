import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient } from "@supabase/supabase-js";
import { Attachment } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

const STORAGE_BUCKETS = {
    PHOTOS: "chat-photos",
    VIDEOS: "chat-videos",
    DOCUMENTS: "chat-documents",
    VOICE: "chat-voice",
    AVATARS: "avatars",
} as const;

@Injectable()
export class FilesService {
    private supabase: ReturnType<typeof createClient>;

    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {
        const url = this.configService.get<string>("SUPABASE_URL");
        const key = this.configService.get<string>("SUPABASE_SERVICE_KEY");
        if (!url || !key) throw new Error("Supabase credentials not set");
        this.supabase = createClient(url, key);
    }

    private getBucketName(mimetype: string): string {
        if (!mimetype) return "chat-documents";
        if (mimetype.startsWith("image/")) return "chat-photos";
        if (mimetype.startsWith("video/")) return "chat-videos";
        if (mimetype.startsWith("audio/")) return "chat-voice";
        return "chat-documents";
    }

    async uploadFile(
        buffer: Buffer,
        originalName: string,
        mimetype: string,
        userId: string,
        messageId: string
    ): Promise<Attachment> {
        const bucket = this.getBucketName(mimetype);
        const ext = originalName.split(".").pop() || "";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filePath = `${userId}/${messageId}/${fileName}`;

        const { error } = await this.supabase.storage.from(bucket).upload(filePath, buffer, {
            contentType: mimetype,
        });

        if (error) throw new BadRequestException(`Upload failed: ${error.message}`);

        const { data: urlData } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

        const attachment = await this.prisma.attachment.create({
            data: {
                url: urlData.publicUrl,
                fileName: originalName,
                fileSize: buffer.length,
                mimetype,
                messageId,
            },
        });

        return attachment;
    }

    async uploadMultipleFiles(files: Express.Multer.File[], userId: string, messageId: string) {
        const attachments: Attachment[] = [];
        for (const file of files) {
            const attachment = await this.uploadFile(
                file.buffer,
                file.originalname,
                file.mimetype,
                userId,
                messageId
            );
            attachments.push(attachment);
        }
        return attachments;
    }

    async uploadAvatar(file: Express.Multer.File, userId: string) {
        if (!file) throw new BadRequestException("No file provided");

        const bucket = STORAGE_BUCKETS.AVATARS;
        const ext = file.originalname.split(".").pop() || "";
        const fileName = `${userId}-${Date.now()}.${ext}`;
        const filePath = `${userId}/${fileName}`;

        const { error } = await this.supabase.storage.from(bucket).upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });

        if (error) throw new BadRequestException(`Upload failed: ${error.message}`);

        const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

        await this.prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: data.publicUrl },
        });

        return { message: "Profile avatar successfully uploaded" };
    }

    async uploadChatAvatar(file: Express.Multer.File, userId: string, chatId: string) {
        if (!file) throw new BadRequestException("No file provided");

        const bucket = STORAGE_BUCKETS.AVATARS;
        const ext = file.originalname.split(".").pop() || "";
        const fileName = `${userId}-${Date.now()}.${ext}`;
        const filePath = `${userId}/${fileName}`;

        const { error } = await this.supabase.storage.from(bucket).upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
        });

        if (error) throw new BadRequestException(`Upload failed: ${error.message}`);

        const { data } = this.supabase.storage.from(bucket).getPublicUrl(filePath);

        await this.prisma.chat.update({
            where: { id: chatId },
            data: { avatar: data.publicUrl },
        });

        return { message: "Chat avatar successfully uploaded" };
    }
}
