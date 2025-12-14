type TextSlice = "title" | "description" | "address" | "none";

export const textSlice = (
    text: string | undefined | null,
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
            case "none":
                return "";
            default:
                return "";
        }
    }
    return text.length > length ? `${text.slice(0, length - 1)}..` : text;
};

export const truncateString = (str: string, length: number) => (str.length > length ? `${str.substring(0, length)}...` : str);
