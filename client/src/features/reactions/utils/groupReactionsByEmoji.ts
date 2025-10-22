import { IMessageReaction, IUser } from "@/shared/interfaces";

interface GroupedReaction {
    emoji: string;
    users: IUser[];
}

export function groupReactionsByEmoji(reactions: IMessageReaction[]): GroupedReaction[] {
    const grouped = reactions.reduce<GroupedReaction[]>((acc, r) => {
        const existing = acc.find((x) => x.emoji === r.emoji);
        if (existing) {
            existing.users.push(r.user);
        } else {
            acc.push({ emoji: r.emoji, users: [r.user] });
        }
        return acc;
    }, []);

    return grouped;
}
