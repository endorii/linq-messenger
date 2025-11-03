import { ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";

export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        secret: config.get("ACCESS_TOKEN_SECRET"),
        signOptions: {
            expiresIn: config.get("ACCESS_TOKEN_EXPIRES") || "15m",
        },
    }),
});
