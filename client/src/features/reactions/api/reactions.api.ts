import { httpService } from "@/shared/api/httpService";
import { ReactionPayload } from "@/shared/interfaces/IMessage";

export async function fetchToggleReaction(reactionPayload: ReactionPayload) {
    const { data } = await httpService.post("/reactions", reactionPayload);
    return data;
}
