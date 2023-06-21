import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "@/app/App";

import { setupStore } from "@/store/store";

import "./i18n";
import "./styles/index.scss";

const root = createRoot(document.getElementById("root")!);

const store = setupStore();

const Root = (
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
);

root.render(Root);
