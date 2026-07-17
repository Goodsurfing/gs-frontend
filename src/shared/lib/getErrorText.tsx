import i18n from "@/shared/config/i18n/i18n";

const errorTranslationKeys: Record<string, string> = {
    "Free account allows up to 3 applications. Get a membership to apply without limits.": "errors.freeAccountApplicationsLimit",
    "Free account allows up to 1 published vacancy. Get a membership to publish without limits.": "errors.freeAccountPublishedVacancyLimit",
    "This vacancy only accepts applications from verified participants. Get a membership to apply.": "errors.onlyVerifiedVolunteersAllowed",
};

const getTranslatedErrorText = (message: string): string => {
    const translationKey = errorTranslationKeys[message];

    if (!translationKey) {
        return message;
    }

    return i18n.t(translationKey, { defaultValue: message });
};

export const getErrorText = (error: unknown): string => {
    if (error && typeof error === "object") {
        if (
            "data" in error
            && typeof error.data === "object"
            && error.data
        ) {
            const data = error.data as Record<string, unknown>;

            if ("detail" in data) {
                return getTranslatedErrorText(String(data.detail));
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
                return getTranslatedErrorText(String(data.error));
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
