import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    app.setGlobalPrefix("api");
    app.enableCors({
        origin: frontendUrl,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
    });

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        })
    );
    await app.listen(5000);
}

bootstrap();
