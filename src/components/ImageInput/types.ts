import { InputFileProps } from "@/UI/InputFile/InputFile.interfaces";

export interface ImageInputComponentProps extends InputFileProps {
    file: File | null,
    setFile: (file: File | null) => void;
    description?: React.ReactNode;
}