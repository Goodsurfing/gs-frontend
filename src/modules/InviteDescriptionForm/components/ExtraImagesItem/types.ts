export interface ExtraImagesItemProps {
    img: string | null;
    setImg: (img: string | null) => void;
    id: string;
    label: string;
    closeBtn?: React.ReactNode;
}
