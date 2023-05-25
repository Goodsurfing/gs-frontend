export const checkLocalizationContentPath = (path: string): boolean => {
  const substring = path.substring(0, 3);
  if (substring !== "en" && substring !== "ru" && substring !== "es") {
    return true;
  }

  return false;
};
