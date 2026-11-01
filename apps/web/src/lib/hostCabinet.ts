import "server-only";

import type { HostDescriptionLabels } from "@/components/cabinet/host/HostDescriptionForm";
import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";

/** Подписи формы организации (namespace host, как в старом фронте) */
export async function hostDescriptionLabels(locale: Locale): Promise<HostDescriptionLabels> {
    const [th, tp] = await Promise.all([getTranslator(locale, "host"), getTranslator(locale, "profile")]);
    const d = (key: string) => th(`hostDescription.${key}`);
    return {
        name: d("Название организации"),
        address: d("Адрес"),
        short: d("Опишите организацию в одно предложение"),
        shortHint: d("Не более 200 знаков"),
        type: d("Тип организации"),
        types: Object.fromEntries(["Другое", "ИП", "ОАО", "ООО", "ООПТ", "НКО"].map((type) => [type, d(type)])),
        otherType: d("Укажите тип организации"),
        website: d("Сайт организации"),
        about: d("Расскажите об организации"),
        aboutHint: d("Расскажите о вас, вашей команде и почему волонтёры должны выбрать вас для участия"),
        aboutLimit: d("Не более 1000 знаков"),
        vk: th("Вконтакте"),
        bannedNotice: th("Ссылки на Facebook и Instagram не отображаются на публичной странице — эти сервисы заблокированы на территории РФ"),
        required: d("Это поле является обязательным"),
        save: d("Сохранить"),
        created: d("Организация создана"),
        saved: d("Данные успешно изменены"),
        error: d("Произошла ошибка"),
        loadError: d("Произошла ошибка! Поробуйте перезагрузить страницу"),
        viewProfile: tp("info.Посмотреть профиль"),
        maxSize: tp("info.Максимальный_размер", { size: 5 }),
        choosePhoto: th("Фото"),
        deleteImage: th("Удалить изображение"),
        uploadError: th("Произошла ошибка при загрузке изображения"),
    };
}

/** Срок ответа поддержки не подтверждён бизнесом — значение из черновика (GS-151) */
const RESPONSE_DAYS = 14;

/** Баннер допродажи: consultation — на «Описании», mediaSupport — на «Вакансиях» */
export async function hostUpsellLabels(locale: Locale, kind: "consultation" | "mediaSupport") {
    const [th, tv] = await Promise.all([getTranslator(locale, "host"), getTranslator(locale, "volunteer")]);
    const u = (key: string, values?: Record<string, string | number>) => th(`hostUpsellBanner.${key}`, values);
    const consultation = kind === "consultation";
    return {
        subject: u(consultation ? "Консультация по продвижению" : "Медиаподдержка"),
        memberTitle: u(consultation
            ? "Организаторы с оформленным членством могут получить бесплатную консультацию по продвижению своего проекта"
            : "Организаторы с оформленным членством получают медиаподдержку своего проекта"),
        memberButton: tv("volunteer-dashboard.Получить членство"),
        canGet: u(consultation ? "Вы можете получить консультацию по продвижению" : "Вы можете получить медиаподдержку проекта"),
        withSubject: u("с темой письма"),
        answer: u("ответ в течение {{days}} рабочих дней", { days: RESPONSE_DAYS }),
    };
}
