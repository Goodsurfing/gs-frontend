import { notFound, redirect } from "next/navigation";

import { isLocale } from "@/i18n/config";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

/**
 * Голый /fundraise в старом фронте — пустой каркас мастера без сбора: ссылки
 * меню без id вели на страницу ошибки, а сам адрес нигде не упоминается.
 * Здесь — сразу к списку сборов (гостя оттуда уведёт на вход).
 */
export default async function FundraiseRootPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    redirect(routes.hostDonations(locale));
}
