import React from "react";
import {
    describe, it, expect, vi, afterEach,
} from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GeolocationControl } from "./GeolocationControl";

describe("GeolocationControl", () => {
    const originalGeolocation = navigator.geolocation;

    afterEach(() => {
        Object.defineProperty(navigator, "geolocation", {
            value: originalGeolocation,
            configurable: true,
        });
    });

    it(
        "центрирует карту на текущих координатах пользователя в масштабе города (не максимальном зуме)",
        () => {
            const getCurrentPosition = vi.fn((onSuccess: PositionCallback) => {
                onSuccess({
                    coords: { latitude: 55.75, longitude: 37.61 },
                } as GeolocationPosition);
            });
            Object.defineProperty(navigator, "geolocation", {
                value: { getCurrentPosition },
                configurable: true,
            });
            const setCenter = vi.fn();
            const mapInstance = { setCenter };

            render(<GeolocationControl mapInstance={mapInstance} />);
            fireEvent.click(screen.getByRole("button", { name: "Показать моё местоположение" }));

            expect(setCenter).toHaveBeenCalledTimes(1);
            const [center, zoom] = setCenter.mock.calls[0];
            expect(center).toEqual([55.75, 37.61]);
            // Регресс: нативный GeolocationControl зумит по точности геолокации
            // (обычно почти до максимума, уровень дома/улицы) — здесь зум
            // всегда фиксированный "городской" масштаб, независимо от точности.
            expect(zoom).toBeLessThan(15);
            expect(zoom).toBeGreaterThanOrEqual(9);
        },
    );

    it("не падает и не трогает карту, если пользователь отклонил доступ к геолокации", () => {
        const getCurrentPosition = vi.fn((
            _onSuccess: PositionCallback,
            onError?: PositionErrorCallback,
        ) => {
            onError?.({ code: 1, message: "denied" } as GeolocationPositionError);
        });
        Object.defineProperty(navigator, "geolocation", {
            value: { getCurrentPosition },
            configurable: true,
        });
        const setCenter = vi.fn();

        render(<GeolocationControl mapInstance={{ setCenter }} />);
        fireEvent.click(screen.getByRole("button", { name: "Показать моё местоположение" }));

        expect(setCenter).not.toHaveBeenCalled();
    });

    it("не падает, если браузер вообще не поддерживает geolocation API", () => {
        Object.defineProperty(navigator, "geolocation", {
            value: undefined,
            configurable: true,
        });
        const setCenter = vi.fn();

        render(<GeolocationControl mapInstance={{ setCenter }} />);
        expect(() => fireEvent.click(
            screen.getByRole("button", { name: "Показать моё местоположение" }),
        )).not.toThrow();
        expect(setCenter).not.toHaveBeenCalled();
    });

    it("не падает, если карта ещё не смонтирована (mapInstance отсутствует)", () => {
        const getCurrentPosition = vi.fn();
        Object.defineProperty(navigator, "geolocation", {
            value: { getCurrentPosition },
            configurable: true,
        });

        render(<GeolocationControl mapInstance={null} />);
        expect(() => fireEvent.click(
            screen.getByRole("button", { name: "Показать моё местоположение" }),
        )).not.toThrow();
        expect(getCurrentPosition).not.toHaveBeenCalled();
    });
});
