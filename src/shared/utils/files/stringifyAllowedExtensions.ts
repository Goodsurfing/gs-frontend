import { AllowedFilesExtensions } from 'constants/files';

export const stringifyAllowedExtensions = (array: AllowedFilesExtensions[]) => array.join(', ');
