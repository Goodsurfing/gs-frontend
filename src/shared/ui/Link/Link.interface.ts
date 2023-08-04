import React from "react";
import { LinkProps } from "react-router-dom";

export enum LinkVariant {
    BLUE = "BLUE",
}

export interface ILinkProps extends LinkProps {
    variant: LinkVariant;
}
