import React, { useEffect, ReactNode, FC } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";

interface PortalProps {
    children: ReactNode;
    elementId: string;
    className?: string;
}

export const Portal: FC<PortalProps> = ({ children, elementId, className }) => {
    const mount = document.getElementById(elementId);
    const el = document.createElement("div");

    useEffect(() => {
        if (mount) mount.appendChild(el);
        return () => {
            if (mount) mount.removeChild(el);
        };
    }, [el, mount]);

    if (!mount) return null;
    return createPortal(<div className={cn(className)}>{children}</div>, el);
};
