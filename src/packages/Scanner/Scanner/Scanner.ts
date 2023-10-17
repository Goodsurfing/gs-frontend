import { IssuesDetectedType, ScannerImplementation } from "../types";

export class Scanner implements ScannerImplementation {
    private scanner: ScannerImplementation;

    constructor(scanner: ScannerImplementation) {
        this.scanner = scanner;
    }

    scan(file: File): Promise<IssuesDetectedType> {
        return this.scanner.scan(file);
    }
}
