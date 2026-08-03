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
const getById = vi.fn((): object | undefined => ({}));
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
            instanceRef.current = { objects: { balloon: { open: balloonOpen }, getById } };
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
        getBounds.mockReset();
        getBounds.mockReturnValue([[54, 36], [57, 39]]);
        onLoadCalls.mockClear();
        balloonOpen.mockClear();
        balloonOpen.mockResolvedValue(undefined);
        getById.mockClear();
        getById.mockImplementation(() => ({}));
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
});
