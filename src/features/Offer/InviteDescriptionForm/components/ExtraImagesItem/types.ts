import { Image } from "@/types/media";

export interface ExtraImagesItemProps {
    img: Image;
    setImg: (img: File) => void;
    onDelete: () => void;
    id: string;
    label: string;
    closeBtn?: React.ReactNode;
    disabled?: boolean;
    checkImageSize?: boolean;
    onError?: () => void;
    onSuccess?: () => void;
}
