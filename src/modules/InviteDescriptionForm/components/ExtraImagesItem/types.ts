import { ImageType } from "@/components/ImageInput/types";

export interface ExtraImagesItemProps {
    img: ImageType;
    setImg: (img: ImageType) => void;
    id: string;
    label: string;
    closeBtn?: React.ReactNode;
}
