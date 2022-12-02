import React from "react";

export interface IButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: "primary" | "secondary" | "outlined";
}
