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
const onLoadCalls = vi.fn();
const balloonOpen = vi.fn().mockResolvedValue(undefined);
let capturedFeatures: any[] = [];

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
            onLoadCalls();
            onLoad?.({ templateLayoutFactory: { createClass: () => undefined } });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <div>{children}</div>;
    },
    ZoomControl: () => null,
    // eslint-disable-next-line react/no-unused-prop-types
    ObjectManager: (props: { features: unknown[]; instanceRef?: { current: unknown } }) => {
        const { features, instanceRef } = props;
        capturedFeatures = features;
        if (instanceRef) {
            instanceRef.current = { objects: { balloon: { open: balloonOpen } } };
        }
        return <div data-testid="object-manager">{features.length}</div>;
    },
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
        onLoadCalls.mockClear();
        balloonOpen.mockClear();
        boundsChangeHandlers.length = 0;
        capturedFeatures = [];
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

    it("открывает balloon выбранной вакансии, когда фокусировка карты завершилась", async () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
                selectedOfferId={1}
                selectedOfferCoordinates={{ latitude: 55.75, longitude: 37.61 }}
            />,
        );

        await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());
        expect(balloonOpen).not.toHaveBeenCalled();

        // Симулируем завершение panning-анимации карты (событие "actionend").
        act(() => {
            boundsChangeHandlers.forEach((handler) => handler());
        });

        expect(balloonOpen).toHaveBeenCalledWith("1");
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

    it("не пересоздаёт карту при переключении isOffersLoading (регресс: карта уходила в бесконечный цикл unmount/remount)", async () => {
        const onBoundsChange = vi.fn();
        const { rerender } = render(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
                onBoundsChange={onBoundsChange}
            />,
        );

        await waitFor(() => expect(onLoadCalls).toHaveBeenCalledTimes(1));

        // isOffersLoading становится true — как только onBoundsChange
        // из первого рендера триггерит фетч у родителя. Раньше это
        // размонтировало <Map> целиком (early return вместо оверлея),
        // из-за чего onLoad срабатывал заново -> emitBounds() -> новый
        // фетч -> isOffersLoading снова true -> бесконечный цикл.
        rerender(
            <OffersMap
                offersData={[]}
                isOffersLoading
                onBoundsChange={onBoundsChange}
            />,
        );
        rerender(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
                onBoundsChange={onBoundsChange}
            />,
        );

        expect(onLoadCalls).toHaveBeenCalledTimes(1);
    });

    it("не прячет уже показанные маркеры на время bounds-рефетча (регресс: карта моргала при каждом перемещении)", async () => {
        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 }), offer({ id: 2 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(screen.getByTestId("object-manager")).toHaveTextContent("2"));

        // Пользователь подвинул карту -> сработал onBoundsChange -> родитель
        // начал bounds-рефетч: isOffersLoading=true, offersData на
        // мгновение вернулся к [] (новая комбинация bounds ещё не в кеше).
        rerender(
            <OffersMap
                offersData={[]}
                isOffersLoading
            />,
        );

        expect(screen.getByTestId("object-manager")).toHaveTextContent("2");

        // Рефетч завершился с обновлённым набором вакансий для новых bounds.
        rerender(
            <OffersMap
                offersData={[offer({ id: 3 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(screen.getByTestId("object-manager")).toHaveTextContent("1"));
    });

    it("даёт маркеру круглую iconShape, совпадающую с кастомной иконкой, чтобы balloon указывал точно на неё", async () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));
        expect(capturedFeatures[0].options.iconShape).toEqual({
            type: "Circle",
            coordinates: [15, 15],
            radius: 15,
        });
    });

    it("рисует balloon как карточку: фото сверху на всю ширину, ссылка на вакансию", async () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));
        const { balloonContent } = capturedFeatures[0].properties;
        expect(balloonContent).toContain("balloonImageLink");
        expect(balloonContent).toContain("balloonImage");
        expect(balloonContent).toContain("/ru/offers/1");
    });
});
