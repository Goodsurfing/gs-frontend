import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateBlogMutation } from "@/entities/Blog";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { getVolunteerArticlesPageUrl } from "@/shared/config/routes/AppUrls";
import { useLocale } from "@/app/providers/LocaleProvider";
import { ArticleForm, ArticleFormFields } from "@/features/ArticleForm";

interface VolunteerCreateArticleProps {
    className?: string;
}

export const VolunteerCreateArticle: FC<VolunteerCreateArticleProps> = (props) => {
    const { className } = props;
    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const [createBlog, { isLoading }] = useCreateBlogMutation();
    const navigate = useNavigate();

    const onSuccess = () => {
        navigate(getVolunteerArticlesPageUrl(locale));
    };

    const onSubmit = async (data: ArticleFormFields) => {
        setToast(undefined);
        const {
            name, description, image, isActive, categoryId,
        } = data;
        try {
            await createBlog({
                name,
                description,
                imageId: image?.id,
                isActive,
                categoryId: categoryId || null,
            }).unwrap();
            onSuccess();
        } catch {
            setToast({ text: "Произошла ошибка при создании статьи", type: HintType.Error });
        }
    };

    return (
        <div className={className}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <ArticleForm
                category="Blog"
                onComplete={onSubmit}
                isLoading={isLoading}
                onErrorUploadImage={() => {}}
            />
        </div>
    );
};
