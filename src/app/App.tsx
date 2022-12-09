import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import RoutesByLanguage from "@/routes/routesByLang";

const App: FC = () => {
    return (
        <BrowserRouter>
            <RoutesByLanguage />
        </BrowserRouter>
    );
};

export default App;
