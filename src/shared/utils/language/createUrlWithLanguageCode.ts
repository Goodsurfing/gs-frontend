import { getUrlWithoutLanguageCode } from "@/shared/utils/language/getUrlWithoutLanguageCode";

import { checkingOfTheLocalizationContentPath } from "./checkingOfTheLocalizationContentPath";

export const createUrlWithLanguageCode = (code: string, path: string) => {
    if (checkingOfTheLocalizationContentPath(path)) {
        return `/${code}${path}`;
    }
    return `/${code}/${getUrlWithoutLanguageCode(path)}`;
};
