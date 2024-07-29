import React, { useEffect, useRef } from "react";

type Callback = () => void;

const useTimeout = (
    callback: Callback,
    delay: number | null,
): React.MutableRefObject<number | null> => {
    const timeoutRef = useRef<number | null>(null);
    const savedCallback = useRef<Callback>(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            if (savedCallback.current) {
                savedCallback.current();
            }
        };

        if (typeof delay === "number") {
            timeoutRef.current = window.setTimeout(tick, delay);
            return () => {
                if (timeoutRef.current) {
                    window.clearTimeout(timeoutRef.current);
                }
            };
        }
    }, [delay]);

    return timeoutRef;
};

export default useTimeout;
