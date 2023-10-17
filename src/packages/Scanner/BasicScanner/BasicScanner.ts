import { ScannerImplementation } from "../types";

const VALID_IMAGE_REGEXP = /\.(jpe?g|png|webp)$/i;

export class BasicScanner implements ScannerImplementation {
    // eslint-disable-next-line class-methods-use-this
    scan(file: File) {
        const convertedFile = file.name.split(".").pop();
        let isValid = false;
        if (convertedFile) {
            isValid = VALID_IMAGE_REGEXP.test(convertedFile);
        }
        return Promise.resolve(isValid);
    }
}
