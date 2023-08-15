import { useState } from "react";

export function useErrorHandler<T = unknown>() {
    const [error, setError] = useState<T | null>(null);

    function handleError(errorMessage: T) {
        setError(errorMessage);
    }

    function resetError() {
        setError(null);
    }

    return [error, handleError, resetError] as const;
}
