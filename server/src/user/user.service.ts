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
                throw new ConflictException("This email already exists");
            }

            const hashedPassword = await bcrypt.hash(userData.password, 10);

            return this.prisma.user.create({
                data: {
                    email: userData.email,
                    username: userData.username,
                    avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${userData.firstName || userData.username}&backgroundType=gradientLinear&backgroundColor=7C3AED,4F46E5,9333EA,8B5CF6,C026D3,FB7185&fontSize=50&scale=75
`,
                    phone: userData.phone?.trim() === "" ? null : userData.phone?.trim(),
                    firstName: userData.firstName,
                    lastName: userData.lastName?.trim() === "" ? null : userData.lastName?.trim(),
                    password: hashedPassword,
                    isVerified: false,
                },
            });
        } catch (error) {
            console.error(error);
            throw new BadRequestException("Error with creating new user");
        }
    }

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
