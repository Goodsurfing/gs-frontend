import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { PreferencesForm } from "@/components/cabinet/profile/ProfileSettings";
import { isLocale, type Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { serverApi } from "@/lib/api";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profilePreferences(locale), "main.sidebar.Предпочтения") : {};
}

async function getCategories(locale: Locale) {
    try {
        const { data } = await serverApi(locale).GET("/api/v1/category", { params: { query: { lang: locale } }, signal: AbortSignal.timeout(5000) });
        return (data ?? []).map((category) => ({ id: category.id, name: category.name ?? "", image: (category as { imagePath?: string }).imagePath }));
    } catch {
        return [];
    }
}

/** Кабинет: «Предпочтения» (ProfilePreferencesPage старого фронта, GS-219) */
export default async function ProfilePreferencesPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tp, categories] = await Promise.all([getTranslator(locale), getTranslator(locale, "profile"), getCategories(locale)]);
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="w-full">
                <h2 className="text-[1.625rem] font-normal down-lg:text-center">{tp("preferences.Куда бы вы хотели поехать")}</h2>
                <PreferencesForm
                    categories={categories}
                    labels={{
                        title: tp("preferences.Какой тип путешествий вы предпочитаете"),
                        save: tp("preferences.Сохранить"),
                        saved: tp("preferences.Данные успешно изменены"),
                        error: tp("password.Произошла ошибка"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
