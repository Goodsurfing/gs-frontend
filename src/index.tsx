import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import { setupStore } from "@/store/store";

import { App } from "@/app/App";

import i18n from "@/shared/config/i18n/i18n";

import { LocaleProvider } from "./app/providers/LocaleProvider";

import "@/app/styles/index.scss";

const root = createRoot(document.getElementById("root")!);

const store = setupStore();

const Root = (
    <BrowserRouter>
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <LocaleProvider>
                    <App />
                </LocaleProvider>
            </I18nextProvider>
        </Provider>
    </BrowserRouter>
);

root.render(Root);
