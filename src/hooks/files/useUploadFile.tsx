import { API_MEDIA_BASE_URL } from "@/constants/api";

interface GenerateLinkResponse {
    url: string;
    contentType: string;
    uuid: string;
}

const useUploadFile = async (fileName: string, data: any, token: string) => {
    const sendRequestForGenerateUploadLink = async () => {
        const body = {
            fileName,
        };
        console.log(body)
        try {
            const response = await fetch(
                `${API_MEDIA_BASE_URL}/generate-upload-link`,
                {
                    method: "POST",
                    headers: new Headers({
                        Authorization: `Bearer ${token}`,
                    }),
                    body: JSON.stringify(body),
                }
            );
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.log(error);
        }
    };
    const uploadFileMutation = async (link: GenerateLinkResponse) => {
        try {
            await fetch(link!.url, {
                method: "PUT",
                headers: new Headers({
                    "Content-Type": link!.contentType,
                }),
                body: data,
            });
        } catch (error) {
            console.log(error);
        }
    };
    if (fileName && data) {
        const generateLinkResponse: GenerateLinkResponse =
            await sendRequestForGenerateUploadLink();
        if (generateLinkResponse) {
            console.log(generateLinkResponse)
            uploadFileMutation(generateLinkResponse);
            return generateLinkResponse.uuid;
        }
    }
};

export default useUploadFile;
