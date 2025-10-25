import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcryptjs";
import { UpdateUserDto } from "./dto/update-user.dto";

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

    async findByPhone(phone: string) {
        return this.prisma.user.findUnique({
            where: { phone },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findUniqueUsername(username: string) {
        const existingUsername = await this.findByUsername(username);
        if (existingUsername) {
            throw new ConflictException(`Username "${username}" already taken`);
        }
        return { message: `${username} available` };
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
                    avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${userData.firstName || userData.username}&backgroundType=gradientLinear&backgroundColor=3B82F6,60A5FA,93C5FD,8B5CF6,A78BFA,C4B5FD&fontSize=50&scale=75`,
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

    async editUserInfo(userId: string, updateUserDto: UpdateUserDto) {
        const user = await this.findById(userId);
        if (!user) throw new NotFoundException("User not found");

        if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
            const userPhone = await this.findByPhone(updateUserDto.phone);
            if (userPhone)
                throw new ConflictException(`Phone "${updateUserDto.phone}" is already taken`);
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const userEmail = await this.findByEmail(updateUserDto.email);
            if (userEmail)
                throw new ConflictException(`Email "${updateUserDto.email}" is already taken`);
        }

        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUsername = await this.findByUsername(updateUserDto.username);
            if (existingUsername)
                throw new ConflictException(
                    `Username "${updateUserDto.username}" is already taken`
                );
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { ...updateUserDto },
        });

        return { message: "User data updated successfully", data: updatedUser };
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
                verificationTokenExpires: null,
            },
        });
    }
}
