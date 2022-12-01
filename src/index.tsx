import App from "@/app/App";
import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import { setupStore } from "@/store/store";

import "./styles/index.scss";

const root = createRoot(document.getElementById("root")!);

const store = setupStore();

const Root = (
    <Provider store={store}>
        <App />
    </Provider>
);

root.render(Root);
