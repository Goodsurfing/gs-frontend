import i18n from "i18next";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createUrlWithLanguageCode } from "@/utils/language/createUrlWithLanguageCode";

export const RouterLanguageController = ({ children }: any) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        console.log(location);
        navigate(
            createUrlWithLanguageCode(
                i18n.language,
                `${location.pathname}${location.search}`
            )
        );
        setIsReady(true);
    }, [i18n.language]);

    if (isReady) {
        return children;
    }
};
