export default function filterInputDate(currentValue: string) {
    const date = new Date(currentValue);
    const formattedDate = date.toLocaleDateString("en-US");
    return formattedDate;
}
