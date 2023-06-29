import { IUserInfoImage } from "@/pages/ProfileInfoPage/ui/ProfileInfoForm/ProfileInfoForm.interface";

export interface ImageUploadProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    id: string;
    disabled: boolean;
    defaultImage?: IUserInfoImage;
}
