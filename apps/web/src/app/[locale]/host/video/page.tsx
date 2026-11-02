import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { HostVideo } from "@/components/cabinet/host/HostVideo";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostVideo(locale), "main.sidebar.Видеогалерея") : {};
}

/** Кабинет организатора: видеогалерея (HostVideoPage старого фронта) */
export default async function HostVideoPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, tv] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), getTranslator(locale, "volunteer")]);
    const g = (key: string) => tv(`volunteer-gallery.${key}`);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main className="max-w-[820px] down-lg:max-w-none">
                <h2 className="text-[1.625rem] leading-8 font-normal text-ink-secondary down-lg:text-center">{th("hostVideo.Видеогалерея организации")}</h2>
                <p className="my-10 text-[14px] leading-[18.2px] font-medium down-lg:text-center">{th("hostVideo.Добавьте ссылки на видеоролики с Youtube или Vimeo")}</p>
                <HostVideo
                    labels={{
                        link: g("Ссылка на видео"),
                        invalid: g("Введите корректный URL"),
                        add: g("Добавить видео"),
                        empty: g("Вы ещё не добавили ни одного видео"),
                        remove: t("Удалить"),
                        saved: th("hostVideo.Данные успешно изменены"),
                        error: th("hostDescription.Произошла ошибка"),
                        loadError: th("hostDescription.Произошла ошибка! Поробуйте перезагрузить страницу"),
                        unsupported: t("Неподдерживаемая ссылка на видео"),
                        video: th("Видео"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
