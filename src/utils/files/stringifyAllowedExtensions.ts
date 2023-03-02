import { AllowedFilesExtensions } from "@/constants/files";

export const stringifyAllowedExtensions = (array: AllowedFilesExtensions[]) => {
    return array.join(", ");
};
