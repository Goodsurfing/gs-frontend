const сompareRoutes = (fullRoute: string, comparableRoute: string): boolean => {
  const splitedFullRoute = fullRoute.split("").slice(2, 4);

  const splittedRoute = comparableRoute.split("");

  let isMatch = false;

  splitedFullRoute.some((route) => {
    if (isMatch) {
      return true;
    }

    splittedRoute.some((secondaryRoute) => {
      if (secondaryRoute === route) {
        isMatch = true;
      }
      return false;
    });
    return false;
  });

  return isMatch;
};

export default сompareRoutes;
