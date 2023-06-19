import i18n from 'i18next';
import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from 'hooks/redux';

interface PrivateRouteProps {
    Component: FC;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ Component }) => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.login);

  useEffect(() => {
    if (!token) {
      return navigate(`/${i18n.language}`, { replace: true });
    }
  }, [token, navigate]);

  return <Component />;
};

export default PrivateRoute;
