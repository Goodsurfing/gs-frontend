import { Navigate, useParams } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";

interface LegacyIdRedirectProps {
    to: (locale: string, id: string) => string;
}

/**
 * Роуты вида /offer-personal/:id переехали на вложенные пути (/offers/:id).
 * Компонент держит старый путь рабочим (уже расшаренные ссылки не должны
 * ломаться), просто 301-подобно перенаправляя на новый.
 */
export const LegacyIdRedirect = ({ to }: LegacyIdRedirectProps) => {
    const { locale } = useLocale();
    const { id } = useParams<{ id: string }>();

    return <Navigate to={to(locale, id ?? "")} replace />;
};
