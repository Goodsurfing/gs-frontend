export enum HintType {
    Error = "error",
    Success = "success",
}

export interface IHintPopup {
    type: HintType;
    text: string;
    className?: string;
    timeout?: number;
}

export interface ToastAlert {
    text: string;
    type: HintType
}
