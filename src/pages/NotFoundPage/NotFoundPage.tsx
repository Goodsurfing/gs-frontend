import { ReactSVG } from "react-svg";

import { useLocale } from "@/app/providers/LocaleProvider";
import { getMainPageUrl } from "@/shared/config/routes/AppUrls";
import documentSearchIcon from "@/shared/assets/icons/document-search.svg";
import ButtonLink from "@/shared/ui/ButtonLink/ButtonLink";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout headerVariant="static">
            <div className={styles.wrapper}>
                <ReactSVG src={documentSearchIcon} className={styles.icon} />
                <h1 className={styles.title}>404</h1>
                <p className={styles.subtitle}>
                    Извините, но страница, на которую вы хотели перейти,
                    {" "}
                    <br />
                    не существует.
                </p>
                <ButtonLink
                    className={styles.link}
                    type="primary"
                    size="MEDIUM"
                    path={getMainPageUrl(locale)}
                >
                    На главную
                </ButtonLink>
            </div>
        </MainPageLayout>
    );
};

export default NotFoundPage;
