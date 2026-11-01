import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { VolunteerSkillsForm } from "@/components/cabinet/volunteer/VolunteerSkillsForm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { LANGUAGES, LEVELS } from "@/lib/offerText";
import { routes } from "@/lib/routes";
import { volunteerMenu } from "@/lib/volunteerMenu";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.volunteerSkills(locale), "main.sidebar.Навыки") : {};
}

/** Кабинет волонтёра: «Навыки и умения» (VolunteerSkillsPage старого фронта) */
export default async function VolunteerSkillsPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tv, tOffer] = await Promise.all([getTranslator(locale), getTranslator(locale, "volunteer"), getTranslator(locale, "offer")]);
    const s = (key: string) => tv(`volunteer-skills.${key}`);
    // Без «не важен»: волонтёр указывает конкретный язык и уровень (useAllLangs().slice(1) старого фронта)
    const options = (map: Record<string, string>) => Object.entries(map)
        .filter(([value]) => value !== "not_matter")
        .map(([value, key]) => ({ value, label: tOffer(`whoNeeds.${key}`) }));
    return (
        <CabinetShell locale={locale} items={volunteerMenu(locale, t)} need="volunteer">
            <main className="w-full">
                <h2 className="text-[1.625rem] leading-8 font-normal">{s("Навыки и умения")}</h2>
                <VolunteerSkillsForm
                    locale={locale}
                    languages={options(LANGUAGES)}
                    levels={options(LEVELS)}
                    labels={{
                        languages: s("Знание языков"),
                        level: s("Уровень владения"),
                        addLanguage: s("Добавить язык"),
                        removeLanguage: t("Удалить"),
                        skills: s("Навыки которыми вы обладаете"),
                        addSkill: s("Добавить навык"),
                        editSkill: s("Навыки которыми вы обладаете"),
                        removeSkill: t("Удалить"),
                        extraInfo: s("Дополнительная информация"),
                        extraInfoHint: s("Не более 1000 знаков"),
                        save: s("Сохранить"),
                        noChanges: s("Нет изменений для сохранения"),
                        saved: s("Данные успешно изменены"),
                        error: tv("volunteer-gallery.Произошла ошибка"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
