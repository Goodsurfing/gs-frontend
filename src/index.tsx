import App from "@/app/App";
import React, {Suspense} from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { setupStore } from "@/store/store";

import "./styles/index.scss";
import "./i18n";

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
