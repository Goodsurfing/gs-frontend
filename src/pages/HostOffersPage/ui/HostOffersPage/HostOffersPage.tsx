import { useLocale } from "@/app/providers/LocaleProvider";

import image from "@/shared/assets/images/default-offer-image.svg";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { getOffersWelcomePageUrl } from "@/shared/config/routes/AppUrls";

import HostOffersPageCard from "../HostOffersPageCard/HostOffersPageCard";

import styles from "./HostOffersPage.module.scss";
import { HostOffersList } from "../HostOffersList/HostOffersList";

const HostOffersPage = () => {
    const { locale } = useLocale();
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.abilities}>Мои возможности</h2>
            <HostOffersList />
            <div className={styles.drafts}>
                <h2 className={styles.draftsTitle}>Черновики</h2>
                <div className={styles.cards}>
                    <HostOffersPageCard
                        title="Работа в заповеднике Лен. область"
                        image={image}
                        location="Казань, Россия"
                        category="Работа с животными"
                        rating="4.3"
                        likes="10"
                        reviews="14"
                        went="22"
                        description="Если у вас есть желание работать с детьми и помогать им, найти единомышленников и завести интересные знакомст.."
                    />
                </div>
            </div>
            <div className={styles.btnWrapper}>
                <ButtonLink
                    type="primary"
                    path={getOffersWelcomePageUrl(locale)}
                    className={styles.btn}
                >
                    Добавить предложение
                </ButtonLink>
            </div>
        </div>
    );
};

export default HostOffersPage;
