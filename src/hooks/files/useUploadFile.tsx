import { API_MEDIA_BASE_URL } from "@/constants/api";

const sendRequestForGenerateUploadLink = async (fileName: string) => {
    const body = {
        fileName,
    };

    const token = localStorage.getItem("token");

    try {
        console.log(token);
        const response = await fetch(`${API_MEDIA_BASE_URL}/generate-upload-link`, {
            method: "POST",
            headers: new Headers({
                Authorization: `Bearer ${token}`,
            }),
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export const uploadFileMutation = async (url: string, data: FormData, contentType: string) => {
    try {
        await fetch(url, {
            method: "PUT",
            headers: new Headers({
                "Content-Type": contentType,
            }),
            body: data,
        });
    } catch (error) {
        console.log(error);
    }
};

export const useUploadFile = async (fileName: string, data: FormData) => {
    const generateLinkResponse = await sendRequestForGenerateUploadLink(fileName);
    console.log(generateLinkResponse);
    await uploadFileMutation(generateLinkResponse.url, data, generateLinkResponse.contentType);
    return generateLinkResponse.uuid;
};
