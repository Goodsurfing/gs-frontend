import { render, screen } from "@testing-library/react";
import {
    afterEach, beforeEach, describe, expect, it, vi,
} from "vitest";

import { handleChunkLoadError, resetChunkReloadState } from "@/shared/lib/handleChunkLoadError";

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
        resetChunkReloadState();
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

    it("после vite:preloadError страница уже перезагружается — падение lazy не показываем и не отправляем", () => {
        const reload = vi.fn();
        handleChunkLoadError(new Event("vite:preloadError", { cancelable: true }), sessionStorage, reload);
        expect(reload).toHaveBeenCalledTimes(1);

        // Так падает React.lazy, когда импорт после preventDefault вернул undefined
        const { container } = render(
            <AppErrorBoundary>
                <Broken error={new TypeError("undefined is not an object (evaluating 'e._result.default')")} />
            </AppErrorBoundary>,
        );

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
        expect(captureException).not.toHaveBeenCalled();
    });
});
