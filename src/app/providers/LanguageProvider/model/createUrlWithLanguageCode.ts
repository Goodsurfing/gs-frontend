import { checkLocalizationContentPath } from "./checkLocalizationContentPath";
import { createUrlWithoutLanguageCode } from "./createUrlWithoutLanguageCode";

export const createUrlWithLanguageCode = (code: string, path: string) => {
  if (checkLocalizationContentPath(path)) {
    return `/${code}${path}`;
  }
  return `/${code}/${createUrlWithoutLanguageCode(path)}`;
};
