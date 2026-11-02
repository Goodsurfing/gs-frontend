import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { fundraiseMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, id } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.fundraiseWelcome(locale, id), "main.sidebar.Сборы") : {};
}

/**
 * Приветствие перед мастером сбора (FundraiseWelcomePage старого фронта):
 * сюда ведут «Добавить сбор» и «Редактировать» в списке сборов. Запросов нет —
 * «Начать» открывает первый шаг мастера (он пока в старом SPA).
 */
export default async function FundraiseWelcomePage({ params }: Props) {
    const { locale, id } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th] = await Promise.all([getTranslator(locale), getTranslator(locale, "host")]);
    const w = (key: string) => th(`hostFundraiseWelcome.${key}`);
    const text = "max-w-[780px] text-[14px] leading-[22px] text-ink-secondary down-lg:text-center";
    return (
        <CabinetShell locale={locale} items={fundraiseMenu(locale, t, id)} need="host">
            <main>
                <h1 className="text-[2em] font-bold text-black down-lg:text-center">{w("Привет!")}</h1>
                <p className={`mt-10 ${text}`}>{w("description")}</p>
                <p className={`mt-5 ${text}`}>{w("hint")}</p>
                <a
                    href={routes.fundraiseEdit(locale, id)}
                    className="mt-[60px] inline-block rounded-[10px] bg-primary px-[100px] py-3 text-center text-[1rem] leading-[1.375rem] text-white no-underline transition-all duration-300 ease-in-out hover:bg-primary-hover down-lg:w-full down-lg:p-3"
                >
                    {w("Начать")}
                </a>
            </main>
        </CabinetShell>
    );
}
