/* eslint-disable no-console */
import { useEffect, useRef } from "react";

export const useWhyDidYouUpdate = <T extends Record<string, any>>(name: string, props: T): void => {
    const previous = useRef<T>();

    useEffect(() => {
        if (previous.current) {
            const allKeys = Object.keys({ ...previous.current, ...props });
            const changedProps: Record<string, { from: any; to: any }> = {};

            allKeys.forEach((key) => {
                if (previous.current![key] !== props[key]) {
                    changedProps[key] = {
                        from: previous.current![key],
                        to: props[key],
                    };
                }
            });

            if (Object.keys(changedProps).length) {
                console.warn("[why-did-you-update]", name, changedProps);
            }
        }

        previous.current = props;
    });
};

// eslint-disable-next-line @typescript-eslint/comma-dangle
export const useValueTracker = <T,>(name: string, value: T): void => {
    const prevValueRef = useRef<T>();

    useEffect(() => {
        if (prevValueRef.current !== value) {
            console.log(`${name} изменился:`, {
                от: prevValueRef.current,
                к: value,
                тип: typeof value,
            });
        }
        prevValueRef.current = value;
    }, [name, value]);
};
