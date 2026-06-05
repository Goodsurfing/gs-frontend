import React from "react";

import { useParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { NewsPersonal } from "@/widgets/News";

const NewsPersonalPage = () => {
    const { id } = useParams<{ id: string; }>();
    return (
        <MainPageLayout headerVariant="static">
            {id && (
                <NewsPersonal newsId={id} />
            )}
        </MainPageLayout>
    );
};

export default NewsPersonalPage;
