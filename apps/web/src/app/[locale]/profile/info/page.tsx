import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { MembershipBanner } from "@/components/cabinet/profile/MembershipBanner";
import { ProfileInfoForm } from "@/components/cabinet/profile/ProfileInfoForm";
import { isLocale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { authMetadata } from "@/lib/authPages";
import { profileMenu } from "@/lib/cabinetMenus";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return isLocale(locale) ? authMetadata(locale, routes.profileInfo(locale), "main.sidebar.Обо мне") : {};
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Кабинет: «Обо мне» (ProfileInfoPage старого фронта, GS-219) */
export default async function ProfileInfoPage({ params }: Props) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const [t, tp] = await Promise.all([getTranslator(locale), getTranslator(locale, "profile")]);
    const i = (key: string) => tp(`info.${key}`);
    return (
        <CabinetShell locale={locale} items={profileMenu(locale, t)}>
            <main className="w-full">
                <div className="mb-[30px]"><h2 className="text-[1.625rem] font-normal">{i("Основная информация")}</h2></div>
                <ProfileInfoForm
                    volunteerHref={routes.volunteerPublicTemplate(locale)}
                    preferencesHref={routes.profilePreferences(locale)}
                    verifyHref={routes.verifyEmail(locale)}
                    aside={(
                        <MembershipBanner
                            locale={locale}
                            membershipHref={routes.membership(locale)}
                            labels={{
                                activeUntil: i("Членство активно до {{date}}"),
                                renew: i("Продлить членство"),
                                clubUntil: i("Международный клуб — активно до {{date}}"),
                                renewClub: i("Продлить участие"),
                                volunteers: i("Волонтёрам"),
                                volunteersText: tp("info.Получи возможность оставлять неограниченное количество откликов и путешествовать без лимитов — {{price}} руб/год", { price: 990 }),
                                hosts: i("Организаторам"),
                                hostsText: tp("info.Создавай неограниченное количество вакансий и получи больше возможностей для своего проекта — {{price}} руб/год", { price: 4990 }),
                                get: i("Оформить членство"),
                            }}
                        />
                    )}
                    labels={{
                        firstName: i("Имя"),
                        lastName: i("Фамилия"),
                        birthDate: i("День рождения"),
                        months: MONTHS.map((month) => i(month)),
                        gender: i("Пол"),
                        genders: { male: i("Мужчина"), female: i("Женщина"), other: i("Другой") },
                        country: i("Страна"),
                        city: i("Город"),
                        language: i("Язык интерфейса"),
                        phone: i("Телефон"),
                        aboutMe: i("Расскажите о себе"),
                        aboutHint: i("Не более 1000 знаков"),
                        save: i("Сохранить"),
                        edit: i("Редактировать"),
                        cancel: i("Отмена"),
                        next: i("Дальше"),
                        saved: i("Данные успешно изменены"),
                        viewProfile: i("Посмотреть профиль"),
                        maxSize: tp("info.Максимальный_размер", { size: 5 }),
                        deleteImage: tp("Удалить изображение"),
                        uploadError: tp("Произошла ошибка при загрузке изображения"),
                        verifyText: i("Вам нужно подтвердить вашу электронную почту."),
                        verify: i("Подтвердить"),
                        errors: {
                            day: i("Укажите день"),
                            month: i("Укажите месяц"),
                            year: i("Укажите год"),
                            dayInvalid: i("Укажите корректно день"),
                            yearMin: i("Год должен быть больше или равен 1900"),
                            yearMax: i("Не верно указан год"),
                        },
                    }}
                />
            </main>
        </CabinetShell>
    );
}
