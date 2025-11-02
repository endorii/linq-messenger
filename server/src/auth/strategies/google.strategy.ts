import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor(configService: ConfigService) {
        const clientID = configService.get<string>("GOOGLE_CLIENT_ID");
        const clientSecret = configService.get<string>("GOOGLE_CLIENT_SECRET");
        const callbackURL = configService.get<string>("GOOGLE_CALLBACK_URL");

        if (!clientID || !clientSecret || !callbackURL) {
            throw new InternalServerErrorException(
                "Google OAuth credentials are not configured properly"
            );
        }

        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: ["email", "profile"],
        });
    }

    validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
        try {
            const { name, emails, photos, id } = profile;

            if (!emails || emails.length === 0) {
                throw new BadRequestException("Email not provided by Google");
            }

            if (!name?.givenName) {
                throw new BadRequestException("First name not provided by Google");
            }

            const user = {
                googleId: id,
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                avatarUrl: photos?.[0]?.value,
            };

            done(null, user);
        } catch (error) {
            done(error as Error, false);
        }
    }
}
