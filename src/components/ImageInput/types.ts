import { InputFileProps } from "@/shared/ui/InputFile/InputFile.interfaces";

export interface ImageType {
    file: File | null;
    src: string | null;
}

export interface ImageInputComponentProps extends InputFileProps {
    img: ImageType;
    setImg: (img: ImageType) => void;
    description?: React.ReactNode;
    extraWrapperClassName?: string;
    isLoading?: boolean;
}
