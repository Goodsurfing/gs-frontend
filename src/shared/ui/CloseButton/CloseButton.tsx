import { ButtonBase } from "@mui/material";
import { styled } from "@mui/material/styles";
import { unstable_styleFunctionSx as styleFunctionSx } from "@mui/system";
import React, { FC } from "react";

import { CloseButtonProps } from "./types";

const CloseButton: FC<CloseButtonProps> = ({
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
          sx={{
            width,
            height,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#82949F",
            borderRadius: "5px",
            display: "flex",
            alignItems: "center",
            color: "#82949F",
            fontFamily: "sans-serif",
          }}
          {...restBtnProps}
          onClick={onBtnClick}
      >
          ✖
      </ButtonBase>
  );
};

export default styled(CloseButton)(styleFunctionSx);
