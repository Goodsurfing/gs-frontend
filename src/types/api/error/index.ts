interface DataError {
    title: string;
    detail: string;
}

export interface ErrorMessage {
    code: number;
    message: string;
}

export interface Error {
    status: number;
    data: DataError
}

export type ErrorType = Error | ErrorMessage;
