import { AppRoutes } from "@/routes";
import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import { RouterLanguageController } from "@/routes/RouterLanguageController";

const App: FC = () => {
    return (
        <BrowserRouter>
            <RouterLanguageController>
                <AppRoutes />
            </RouterLanguageController>
        </BrowserRouter>
    );
};

export default App;
