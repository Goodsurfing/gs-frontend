import { API_MEDIA_BASE_URL } from "@/shared/constants/api";

interface GenerateLinkResponse {
    url: string;
    contentType: string;
    uuid: string;
}

const uploadFile = async (
    fileName: string,
    data: any,
    token: string,
) => {
    const sendRequestForGenerateUploadLink = async () => {
        const body = {
            fileName,
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
            // fix this replaced url in backend
            const replacedUrl = dataResult.url.replace(
                "minio:9000",
                "storage.gudserfing.ru",
            );
            return { ...dataResult, url: replacedUrl };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };
    const uploadFileMutation = async (link: GenerateLinkResponse) => {
        console.log(link);
        try {
            await fetch(link.url, {
                method: "PUT",
                credentials: "same-origin",
                headers: new Headers({
                    Authorization: `Bearer ${JSON.parse(token)}`,
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
            // eslint-disable-next-line no-console
            console.log("generateLinkResponse", generateLinkResponse);
            uploadFileMutation(generateLinkResponse);
            return generateLinkResponse.url;
        }
    }
};

export default uploadFile;
