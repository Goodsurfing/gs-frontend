import React, { FC, useEffect, useState } from "react";
import { ArticleForm, ArticleFormFields } from "@/features/ArticleForm";
import { useGetBlogByIdQuery, useUpdateBlogMutation } from "@/entities/Blog";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { Locale } from "@/app/providers/LocaleProvider/ui/LocaleProvider";

interface VolunteerArticleInfoProps {
    className?: string;
    articleId: number;
    locale: Locale;
}

export const VolunteerArticleInfo: FC<VolunteerArticleInfoProps> = (props) => {
    const { className, articleId, locale } = props;
    const [toast, setToast] = useState<ToastAlert>();
    const [initialDataForm,
        setInitialDataForm] = useState<ArticleFormFields | undefined>(undefined);

    const {
        data: articleData,
        isLoading: isArticleLoading,
    } = useGetBlogByIdQuery({ id: articleId, lang: locale });
    const [updateBlog, { isLoading }] = useUpdateBlogMutation();

    const onErrorUploadImage = () => {
        setToast({ text: "Произошла ошибка при загрузке изображения", type: HintType.Error });
    };

    const onSubmit = async (data: ArticleFormFields) => {
        setToast(undefined);
        const {
            name, description, image, isActive, categoryId,
        } = data;
        try {
            await updateBlog({
                id: articleId,
                body: {
                    name,
                    description,
                    imageId: image?.id,
                    isActive,
                    categoryId: categoryId || null,
                },
            }).unwrap();
            const successToast = isActive ? "Статья успешно обновлена и опубликована" : "Статья успешно сохранена в черновиках";
            setToast({ text: successToast, type: HintType.Success });
        } catch {
            setToast({ text: "Произошла ошибка при обновлении статьи", type: HintType.Error });
        }
    };

    useEffect(() => {
        if (articleData) {
            const {
                name, description, image, isActive, blogCategoryResult,
            } = articleData;
            setInitialDataForm({
                name,
                description,
                image,
                isActive,
                categoryId: blogCategoryResult?.id,
            });
        }
    }, [articleData]);

    if (isArticleLoading) {
        return (
            <div className={className}>
                <MiniLoader />
            </div>
        );
    }

    return (
        <div className={className}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <ArticleForm
                category="Blog"
                initialData={initialDataForm}
                onComplete={onSubmit}
                isLoading={isLoading}
                onErrorUploadImage={onErrorUploadImage}
            />
        </div>
    );
};
