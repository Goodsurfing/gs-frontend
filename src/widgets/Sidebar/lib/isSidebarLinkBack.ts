import { Location } from "react-router-dom";
import { SidebarContentProps } from "../model/types/sidebar";

export const isSidebarLinkBack = (route: string) => {
    const pathBackLinkData: string[] = [
        "/host/my-offers",
        "/admin/vacancies",
    ];
    return pathBackLinkData.includes(route);
};

export const isHostActiveCheck = (
    route: SidebarContentProps,
    isActive: boolean,
    location: Location,
) => {
    const dropdownRoutes = [
        "/registration",
        "/gallery",
        "/video",
        "/team",
        "/review",
    ];

    if (route.route === "/host" && route.dropdownItems) {
        const isDropdownRouteActive = dropdownRoutes.some(
            (dropdownRoute) => location.pathname.includes(dropdownRoute),
        );

        if (isDropdownRouteActive) {
            return true;
        }

        return false;
    }

    return isActive;
};
