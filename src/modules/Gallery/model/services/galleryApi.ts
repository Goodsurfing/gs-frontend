import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "@/store/store";

interface GenerateLinkResponse {
    url: string;
    uuid: string;
    contentType: string;
}

export const galleryApi = createApi({
    reducerPath: "galleryApi",
    baseQuery: fetchBaseQuery({
        credentials: "same-origin",
        baseUrl: `${process.env._BASE_URL}api/v1`,
        prepareHeaders: (headers, { getState }) => {
            const { token } = (getState() as RootState).login;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            headers.set("Access-Control-Allow-Origin", "*");
            headers.set("Content-Type", "application/json");
            return headers;
        },
    }),
    endpoints: (build) => {
        return {
            generateLink: build.mutation<GenerateLinkResponse, { fileName: string }>({
                query: (data: { fileName: string }) => {
                    console.log(data);
                    return {
                        url: "/media/generate-upload-link",
                        method: "POST",
                        body: data,
                    };
                },
            }),
        };
    },
});
