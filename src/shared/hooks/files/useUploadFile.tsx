import { API_BASE_URL } from "@/shared/constants/api";
import { MediaObjectType } from "@/types/media";

// export interface ObjectMediaResponse {
//     "@id": string;
//     id: string;
//     contentUrl: string;
//     isImage: string;
//     mimeType: string;
//     originalHeight: number;
//     originalWidth: number;
//     thumbnails: {
//         large: string;
//         medium: string;
//         small: string;
//     }
// }

const sendRequestForGenerateUploadLink = async (
    fileName: string,
    data: File,
    signal?: AbortSignal,
) => {
    const formData = new FormData();
    formData.append("file", data);
    const response = await fetch(`${API_BASE_URL}media_objects`, {
        method: "POST",
        headers: new Headers({
            Accept: "application/ld+json",
        }),
        body: formData,
        signal,
    });

    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const dataResult: MediaObjectType = await response.json();
    return dataResult;
};

const uploadFile = async (
    fileName: string,
    data: File,
    signal?: AbortSignal,
) => {
    if (fileName && data) {
        return sendRequestForGenerateUploadLink(fileName, data, signal);
    }
    return null;
};

export default uploadFile;
