import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ChatsModule } from "./chats/chats.module";
import { EmailModule } from "./email/email.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        ChatsModule,
        EmailModule,
        UserModule,
    ],
})
export class AppModule {}
