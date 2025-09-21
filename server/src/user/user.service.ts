import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async createUser(userData: CreateUserDto) {
        try {
            const existingUsername = await this.findByUsername(userData.username);
            if (existingUsername) {
                throw new ConflictException(`Username "${userData.username}" already taken`);
            }

            const existingEmail = await this.findByEmail(userData.email);
            if (existingEmail) {
                throw new ConflictException("This email already exist");
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            return this.prisma.user.create({
                data: {
                    email: userData.email,
                    username: userData.username,
                    phone: userData.phone,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    password: hashedPassword,
                    isVerified: false,
                },
            });
        } catch (error) {
            console.error(error);
            throw new BadRequestException("Error with creating new user");
        }
    }

    // async updateUser(id: string, updateData: UpdateUserDto) {
    //     return this.prisma.user.update({
    //         where: { id },
    //         data: updateData,
    //     });
    // }

    async updateVerificationData(id: string, verificationToken: string, tokenExpiry: Date) {
        return this.prisma.user.update({
            where: { id },
            data: {
                verificationToken,
                verificationTokenExpires: tokenExpiry,
            },
        });
    }

    async findByVerificationToken(token: string) {
        return this.prisma.user.findFirst({
            where: { verificationToken: token },
        });
    }

    async verifyUser(id: string) {
        return this.prisma.user.update({
            where: { id },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });
    }
}
