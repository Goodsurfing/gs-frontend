import { API_MEDIA_BASE_URL } from "@/shared/constants/api";

export interface GenerateLinkResponse {
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

            return dataResult;
        } catch (error) {
            // eslint-disable-next-line no-console
            return null;
        }
    };
    const uploadFileMutation = async (link: GenerateLinkResponse) => {
        // const newFile = new File([data], `${link.uuid}.png`, { type: data.type });
        const formData = new FormData();
        formData.append("image", data);
        console.log(link.url);
        try {
            await fetch(link.url, {
                method: "PUT",
                headers: new Headers({
                    "Content-Type": link.contentType,
                }),
                body: formData,
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
            const result = await uploadFileMutation(generateLinkResponse)
                .then(() => true)
                .catch(() => false);
            if (result) return generateLinkResponse;
            // return generateLinkResponse;
        }
    }
};

export default uploadFile;
