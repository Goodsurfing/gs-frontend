export {
    journalApi,
    useGetJournalByIdQuery,
    useLazyGetJournalListQuery,
    usePutLikeJournalMutation,
} from "./api/journalApi";
export type { GetJournal, GetJournals } from "./model/journalSchema";
export { journalAdapter, journalApiAdapter } from "./lib/journalAdapter";
