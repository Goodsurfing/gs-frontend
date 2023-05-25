export default function filterInputDate(currentValue: string, prevValue: string) {
  const date = new Date(currentValue);
  const formattedDate = date.toLocaleDateString("en-US");
  console.log(formattedDate);
  return currentValue;
}
