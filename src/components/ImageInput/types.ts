import { InputFileProps } from "@/shared/ui/InputFile/InputFile.interfaces";

export interface ImageType {
    file: File | null;
    src: string | null;
}

export interface ImageInputComponentProps extends InputFileProps {
    img?: string;
    setImg: (img: File) => void;
    onDelete: () => void;
    description?: React.ReactNode;
    extraWrapperClassName?: string;
    isLoading?: boolean;
    checkImageSize?: boolean;
    onError?: () => void;
    onSuccess?: () => void;
}
