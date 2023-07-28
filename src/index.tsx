import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";

import { setupStore } from "@/store/store";

import { App } from "@/app/App";

import "@/shared/config/i18n/i18n";

import { LocaleProvider } from "./app/providers/LocaleProvider";

import "@/app/styles/index.scss";

const root = createRoot(document.getElementById("root")!);

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
