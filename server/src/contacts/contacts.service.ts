import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateContactDto } from "./dto/create-contact.dto";

@Injectable()
export class ContactsService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllContacts(userId: string) {
        return await this.prisma.contact.findMany({
            where: {
                userId: userId,
            },
            include: {
                contact: true,
            },
        });
    }

    async addContact(userId: string, createContactDto: CreateContactDto) {
        return await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: {
                    username: createContactDto.username,
                },
            });

            if (!user) throw new NotFoundException("User with this username do not use LINQ yet");

            if (user.id === userId)
                throw new BadRequestException("You cannot add yourself to contacts");

            const contact = await tx.contact.findUnique({
                where: {
                    userId_contactId: {
                        userId,
                        contactId: user.id,
                    },
                },
            });

            if (contact) throw new ConflictException("This user already exist in your contacts");

            const newContact = await tx.contact.create({
                data: {
                    userId,
                    contactId: user.id,
                    nickname: createContactDto.nickname,
                },
            });

            return {
                message: `User @${user.username} successfully added to you contacts`,
                data: newContact,
            };
        });
    }

    async deleteContact(userId: string, contactId: string) {
        const contact = await this.prisma.contact.findUnique({
            where: {
                userId_contactId: {
                    userId,
                    contactId,
                },
            },
        });

        if (!contact) {
            throw new ConflictException("This user does not exist in your contacts");
        }

        return this.prisma.contact.delete({
            where: {
                userId_contactId: {
                    userId,
                    contactId,
                },
            },
        });
    }
}
