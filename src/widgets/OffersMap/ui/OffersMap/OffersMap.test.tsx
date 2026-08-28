import {
    describe, it, expect, vi, beforeEach,
} from "vitest";
import { useEffect, useLayoutEffect, useState } from "react";
import {
    render, screen, act, waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OffersMap } from "./OffersMap";
import { OfferMap } from "@/entities/Offer";

const setCenter = vi.fn();
const setZoom = vi.fn();
const getZoom = vi.fn(() => 5);
const getBounds = vi.fn(() => [[54, 36], [57, 39]]);
const boundsChangeHandlers: Array<() => void> = [];
const onLoadCalls = vi.fn();
const balloonOpen = vi.fn().mockResolvedValue(undefined);
const objectsBalloonClose = vi.fn();
const getById = vi.fn((): object | undefined => ({}));
const clustersGetById = vi.fn(
    (): { properties: { geoObjects: any[] }; geometry?: { coordinates: number[] } } => (
        { properties: { geoObjects: [] } }
    ),
);
const getObjectState = vi.fn((): { isClustered: boolean } => ({ isClustered: false }));
// Симулирует нативный клик по маркеру (или наш собственный balloon.open()) —
// см. подписку OffersMap на "balloonopen" в objects.events.
const objectsBalloonOpenHandlers: Array<(e: { get: (key: string) => unknown }) => void> = [];
const simulateBalloonOpen = (objectId: number | string) => {
    objectsBalloonOpenHandlers.forEach((handler) => handler({ get: (key) => (key === "objectId" ? objectId : undefined) }));
};
// Симулирует клик по кластеру (обрабатывается вручную — clusterOpenBalloonOnClick:
// false отключает нативный balloon у Яндекса, см. handleClusterClick в
// OffersMap.tsx). clustersGetById должен быть настроен на возврат нужных
// geoObjects ДО вызова.
const clustersClickHandlers: Array<(e: { get: (key: string) => unknown }) => void> = [];
const simulateClusterClick = (objectId: number | string = "cluster-1") => {
    clustersClickHandlers.forEach((handler) => handler({ get: (key) => (key === "objectId" ? objectId : undefined) }));
};
let capturedFeatures: any[] = [];
let capturedObjectsOptions: Record<string, unknown> | undefined;
let capturedOptionsProp: Record<string, unknown> | undefined;
let capturedClustersProp: Record<string, unknown> | undefined;
// Тесты на тайм-аут/onError загрузки карты не должны давать моку Map
// самому вызывать onLoad — иначе карта "успевает" загрузиться раньше, чем
// успеет сработать проверяемое поведение.
let skipAutoLoad = false;
let capturedOnError: (() => void) | undefined;
// Симулирует GS-112/GS-114-race: onLoad карты срабатывает, но
// templateLayoutFactory ещё не готов на этом же тике.
let onLoadWithoutTemplateFactory = false;

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
        onError?: () => void;
    }) => {
        const {
            children, instanceRef, onLoad, onError,
        } = props;
        instanceRef.current = {
            setCenter,
            setZoom,
            getZoom,
            getBounds,
            // computeClusterPopupAnchor (OffersMap.tsx) читает текущую проекцию
            // карты через options.get("projection") и переводит гео-координаты
            // кластера в пиксели — тождественные заглушки ниже достаточно,
            // тесты на позицию попапа не проверяют реальную гео-математику.
            options: { get: () => ({ toGlobalPixels: (coords: number[]) => coords }) },
            converter: { globalToPage: (pixels: number[]) => pixels },
            events: {
                add: (_event: string, handler: () => void) => boundsChangeHandlers.push(handler),
                remove: (_event: string, handler: () => void) => {
                    const index = boundsChangeHandlers.indexOf(handler);
                    if (index !== -1) boundsChangeHandlers.splice(index, 1);
                },
            },
        };
        capturedOnError = onError;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (skipAutoLoad) return;
            onLoadCalls();
            onLoad?.(onLoadWithoutTemplateFactory
                ? {}
                : { templateLayoutFactory: { createClass: () => "layout-class-sentinel" } });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return <div>{children}</div>;
    },
    ZoomControl: () => null,
    // Реальный ObjectManager из react-yandex-maps теперь монтируется с
    // ПОСТОЯННОЙ пустой ссылкой на features (см. OffersMap.tsx) — весь набор
    // маркеров управляется императивно через add()/remove() на инстансе, а не
    // через prop. Мок повторяет это: features prop игнорируется, единственный
    // источник правды — что реально "добавили"/"убрали" через инстанс.
    // eslint-disable-next-line react/no-unused-prop-types
    ObjectManager: (props: {
        instanceRef?: { current: unknown } | ((instance: unknown) => void);
        objects?: Record<string, unknown>;
        options?: Record<string, unknown>;
        clusters?: Record<string, unknown>;
    }) => {
        const {
            instanceRef, objects, options, clusters,
        } = props;
        const [mounted, setMounted] = useState<any[]>([]);
        capturedObjectsOptions = objects;
        capturedOptionsProp = options;
        capturedClustersProp = clusters;

        // useLayoutEffect (не useEffect) — реальный react-yandex-maps
        // регистрирует инстанс синхронно в componentDidMount, т.е. раньше,
        // чем сработает useLayoutEffect родителя (OffersMap), который сразу
        // же вызывает add()/remove() на этом инстансе.
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useLayoutEffect(() => {
            const instance = {
                getObjectState,
                objects: {
                    balloon: { open: balloonOpen, close: objectsBalloonClose },
                    getById,
                    events: {
                        add: (_event: string, handler: (e: any) => void) => {
                            objectsBalloonOpenHandlers.push(handler);
                        },
                        remove: (_event: string, handler: (e: any) => void) => {
                            const index = objectsBalloonOpenHandlers.indexOf(handler);
                            if (index !== -1) objectsBalloonOpenHandlers.splice(index, 1);
                        },
                    },
                },
                clusters: {
                    getById: clustersGetById,
                    events: {
                        add: (_event: string, handler: (e: any) => void) => {
                            clustersClickHandlers.push(handler);
                        },
                        remove: (_event: string, handler: (e: any) => void) => {
                            const index = clustersClickHandlers.indexOf(handler);
                            if (index !== -1) clustersClickHandlers.splice(index, 1);
                        },
                    },
                },
                add: (toAdd: any[]) => setMounted((prev) => {
                    const next = [...prev, ...toAdd];
                    capturedFeatures = next;
                    return next;
                }),
                remove: (toRemove: any[]) => setMounted((prev) => {
                    const removedIds = new Set(toRemove.map((f: any) => f.id));
                    const next = prev.filter((f: any) => !removedIds.has(f.id));
                    capturedFeatures = next;
                    return next;
                }),
            };
            if (typeof instanceRef === "function") instanceRef(instance);
            else if (instanceRef) instanceRef.current = instance;
            return () => {
                if (typeof instanceRef === "function") instanceRef(null);
                else if (instanceRef) instanceRef.current = null;
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div data-testid="object-manager">{mounted.length}</div>;
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
        setZoom.mockClear();
        getZoom.mockClear();
        getZoom.mockReturnValue(5);
        getBounds.mockReset();
        getBounds.mockReturnValue([[54, 36], [57, 39]]);
        onLoadCalls.mockClear();
        balloonOpen.mockClear();
        balloonOpen.mockResolvedValue(undefined);
        objectsBalloonClose.mockClear();
        getById.mockClear();
        getById.mockImplementation(() => ({}));
        clustersGetById.mockClear();
        clustersGetById.mockImplementation(() => ({
            properties: { geoObjects: [] }, geometry: { coordinates: [55.75, 37.61] },
        }));
        getObjectState.mockClear();
        getObjectState.mockReturnValue({ isClustered: false });
        boundsChangeHandlers.length = 0;
        objectsBalloonOpenHandlers.length = 0;
        clustersClickHandlers.length = 0;
        capturedFeatures = [];
        capturedObjectsOptions = undefined;
        capturedOptionsProp = undefined;
        capturedClustersProp = undefined;
        skipAutoLoad = false;
        capturedOnError = undefined;
        onLoadWithoutTemplateFactory = false;
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

    it(
        "дозумируется, а не открывает balloon поверх кластера, если выбранная вакансия всё ещё "
        + "смёржена в кластер (регресс: ?offerId= на вакансию с соседями открывал balloon.open() "
        + "успешно, но табличка повисала над безликим числовым кружком-кластером вместо своего "
        + "реального маркера — выглядело как баг)",
        async () => {
            getObjectState.mockReturnValue({ isClustered: true });
            const coordinates = { latitude: 55.75, longitude: 37.61 };

            vi.useFakeTimers();
            try {
                const { rerender } = render(
                    <OffersMap
                        offersData={[offer({ id: 1 })]}
                        isOffersLoading={false}
                        selectedOfferId={1}
                        selectedOfferCoordinates={coordinates}
                    />,
                );

                await vi.waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

                act(() => {
                    boundsChangeHandlers.forEach((handler) => handler());
                });

                expect(balloonOpen).not.toHaveBeenCalled();
                expect(setZoom).toHaveBeenCalledWith(7, { duration: 400, checkZoomRange: true });

                // Кластер расклеился (например, после того как карта
                // дозумилась и новые bounds-scoped маркеры пришли) —
                // реактивный триггер на изменившиеся features должен
                // подхватить это сразу, не дожидаясь тика таймера-ретрая.
                getObjectState.mockReturnValue({ isClustered: false });
                act(() => {
                    rerender(
                        <OffersMap
                            offersData={[offer({ id: 1, name: "Обновлённое название" })]}
                            isOffersLoading={false}
                            selectedOfferId={1}
                            selectedOfferCoordinates={coordinates}
                        />,
                    );
                });

                expect(balloonOpen).toHaveBeenCalledWith("1");
            } finally {
                vi.useRealTimers();
            }
        },
    );

    it(
        "не зумит карту сама, если пользователь вручную отзумил уже показанную вакансию так, что "
        + "она смёржилась в кластер (регресс, живой репорт: выбрал вакансию, зум-балун показался, "
        + "потом вручную нажал \"минус\" — карта тут же сама приближала зум обратно, отменяя "
        + "действие пользователя, потому что реактивный эффект на features раз за разом пытался "
        + "раскластеризовать уже когда-то показанную вакансию; авто-дозум легитимен только в "
        + "ограниченном по попыткам retry-цикле сразу после САМОГО выбора, а не бесконечно потом)",
        async () => {
            const coordinates = { latitude: 55.75, longitude: 37.61 };

            const { rerender } = render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={coordinates}
                />,
            );

            await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            // Первое открытие — обычный путь, маркер НЕ смёржен, balloon
            // успешно открывается через retry-цикл (actionend).
            act(() => {
                boundsChangeHandlers.forEach((handler) => handler());
            });
            expect(balloonOpen).toHaveBeenCalledWith("1");
            setZoom.mockClear();

            // Пользователь вручную отзумил карту (например, кнопкой "минус")
            // так, что та же вакансия смёржилась в кластер — новый bounds-
            // рефетч приносит другой набор offersData, реактивный эффект на
            // features срабатывает.
            getObjectState.mockReturnValue({ isClustered: true });
            act(() => {
                rerender(
                    <OffersMap
                        offersData={[offer({ id: 1, name: "После ручного зума" })]}
                        isOffersLoading={false}
                        selectedOfferId={1}
                        selectedOfferCoordinates={coordinates}
                    />,
                );
            });

            // Карта не должна сама менять зум в ответ — это уже не "доводим
            // до первого показа", а самостоятельное действие пользователя
            // спустя время после того, как balloon уже показывался.
            expect(setZoom).not.toHaveBeenCalled();
        },
    );

    it(
        "закрывает наш попап-список кластера, открывая balloon отдельной вакансии (регресс: "
        + "пользователь кликал по кластеру — открывался список вакансий — а затем открывался "
        + "balloon конкретной вакансии из списка/deep-link: обе таблички повисали на карте "
        + "разом, одна поверх другой, если явно не закрыть список кластера)",
        async () => {
            clustersGetById.mockReturnValue({
                properties: {
                    geoObjects: [{
                        id: "2",
                        properties: {
                            name: "Вакансия в кластере",
                            offerUrl: "/offer/2",
                            offerImage: "image.png",
                            categoryName: "Категория",
                            categoryColor: "#000",
                        },
                    }],
                },
                geometry: { coordinates: [55.75, 37.61] },
            });
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={{ latitude: 55.75, longitude: 37.61 }}
                />,
            );

            await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            act(() => {
                simulateClusterClick();
            });
            expect(screen.getByText("Вакансия в кластере")).toBeInTheDocument();

            // Попап анкорится напрямую в OffersMap.tsx (не портал в body,
            // не centered-модалка на весь экран) — carточка несёт класс
            // clusterPopup. [class~=...] ищет ТОЧНЫЙ класс-токен, а не
            // подстроку — иначе closest('[class*="clusterPopup"]')
            // сработал бы уже на первом попавшемся потомке вроде
            // clusterPopupClose/clusterPopupTail, даже не поднимаясь до
            // реального контейнера, и тест ничего бы не проверял.
            const clusterPopupBox = screen.getByText("Вакансия в кластере")
                .closest("[class~=\"clusterPopup\"]");
            expect(clusterPopupBox).not.toBeNull();

            act(() => {
                boundsChangeHandlers.forEach((handler) => handler());
            });

            expect(balloonOpen).toHaveBeenCalledWith("1");
            expect(screen.queryByText("Вакансия в кластере")).not.toBeInTheDocument();
        },
    );

    it(
        "закрывает balloon отдельной вакансии и показывает список вакансий кластера при клике по "
        + "кластеру (симметричный случай — клик по кластеру обрабатывается вручную, "
        + "clusterOpenBalloonOnClick: false отключает нативный balloon Яндекса, см. "
        + "handleClusterClick в OffersMap.tsx)",
        async () => {
            const coordinates = { latitude: 55.75, longitude: 37.61 };
            const { rerender } = render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={coordinates}
                />,
            );

            await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            act(() => {
                boundsChangeHandlers.forEach((handler) => handler());
            });
            expect(balloonOpen).toHaveBeenCalledWith("1");
            objectsBalloonClose.mockClear();

            clustersGetById.mockReturnValue({
                properties: {
                    geoObjects: [{
                        id: "3",
                        properties: {
                            name: "Другая вакансия в кластере",
                            offerUrl: "/offer/3",
                            offerImage: "image.png",
                            categoryName: "Категория",
                            categoryColor: "#000",
                        },
                    }],
                },
                geometry: { coordinates: [55.75, 37.61] },
            });
            act(() => {
                simulateClusterClick();
            });

            expect(objectsBalloonClose).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Другая вакансия в кластере")).toBeInTheDocument();

            // Следующее обновление маркеров (реактивный триггер на features)
            // не должно молча переоткрыть табличку старой вакансии поверх
            // того, что пользователь сейчас видит (список вакансий кластера)
            // — отложенный выбор должен был сброситься.
            balloonOpen.mockClear();
            act(() => {
                rerender(
                    <OffersMap
                        offersData={[offer({ id: 1, name: "Обновлённое название" })]}
                        isOffersLoading={false}
                        selectedOfferId={1}
                        selectedOfferCoordinates={coordinates}
                    />,
                );
            });
            expect(balloonOpen).not.toHaveBeenCalled();
        },
    );

    it(
        "позиционирует попап-список кластера у точки клика, а не по центру всего экрана "
        + "(регресс: раньше рендерился через общий на всё приложение centered Modal — карточка "
        + "всегда съезжала в центр viewport независимо от того, где на карте реально находится "
        + "кластер, по которому кликнули)",
        async () => {
            // jsdom по умолчанию не считает лэйаут — getBoundingClientRect()
            // отдаёт нулевой width/height у любого элемента, из-за чего
            // клэмпинг по ширине карты (см. handleClusterClick) всегда
            // прижимал бы карточку к левому краю независимо от clientPixels.
            // Подставляем реалистичный размер контейнера, чтобы тест
            // действительно проверял позиционирование, а не клэмпинг.
            const rectSpy = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect")
                .mockReturnValue({
                    width: 1000,
                    height: 800,
                    left: 0,
                    top: 0,
                    right: 1000,
                    bottom: 800,
                    x: 0,
                    y: 0,
                    toJSON: () => {},
                });

            try {
                // Мок map.options.get("projection").toGlobalPixels и
                // map.converter.globalToPage (см. мок Map выше) — тождественные
                // функции, так что координаты кластера напрямую становятся
                // "пикселями" — x=500 нарочно выбран подальше от обоих краёв
                // 1000px-контейнера, чтобы клэмпинг по ширине карты (см.
                // computeClusterPopupAnchor) не подменял собой то, что реально
                // проверяет тест — позицию по самой геоточке кластера.
                clustersGetById.mockReturnValue({
                    properties: {
                        geoObjects: [{
                            id: "2",
                            properties: {
                                name: "Вакансия в кластере",
                                offerUrl: "/offer/2",
                                offerImage: "image.png",
                                categoryName: "Категория",
                                categoryColor: "#000",
                            },
                        }],
                    },
                    geometry: { coordinates: [500, 460] },
                });
                render(
                    <OffersMap
                        offersData={[offer({ id: 1 })]}
                        isOffersLoading={false}
                    />,
                );

                await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

                act(() => {
                    simulateClusterClick();
                });

                const clusterPopupBox = screen.getByText("Вакансия в кластере")
                    .closest("[class~=\"clusterPopup\"]") as HTMLElement;
                expect(clusterPopupBox).not.toBeNull();
                // Контейнер сидит в (0,0), поэтому left/top карточки должны
                // совпасть напрямую с координатами кластера — не с центром
                // экрана и не с каким-то фиксированным местом, никак не
                // зависящим от того, где реально находится кластер.
                expect(clusterPopupBox.style.left).toBe("500px");
                expect(clusterPopupBox.style.top).toBe(`${460 - 26}px`);
            } finally {
                rectSpy.mockRestore();
            }
        },
    );

    it(
        "закрывает попап-список кластера по клику вне карточки (регресс: раньше это делал "
        + "backdrop общего Modal — при переходе на свой позиционируемый попап без backdrop "
        + "поведение \"клик мимо — закрыть\" легко потерять)",
        async () => {
            clustersGetById.mockReturnValue({
                properties: {
                    geoObjects: [{
                        id: "2",
                        properties: {
                            name: "Вакансия в кластере",
                            offerUrl: "/offer/2",
                            offerImage: "image.png",
                            categoryName: "Категория",
                            categoryColor: "#000",
                        },
                    }],
                },
                geometry: { coordinates: [55.75, 37.61] },
            });
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                />,
            );

            await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            act(() => {
                simulateClusterClick();
            });
            expect(screen.getByText("Вакансия в кластере")).toBeInTheDocument();

            act(() => {
                document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            });

            expect(screen.queryByText("Вакансия в кластере")).not.toBeInTheDocument();
        },
    );

    it(
        "не закрывает попап-список кластера от mousedown на самой карте (регресс, живая "
        + "проверка: drag карты мышью тоже начинается с mousedown вне попапа — попап рвался "
        + "в первую же миллисекунду перетаскивания, даже не дав карте сдвинуться, хотя за это "
        + "и отвечает repositioning-эффект на actionend; клик по-настоящему ВНЕ карты — "
        + "например по сайдбару — по-прежнему должен закрывать)",
        async () => {
            clustersGetById.mockReturnValue({
                properties: {
                    geoObjects: [{
                        id: "2",
                        properties: {
                            name: "Вакансия в кластере",
                            offerUrl: "/offer/2",
                            offerImage: "image.png",
                            categoryName: "Категория",
                            categoryColor: "#000",
                        },
                    }],
                },
                geometry: { coordinates: [55.75, 37.61] },
            });
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                />,
            );

            await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            act(() => {
                simulateClusterClick();
            });
            expect(screen.getByText("Вакансия в кластере")).toBeInTheDocument();

            // mousedown на самой карте (внутри wrapperRef, не на попапе) —
            // как в начале drag'а или клика по пустому месту карты.
            act(() => {
                screen.getByTestId("object-manager")
                    .dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            });
            expect(screen.getByText("Вакансия в кластере")).toBeInTheDocument();

            // А по-настоящему ВНЕ карты (например сайдбар/фильтры) — закрывает.
            act(() => {
                document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
            });
            expect(screen.queryByText("Вакансия в кластере")).not.toBeInTheDocument();
        },
    );

    it(
        "не закрывает попап-список кластера сам от себя, когда клик по этому же кластеру "
        + "запускает pan карты (регресс, живая проверка на стейдже: клик по кластеру у "
        + "Яндекс.Карт всегда чуть паннит карту, подводя кластер ближе к центру, даже с "
        + "clusterDisableClickZoom: true — та опция отключает только смену зума, не сам pan; "
        + "закрытие попапа по map actionbegin закрывало его в тот же момент, когда он только "
        + "что открылся, от pan'а, вызванного этим же самым кликом)",
        async () => {
            clustersGetById.mockReturnValue({
                properties: {
                    geoObjects: [{
                        id: "2",
                        properties: {
                            name: "Вакансия в кластере",
                            offerUrl: "/offer/2",
                            offerImage: "image.png",
                            categoryName: "Категория",
                            categoryColor: "#000",
                        },
                    }],
                },
                geometry: { coordinates: [55.75, 37.61] },
            });
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                />,
            );

            await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            act(() => {
                simulateClusterClick();
            });
            expect(screen.getByText("Вакансия в кластере")).toBeInTheDocument();

            // Симулирует actionend от pan'а, который сам клик по кластеру
            // и вызвал — попап должен пережить это, просто пересчитав позицию.
            act(() => {
                boundsChangeHandlers.forEach((handler) => handler());
            });

            expect(screen.getByText("Вакансия в кластере")).toBeInTheDocument();
        },
    );

    it(
        "передаёт ObjectManager clusterDisableClickZoom: true вместе с "
        + "clusterOpenBalloonOnClick: false (регресс GS-119: без него клик по кластеру "
        + "в реальных Яндекс.Картах ловит только встроенный zoom-in — событие \"click\" "
        + "на clusters.events, которое слушает handleClusterClick, до кода приложения "
        + "просто не доходит, хотя мок в этих тестах эмулирует его напрямую и не "
        + "ловит такую регрессию)",
        async () => {
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferCoordinates={null}
                />,
            );

            await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            expect(capturedClustersProp).toMatchObject({
                clusterOpenBalloonOnClick: false,
                clusterDisableClickZoom: true,
            });
        },
    );

    it("показывает подсказку вместо тишины, если координаты точно отсутствуют (null)", () => {
        vi.useFakeTimers();
        try {
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={999}
                    selectedOfferCoordinates={null}
                />,
            );

            expect(setCenter).not.toHaveBeenCalled();
            // Показ уведомления намеренно отложен (см. регресс-тест ниже) —
            // сразу после рендера его ещё нет.
            expect(screen.queryByText("У этой вакансии не указано местоположение на карте")).not.toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(350);
            });

            expect(screen.getByText("У этой вакансии не указано местоположение на карте")).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it("не мигает подсказкой \"нет местоположения\" при переключении на другую вакансию, у которой "
        + "координаты есть (регресс: selectedOfferCoordinates мог на короткий момент вычислиться как null "
        + "раньше, чем повторный фоновый рефетч координат страницы в родителе успевал подтвердить реальные "
        + "координаты — уведомление успевало мигнуть на экране до появления маркера с табличкой)", () => {
        vi.useFakeTimers();
        try {
            const { rerender } = render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={{ latitude: 55.75, longitude: 37.61 }}
                />,
            );
            expect(screen.queryByText(/местоположение/)).not.toBeInTheDocument();

            // Переключились на другую вакансию — координаты на мгновение null
            // (типичная стадия рефетча в родителе), но затем сразу приходят
            // реальные координаты ДО истечения задержки уведомления.
            rerender(
                <OffersMap
                    offersData={[offer({ id: 1 }), offer({ id: 2 })]}
                    isOffersLoading={false}
                    selectedOfferId={2}
                    selectedOfferCoordinates={null}
                />,
            );
            expect(screen.queryByText(/местоположение/)).not.toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(200);
            });
            rerender(
                <OffersMap
                    offersData={[offer({ id: 1 }), offer({ id: 2 })]}
                    isOffersLoading={false}
                    selectedOfferId={2}
                    selectedOfferCoordinates={{ latitude: 60, longitude: 30 }}
                />,
            );

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(screen.queryByText(/местоположение/)).not.toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
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

    it("не сообщает вырожденный (нулевой площади) bounds (регресс: скрытая через display:none десктопная карта на мобильном шлёт SW===NE и стирает реальные маркеры пустым ответом)", async () => {
        getBounds.mockReturnValue([[50, 50], [50, 50]]);
        const onBoundsChange = vi.fn();
        render(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
                onBoundsChange={onBoundsChange}
            />,
        );

        await waitFor(() => expect(onLoadCalls).toHaveBeenCalledTimes(1));
        expect(onBoundsChange).not.toHaveBeenCalled();
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

    it("не показывает оверлей-спиннер поверх карты во время фонового bounds-рефетча, только на самом первом "
        + "заходе (регресс: isOffersLoading = isLoading || isFetching у родителя, т.е. становится true и на "
        + "КАЖДОМ последующем bounds-рефетче после pan — оверлей закрывал всю карту полупрозрачным белым на миг "
        + "при любом движении, хотя сами маркеры уже не терялись благодаря анти-мигающему кэшу)", async () => {
        const { rerender } = render(
            <OffersMap
                offersData={[]}
                isOffersLoading
            />,
        );

        expect(screen.getByRole("progressbar")).toBeInTheDocument();

        rerender(
            <OffersMap
                offersData={[offer({ id: 1 }), offer({ id: 2 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(screen.getByTestId("object-manager")).toHaveTextContent("2"));
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

        // Пользователь подвинул карту -> onBoundsChange -> родитель начал
        // фоновый bounds-рефетч: isOffersLoading снова true, но карта уже
        // показывала маркеры раньше — спиннер поверх нее больше не нужен.
        rerender(
            <OffersMap
                offersData={[]}
                isOffersLoading
            />,
        );

        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

        rerender(
            <OffersMap
                offersData={[offer({ id: 3 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(screen.getByTestId("object-manager")).toHaveTextContent("1"));
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("не падает и повторяет попытку, если balloon.open синхронно бросает даже когда объект уже числится в ObjectManager (регресс: getById подтверждал существование объекта раньше, чем его геометрия готова для balloon — пойманное исключение раньше тихо считалось успехом, и табличка так и не появлялась, хотя маркер по прямому клику уже открывался)", async () => {
        balloonOpen.mockImplementationOnce(() => {
            throw new TypeError("Cannot read properties of null (reading 'geometry')");
        });

        vi.useFakeTimers();
        try {
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={{ latitude: 55.75, longitude: 37.61 }}
                />,
            );

            await vi.waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            expect(() => {
                act(() => {
                    boundsChangeHandlers.forEach((handler) => handler());
                });
            }).not.toThrow();

            expect(balloonOpen).toHaveBeenCalledTimes(1);

            act(() => {
                vi.advanceTimersByTime(300);
            });

            // Второй вызов (mockImplementationOnce исчерпан, дальше balloonOpen
            // резолвится нормально) доказывает, что после пойманного исключения
            // код запланировал повтор, а не тихо решил, что всё получилось.
            expect(balloonOpen).toHaveBeenCalledTimes(2);
        } finally {
            vi.useRealTimers();
        }
    });

    it("повторяет попытку открыть balloon, пока маркер не появится в ObjectManager (регресс: табличка молча не появлялась, был виден только маркер)", async () => {
        // getById.open() возвращает falsy (объекта ещё нет — маркер под
        // только что выбранную вакансию ещё не подъехал с bounds-запросом)
        // первые несколько попыток, но объект рано или поздно появляется —
        // balloon должен открыться, а не молча остаться закрытым.
        let attempt = 0;
        getById.mockImplementation(() => {
            attempt += 1;
            return attempt >= 3 ? {} : undefined;
        });

        vi.useFakeTimers();
        try {
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={{ latitude: 55.75, longitude: 37.61 }}
                />,
            );

            await vi.waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            act(() => {
                boundsChangeHandlers.forEach((handler) => handler());
            });

            expect(attempt).toBe(1);
            expect(balloonOpen).not.toHaveBeenCalled();

            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(attempt).toBe(2);
            expect(balloonOpen).not.toHaveBeenCalled();

            act(() => {
                vi.advanceTimersByTime(300);
            });
            expect(attempt).toBe(3);
            expect(balloonOpen).toHaveBeenCalledWith("1");
        } finally {
            vi.useRealTimers();
        }
    });

    it("не переоткрывает balloon старой (списочной) вакансии после того, как пользователь напрямую кликнул по "
        + "ДРУГОМУ маркеру на карте и затем подвинул её (регресс: прямой клик по маркеру открывает balloon "
        + "целиком через нативный openBalloonOnClick у Яндекс.Карт, минуя selectedOfferId/pendingBalloonOfferIdRef "
        + "— без синхронизации следующий же bounds-рефетч маркеров молча переоткрывал balloon СТАРОЙ вакансии, "
        + "выбранной раньше из списка, отбирая табличку у той, что пользователь только что открыл кликом)", async () => {
        // Та же ссылка на coordinates для ОБОИХ рендеров — как оно и бывает в
        // проде: selectedOfferCoordinates пересчитывается в родителе только
        // при смене selectedOfferId/списочных данных, а не от одного лишь
        // pan'а карты. Если бы объект пересоздавался на каждый рендер (как в
        // первой версии этого теста), эффект на [selectedOfferId,
        // selectedOfferCoordinates, ymapState] ложно решил бы, что выбор
        // изменился, и сам сбросил pendingBalloonOfferIdRef/panActionEndedRef
        // — тест бы ничего не проверял.
        const coordinates = { latitude: 55.75, longitude: 37.61 };

        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 }), offer({ id: 2 })]}
                isOffersLoading={false}
                selectedOfferId={1}
                selectedOfferCoordinates={coordinates}
            />,
        );

        await waitFor(() => expect(screen.getByTestId("object-manager")).toHaveTextContent("2"));

        act(() => {
            boundsChangeHandlers.forEach((handler) => handler());
        });
        expect(balloonOpen).toHaveBeenCalledWith("1");
        balloonOpen.mockClear();

        // Пользователь кликает НАПРЯМУЮ по маркеру оффера 2 на карте — это
        // открывает его balloon целиком нативно у Яндекс.Карт, никак не меняя
        // selectedOfferId (кликов по маркерам React вообще не видит).
        act(() => {
            simulateBalloonOpen(2);
        });
        expect(balloonOpen).not.toHaveBeenCalled();

        // Пользователь подвинул карту — bounds-рефетч приносит новый набор
        // маркеров. Меняем name, чтобы сигнатура features реально
        // пересчиталась (анти-мигающий кэш иначе отдал бы ту же ссылку).
        act(() => {
            rerender(
                <OffersMap
                    offersData={[offer({ id: 1 }), offer({ id: 2, name: "Обновлённые данные" })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={coordinates}
                />,
            );
        });

        // Должен переоткрыться balloon оффера 2 (то, что пользователь реально
        // выбрал последним), а НЕ оффера 1 (устаревший списочный выбор).
        expect(balloonOpen).toHaveBeenCalledWith("2");
        expect(balloonOpen).not.toHaveBeenCalledWith("1");
    });

    it("открывает balloon реактивно при обновлении маркеров, не дожидаясь следующего тика таймера-ретрая (регресс: на медленной сети/бэкенде реальный round-trip мог не уложиться в весь таймерный бюджет)", async () => {
        // Маркера нет в ObjectManager после actionend — таймер уходит в
        // ожидание следующей попытки (300мс, ещё не наступило). Затем маркер
        // "приезжает" (features обновляются новым набором offersData), и
        // getById внезапно начинает подтверждать существование объекта —
        // balloon должен открыться СРАЗУ по этому событию, а не по таймеру.
        getById.mockImplementation(() => undefined);
        // Одна и та же ссылка на объект координат для обоих рендеров: если
        // передавать новый литерал при каждом рендере, pan-эффект (у него в
        // зависимостях selectedOfferCoordinates) перезапускался бы сам по
        // себе и сбрасывал бы флаг "pan завершился" — тест проверял бы не то.
        const coordinates = { latitude: 55.75, longitude: 37.61 };

        vi.useFakeTimers();
        try {
            const { rerender } = render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={coordinates}
                />,
            );

            await vi.waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            act(() => {
                boundsChangeHandlers.forEach((handler) => handler());
            });
            expect(balloonOpen).not.toHaveBeenCalled();

            getById.mockImplementation(() => ({}));
            act(() => {
                rerender(
                    <OffersMap
                        offersData={[offer({ id: 1, name: "Обновлённое название" })]}
                        isOffersLoading={false}
                        selectedOfferId={1}
                        selectedOfferCoordinates={coordinates}
                    />,
                );
            });

            // Ни один таймер не продвигался — если balloon всё равно открылся,
            // значит сработал реактивный эффект на features, а не таймер.
            expect(balloonOpen).toHaveBeenCalledWith("1");
        } finally {
            vi.useRealTimers();
        }
    });

    it("переоткрывает balloon при следующем обновлении маркеров даже после уже успешного open() (регресс: bounds-дебаунс иногда даёт две волны обновления за один pan — промежуточную и финальную; второй remove()+add() в ObjectManager молча закрывал уже открытый balloon, а код считал задачу выполненной и больше не пытался)", async () => {
        getById.mockImplementation(() => ({}));
        const coordinates = { latitude: 55.75, longitude: 37.61 };

        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
                selectedOfferId={1}
                selectedOfferCoordinates={coordinates}
            />,
        );

        await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

        act(() => {
            boundsChangeHandlers.forEach((handler) => handler());
        });
        expect(balloonOpen).toHaveBeenCalledTimes(1);

        // Вторая волна маркеров под тот же самый pan (та самая "финальная"
        // bounds-загрузка) — balloon должен попытаться открыться снова, а не
        // молчать, потому что "уже открывали один раз".
        act(() => {
            rerender(
                <OffersMap
                    offersData={[offer({ id: 1, name: "Ещё одно обновление" })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={coordinates}
                />,
            );
        });

        expect(balloonOpen).toHaveBeenCalledTimes(2);
    });

    it("прекращает попытки открыть balloon после разумного числа неудач, а не бесконечно (объекта у вакансии в принципе никогда не будет)", async () => {
        getById.mockImplementation(() => undefined);

        vi.useFakeTimers();
        try {
            render(
                <OffersMap
                    offersData={[offer({ id: 1 })]}
                    isOffersLoading={false}
                    selectedOfferId={1}
                    selectedOfferCoordinates={{ latitude: 55.75, longitude: 37.61 }}
                />,
            );

            await vi.waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());

            act(() => {
                boundsChangeHandlers.forEach((handler) => handler());
            });

            act(() => {
                vi.advanceTimersByTime(30_000);
            });

            const callsAfterLongWait = getById.mock.calls.length;

            act(() => {
                vi.advanceTimersByTime(30_000);
            });

            expect(getById.mock.calls.length).toBe(callsAfterLongWait);
            expect(balloonOpen).not.toHaveBeenCalled();
        } finally {
            vi.useRealTimers();
        }
    });

    it("даёт маркеру круглую iconShape с центром в точке геопривязки (регресс: [15,15] сдвигал кликабельную область на 15px вправо-вниз от видимого маркера — курсор становился pointer мимо самого кружка)", async () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));
        expect(capturedFeatures[0].options.iconShape).toEqual({
            type: "Circle",
            coordinates: [0, 0],
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

    it("использует MEDIUM-превью в balloon, а не крошечный SMALL (56x56, размывается при показе крупнее)", async () => {
        render(
            <OffersMap
                offersData={[offer({
                    id: 1,
                    image: {
                        id: "1",
                        contentUrl: "https://example.com/original.jpg",
                        thumbnails: {
                            small: "https://example.com/small.webp",
                            medium: "https://example.com/medium.webp",
                            large: "https://example.com/large.webp",
                        },
                    },
                })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));
        const { balloonContent } = capturedFeatures[0].properties;
        expect(balloonContent).toContain("https://example.com/medium.webp");
        expect(balloonContent).not.toContain("https://example.com/small.webp");
    });

    it("задаёт iconContentSize вровень с iconImageSize (иначе Яндекс.Карты по умолчанию заводят под content крошечный 10x10 хитбокс вместо видимых 30x30, и клик по маркеру мимо своей же кликабельной области ничего не делает)", async () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));
        const { options } = capturedFeatures[0];
        expect(options.iconContentSize).toEqual(options.iconImageSize);
        // iconContentOffset намеренно не задаём: content уже сидит внутри
        // контейнера image (который сам сдвинут на iconImageOffset) — если
        // продублировать тот же сдвиг ещё и для content, он применится дважды.
        expect(options.iconContentOffset).toBeUndefined();
    });

    it("держит ту же ссылку на features, если пришедший offersData не меняет фактический набор маркеров "
        + "(регресс: ObjectManager делает remove()+add() по ВСЕЙ коллекции на каждую новую ссылку features, "
        + "даже если содержимое идентично — например повторный bounds-фетч тех же данных или лёгкий пан в "
        + "пределах того же viewport — из-за чего все маркеры на карте видимо мигали при каждом таком апдейте)", async () => {
        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));
        const firstFeatures = capturedFeatures;

        // Новый массив-литерал с offersData, но по содержимому — те же самые
        // офферы: именно так выглядит повторный RTK Query fetch с тем же
        // результатом (новая ссылка на массив/объекты при каждом success).
        rerender(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        expect(capturedFeatures).toBe(firstFeatures);
    });

    it("строит новый набор features, если офферы реально изменились (координаты)", async () => {
        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));
        const firstFeatures = capturedFeatures;

        rerender(
            <OffersMap
                offersData={[offer({ id: 1, latitude: 60 })]}
                isOffersLoading={false}
            />,
        );

        expect(capturedFeatures).not.toBe(firstFeatures);
    });

    it("трогает через ObjectManager.add()/remove() только реально изменившиеся маркеры, а не весь набор "
        + "разом (регресс: на мобильном viewport покрывает заметно меньшую площадь, чем на десктопе, и почти "
        + "любой pan меняет хотя бы один маркер — при декларативном features prop ObjectManager сносил и "
        + "пересоздавал ВСЕ маркеры на каждое такое изменение, даже если 9 из 10 не изменились, отчего вся "
        + "карта на мгновение мигала пустой)", async () => {
        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 }), offer({ id: 2 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(2));
        const unchangedFeature = capturedFeatures.find((f: any) => f.id === "2");

        // id=1 пропадает из viewport, id=2 остаётся без изменений, id=3 внось
        // появляется — типичная картина частичного pan'а на мобильном.
        rerender(
            <OffersMap
                offersData={[offer({ id: 2 }), offer({ id: 3 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures.map((f: any) => f.id).sort()).toEqual(["2", "3"]));
        // Ключевая проверка: маркер id=2 — ТА ЖЕ ссылка на объект, что и до
        // обновления, т.е. его никто не снимал и не добавлял заново. Если бы
        // ObjectManager делал remove()+add() по всей коллекции (старое
        // поведение), это был бы новый объект и тест бы упал.
        expect(capturedFeatures.find((f: any) => f.id === "2")).toBe(unchangedFeature);
    });

    it("держит те же ссылки на options/objects/clusters у ObjectManager между рендерами (регресс: инлайновые "
        + "объектные литералы в JSX пересоздаются на КАЖДЫЙ рендер компонента, включая каждое движение карты "
        + "— react-yandex-maps сравнивает эти пропы по ссылке и на любое изменение зовёт .options.set() на "
        + "реальном инстансе, из-за чего кластеры на мгновение сбрасывались к дефолтному белому кружку без "
        + "цвета и тут же перерисовывались обратно — видимое моргание при любом движении карты, а не только "
        + "при реальном изменении набора маркеров)", async () => {
        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedOptionsProp).toBeDefined());
        const firstOptions = capturedOptionsProp;
        const firstObjects = capturedObjectsOptions;
        const firstClusters = capturedClustersProp;

        // Ре-рендер с абсолютно тем же содержимым — именно так выглядит любое
        // движение карты, которое не меняет набор маркеров (bounds ещё не
        // успели дебаунситься/дойти до бэкенда).
        rerender(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        expect(capturedOptionsProp).toBe(firstOptions);
        expect(capturedObjectsOptions).toBe(firstObjects);
        expect(capturedClustersProp).toBe(firstClusters);
    });

    it("монтирует ObjectManager (и показывает маркер), даже если templateLayoutFactory ещё не готов в момент "
        + "onLoad карты (регресс: мемоизированный clusters временно вычисляется как undefined, пока фабрика не "
        + "готова — если условие монтирования ObjectManager зависит от truthy clusters, а не только от "
        + "ymapState/features, виджет мог навсегда остаться немонтированным без единой ошибки, потому что "
        + "ymapState как ссылка на объект после onLoad больше не меняется и без ДРУГОГО повода для ре-рендера "
        + "переоценить условие просто нечем — маркер и balloon молча пропадали бы навсегда при заходе по "
        + "прямой ссылке на вакансию)", async () => {
        onLoadWithoutTemplateFactory = true;
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(onLoadCalls).toHaveBeenCalled());
        await waitFor(() => expect(screen.getByTestId("object-manager")).toBeInTheDocument());
        expect(capturedFeatures).toHaveLength(1);
    });

    it("строит маркер с реальным iconContentLayout (не пустым), даже если offersData уже пришли ДО того, "
        + "как карта закончила грузиться (регресс: templateLayoutFactory становится доступен только после "
        + "onLoad карты — если features успевают построиться раньше на пустой фабрике, а сигнатура "
        + "стабильности не учитывает эту готовность, устаревший набор с пустым iconContentLayout "
        + "переиспользуется навсегда, и цветной кружок маркера никогда не рисуется, хотя balloon по клику "
        + "всё равно открывается)", async () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));
        expect(capturedFeatures[0].options.iconContentLayout).toBeTruthy();
    });

    it("очищает маркеры на карте, если новый результат поиска/фильтра пришёл пустым (регресс: анти-мигающий "
        + "кэш последнего набора features отдавал старые маркеры и тогда, когда offersData реально стал "
        + "пустым и загрузка уже завершилась — не только во время загрузки, для которой кэш и задумывался; "
        + "карта продолжала показывать результаты предыдущего запроса, а новое пустое уведомление не "
        + "успевало сработать, потому что features так и не становился пустым)", async () => {
        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedFeatures).toHaveLength(1));

        rerender(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
            />,
        );

        // ObjectManager рендерится только при features.length > 0 — при реально
        // пустом результате он должен размонтироваться (а не остаться висеть со
        // старым содержимым), поэтому проверяем именно его отсутствие в дереве.
        await waitFor(() => expect(screen.queryByTestId("object-manager")).not.toBeInTheDocument());
        await waitFor(() => expect(screen.getByText("По вашему запросу вакансий на карте не найдено")).toBeInTheDocument());
    });

    it("отключает hideIconOnBalloonOpen у ObjectManager (регресс: Яндекс.Карты по умолчанию скрывают иконку "
        + "маркера, пока открыт его balloon — при заходе по прямой ссылке на вакансию balloon открывается "
        + "программно сразу же, и без этого флага маркер оставался невидимым, пока пользователь сам не "
        + "закрывал balloon вручную)", async () => {
        render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(capturedObjectsOptions).toBeDefined());
        expect(capturedObjectsOptions?.hideIconOnBalloonOpen).toBe(false);
    });

    it("показывает отдельное сообщение об ошибке (не «вакансий не найдено»), если загрузка маркеров упала, "
        + "и кнопка «Попробовать снова» вызывает onRetry", async () => {
        const onRetry = vi.fn();
        render(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
                isOffersError
                onRetry={onRetry}
            />,
        );

        expect(screen.getByText("Не удалось загрузить вакансии")).toBeInTheDocument();
        expect(screen.queryByText("По вашему запросу вакансий на карте не найдено")).not.toBeInTheDocument();

        await userEvent.click(screen.getByText("Попробовать снова"));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("показывает «вакансий не найдено», если карта загрузилась, но маркеров нет и это не ошибка "
        + "(регресс: пустой результат фильтров/поиска выглядел на карте как молчаливо пустое место, "
        + "неотличимое от карты, которая просто ещё грузится)", async () => {
        render(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
            />,
        );

        await waitFor(() => expect(onLoadCalls).toHaveBeenCalled());
        await waitFor(() => expect(screen.getByText("По вашему запросу вакансий на карте не найдено")).toBeInTheDocument());
    });

    it("не мигает уведомлением \"не найдено\", если пустой результат — лишь промежуточная волна "
        + "bounds-рефетча за один pan (регресс: та же природа гонки, что и с уведомлением "
        + "\"нет местоположения\" — итоговая непустая волна должна успеть прийти раньше, чем мелькнёт "
        + "уведомление)", async () => {
        const { rerender } = render(
            <OffersMap
                offersData={[offer({ id: 1 })]}
                isOffersLoading={false}
            />,
        );
        await waitFor(() => expect(capturedFeatures).toHaveLength(1));

        vi.useFakeTimers();
        try {
            // Промежуточная волна во время pan — bounds на миг не содержат
            // маркеров.
            rerender(
                <OffersMap
                    offersData={[]}
                    isOffersLoading={false}
                />,
            );
            expect(screen.queryByText("По вашему запросу вакансий на карте не найдено")).not.toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(200);
            });

            // Финальная волна — реальные маркеры под итоговые bounds пришли
            // раньше истечения дебаунса.
            rerender(
                <OffersMap
                    offersData={[offer({ id: 2 })]}
                    isOffersLoading={false}
                />,
            );

            act(() => {
                vi.advanceTimersByTime(1000);
            });

            expect(screen.queryByText("По вашему запросу вакансий на карте не найдено")).not.toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it("не показывает «вакансий не найдено», пока карта ещё грузится", () => {
        skipAutoLoad = true;
        render(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
            />,
        );

        expect(screen.queryByText("По вашему запросу вакансий на карте не найдено")).not.toBeInTheDocument();
    });

    it("показывает «не удалось загрузить карту» с кнопкой перезагрузки страницы, если карта не "
        + "загрузилась за разумное время (регресс: скрипт Яндекс.Карт грузится вне React-дерева — если он "
        + "падает или зависает, никакой Error Boundary этого не ловит, карта молча остаётся пустым местом "
        + "навсегда без единого сигнала)", () => {
        vi.useFakeTimers();
        try {
            skipAutoLoad = true;
            render(
                <OffersMap
                    offersData={[]}
                    isOffersLoading={false}
                />,
            );

            expect(screen.queryByText("Не удалось загрузить карту")).not.toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(15_000);
            });

            expect(screen.getByText("Не удалось загрузить карту")).toBeInTheDocument();
            expect(screen.getByText("Обновить страницу")).toBeInTheDocument();
        } finally {
            vi.useRealTimers();
        }
    });

    it("показывает тот же оверлей сразу через onError, не дожидаясь тайм-аута, если карта падает "
        + "при рендере (Error Boundary внутри react-yandex-maps)", () => {
        skipAutoLoad = true;
        render(
            <OffersMap
                offersData={[]}
                isOffersLoading={false}
            />,
        );

        expect(screen.queryByText("Не удалось загрузить карту")).not.toBeInTheDocument();

        act(() => {
            capturedOnError?.();
        });

        expect(screen.getByText("Не удалось загрузить карту")).toBeInTheDocument();
    });
});
