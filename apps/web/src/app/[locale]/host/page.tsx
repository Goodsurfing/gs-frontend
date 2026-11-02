import { notFound, permanentRedirect } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

/** /host без продолжения — на главную страницу раздела (в старом SPA здесь был пустой каркас кабинета) */
export default async function SectionRoot({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    permanentRedirect(routes.hostDashboard(locale));
}
