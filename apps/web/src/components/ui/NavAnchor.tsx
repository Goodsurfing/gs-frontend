"use client";

import { usePathname } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from "react";

import { isSamePage } from "@/lib/currentPage";

type NavAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Ссылка меню. На своей же странице — не ссылка на себя, а отметка «вы здесь»:
 * `<span aria-current="page">`; вид задают классы `aria-[current=page]:…`.
 */
export const NavAnchor = forwardRef<HTMLAnchorElement, NavAnchorProps>(function NavAnchor(
    { href, target, rel, children, ...rest },
    ref,
) {
    const pathname = usePathname();

    if (pathname && isSamePage(pathname, href)) {
        return (
            <span
                ref={ref as React.Ref<HTMLSpanElement>}
                aria-current="page"
                {...(rest as HTMLAttributes<HTMLSpanElement>)}
            >
                {children}
            </span>
        );
    }

    return (
        <a ref={ref} href={href} target={target} rel={rel} {...rest}>
            {children}
        </a>
    );
});
