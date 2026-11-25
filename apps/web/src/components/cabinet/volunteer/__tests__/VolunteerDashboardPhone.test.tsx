import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/session/SessionProvider", () => ({ useSession: () => ({ status: "loading", token: null }) }));

import { VolunteerDashboardPhone, type VolunteerDashboardPhoneLabels } from "../VolunteerDashboardPhone";

const labels: VolunteerDashboardPhoneLabels = {
    applications: "Мои отклики",
    all: "Все отклики ({{count}})",
    status: { new: "На рассмотрении", accepted: "Принята", canceled: "Отклонена" },
    next: { new: "Ждём ответа", accepted: "Договоритесь", canceled: "Посмотрите похожие" },
    emptyTitle: "Вы ещё не откликались",
    emptyHint: "Выберите вакансию",
    find: "Найти вакансию",
    loadError: "Не удалось загрузить",
    retry: "Повторить",
    offers: "Вакансии для вас",
    offersAll: "Все вакансии",
    offersFresh: "Пока это свежие вакансии",
    interests: "Интересы",
    offersEmpty: "Подходящих вакансий пока нет",
    profileFilled: "Профиль заполнен на {{percent}} %",
    profileDone: "Профиль заполнен",
    profileHint: "Заполненный профиль чаще принимают",
    complete: "Дополнить",
    open: "Открыть",
    quota: "Бесплатных откликов: {{left}} из {{total}}",
    quotaMember: "Членство: отклики без ограничений",
    membership: "Членство",
    noTitle: "Без названия",
    favorite: { add: "В избранное", remove: "Убрать" },
};

const hrefs = { chat: "/messenger/{id}", offer: "/offers/{id}", notes: "/volunteer/notes", catalog: "/offers-map", preferences: "/profile/preferences", membership: "/membership" };
const favorites = { enabled: false, isFavorite: () => false, isBusy: () => false, toggle: () => undefined };

const render = (props: Partial<Parameters<typeof VolunteerDashboardPhone>[0]>) => renderToString(
    <VolunteerDashboardPhone enabled={false} hrefs={hrefs} profile={null} offers={null} favorites={favorites} labels={labels} {...props} />,
);

describe("кабинет волонтёра на телефоне", () => {
    it("первым — «Мои отклики», затем «Вакансии для вас»; на компьютере скрыт", () => {
        const html = render({});
        expect(html.indexOf("Мои отклики")).toBeLessThan(html.indexOf("Вакансии для вас"));
        expect(html).toContain("hidden");
        expect(html).toContain("down-md:flex");
    });

    it("пока грузится — заготовки, а не пустота", () => {
        const html = render({});
        expect(html).toContain("animate-pulse");
    });

    it("свежие вакансии — с подсказкой про интересы", () => {
        const offer = { id: 7, title: "Ферма", image: undefined, address: "Алтай", category: "Экология" } as never;
        const html = render({ offers: { items: [{ offer }], fresh: true, failed: false } });
        expect(html).toContain("Пока это свежие вакансии");
        expect(html).toContain("/offers/7");
        expect(html).toContain("Все вакансии");
    });

    it("нет вакансий — подсказка и «Найти вакансию»", () => {
        const html = render({ offers: { items: [], fresh: true, failed: false } });
        expect(html).toContain("Подходящих вакансий пока нет");
        expect(html).toContain("Найти вакансию");
    });

    it("профиль одной строкой: заполненность и «Дополнить», остаток откликов", () => {
        const html = render({ profile: { name: "Анна", share: 1 / 3, completeHref: "/profile/info", publicHref: "/volunteers/1", quota: { member: false, left: 2, total: 3 } } });
        expect(html).toContain("Анна");
        expect(html).toContain("Профиль заполнен на <!-- -->33<!-- --> %".replace(/<!-- -->/g, ""));
        expect(html).toContain("Дополнить");
        expect(html).toContain("Заполненный профиль чаще принимают");
        expect(html).toContain("Бесплатных откликов: 2 из 3");
    });

    it("заполненный профиль — «Открыть», без подсказки", () => {
        const html = render({ profile: { name: "Анна", share: 1, publicHref: "/volunteers/1", quota: { member: true, left: 0, total: 3 } } });
        expect(html).toContain("Профиль заполнен");
        expect(html).toContain("Открыть");
        expect(html).not.toContain("Заполненный профиль чаще принимают");
        expect(html).toContain("Членство: отклики без ограничений");
    });
});
