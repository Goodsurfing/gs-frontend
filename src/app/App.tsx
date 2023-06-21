import React, { FC } from "react";
import { AppRouter } from "@/routes/AppRouter/AppRouter";

import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";

import { RouterLanguageController } from "@/routes/RouterLanguageController/RouterLanguageController";

const App: FC = () => {
    return (
        <RouterLanguageController>
            <ScrollToTop />
            <AppRouter />
        </RouterLanguageController>
    );
};

export default App;
