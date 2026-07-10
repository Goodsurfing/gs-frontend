import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryV3 } from "@/shared/api/baseQuery/baseQuery";
import { CreateFeedback } from "../model/types/feedback";

export const feedbackApi = createApi({
    reducerPath: "feedbackApi",
    baseQuery: baseQueryV3,
    endpoints: (build) => ({
        createFeedback: build.mutation<void, CreateFeedback>({
            query: (body) => ({
                url: "feedback/create",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useCreateFeedbackMutation,
} = feedbackApi;
