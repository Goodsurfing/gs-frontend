import React from "react";

import styles from "./VolunteerCreateArticlePage.module.scss";
import { ArticleForm } from "@/features/ArticleForm";
import { ArticleCover } from "@/features/ArticleForm/ui/UploadArticleCover/UploadArticleCover";

const VolunteerCreateArticlePage = () => (
    <div className={styles.wrapper}>
        <h2>Написать в блог</h2>
        <ArticleForm />
    </div>
);

export default VolunteerCreateArticlePage;
