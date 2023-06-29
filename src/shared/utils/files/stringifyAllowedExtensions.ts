import { AllowedFilesExtensions } from "@/shared/constants/files";

export const stringifyAllowedExtensions = (array: AllowedFilesExtensions[]) => array.join(", ");
