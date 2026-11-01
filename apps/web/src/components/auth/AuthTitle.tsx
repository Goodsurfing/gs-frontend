import type { ReactNode } from "react";

/** Заголовок страниц входа (SignTitle) */
export function AuthTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <h2 className={`text-center text-[2rem] font-bold text-ink-secondary down-xs:text-[1.5rem] ${className}`}>{children}</h2>;
}
