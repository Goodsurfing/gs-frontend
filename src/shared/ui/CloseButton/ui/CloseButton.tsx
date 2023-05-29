import { ButtonBase, ButtonBaseProps, SxProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { unstable_styleFunctionSx as styleFunctionSx } from "@mui/system";
import React, { FC } from "react";

export interface ButtonWithSx extends ButtonBaseProps {
  sx?: SxProps;
}

export interface CloseButtonProps extends ButtonWithSx {
  width?: number | string;
  height?: number | string;
}

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
      // eslint-disable-next-line i18next/no-literal-string
      >
          ✖
      </ButtonBase>
  );
};

export const StyledCloseButton = styled(CloseButton)(styleFunctionSx);
