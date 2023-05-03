import { InputFileProps } from "@/UI/InputFile/InputFile.interfaces";

export interface ImageInputComponentProps extends InputFileProps {
    img: string | null;
    setImg: (img: string | null) => void;
    description?: React.ReactNode;
    extraWrapperClassName?: string; 
}