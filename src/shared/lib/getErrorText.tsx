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
            // Validation errors: { errors: ["msg1", "msg2", ...] }
            if ("errors" in data && Array.isArray(data.errors) && data.errors.length > 0) {
                return data.errors.join(". ");
            }
            // { error: "msg" }
            if ("error" in data) {
                return String(data.error);
            }
            // JWT 401 errors return { code, message } without detail/title
            if ("message" in data) {
                return String(data.message);
            }
        }
        if ("message" in error) {
            return String(error.message);
        }
    }

    return "Произошла неизвестная ошибка.";
};
