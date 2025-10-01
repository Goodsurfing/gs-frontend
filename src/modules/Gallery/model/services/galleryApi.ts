import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { TOKEN_LOCALSTORAGE_KEY } from "@/shared/constants/localstorage";
import { API_BASE_URL } from "@/shared/constants/api";
import { MediaObjectType } from "@/types/media";

// interface MediaObjectResponse {
//     "@id": string;
//     id: string;
//     contentUrl: string;
// }

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
            headers.set("Accept", "application/ld+json");
            return headers;
        },
    }),
    endpoints: (build) => ({
        getMediaObjectById: build.query<MediaObjectType, string>({
            query: (mediaId) => ({
                url: `/media_objects/${mediaId}`,
                method: "GET",
            }),
        }),
    }),
});

export const { useGetMediaObjectByIdQuery, useLazyGetMediaObjectByIdQuery } = galleryApi;
