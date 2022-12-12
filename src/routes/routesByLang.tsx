import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import MainPage from "@/pages/MainPage/MainPage";
import SignInPage from "@/pages/SignInPage/SignInPage";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";
import {changeLanguageData} from "@/components/ChangeLanguage/ChangeLanguage.data";

function RoutesByLanguage() {
    const { i18n } = useTranslation();
    const loc = useLocation();

    useEffect(() => {
        const lang = loc.pathname.split(/\/([a-z]{2})(?![^\/])/gm)[1];
        const i = changeLanguageData.findIndex((i) => {
            return i.code === lang;
        });
        if (i !== -1 && i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [loc, i18n]);

    const routes = () => {
        return (
            <>
                <Route
                    index
                    element={<Navigate to={`/${i18n.language}/home`} />}
                />
                <Route path={"home"} element={<MainPage />} />

                <Route path={"signup"} element={<SignUpPage />} />
                <Route path={"signin"} element={<SignInPage />} />
            </>
        );
    };

    function renderRoutes() {
        return changeLanguageData.map((lang) => {
            return (
                <>
                    <Route key={lang.id} path={lang.code}>
                        {routes()}
                    </Route>
                </>
            );
        });
    }

    return (
        <Routes>
            <Route
                path={"/"}
                element={<Navigate to={`${i18n.language}`} replace />}
            />
            {renderRoutes()}
        </Routes>
    );
}

export default RoutesByLanguage;
