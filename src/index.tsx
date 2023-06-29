import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "@/app/App";

import { setupStore } from "@/store/store";

import "./shared/config/i18n/i18n";
import "@/app/styles/index.scss";

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
