import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ChatList, type ChatListLabels } from "../ChatList";

const labels: ChatListLabels = {
    search: "Поиск",
    tabs: {} as ChatListLabels["tabs"],
    statuses: { incoming: "Новая заявка", sent: "Заявка отправлена", accepted: "Принята", canceled: "Отклонена" } as ChatListLabels["statuses"],
    you: "Вы",
    attachment: "Вложение",
    application: "Заявка",
    noDate: "Без дат",
    noName: "Без имени",
    empty: "У вас пока нет сообщений",
    emptyTab: "Ничего не найдено",
    emptyTabs: {} as ChatListLabels["emptyTabs"],
    loadError: "Не удалось загрузить",
    retry: "Повторить",
    read: "Прочитано",
};

const render = (emptyPhone?: Parameters<typeof ChatList>[0]["emptyPhone"]) => renderToString(
    <ChatList
        locale="ru"
        chats={[]}
        loaded
        failed={false}
        onRetry={() => undefined}
        myId={undefined}
        viewerIsVolunteer={() => true}
        selectedId={undefined}
        chatHref={(id) => `/messenger/${id}`}
        onOpen={() => undefined}
        search=""
        onSearch={() => undefined}
        labels={labels}
        emptyPhone={emptyPhone}
    />,
);

describe("пустые «Сообщения»", () => {
    it("волонтёру на телефоне — подсказка и «Найти вакансию», на компьютере прежняя строка", () => {
        const html = render({ title: "Здесь появится переписка с организаторами", hint: "Откликнитесь", action: { href: "/offers-map", label: "Найти вакансию" } });
        expect(html).toContain("Здесь появится переписка с организаторами");
        expect(html).toContain('href="/offers-map"');
        expect(html).toMatch(/class="[^"]*hidden[^"]*down-md:flex[^"]*"/);
        expect(html).toMatch(/down-md:hidden[^>]*>У вас пока нет сообщений/);
    });

    it("без подсказки (организатор) — только прежняя строка", () => {
        const html = render();
        expect(html).toContain("У вас пока нет сообщений");
        expect(html).not.toContain("Найти вакансию");
    });
});
