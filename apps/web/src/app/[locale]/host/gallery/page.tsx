import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { GALLERY_LIMIT, HostGallery } from "@/components/cabinet/host/HostGallery";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { hostMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.hostGallery(locale), "main.sidebar.Фотогалерея") : {};
}

/** Кабинет организатора: фотогалерея (HostGalleryPage старого фронта) */
export default async function HostGalleryPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, th, tv] = await Promise.all([getTranslator(locale), getTranslator(locale, "host"), getTranslator(locale, "volunteer")]);
    return (
        <CabinetShell locale={locale} items={hostMenu(locale, t)} need="host" fitContent>
            <main>
                <div className="flex max-w-[880px] flex-col gap-10 down-lg:text-center">
                    <h2 className="text-[1.625rem] font-normal">{th("hostGallery.Фотогалерея организации")}</h2>
                    <p className="text-[14px]">{th("hostGallery.Добавьте сюда не менее 6 фотографий")}</p>
                </div>
                <HostGallery
                    labels={{
                        add: t("Добавить фото"),
                        drop: t("Отпусти файлы здесь"),
                        remove: t("Удалить"),
                        tooMany: t("Нельзя загрузить больше 10 файлов", { count: GALLERY_LIMIT }),
                        tooBig: t("Файл больше 5MB"),
                        saved: tv("volunteer-gallery.Галерея успешно обновлена"),
                        error: tv("volunteer-gallery.Произошла ошибка с обновлением галереи"),
                        loadError: th("hostDescription.Произошла ошибка! Поробуйте перезагрузить страницу"),
                        gallery: { close: t("Закрыть"), prev: t("slider.previous"), next: t("slider.next"), photo: t("gallery.photo") },
                    }}
                />
            </main>
        </CabinetShell>
    );
}
