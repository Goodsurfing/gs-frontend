import { API_BASE_URL } from "@/shared/constants/api";

export interface ObjectMediaResponse {
    id: string;
    contentUrl: string;
}

const createNewFileName = (file: File) => {
    if (file.type === "image/jpeg") {
        return file.name.replace(/\.jpg$/i, ".jpeg");
    }
    if (file.type === "image/png") {
        return file.name.replace(/\.png$/i, ".png");
    }
    return file.name;
};

const uploadFile = async (fileName: string, data: File, token: string) => {
    const sendRequestForGenerateUploadLink = async () => {
        const newFileName = createNewFileName(data);
        const body = {
            fileName: newFileName,
        };
        try {
            const response = await fetch(
                `${API_BASE_URL}/media_objects`,
                {
                    method: "POST",
                    headers: new Headers({
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    }),
                    body: JSON.stringify(body),
                },
            );
            const dataResult: ObjectMediaResponse = await response.json();

            return dataResult;
        } catch (error) {
            return null;
        }
    };
    if (fileName && data) {
        const uploadedFile: ObjectMediaResponse | null = await
        sendRequestForGenerateUploadLink();
        if (uploadedFile) {
            return uploadedFile;
        }
    }
};

// add get media_object

export default uploadFile;
