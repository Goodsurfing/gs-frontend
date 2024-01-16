export function getVacancyText(num: number): string {
    let text = "вакансий";
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastDigit === 1 && lastTwoDigits !== 11) {
        text = "вакансия";
    } else if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits >= 20)) {
        text = "вакансии";
    }

    return `${text}`;
}
