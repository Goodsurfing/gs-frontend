import { LinkProps } from "react-router-dom";

type LinkVariant = "BLUE" | "DEFAULT";

export interface ILinkProps extends LinkProps {
    variant: LinkVariant;
}
