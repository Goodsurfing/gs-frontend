export interface ImageUploadProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    id: string;
    disabled: boolean;
    defaultImage?: any;
}
