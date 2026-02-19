import React, { FC } from "react";
import { ArticleForm } from "@/features/ArticleForm";

interface VolunteerCreateArticleProps {
    className?: string;
}

export const VolunteerCreateArticle: FC<VolunteerCreateArticleProps> = (props) => {
    const { className } = props;
    return (
        <div className={className}>
            <ArticleForm onComplete={() => {}} onErrorUploadImage={() => {}} />
        </div>
    );
};
