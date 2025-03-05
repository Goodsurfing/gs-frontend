import { API_BASE_URL } from "@/shared/constants/api";

export interface ObjectMediaResponse {
    "@id": string;
    id: string;
    contentUrl: string;
}

const uploadFile = async (fileName: string, data: File) => {
    const sendRequestForGenerateUploadLink = async () => {
        const formData = new FormData();
        formData.append("file", data);
        try {
            const response = await fetch(
                `${API_BASE_URL}media_objects`,
                {
                    method: "POST",
                    headers: new Headers({
                        Accept: "application/ld+json",
                    }),
                    body: formData,
                },
            );

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const dataResult: ObjectMediaResponse = await response.json();
            return dataResult;
        } catch (error) {
            return null;
        }
    };

    if (fileName && data) {
        const uploadedFile: ObjectMediaResponse | null = await sendRequestForGenerateUploadLink();
        if (uploadedFile) {
            return uploadedFile;
        }
    }
    return null;
};

export default uploadFile;
