type TimeType = "week" | "day" | "month";

export function convertStringToWord(timeType: TimeType): string | null {
    switch (timeType) {
        case "month":
            return "В месяц";
        case "week":
            return "В неделю";
        case "day":
            return "В день";
        default:
            return null;
    }
}
