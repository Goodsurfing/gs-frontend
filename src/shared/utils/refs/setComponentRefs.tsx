import { ForwardedRef, MutableRefObject } from "react";

export const setComponentRefs = <T extends unknown>(
    ref: MutableRefObject<T | null>,
    forwardedRef: ForwardedRef<T>,
) => (el: T) => {
    ref.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) forwardedRef.current = el;
};
