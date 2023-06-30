import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { I18nextProvider } from "react-i18next";

import { setupStore } from "@/store/store";

import "./shared/config/i18n/i18n";
import "@/app/styles/index.scss";
import { LangRouter } from "@/routes";
import i18n from "@/shared/config/i18n/i18n";

const root = createRoot(document.getElementById("root")!);

const store = setupStore();

const Root = (
    <BrowserRouter>
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <LangRouter />
            </I18nextProvider>
        </Provider>
    </BrowserRouter>
);

root.render(Root);
