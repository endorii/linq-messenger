import { httpService } from "@/shared/api/httpService";
import { IPrivacySettings } from "@/shared/interfaces/IPrivacySettings";

export async function fetchUserPrivacy() {
    const { data } = await httpService.get("/privacy");
    return data;
}
export async function fetchUpdatePrivacy(privacyData: Partial<IPrivacySettings>) {
    const { data } = await httpService.patch(`/privacy`, privacyData);
    return data;
}
