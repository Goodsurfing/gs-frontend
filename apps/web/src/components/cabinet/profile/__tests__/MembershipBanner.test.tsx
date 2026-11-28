import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const session = vi.hoisted(() => ({ value: { status: "guest", memberships: [] } as Record<string, unknown> }));
vi.mock("@/components/session/SessionProvider", () => ({
    useSession: () => session.value,
    activeMembership: (list: { isActive: boolean; tariff?: { category?: string } }[], category: string) =>
        list.find((item) => item.isActive && item.tariff?.category === category),
}));

import { MembershipBanner, membershipStatusText } from "../MembershipBanner";

const labels = {
    activeUntil: "Членство активно до {{date}}",
    duoWith: "Членство на двоих с {{name}} до {{date}}",
    duoInviteSent: "Членство на двоих до {{date}}. Приглашение отправлено — ждём второго участника",
    duoInvite: "Членство на двоих до {{date}}",
    duoInviteLink: "Пригласить второго участника",
    renew: "Продлить членство",
    clubUntil: "Международный клуб: активно до {{date}}",
    renewClub: "Продлить участие",
    volunteers: "Волонтёрам",
    volunteersText: "",
    hosts: "Организаторам",
    hostsText: "",
    get: "Оформить членство",
};

const regular = (duo: unknown) => ({
    isActive: true,
    endDate: "2027-11-28T10:00:00+03:00",
    tariff: { category: "REGULAR", forRole: "VOLUNTEER", code: duo ? "volunteer_duo" : "volunteer_990" },
    duo,
});
const render = () => renderToString(<MembershipBanner locale="ru" membershipHref="/membership" labels={labels} />);

describe("статус членства под аватаркой (GS-294)", () => {
    beforeEach(() => {
        session.value = { status: "user", memberships: [] };
    });

    it("обычное членство — «активно до»", () => {
        session.value = { status: "user", memberships: [regular(null)] };
        const html = render();
        expect(html).toContain("Членство активно до 28.11.2027");
        expect(html).not.toContain("на двоих");
    });

    it("покупатель, второй присоединился — «на двоих с <имя> до <дата>»", () => {
        session.value = { status: "user", memberships: [regular({ role: "owner", partnerFirstName: "Иван", invitationSent: false })] };
        const html = render();
        expect(html).toContain("Членство на двоих с Иван до 28.11.2027");
        expect(html).not.toContain("Пригласить второго участника");
    });

    it("второй участник видит имя покупателя", () => {
        session.value = { status: "user", memberships: [regular({ role: "partner", partnerFirstName: "Анна", invitationSent: false })] };
        expect(render()).toContain("Членство на двоих с Анна до 28.11.2027");
    });

    it("покупатель, приглашение отправлено — «приглашение отправлено», без ссылки пригласить", () => {
        session.value = { status: "user", memberships: [regular({ role: "owner", partnerFirstName: null, invitationSent: true })] };
        const html = render();
        expect(html).toContain("Приглашение отправлено");
        expect(html).not.toContain("Пригласить второго участника");
    });

    it("покупатель ещё никого не приглашал — ссылка на приглашение на странице членства", () => {
        session.value = { status: "user", memberships: [regular({ role: "owner", partnerFirstName: null, invitationSent: false })] };
        const html = render();
        expect(html).toContain("Членство на двоих до 28.11.2027");
        expect(html).toMatch(/href="\/membership#duo"[^>]*>Пригласить второго участника</);
    });

    it("старый бэкенд без поля duo — как обычное членство", () => {
        expect(membershipStatusText({ endDate: null }, "28.11.2027", labels)).toEqual({ text: "Членство активно до 28.11.2027", invite: false });
    });
});
