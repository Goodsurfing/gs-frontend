import { API_BASE_URL } from "@/shared/constants/api";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
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
    const token = JSON.parse(localStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null")
                || JSON.parse(sessionStorage.getItem(TOKEN_LOCALSTORAGE_KEY) || "null");

    if (!token) {
        throw new Error("Токен авторизации не найден");
    }
    const formData = new FormData();
    formData.append("file", data);
    const response = await fetch(`${API_BASE_URL}media_objects`, {
        method: "POST",
        headers: new Headers({
            Accept: "application/ld+json",
            Authorization: `Bearer ${token}`,
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
