import { Link } from "react-router-dom";

import { getMainPageUrl } from "@/shared/config/routes/AppUrls";

import { useLocale } from "@/app/providers/LocaleProvider";
import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
    const { locale } = useLocale();
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1>404</h1>
                <p className={styles.smile}>🤕</p>
                <p className={styles.subtitle}>
                    Извините, но страница на которую вы хотели перейти
                    {" "}
                    <br />
                    {" "}
                    не существует.
                </p>
                <div className={styles.return}>
                    <Link className={styles.link} to={getMainPageUrl(locale)}>Главная</Link>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
