export const isSidebarLinkBack = (route: string) => {
    const pathBackLinkData: string[] = [
        "/host/my-offers",
    ];
    return pathBackLinkData.includes(route);
};
