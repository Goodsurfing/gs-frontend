type TimeType = "week" | "day" | "mounth";

export function convertStringToWord(timeType: TimeType): string | null {
    switch (timeType) {
        case "mounth":
            return "В месяц";
        case "week":
            return "В неделю";
        case "day":
            return "В день";
        default:
            return null;
    }
}
