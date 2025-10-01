import { memo } from "react";

import cn from "classnames";

import closeIcon from "@/shared/assets/icons/offer-create/delete.svg";

import ExtraCloseButton from "@/shared/ui/ExtraCloseButton/ExtraCloseButton";

import styles from "./ExtraImagesItemButton.module.scss";

export interface ExtraImagesItemButtonProps {
    className?: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
}

const ExtraImagesItemButton = memo(({
    className,
    onClick,
    disabled,
}: ExtraImagesItemButtonProps) => (
    <ExtraCloseButton className={cn(className, styles.btn)} onClick={onClick} disabled={disabled}>
        <img className={styles.icon} src={closeIcon} alt="close" />
    </ExtraCloseButton>
));

export default ExtraImagesItemButton;
