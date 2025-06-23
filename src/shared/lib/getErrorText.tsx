export const getErrorText = (error: unknown): string => {
    if (error && typeof error === "object") {
        if (
            "data" in error
            && typeof error.data === "object"
            && error.data
        ) {
            const data = error.data as Record<string, unknown>;

            if ("detail" in data) {
                return String(data.detail);
            }
            if ("title" in data) {
                return String(data.title);
            }
        }
        if ("message" in error) {
            return String(error.message);
        }
    }

    return "Произошла неизвестная ошибка.";
};
