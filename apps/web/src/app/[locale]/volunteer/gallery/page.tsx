import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerGallery } from "@/components/cabinet/volunteer/VolunteerGallery";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { uploaderLabels } from "@/lib/cabinetLabels";
import { routes } from "@/lib/routes";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerGallery(locale), "main.sidebar.Фото и видео") : {};
}

/** Кабинет волонтёра: «Фото и видео» (VolunteerGalleryPage старого фронта) */
export default async function VolunteerGalleryPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv, tVideo] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer"), getTranslator(locale, "video")]);
    const g = (key: string) => tv(`volunteer-gallery.${key}`);
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full">
                <VolunteerGallery
                    labels={{
                        photos: g("Ваши фотографии"),
                        photosText: g("Добавьте несколько ваших фотографий, которые помогут больше о вас понять. Например, это фотографии где вы были, примеры как вы успешно справлялись с задачами или ваши встречи с другими гудсёрферами."),
                        videos: g("Видео о себе"),
                        videosText: g("Добавьте одно или несколько видео через URL (например, с YouTube, Vk, Vimeo). В видео расскажите о себе, о своих навыках и опыте и мотивации путешествовать со смыслом. Видео может быть несколько."),
                        certificates: g("Дипломы и сертификаты"),
                        certificatesText: g("Сюда вы можете добавить ваши дипломы и сертификаты, которые подтверждают ваш опыт и навыки."),
                        videoLink: g("Ссылка на видео"),
                        addVideo: g("Добавить видео"),
                        badUrl: g("Введите корректный URL"),
                        noVideos: g("Вы ещё не добавили ни одного видео"),
                        removeVideo: t("Удалить"),
                        videoTitle: g("Видео о себе"),
                        unsupported: tVideo("Видео не найдены"),
                        galleryUpdated: g("Галерея успешно обновлена"),
                        galleryError: g("Произошла ошибка с обновлением галереи"),
                        saved: g("Данные успешно изменены"),
                        certificateAdded: g("Диплом или сертификат были успешно добавлены"),
                        error: g("Произошла ошибка"),
                        uploader: uploaderLabels(t),
                        certificateUploader: uploaderLabels(t, "Добавить сертификат"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
