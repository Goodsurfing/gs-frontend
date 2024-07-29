import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { mockedJournalsData } from "@/entities/Article/model/data/mockedArticleData";

import { Header } from "../Header/Header";
import { JournalFilter } from "../JournalFilter/JournalFilter";
import { JournalsList } from "../JournalsList/JournalsList";
import styles from "./JournalsPage.module.scss";

const JournalsPage = () => (
    <MainPageLayout>
        <Header />
        <div className={styles.container}>
            <div className={styles.top}>
                <JournalFilter />
            </div>
            <div className={styles.content}>
                <JournalsList
                    className={styles.journalsList}
                    data={mockedJournalsData}
                />
            </div>
        </div>
    </MainPageLayout>
);

export default JournalsPage;
