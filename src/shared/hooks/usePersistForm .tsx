import { useEffect } from "react";

interface UsePersistFormProps<T> {
    value: T;
    localStorageKey: string;
    enabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const usePersistForm = <T,>({
    value,
    localStorageKey,
    enabled = true,
}: UsePersistFormProps<T>): void => {
    useEffect(() => {
        if (!enabled) return;
        localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [value, localStorageKey, enabled]);
};
