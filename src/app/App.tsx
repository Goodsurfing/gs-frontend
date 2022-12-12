import React, {FC, useEffect, useLayoutEffect, useState} from "react";
import {BrowserRouter, useLocation, useNavigate} from "react-router-dom";

import RoutesByLanguage from "@/routes/routesByLang";
import {AppRoutes} from "@/routes";
import {changeLanguageData} from "@/components/ChangeLanguage/ChangeLanguage.data";
import i18n from "i18next";
import {createUrlWithLanguageCode} from "@/utils/language/createUrlWithLanguageCode";
import i18next from "i18next";

const RouterLanguageController = ({children}: any) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
            navigate(createUrlWithLanguageCode(i18n.language, location.pathname), {
                replace: true,
            });
            setIsReady(true);
    }, [i18n.language]);

    if (isReady) {
        return children;
    }
}

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
