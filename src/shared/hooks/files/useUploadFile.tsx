import { API_MEDIA_BASE_URL } from "@/shared/constants/api";

export interface GenerateLinkResponse {
    url: string;
    contentType: string;
    uuid: string;
}

const createNewFileName = (file: File) => {
    if (file.type === "image/jpeg") {
        return file.name.replace(".jpg", ".jpeg");
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
                `${API_MEDIA_BASE_URL}/generate-upload-link`,
                {
                    method: "POST",
                    headers: new Headers({
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    }),
                    body: JSON.stringify(body),
                },
            );
            const dataResult = await response.json();

            return dataResult;
        } catch (error) {
            // eslint-disable-next-line no-console
            return null;
        }
    };
    const uploadFileMutation = async (link: GenerateLinkResponse) => {
        // const newFile = new File([data], `${link.uuid}.png`, { type: data.type });
        // const formData = new FormData();
        // formData.append(`${link.uuid}`, newFile);
        try {
            await fetch(link.url, {
                method: "PUT",
                headers: new Headers({
                    "Content-Type": link.contentType,
                }),
                body: data,
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };
    if (fileName && data) {
        const generateLinkResponse: GenerateLinkResponse = await sendRequestForGenerateUploadLink();
        if (generateLinkResponse) {
            const result = await uploadFileMutation(generateLinkResponse)
                .then(() => true)
                .catch(() => false);
            if (result) return generateLinkResponse;
            // return generateLinkResponse;
        }
    }
};

export default uploadFile;
