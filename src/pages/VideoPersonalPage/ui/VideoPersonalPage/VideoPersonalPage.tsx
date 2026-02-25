import React from "react";

import { useParams } from "react-router-dom";
import { useLocale } from "@/app/providers/LocaleProvider";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { VideoPersonal } from "@/widgets/Video";

const VideoPersonalPage = () => {
    const { locale } = useLocale();
    const { id } = useParams<{ id: string }>();

    return (
        <MainPageLayout>
            {id && (
                <VideoPersonal videoId={id} locale={locale} />
            )}
        </MainPageLayout>
    );
};

export default VideoPersonalPage;
