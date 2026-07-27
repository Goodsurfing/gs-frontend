import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { useEffect } from "react";
import {
    render, screen, act, waitFor,
} from "@testing-library/react";
import { OffersMap } from "./OffersMap";
import { OfferMap } from "@/entities/Offer";

const setCenter = vi.fn();
const getZoom = vi.fn(() => 5);
const getBounds = vi.fn(() => [[54, 36], [57, 39]]);
const boundsChangeHandlers: Array<() => void> = [];

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/app/providers/LocaleProvider", () => ({
    useLocale: () => ({ locale: "ru" }),
}));

vi.mock("@pbe/react-yandex-maps", () => ({
    YMaps: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    // eslint-disable-next-line react/no-unused-prop-types
    Map: (props: {
        children: React.ReactNode;
        instanceRef: { current: unknown };
        onLoad?: (ymap: unknown) => void;
    }) => {
        const { children, instanceRef, onLoad } = props;
        instanceRef.current = {
            setCenter,
            getZoom,
            getBounds,
            events: {
                add: (_event: string, handler: () => void) => boundsChangeHandlers.push(handler),
                remove: (_event: string, handler: () => void) => {
                    const index = boundsChangeHandlers.indexOf(handler);
                    if (index !== -1) boundsChangeHandlers.splice(index, 1);
                },
            },
        };
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            onLoad?.({ templateLayoutFactory: { createClass: () => undefined } });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
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
        getBounds.mockClear();
        boundsChangeHandlers.length = 0;
    });

    it("фокусирует карту, если у выбранной вакансии известны координаты", () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
                selectedOfferId={1}
                selectedOfferCoordinates={{ latitude: 55.75, longitude: 37.61 }}
            />,
        );

        expect(setCenter).toHaveBeenCalledWith([55.75, 37.61], 10, { duration: 400 });
        expect(screen.queryByText(/местоположение/)).not.toBeInTheDocument();
    });

    it("показывает подсказку вместо тишины, если координаты точно отсутствуют (null)", () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
                selectedOfferId={999}
                selectedOfferCoordinates={null}
            />,
        );

        expect(setCenter).not.toHaveBeenCalled();
        expect(screen.getByText("У этой вакансии не указано местоположение на карте")).toBeInTheDocument();
    });

    it("не показывает подсказку, пока координаты ещё не разрешены (undefined)", () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
                selectedOfferId={999}
                selectedOfferCoordinates={undefined}
            />,
        );

        expect(setCenter).not.toHaveBeenCalled();
        expect(screen.queryByText(/местоположение/)).not.toBeInTheDocument();
    });

    it("сообщает границы видимой области карты через onBoundsChange", async () => {
        const onBoundsChange = vi.fn();
        render(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
                onBoundsChange={onBoundsChange}
            />,
        );

        // Начальные границы сообщаются сразу при загрузке карты, ещё до
        // какого-либо реального panning/zoom пользователем.
        await waitFor(() => expect(onBoundsChange).toHaveBeenCalledWith({
            boundsSwLat: 54, boundsSwLng: 36, boundsNeLat: 57, boundsNeLng: 39,
        }));
        onBoundsChange.mockClear();

        act(() => {
            boundsChangeHandlers.forEach((handler) => handler());
        });

        await waitFor(() => expect(onBoundsChange).toHaveBeenCalledWith({
            boundsSwLat: 54, boundsSwLng: 36, boundsNeLat: 57, boundsNeLng: 39,
        }), { timeout: 1000 });
    });
});
