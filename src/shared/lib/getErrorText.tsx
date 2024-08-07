import { ErrorType } from "@/types/api/error";

export const getErrorText = (error: ErrorType): string => {
    if ("data" in error && "detail" in error.data) {
        // Это ошибка типа Error
        return error.data.detail;
    } if ("message" in error) {
        // Это ошибка типа ErrorMessage
        return error.message;
    }
    // Неизвестный формат ошибки
    return "An unknown error occurred.";
};
