type TextSlice = "title" | "description" | "address";

export const textSlice = (
    text: string | undefined,
    length: number,
    textType: TextSlice,
): string => {
    if (!text || text === "") {
        switch (textType) {
            case "title":
                return "Без заголовка";
            case "description":
                return "Без описания";
            case "address":
                return "Без адреса";
            default:
                return "";
        }
    }
    return text.length > length ? `${text.slice(0, length - 1)}..` : text;
};
