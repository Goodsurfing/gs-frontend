import { createUrlWithoutLanguageCode } from "./createUrlWithoutLanguageCode";

import { checkLocalizationContentPath } from "./checkLocalizationContentPath";

export const createUrlWithLanguageCode = (code: string, path: string) => {
  if (checkLocalizationContentPath(path)) {
    return `/${code}${path}`;
  }
  return `/${code}/${createUrlWithoutLanguageCode(path)}`;
};
