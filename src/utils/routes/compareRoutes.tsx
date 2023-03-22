const сompareRoutes = (
    fullRoute: string,
    comparableRoute: string
): boolean => {
    const splitedFullRoute = fullRoute.split("/").splice(2, 4);
    const isMatch = splitedFullRoute.some((route) => {
       return comparableRoute === route;
    })

    return isMatch;
};

export default сompareRoutes;
