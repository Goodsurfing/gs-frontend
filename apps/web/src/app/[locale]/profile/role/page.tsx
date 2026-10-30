import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { RoleCards } from "@/components/cabinet/profile/ProfileSettings";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profileRole(locale), "main.sidebar.Роль") : {};
}

/** Кабинет: «Роль» — гудсёрфер или организатор (ProfileRolePage старого фронта, GS-219) */
export default async function ProfileRolePage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tp] = await Promise.all([getTranslator(locale), getTranslator(locale, "profile")]);
    const r = (key: string) => tp(`role.${key}`);
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="max-w-[1500px]">
                <h2 className="mb-[30px] text-[1.625rem] font-normal down-lg:text-center">{r("Заполните аккаунт гудсёрфера или организатора")}</h2>
                <p className="text-[16px] down-lg:text-center">{r("В новой версии Гудсёрфинга вы можете быть одновременно и гудсёрфером-путешественником и организатором, который выступает принимающей стороной.")}</p>
                <br />
                <p className="text-[16px] down-lg:text-center">{r("Для каждой роли есть отдельный рабочий стол, в котором отражается вся необходимая информация. Выберите роль, перейдите на рабочий стол и заполните профиль гудсёрфера или профиль организации.")}</p>
                <RoleCards
                    hrefs={{
                        volunteerDashboard: routes.volunteerDashboard(locale),
                        hostDashboard: routes.hostDashboard(locale),
                        hostRegister: routes.hostRegister(locale),
                        offer: routes.offer(locale, "{id}"),
                        fundraise: routes.fundraise(locale, "{id}"),
                    }}
                    labels={{
                        volunteer: { title: r("Гудсёрфер"), text: r("Чтобы путешествовать как гудсёрфер"), become: r("Стать гудсёрфером"), already: r("Вы уже стали гудсёрфером"), confirm: r("Вы уверены что хотите стать волонтёром? Вам станет доступен дашборд волонтёра") },
                        host: { title: r("Организатор"), text: r("Чтобы принимать гудсёрферов как организатор"), become: r("Стать организатором"), already: r("Вы уже стали организатором"), confirm: r("Вы уверены что хотите стать организатором мероприятий? Для этого вы должны заполнить информацию о организации") },
                        yes: t("Ок"),
                        no: t("Отмена"),
                        becameVolunteer: r("Вы успешно стали волонтёром"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
