import { render, screen } from "@testing-library/react";
import {
    afterEach, beforeEach, describe, expect, it, vi,
} from "vitest";

import { AppErrorBoundary } from "./AppErrorBoundary";

const captureException = vi.fn();
vi.mock("@sentry/react", () => ({ captureException: (...args: unknown[]) => captureException(...args) }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const Broken = ({ error }: { error: Error }) => {
    throw error;
};

describe("AppErrorBoundary", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        sessionStorage.clear();
        captureException.mockClear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("показывает экран с кнопкой вместо белого экрана и отправляет ошибку", () => {
        render(
            <AppErrorBoundary>
                <Broken error={new TypeError("boom")} />
            </AppErrorBoundary>,
        );

        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText("Обновить страницу")).toBeInTheDocument();
        expect(captureException).toHaveBeenCalledTimes(1);
    });

    it("при незагрузившемся модуле перезагружает страницу и не шумит в Bugsink", () => {
        const reload = vi.fn();
        vi.stubGlobal("location", { ...window.location, reload });

        render(
            <AppErrorBoundary>
                <Broken error={new TypeError("Importing a module script failed.")} />
            </AppErrorBoundary>,
        );

        expect(reload).toHaveBeenCalledTimes(1);
        expect(captureException).not.toHaveBeenCalled();
        vi.unstubAllGlobals();
    });
});
