import { memo, MouseEventHandler } from "react";
import { useTranslation } from "react-i18next";
import { DonationProgressBar, GetDonations } from "@/entities/Donation";
import Button from "@/shared/ui/Button/Button";
import { getMediaContent } from "@/shared/lib/getMediaContent";
import calendarIcon from "@/shared/assets/icons/donation/calendar.svg";
import flagIcon from "@/shared/assets/icons/donation/flag.svg";
import styles from "./HostFundraiseCard.module.scss";

interface HostFundraiseCardProps {
    onCardClick: () => void;
    fundraise: GetDonations;
    onEditClick: MouseEventHandler<HTMLButtonElement>;
    onCloseClick: MouseEventHandler<HTMLButtonElement>;
    onDeleteClick: MouseEventHandler<HTMLButtonElement>;
}

export const HostFundraiseCard = memo(({
    onCardClick,
    fundraise,
    onEditClick,
    onCloseClick,
    onDeleteClick,
}: HostFundraiseCardProps) => {
    const { t } = useTranslation("host");

    const {
        name,
        shortDescription,
        percentAmountCollect,
        daysLeft,
        isClose,
        organization,
        image,
    } = fundraise;

    const imageSrc = getMediaContent(image?.contentUrl);

    return (
        <div
            className={styles.card}
            onClick={onCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    onCardClick();
                }
            }}
        >
            <div className={styles.imageWrapper}>
                {imageSrc ? (
                    <img src={imageSrc} alt={name ?? ""} className={styles.image} />
                ) : (
                    <div className={styles.imagePlaceholder} />
                )}
            </div>
            <div className={styles.content}>
                <DonationProgressBar
                    value={percentAmountCollect}
                    isSuccess={isClose}
                    className={styles.progressBar}
                />
                <h3 className={styles.title}>{name}</h3>
                <p className={styles.organization}>{organization?.name}</p>
                {shortDescription && (
                    <p className={styles.description}>{shortDescription}</p>
                )}
                <div className={styles.stats}>
                    <span className={styles.stat}>
                        <img src={flagIcon} alt="" />
                        {t("hostFundraises.Собрано")}
                        {" "}
                        {percentAmountCollect}
                        %
                    </span>
                    <span className={styles.stat}>
                        <img src={calendarIcon} alt="" />
                        {t("hostFundraises.Осталось дней")}
                        {" "}
                        {daysLeft}
                    </span>
                </div>
            </div>
            <div className={styles.buttons}>
                <Button
                    variant="FILL"
                    color="GREEN"
                    size="SMALL"
                    onClick={(event) => {
                        event.stopPropagation();
                        onEditClick(event);
                    }}
                >
                    {t("hostFundraises.Редактировать")}
                </Button>
                <Button
                    variant="OUTLINE"
                    color="GRAY"
                    size="SMALL"
                    onClick={(event) => {
                        event.stopPropagation();
                        onCloseClick(event);
                    }}
                >
                    {t("hostFundraises.Закрыть")}
                </Button>
                <Button
                    variant="FILL"
                    color="RED"
                    size="SMALL"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDeleteClick(event);
                    }}
                >
                    {t("hostFundraises.Удалить")}
                </Button>
            </div>
        </div>
    );
});
