import { ReactNode } from "react";

interface RouteProps {
    element: ReactNode;
    path: (locale: string) => string;
    label?: string;
}

export interface RouteWithChildrenProps extends RouteProps {
    children?: RouteWithChildrenProps[];
}

export interface RestrictedRouteProps {
    requiredPermissions: string[] | string;
    children?: ReactNode;
}

export interface RestrictedWrapperProps extends RestrictedRouteProps {
    notPermittedComponent?: ReactNode;
}

export interface PublicRouteGuardProps {
    restricted?: boolean;
    children: ReactNode;
    redirect?: string;
}

export interface HeaderRouteProps {
    label: string;
    path: (locale: string) => string;
    permissions?: string | string[];
}
