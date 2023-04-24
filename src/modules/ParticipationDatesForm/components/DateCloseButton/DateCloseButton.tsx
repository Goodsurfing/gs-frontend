import { ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import {unstable_styleFunctionSx as styleFunctionSx} from "@mui/system";
import { IDateCloseButton } from "./type";

const DateCloseButton: FC<IDateCloseButton> = ({
    width = 36,
    height = 36,
    onClick = () => {},
    ...restBtnProps
}) => {
    const onBtnClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        onClick(e);
    };

    return (
        <ButtonBase
            {...restBtnProps}
            sx={{
                width: width,
                height: height,
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#82949F",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                color: "#82949F",
                fontFamily: "sans-serif",
            }}
            onClick={onBtnClick}
        >
            ✖
        </ButtonBase>
    );
};

export default styled(DateCloseButton)(styleFunctionSx);

