import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { MemberBanner } from "@/features/MemberBanner";

import { mockedVideoData } from "@/entities/Article/model/data/mockedArticleData";

import { Category } from "../Category/Category";
import { Header } from "../Header/Header";
import { VideoFilter } from "../VideoFilter/VideoFilter";
import { VideoList } from "../VideoList/VideoList";
import { VideoSearch } from "../VideoSearch/VideoSearch";
import styles from "./VideoPage.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";

const VideoPage = () => {
    const { locale } = useLocale();
    return (
        <MainPageLayout>
            <Header />
            <div className={styles.container}>
                <div className={styles.top}>
                    <VideoFilter />
                    <VideoSearch />
                </div>
                <div className={styles.content}>
                    <VideoList className={styles.newsList} data={mockedVideoData} />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "30px",
                        }}
                    >
                        <Category className={styles.category} locale={locale} />
                        <MemberBanner className={styles.memberBanner} />
                    </div>
                </div>
            </div>
        </MainPageLayout>
    );
};

export default VideoPage;
