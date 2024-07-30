interface DataError {
    title: string;
    detail: string;
}

export interface ErrorType {
    status: number;
    data: DataError
}
