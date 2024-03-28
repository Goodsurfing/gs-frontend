import React from "react";
import { useLocale } from "@/app/providers/LocaleProvider";
import { MainPageLayout } from "@/widgets/MainPageLayout";
import {
    ArticleContent, ArticleHeader, ArticleShare, Navigation,
} from "@/features/Article";
import { getJournalsPageUrl } from "@/shared/config/routes/AppUrls";
import styles from "./JournalPersonalPage.module.scss";
import { CommentWidget } from "@/widgets/Article";

const JournalPersonalPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout>
            <div className={styles.wrapper}>
                <Navigation
                    mainLink={getJournalsPageUrl(locale)}
                    nameMain="Журнал"
                    nameArticle="Тестовая статья"
                />
                <div className={styles.articleWrapper}>
                    <ArticleHeader
                        className={styles.articleHeader}
                        title="Гудсерфер №18. Путешествия с пользой и польза для путешествий"
                        authorAvatar=""
                        authorName=""
                        category="Журнал"
                        date="17 мая 2017"
                    />
                    <ArticleContent className={styles.content} content={"<iframe src=\"https://www.mindomo.com/mindmap/colores-"} />
                    <ArticleShare className={styles.shareBlock} />
                </div>
                <div className={styles.commentWrapper}>
                    <CommentWidget />
                </div>
            </div>
        </MainPageLayout>
    );
};

export default JournalPersonalPage;
