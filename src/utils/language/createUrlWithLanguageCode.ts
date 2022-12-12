import { getUrlWithoutLanguageCode } from "@/utils/language/getUrlWithoutLanguageCode";

export const createUrlWithLanguageCode = (code: string, path: string) => {
    return `/${code}/${getUrlWithoutLanguageCode(path)}`;
};
