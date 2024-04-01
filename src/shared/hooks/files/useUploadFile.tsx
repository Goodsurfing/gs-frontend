import { API_MEDIA_BASE_URL } from "@/shared/constants/api";

interface GenerateLinkResponse {
    url: string;
    contentType: string;
    uuid: string;
}

const uploadFile = async (fileName: string, data: File, token: string) => {
    const sendRequestForGenerateUploadLink = async () => {
        const body = {
            fileName,
        };
        console.log(body);
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
        const newFile = new File([data], `${link.uuid}.png`, { type: data.type });
        const formData = new FormData();
        formData.append(`${link.uuid}.png`, newFile);
        console.log(link.url);
        try {
            await fetch(link.url, {
                method: "PUT",
                headers: new Headers({
                    "Content-Type": link.contentType,
                }),
                body: newFile,
            });
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };
    if (fileName && data) {
        const generateLinkResponse: GenerateLinkResponse = await sendRequestForGenerateUploadLink();
        console.log(generateLinkResponse);
        if (generateLinkResponse) {
            uploadFileMutation(generateLinkResponse);
            return generateLinkResponse.url;
        }
    }
};

export default uploadFile;
