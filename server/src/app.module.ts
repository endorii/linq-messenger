import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { EmailModule } from "./email/email.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { ChatsModule } from './chats/chats.module';
import { FoldersModule } from './folders/folders.module';
import { MessagesModule } from './messages/messages.module';
import { ContactsModule } from './contacts/contacts.module';
import { SearchModule } from './search/search.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule,
        EmailModule,
        UserModule,
        ChatsModule,
        FoldersModule,
        MessagesModule,
        ContactsModule,
        SearchModule,
    ],
})
export class AppModule {}
