import {
    describe, it, expect, vi,
} from "vitest";
import { render } from "@testing-library/react";
import { VolunteerDesctiptionCard } from "./VolunteerDesctiptionCard";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string, fallback?: string) => fallback ?? key }),
}));

/**
 * GS-84: VolunteerInfoCard рендерит этот компонент дважды подряд (О себе
 * + Дополнительная информация). Раньше id="1" был жёстко зашит внутри
 * компонента — при наличии externalInfo на странице оказывались два
 * элемента с одинаковым id (невалидный HTML, document.getElementById
 * находит только первый). Теперь id — проп, явно передаётся только
 * для секции "О себе".
 */
describe("VolunteerDesctiptionCard", () => {
    it("не рендерит id, если проп не передан", () => {
        const { container } = render(
            <VolunteerDesctiptionCard title="Дополнительная информация" description="Текст" />,
        );

        expect(container.querySelector("[id]")).toBeNull();
    });

    it("рендерит переданный id на корневом элементе", () => {
        const { container } = render(
            <VolunteerDesctiptionCard id="1" title="О себе" description="Текст" />,
        );

        expect(container.querySelector("[id=\"1\"]")).not.toBeNull();
    });
});
