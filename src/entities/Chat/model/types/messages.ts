export interface AttachmentType {
    contentUrl: string;
    mimeType: string;
    isImage: boolean;
    originalWidth: number;
    originalHeight: number;
    thumbnails: string[];
    id: string;
}

export interface Message {
    id: number;
    author: string;
    text: string;
    createdAt: string;
    viewed: boolean;
    applicationForm: string;
}

export interface CreateMessageType {
    text?: string;
    chat?: string;
    recipient?: string;
    recipientOrganization?: string;
    attachments: string[];
}

export interface CreateMessageResponse {
    id: number,
    author: string,
    text: string,
    chat: string,
    createdAt: string,
    applicationForm: string,
    attachments: AttachmentType[],
    readByUserIds: string[]
}
