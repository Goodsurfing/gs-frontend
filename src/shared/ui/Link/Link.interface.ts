import { LinkProps } from "react-router-dom";

export enum LinkVariant {
    BLUE = "BLUE",
    DEFAULT = "DEFAULT",
}

export interface ILinkProps extends LinkProps {
    variant: LinkVariant;
}
