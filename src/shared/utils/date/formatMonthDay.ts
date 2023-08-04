export function formatMonthDay(value: number) {
    const mounthsCount = Math.floor(value / 31);
    const daysCount = value % 31;

    let days = "";
    let mounths = "";

    if (daysCount !== 0) {
        if (daysCount === 1) {
            days = "день";
        } else if (daysCount <= 4 && daysCount >= 2) {
            days = "дня";
        } else if (daysCount >= 5 && daysCount <= 20) {
            days = "дней";
        } else if (daysCount === 21) {
            days = "день";
        } else if (daysCount > 21 && daysCount < 25) {
            days = "дня";
        } else days = "дней";
    }

    if (mounthsCount === 1) {
        mounths = "месяц";
    } else if (mounthsCount >= 2 && mounthsCount <= 4) {
        mounths = "месяца";
    } else mounths = "месяцев";

    if (daysCount < 31 && !mounthsCount) {
        return `${daysCount} ${days}`;
    }

    return `${mounthsCount} ${mounths}${daysCount ? "," : ""} ${
        daysCount === 0 ? "" : daysCount
    } ${days}`;
}
