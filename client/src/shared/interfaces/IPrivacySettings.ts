import { PrivacyLevel } from "../types/types";

export interface IPrivacySettings {
    id: string;
    userId: string;
    phoneVisibility: PrivacyLevel;
    lastSeen: PrivacyLevel;
    bio: PrivacyLevel;
    dateOfBirth: PrivacyLevel;
    calls: PrivacyLevel;
    voiceMessagesAndVideo: PrivacyLevel;
    messages: PrivacyLevel;
    addMe: PrivacyLevel;
}
