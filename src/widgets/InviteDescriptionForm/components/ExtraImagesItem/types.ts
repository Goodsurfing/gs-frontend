import { ReactNode } from "react";

export interface ExtraImagesItemProps {
    img: string | null;
    setImg: (img: string | null) => void;
    id: string;
    closeBtn?: ReactNode;
}
