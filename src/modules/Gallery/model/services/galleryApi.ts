import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
import { API_BASE_URL } from "@/shared/constants/api";

interface MediaObjectResponse {
    contentUrl: string;
    id: string;
}

export const galleryApi = createApi({
    reducerPath: "galleryApi",
    baseQuery: fetchBaseQuery({
        credentials: "same-origin",
        baseUrl: `${API_BASE_URL}`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem(TOKEN_LOCALSTORAGE_KEY);
            if (token) {
                headers.set("Authorization", `Bearer ${JSON.parse(token)}`);
            }
            // headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    endpoints: (build) => ({
        getMediaObjectById: build.mutation<MediaObjectResponse, string>({
            query: (fileId) => ({
                url: "/media_objects",
                method: "POST",
                body: fileId,
            }),
        }),
    }),
});
