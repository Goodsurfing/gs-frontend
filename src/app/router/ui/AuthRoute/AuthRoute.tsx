import i18n from "i18next";
import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppSelector } from "shared/hooks/redux";

interface PrivateRouteProps {
    Component: FC;
}

export const AuthRoute: FC<PrivateRouteProps> = ({ Component }) => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.login);

  useEffect(() => {
    if (!token) {
      return navigate(`/${i18n.language}`, { replace: true });
    }
  }, [token, navigate]);

  return <Component />;
};
