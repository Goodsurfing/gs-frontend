import React, { FC } from "react";

import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { Outlet } from "react-router-dom";

const App: FC = () => (
    <div>
        <Outlet />
    </div>
);

export default App;
