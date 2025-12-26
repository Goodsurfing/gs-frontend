import cn from "classnames";
import React, {
    FC, memo, useCallback, useEffect, useState,
} from "react";

import { useTranslation } from "react-i18next";
import { OfferContributorCard } from "@/entities/Volunteer/ui/OfferContributorCard/OfferContributorCard";

import { ShowNext } from "@/shared/ui/ShowNext/ShowNext";
import { useLazyGetOfferParticipantListByOfferIdQuery } from "../../api/offerApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { OfferParticipant } from "../../model/types/offer";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import { getVolunteerPersonalPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useGetFullName } from "@/shared/lib/getFullName";
import { Text } from "@/shared/ui/Text/Text";
import styles from "./OfferContributorsCard.module.scss";

interface OfferContributorsCardProps {
    className?: string;
    offerId: number;
}

const VISIBLE_COUNT = 6;

export const OfferContributorsCard: FC<OfferContributorsCardProps> = memo(
    (props: OfferContributorsCardProps) => {
        const { className, offerId } = props;
        const { t } = useTranslation("offer");
        const [offerParticipants, setOfferParticipants] = useState<OfferParticipant[]>([]);
        const [page, setPage] = useState<number>(1);
        const [error, setError] = useState<string | null>(null);
        const { getFullName } = useGetFullName();
        const { locale } = useLocale();

        const [getOfferParticipants,
            {
                data: offerParticipantsData,
                isLoading, isFetching,
            }] = useLazyGetOfferParticipantListByOfferIdQuery();

        const fetchOfferParticipants = useCallback(async (pageItem: number) => {
            try {
                const result = await getOfferParticipants({
                    id: offerId,
                    limit: VISIBLE_COUNT,
                    page: pageItem,
                }).unwrap();
                if (result) {
                    setOfferParticipants((prev) => {
                        if (pageItem === 1) {
                            return [...result.data];
                        }
                        return [...prev, ...result.data];
                    });
                    setError(null);
                }
            } catch {
                setError(t("personalOffer.Произошла ошибка загрузки участников"));
            }
        }, [getOfferParticipants, offerId, t]);

        useEffect(() => {
            fetchOfferParticipants(page);
        }, [fetchOfferParticipants, page]);

        const renderCards = offerParticipants.map((offerParticipant) => (
            <OfferContributorCard
                url={getVolunteerPersonalPageUrl(locale, offerParticipant.id)}
                avatar={getMediaContent(offerParticipant.image?.thumbnails?.small)}
                name={getFullName(offerParticipant.firstName, offerParticipant.lastName)}
            />
        ));

        const renderContent = () => {
            if (error) {
                return <div className={styles.error}>{error}</div>;
            }
            if (offerParticipants.length === 0) {
                return t("personalOffer.На данный момент у данной вакансии нет участников");
            }
            return renderCards;
        };

        const handleShowNext = () => {
            setPage((prev) => prev + 1);
        };

        return (
            <div className={cn(className, styles.wrapper)} id="participants">
                <Text title={`${t("personalOffer.Участники")} ${offerParticipantsData ? `(${offerParticipantsData.pagination.total})` : ""}`} titleSize="h3" />
                <p className={styles.description}>
                    {t("В нашем сообществе вы можете поговорить с волонтерами, которые уже сотрудничали с этим хостом, и получить прямые ответы на свои вопросы.")}
                </p>
                <div className={styles.container}>
                    {renderContent()}
                    {(isLoading || isFetching) && <MiniLoader />}
                </div>
                {offerParticipantsData && offerParticipants.length > 0
                     && offerParticipants.length < offerParticipantsData.pagination.total && (
                // eslint-disable-next-line @typescript-eslint/indent
                     <ShowNext onClick={handleShowNext} />
                )}
            </div>
        );
    },
);
