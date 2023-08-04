import { RefObject } from "react";

import useEventListener from "@/shared/hooks/useEventListener";

type Handler = (event: MouseEvent) => void;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: Handler,
    mouseEvent: "mousedown" | "mouseup" = "mousedown",
): void {
    useEventListener(mouseEvent, (event) => {
        const element = ref?.current;

        if (!element || element.contains(event.target as Node)) {
            return;
        }

        handler(event);
    });
}
