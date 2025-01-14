import React, { useEffect, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { Pagination } from "@mui/material";
import { ErrorType } from "@/types/api/error";

import { NotesWidget } from "@/widgets/NotesWidget";

import { FullFormApplication } from "@/entities/Application";
import { VolunteerModalReview } from "@/entities/Review";
import { useCreateToOrganizationsReviewMutation } from "@/entities/Review/api/reviewApi";

import { API_BASE_URL } from "@/shared/constants/api";
import { getErrorText } from "@/shared/lib/getErrorText";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";

import { ReviewFields } from "../../model/types/notes";
import styles from "./NotesVolunteerForm.module.scss";
import { useLocale } from "@/app/providers/LocaleProvider";
import { useLazyGetMyVolunteerApplicationsQuery } from "@/entities/Application/api/applicationApi";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";

export const NotesVolunteerForm = () => {
    const defaultValues: DefaultValues<ReviewFields> = {
        review: {
            stars: undefined,
            text: "",
        },
    };

    const { locale } = useLocale();
    const [toast, setToast] = useState<ToastAlert>();
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control } = form;
    const [selectedApplication,
        setSelectedApplication] = useState<FullFormApplication | null>(null);

    const applicationsPerPage = 2;
    const [pageApplications, setPageApplications] = useState<FullFormApplication[]>([]);
    const [page, setPage] = useState<number>(1);
    const [getApplicationsData,
        { data: applications, isLoading }] = useLazyGetMyVolunteerApplicationsQuery();
    const [createToOrganizationReview] = useCreateToOrganizationsReviewMutation();

    useEffect(() => {
        getApplicationsData();
    }, [getApplicationsData]);

    useEffect(() => {
        if (applications) {
            const startIndex = (page - 1) * applicationsPerPage;
            const endIndex = startIndex + applicationsPerPage;
            setPageApplications(applications.slice(startIndex, endIndex));
        } else {
            setPageApplications([]);
        }
    }, [applications, page]);

    const totalPageCount = applications ? Math.ceil(applications.length / applicationsPerPage) : 0;

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (selectedApplicationId) {
    //             await getReviewData(selectedApplicationId.toString())
    //                 .unwrap()
    //                 .then((resultData) => {
    //                     const {
    //                         stars, text, applicationForm, id,
    //                     } = resultData;
    //                     reset({
    //                         review: {
    //                             stars,
    //                             text,
    //                             applicationForm,
    //                             id,
    //                         },
    //                     });
    //                 })
    //                 .catch(() => {
    //                     reset();
    //                 });
    //         }
    //     };
    //     fetchData();
    // }, [getReviewData, reset, selectedApplicationId]);

    const onReviewClick = (application: FullFormApplication) => {
        setSelectedApplication(application);
    };

    const resetSelectedReview = () => {
        setSelectedApplication(null);
    };

    const onSendReview = handleSubmit(async (data) => {
        const {
            review: { stars, text },
        } = data;
        if (selectedApplication) {
            setToast(undefined);
            const formData = new FormData();
            formData.append(
                "applicationForm",
                `${API_BASE_URL}application_forms/${selectedApplication.id.toString()}`,
            );
            if (stars) formData.append("stars", stars.toString());
            formData.append("text", text);
            await createToOrganizationReview(formData)
                .unwrap()
                .then(() => {
                    setToast({
                        text: "Ваш отзыв был отправлен",
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                });
        }
    });

    if (isLoading) {
        return (
            <div><MiniLoader /></div>
        );
    }

    return (
        <div className={styles.wrapper}>
            <NotesWidget
                className={styles.notes}
                notes={pageApplications}
                variant="volunteer"
                onReviewClick={onReviewClick}
                isDragDisable
                locale={locale}
            />
            <Pagination
                count={totalPageCount}
                page={page}
                onChange={(_, newPage) => setPage(newPage)}
                size="large"
            />
            <Controller
                name="review"
                control={control}
                render={({ field }) => (
                    <VolunteerModalReview
                        value={field.value}
                        onChange={field.onChange}
                        application={selectedApplication}
                        isOpen={!!selectedApplication}
                        onClose={resetSelectedReview}
                        locale={locale}
                        sendReview={() => onSendReview()}
                        successText={
                            toast?.type === HintType.Success
                                ? toast?.text
                                : undefined
                        }
                        errorText={
                            toast?.type === HintType.Error
                                ? toast?.text
                                : undefined
                        }
                    />
                )}
            />
        </div>
    );
};
