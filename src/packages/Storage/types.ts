export type StorageUploadResultSuccessType = {};
export type StorageUploadResultErrorType = string;

// I don't want to sacrifice readability for lint's 1st rule
// eslint-disable-next-line max-len
export type StorageUploadResultType = Promise<StorageUploadResultSuccessType | StorageUploadResultErrorType>;

export type AttachmentType = {
    fileName: string;
};

export interface StorageType {
    /**
     * Storage an attachment
     *
     * @param {string} attachment The attachment to store
     * @return the attachment id or error
     */
    upload: (attachment: AttachmentType) => StorageUploadResultType;

    /**
     * Retrieve the attachment from the storage server
     *
     * @param {string} attachmentId The attachment id
     * @return the attachment
     */
    download: (attachmentId: string) => StorageUploadResultType;
}

export type StorageInstanceType = StorageType & {};
