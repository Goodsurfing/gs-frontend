import React, { useState } from "react";

export const useErrorHandler = () => {
    const [error, setError] = useState<string | null>();

    function handleError(error: string) {
        setError(error);
    }

    function resetError() {
        setError(null);
    }

    return [error, handleError, resetError];
};
