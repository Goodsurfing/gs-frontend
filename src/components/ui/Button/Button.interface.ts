import React from "react";

export enum Variant {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    OUTLINED = "OUTLINED",
    GRAY = "GRAY",
    BLACK = "BLACK",
    GREEN = "GREEN"
}

export interface IButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: Variant;
    rounded?: boolean;
}
