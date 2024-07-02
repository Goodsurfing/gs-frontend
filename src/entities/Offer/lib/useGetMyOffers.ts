import { useEffect, useState } from "react";
import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";
import { Offer } from "../model/types/offer";
import { useLazyGetHostOffersByIdQuery } from "../api/offerApi";

export const useGetMyOffers = () => {
    const { data: myHost } = useGetMyHostQuery();
    const [trigger] = useLazyGetHostOffersByIdQuery();

    const [data, setData] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const fetchOffers = async () => {
            if (myHost) {
                try {
                    const offers = await trigger(myHost?.id).unwrap();
                    setData(offers);
                    setIsLoading(false);
                } catch (err) {
                    setError(err);
                    setIsLoading(false);
                }
            }
        };
        fetchOffers();
    }, [myHost, trigger]);

    return { data, isLoading, error };
};
