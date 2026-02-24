export {
    journalApi,
    useLazyGetJournalListQuery,
    useGetJournalByIdQuery,
    usePutLikeJournalMutation,
    useLazyGetReviewsByJournalIdQuery,
    useCreateReviewJournalMutation,
} from "./api/journalApi";
export type {
    GetJournal, GetJournals, GetReviewsJournal,
} from "./model/journalSchema";
export {
    journalAdapter, journalApiAdapter, journalCardAdapter,
    journalReviewsAdapter,
} from "./lib/journalAdapter";
