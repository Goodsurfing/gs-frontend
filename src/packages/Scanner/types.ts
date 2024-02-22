export type IssuesDetectedType = boolean;

type ScanFileMethodType = (file: File) => Promise<IssuesDetectedType>;

export interface ScannerImplementation {
    scan: ScanFileMethodType;
}
