import { FC } from "react";

import { AppRouter } from "app/router";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";

import { LanguageProvider } from "./providers/LanguageProvider";

const App: FC = () => (
    <LanguageProvider>
        <ScrollToTop />
        <AppRouter />
    </LanguageProvider>
);

export default App;
