import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import type { ChatApplication } from "@/lib/messenger";

import { ChatHeader, type ChatHeaderLabels } from "../ChatHeader";
import { DecisionButtons, decisionStep } from "../Decision";

const labels: ChatHeaderLabels = {
    back: "Назад",
    info: "Информация",
    statuses: { incoming: "Новая заявка", sent: "Заявка отправлена", accepted: "Принята", canceled: "Отклонена" },
    decisionPrompt: "Новая заявка — примите или отклоните её",
    accept: "Принять",
    decline: "Отклонить",
    declineConfirm: "Отклонить заявку? Волонтёр получит уведомление",
    cancel: "Отмена",
    change: "Изменить решение",
    changePrompt: "Измените решение по заявке",
};

const header = (status: string, viewerIsVolunteer = false) => renderToString(
    <ChatHeader
        locale="ru"
        name="Волонтёр"
        application={{ id: 1, status, vacancyTitle: "Ферма" } as unknown as ChatApplication}
        viewerIsVolunteer={viewerIsVolunteer}
        infoOpen={false}
        onBack={() => undefined}
        onDecision={async () => true}
        labels={labels}
    />,
);

/** Кнопки решения в порядке на странице */
const buttons = (html: string) => [...html.matchAll(/<button[^>]*>([^<]*)<\/button>/g)].map((match) => ({ tag: match[0], text: match[1] }))
    .filter((button) => button.text === labels.accept || button.text === labels.decline);

describe("кнопки решения по заявке", () => {
    it("«Принять» первой и зелёной, «Отклонить» второй и рамкой", () => {
        const [accept, decline] = buttons(header("new"));
        expect(accept?.text).toBe("Принять");
        expect(accept?.tag).toContain("bg-cta");
        expect(decline?.text).toBe("Отклонить");
        expect(decline?.tag).not.toContain("bg-cta");
    });

    it("подписи не отдаются переводчику браузера", () => {
        for (const button of buttons(header("new"))) {
            expect(button.tag).toContain('translate="no"');
            expect(button.tag).toContain("notranslate");
        }
        const html = renderToString(<DecisionButtons onDecision={() => undefined} labels={labels} />);
        expect(html.indexOf("Принять")).toBeLessThan(html.indexOf("Отклонить"));
    });

    it("отказ — только после подтверждения, принятие — сразу", () => {
        expect(decisionStep("canceled")).toBe("confirm");
        expect(decisionStep("accepted")).toBe("send");
    });

    it("у принятой и отклонённой заявки организатору — «Изменить решение», кнопки скрыты до нажатия", () => {
        for (const status of ["accepted", "canceled"]) {
            const html = header(status);
            expect(html).toContain("Изменить решение");
            expect(buttons(html)).toHaveLength(0);
        }
        expect(header("new")).not.toContain("Изменить решение");
    });

    it("волонтёру решения нет", () => {
        for (const status of ["new", "accepted", "canceled"]) {
            const html = header(status, true);
            expect(html).not.toContain("Изменить решение");
            expect(buttons(html)).toHaveLength(0);
        }
    });

    it("в выборе нового решения нынешнее неактивно", () => {
        const html = renderToString(<DecisionButtons current="accepted" onDecision={() => undefined} labels={labels} />);
        const [accept, decline] = buttons(html);
        expect(accept?.tag).toContain("disabled=\"\"");
        expect(decline?.tag).not.toContain("disabled=\"\"");
    });
});

describe("пожаловаться на сообщение (GS-282)", () => {
    it("флажок — только у сообщения собеседника с обработчиком", async () => {
        const { MessageBubble } = await import("../MessageBubble");
        const props = { name: "Пётр", showAvatar: true, text: "Привет", time: "12:00", read: false, readLabel: "Прочитано", groupEnd: true, token: undefined, onImage: () => undefined };
        expect(renderToString(<MessageBubble {...props} own={false} onReport={() => undefined} reportLabel="Пожаловаться на сообщение" />)).toContain("aria-label=\"Пожаловаться на сообщение\"");
        expect(renderToString(<MessageBubble {...props} own={false} />)).not.toContain("Пожаловаться");
    });

    it("меню «Ещё» в шапке", async () => {
        const { ChatActions } = await import("../ChatActions");
        const html = renderToString(<ChatActions blocked={false} onReport={() => undefined} onBlock={() => undefined} labels={{ menu: "Ещё", report: "Пожаловаться", block: "Заблокировать", unblock: "Разблокировать" }} />);
        expect(html).toContain("aria-label=\"Ещё\"");
    });
});
