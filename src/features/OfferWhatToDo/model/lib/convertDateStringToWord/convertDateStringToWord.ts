type TimeType = "week" | "day";

export function convertStringToWord(timeType: TimeType): string | null {
    switch (timeType) {
        case "week":
            return "В неделю";
        case "day":
            return "В день";
        default:
            return null;
    }
}
