import { PrivacyLevel } from "../types/types";

export interface IPrivacySettings {
    id: string;
    userId: string;
    phoneVisibility: PrivacyLevel;
    lastSeenVisibility: PrivacyLevel;
    bioVisibility: PrivacyLevel;
    voiceMessagesAndVideo: PrivacyLevel;
    messages: PrivacyLevel;
    addMe: PrivacyLevel;
    usernameVisibility: PrivacyLevel;
}
