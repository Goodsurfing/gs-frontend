export const getErrorText = (error: unknown): string => {
    if (error && typeof error === "object") {
        if ("data" in error && typeof error.data === "object" && error.data && "detail" in error.data) {
            return String(error.data.detail);
        }
        if ("message" in error) {
            return String(error.message);
        }
    }
    return "Произошла неизвестная ошибка.";
};
