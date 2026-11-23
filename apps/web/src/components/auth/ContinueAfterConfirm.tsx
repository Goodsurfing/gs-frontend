"use client";

import { useSession } from "@/components/session/SessionProvider";

/**
 * Кнопка на «Почта подтверждена». С 06.11.2026 ссылка из письма сразу входит
 * (gs-backend #551): вошедшему — дальше, к вакансии, откуда пришёл, или в каталог,
 * без повторного ввода пароля. Пока не знаем, вошёл ли (и на старом бэкенде) — «Войти».
 */
export function ContinueAfterConfirm({ signIn, back, catalogHref, labels, className }: {
    signIn: { href: string; label: string };
    /** Адрес, с которого пришли на регистрацию (вакансия), если есть */
    back: string | null;
    catalogHref: string;
    labels: { backToOffer: string; toCatalog: string };
    className: string;
}) {
    const session = useSession();
    if (session.status === "user") {
        return <a href={back ?? catalogHref} className={className}>{back ? labels.backToOffer : labels.toCatalog}</a>;
    }
    return <a href={signIn.href} className={className}>{signIn.label}</a>;
}
