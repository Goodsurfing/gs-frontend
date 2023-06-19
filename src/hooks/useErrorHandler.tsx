import React, { useState } from 'react';

export function useErrorHandler<T = unknown>() {
  const [error, setError] = useState<T | null>(null);

  function handleError(error: T) {
    setError(error);
  }

  function resetError() {
    setError(null);
  }

  return [error, handleError, resetError] as const;
}
