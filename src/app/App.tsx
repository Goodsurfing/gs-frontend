import { FC } from "react";

import ScrollToTop from "components/ScrollToTop/ScrollToTop";

import { AppRouter } from "app/providers/Router";
import { LanguageProvider } from "app/providers/LanguageProvider";

const App: FC = () => (
    <LanguageProvider>
        <ScrollToTop />
        <AppRouter />
    </LanguageProvider>
);

export default App;
