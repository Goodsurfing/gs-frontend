import { AppRoutes } from "@/routes";
import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";

import { RouterLanguageController } from "@/routes/RouterLanguageController";

const App: FC = () => {
    return (
        <BrowserRouter>
            <RouterLanguageController>
                <ScrollToTop />
                    <AppRoutes />
            </RouterLanguageController>
        </BrowserRouter>
    );
};

export default App;
