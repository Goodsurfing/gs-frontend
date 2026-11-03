import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const navigation = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));

import { CabinetFrame, type CabinetMenuItem } from "../CabinetFrame";

const items: CabinetMenuItem[] = [
    { text: "Рабочий стол", href: "/host/host-dashboard", icon: "dashboard" },
    {
        text: "Организация",
        href: "/host/info",
        icon: "organization",
        children: [
            { text: "Описание", href: "/host/info" },
            { text: "Команда", href: "/host/team" },
        ],
    },
];

const render = (pathname: string) => {
    navigation.pathname = pathname;
    return renderToString(
        <CabinetFrame items={items} labels={{ toggle: "Меню" }}>
            <p>Содержимое</p>
        </CabinetFrame>,
    );
};

describe("CabinetFrame", () => {
    it("одинаково рисует меню на сервере (/ru/… после rewrite) и в браузере — иначе React #418", () => {
        expect(render("/ru/host/team")).toBe(render("/host/team"));
    });

    it("на странице подменю показывает его пункты", () => {
        const html = render("/ru/host/team");
        expect(html).toContain("Команда");
        expect(html).toContain("Описание");
    });
});
