import dayjs from "dayjs";

export function formatSidebarLastMessageDateInChat(date: string | Date) {
    if (typeof date === "string" && date.trim() === "") {
        return "";
    }

    const msgDate = dayjs(date);
    const now = dayjs();

    const diffDays = now.diff(msgDate, "day");
    const diffWeeks = now.diff(msgDate, "week");
    const diffYears = now.diff(msgDate, "year");

    if (msgDate.isSame(now, "day")) {
        return msgDate.format("HH:mm");
    }

    if (msgDate.isSame(now.subtract(1, "day"), "day")) {
        return "Yesterday";
    }

    if (diffDays < 7) {
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }

    if (diffWeeks < 52) {
        return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    }

    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}
