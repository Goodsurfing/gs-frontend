import { ReactNode } from "react";

interface RouteBaseProps {
    element: ReactNode;
    path: (locale: string) => string;
    label?: string;
    authOnly?: boolean;
}

export interface RouteWithChildrenProps extends Omit<RouteBaseProps, "index"> {
    index?: never;
    children?: RouteType[];
}

export interface RouteWithIndexProps extends Omit<RouteBaseProps, "children"> {
    index: true;
    children?: undefined,
}

export type RouteType = RouteWithChildrenProps | RouteWithIndexProps;

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
