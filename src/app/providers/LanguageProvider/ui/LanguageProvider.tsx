import i18n from "i18next";
import {
  FC, useEffect, useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { createUrlWithLanguageCode } from "../model/createUrlWithLanguageCode";

interface LanguageProviderProps {
  children: any; // Todo
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    navigate(
      createUrlWithLanguageCode(
        i18n.language,
        `${location.pathname}${location.search}`,
      ),
    );
    setIsReady(true);
  }, [location.pathname, location.search, navigate]);

  if (isReady) {
    return children;
  }

  return null;
};
