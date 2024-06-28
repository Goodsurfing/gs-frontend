import { useEffect, useState } from "react";
import { useGetMyHostQuery } from "@/entities/Host/api/hostApi";
import { Offer } from "../model/types/offer";
import { BASE_URL } from "@/shared/constants/api";

export const useGetMyOffers = () => {
    const { data: myHost } = useGetMyHostQuery();

    const [data, setData] = useState<Offer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        const fetchOffers = async (links: string[]) => {
            try {
                const offers = await Promise.all(
                    links.map((url) => fetch(`${BASE_URL}${url}`).then((response) => {
                        if (!response.ok) {
                            throw new Error(`Ошибка при запросе: ${response.statusText}`);
                        }
                        return response.json();
                    })),
                );
                setData(offers);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        };
        if (myHost) {
            const offersLinks = myHost.vacancies || [];
            fetchOffers(offersLinks);
        }
    }, [myHost, myHost?.vacancies]);

    return { data, isLoading, error };
};
