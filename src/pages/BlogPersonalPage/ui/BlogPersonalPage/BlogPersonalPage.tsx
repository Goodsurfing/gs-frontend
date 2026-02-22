import React from "react";
import { useParams } from "react-router-dom";

import { MainPageLayout } from "@/widgets/MainPageLayout";

import { BlogPersonal } from "@/widgets/Blog";

const BlogPersonalPage = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <MainPageLayout>
            <BlogPersonal blogId={Number(id)} />
        </MainPageLayout>
    );
};

export default BlogPersonalPage;
