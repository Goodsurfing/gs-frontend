import i18n from "@/shared/config/i18n/i18n";

export const VACANCY_LIMIT_EXCEEDED_DETAIL = "Free account allows up to 1 published vacancy. Get a membership to publish without limits.";

const errorTranslationKeys: Record<string, string> = {
    "Free account allows up to 3 applications. Get a membership to apply without limits.": "errors.freeAccountApplicationsLimit",
    [VACANCY_LIMIT_EXCEEDED_DETAIL]: "errors.freeAccountPublishedVacancyLimit",
    "This vacancy only accepts applications from verified participants. Get a membership to apply.": "errors.onlyVerifiedVolunteersAllowed",
    "Creating fundraising campaigns requires an active membership.": "errors.fundraiseRequiresMembership",
    "Fill in the vacancy title, description and address before publishing.": "errors.vacancyIncomplete",
};

/** GS-172: отличить именно превышение лимита бесплатных вакансий от прочих
 * ошибок toggle-status, чтобы показать попап со ссылкой на /membership
 * вместо обычного текстового тоста. */
export const isVacancyLimitExceededError = (error: unknown): boolean => (
    Boolean(
        error
        && typeof error === "object"
        && "data" in error
        && typeof error.data === "object"
        && error.data
        && "detail" in error.data
        && error.data.detail === VACANCY_LIMIT_EXCEEDED_DETAIL,
    )
);

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
