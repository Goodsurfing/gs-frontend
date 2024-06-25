import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";
import { Offer } from "../model/types/offer";

export const useGetMyOffers = () => {
    const { data, isError, isLoading } = useGetMyHostQuery();
    const myOffersData: Offer[] | undefined = data?.vacancies;

    return { myOffersData, isError, isLoading };
};
