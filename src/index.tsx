import App from "@/app/App";
import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.scss";

const root = createRoot(document.getElementById("root")!);

const Root = (
    <>
        <App />
    </>
);

root.render(Root);
