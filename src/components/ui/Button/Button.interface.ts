import React from "react";

export enum Variant {
    PRIMARY = "PRIMARY",
    SECONDARY = "SECONDARY",
    OUTLINED = "OUTLINED",
    ROUNDED = "ROUNDED",
    GREEN = "GREEN"
}

export interface IButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: Variant;
    rounded?: boolean;
}
