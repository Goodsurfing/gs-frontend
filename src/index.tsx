import { StyledEngineProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { setupStore } from "@/store/store";

import { App } from "@/app/App";
import "@/app/styles/index.scss";

import "@/shared/config/i18n/i18n";

import { LocaleProvider } from "./app/providers/LocaleProvider";

const root = createRoot(document.getElementById("root")!);

// Глобальный fallback для битых изображений (S3 миграция)
document.addEventListener("error", (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG" && !target.dataset.fallback) {
        target.dataset.fallback = "true";
        (target as HTMLImageElement).src = "/placeholder-missing.svg";
    }
}, true);

const store = setupStore();

const Root = (
    <StrictMode>
        <BrowserRouter>
            <Provider store={store}>
                <StyledEngineProvider injectFirst>
                    <LocaleProvider>
                        <App />
                    </LocaleProvider>
                </StyledEngineProvider>
            </Provider>
        </BrowserRouter>
    </StrictMode>
);

root.render(Root);

// async function init() {
//     if (process.env.NODE_ENV === "development") {
//         try {
//             const { worker } = await import("./mocks/browser");
//             await worker.start();
//         } catch (e) {
//             // ignore worker start errors in non-dev environments
//             // eslint-disable-next-line no-console
//             console.warn("MSW failed to start", e);
//         }
//     }

//     root.render(Root);
// }

// init();
