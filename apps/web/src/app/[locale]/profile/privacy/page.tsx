import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { PrivacySettings } from "@/components/cabinet/profile/ProfileSettings";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profilePrivacy(locale), "main.sidebar.Приватность") : {};
}

/** Кабинет: «Приватность» (ProfilePrivacyPage старого фронта, GS-219) */
export default async function ProfilePrivacyPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tp] = await Promise.all([getTranslator(locale), getTranslator(locale, "profile")]);
    const p = (key: string) => tp(`privacy.${key}`);
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="w-full">
                <h2 className="text-[1.625rem] font-normal">{p("Выберете настройки приватности")}</h2>
                <PrivacySettings
                    mainHref={routes.main(locale)}
                    labels={{
                        hide: p("Деактивировать и скрыть мой аккаунт"),
                        hideText: p("Деактивировав аккаунт вы делаете его недоступным для остальных"),
                        newsletter: p("Получать рассылку от Гудсёрфинга с новостями и обновлениями"),
                        newsletterText: p("Отказавшись от рассылки вы можете пропустить важные новости проекта, а также уникальные возможности"),
                        newsletterWording: p("Получать рассылку от Гудсёрфинга с новостями и обновлениями"),
                        delete: p("Удалить аккаунт"),
                        deleteText: p("Нажимая эту кнопку вы удаляете ваш аккаунт со всей заполненной вами информацией"),
                        deleteConfirm: p("Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить."),
                        yes: p("Удалить"),
                        no: p("Отмена"),
                        deleteError: p("Ошибка при удалении профиля"),
                        hideError: p("Ошибка при изменении статуса активности профиля"),
                        blocked: p("Ваш аккаунт был заблокирован администратором. Обратитесь в службу поддержки"),
                        newsletterError: p("Не удалось сохранить настройку рассылки"),
                    }}
                />
            </main>
        </CabinetShell>
    );
}
