export const checkingOfTheLocalizationContentPath = (path: string): boolean => {
    const substring = path.substring(0, 4);
    if (substring !== "/en/" && substring !== "/ru/" && substring !== "/es/") {
        return true;
    }

    return false;
};
