import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "@/app/App";

import { setupStore } from "@/store/store";

import "./i18n";
import "./styles/index.scss";

const root = createRoot(document.getElementById("root")!);

const store = setupStore();

const Root = (
    <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
            <App />
        </Provider>
    </Suspense>
);

root.render(Root);
