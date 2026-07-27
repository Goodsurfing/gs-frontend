import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { render, screen } from "@testing-library/react";
import { OffersMap } from "./OffersMap";
import { OfferMap } from "@/entities/Offer";

const setCenter = vi.fn();
const getZoom = vi.fn(() => 5);

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@pbe/react-yandex-maps", () => ({
    YMaps: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    // eslint-disable-next-line react/no-unused-prop-types
    Map: (
        { children, instanceRef }: { children: React.ReactNode; instanceRef: { current: unknown } },
    ) => {
        instanceRef.current = { setCenter, getZoom };
        return <div>{children}</div>;
    },
    ZoomControl: () => null,
    ObjectManager: () => null,
}));

const offer = (overrides: Partial<OfferMap> = {}): OfferMap => ({
    id: 1,
    latitude: 55.75,
    longitude: 37.61,
    name: "Test offer",
    image: { id: "1", contentUrl: "" },
    categories: [],
    ...overrides,
} as OfferMap);

describe("OffersMap", () => {
    beforeEach(() => {
        setCenter.mockClear();
        getZoom.mockClear();
    });

    it("фокусирует карту, если у выбранной вакансии есть координаты", () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
                selectedOfferId={1}
            />,
        );

        expect(setCenter).toHaveBeenCalledWith([55.75, 37.61], 10, { duration: 400 });
        expect(screen.queryByText(/местоположение/)).not.toBeInTheDocument();
    });

    it("показывает подсказку вместо тишины, если у вакансии нет координат", () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
                selectedOfferId={999}
            />,
        );

        expect(setCenter).not.toHaveBeenCalled();
        expect(screen.getByText("У этой вакансии не указано местоположение на карте")).toBeInTheDocument();
    });
});
