import React from "react";
import { createRoot } from "react-dom/client";

import "./styles/index.scss";

const root = createRoot(document.getElementById("root")!);

const Root = <h1>Hello</h1>;

root.render(Root);
