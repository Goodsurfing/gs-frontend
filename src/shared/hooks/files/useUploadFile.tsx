import { API_BASE_URL } from "@/shared/constants/api";

export interface ObjectMediaResponse {
    "@id": string;
    id: string;
    contentUrl: string;
}

const sendRequestForGenerateUploadLink = async (fileName: string, data: File) => {
    const formData = new FormData();
    formData.append("file", data);
    const response = await fetch(`${API_BASE_URL}media_objects`, {
        method: "POST",
        headers: new Headers({
            Accept: "application/ld+json",
        }),
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const dataResult: ObjectMediaResponse = await response.json();
    return dataResult;
};

const uploadFile = async (fileName: string, data: File) => {
    if (fileName && data) {
        return sendRequestForGenerateUploadLink(fileName, data);
    }
    return null;
};

export default uploadFile;
