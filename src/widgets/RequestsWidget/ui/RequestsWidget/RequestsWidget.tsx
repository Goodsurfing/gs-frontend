import cn from "classnames";
import { memo, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ReviewFields } from "@/features/Notes";

import {
    Application,
    FormApplicationStatus,
    RequestCard,
} from "@/entities/Application";
import { Locale } from "@/entities/Locale";
import { HostModalReview } from "@/entities/Review";
import { useCreateVolunteerReviewMutation } from "@/entities/Review/api/reviewApi";

import { getHostNotesPageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Text } from "@/shared/ui/Text/Text";

import { getErrorText } from "@/shared/lib/getErrorText";
import { useGetMyHostApplicationsQuery, useUpdateApplicationFormStatusByIdMutation } from "@/entities/Chat";
import styles from "./RequestsWidget.module.scss";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

interface RequestsWidgetProps {
    className?: string;
    locale: Locale;
}

const APPLICATIONS_PER_PAGE = 10;

export const RequestsWidget = memo((props: RequestsWidgetProps) => {
    const { className, locale } = props;
    const {
        data: applications,
        isLoading: isApplicationsLoading,
        refetch,
    } = useGetMyHostApplicationsQuery({ limit: APPLICATIONS_PER_PAGE, page: 1 });
    const [createVolunteerReview] = useCreateVolunteerReviewMutation();
    const [updateApplicationStatus] = useUpdateApplicationFormStatusByIdMutation();
    const { t } = useTranslation("host");
    const navigate = useNavigate();

    const defaultValues: DefaultValues<ReviewFields> = {
        review: {
            stars: undefined,
            text: "",
        },
    };

    const [toast, setToast] = useState<ToastAlert>();
    const [toastTop, setToastTop] = useState<ToastAlert>();
    const [selectedApplication,
        setSelectedApplication] = useState<Application | null>(null);
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;

    const navigateTo = () => {
        navigate(getHostNotesPageUrl(locale));
    };

    const onReviewClick = (application: Application) => {
        setSelectedApplication(application);
    };

    const resetSelectedReview = () => {
        setSelectedApplication(null);
        setToast(undefined);
        reset();
    };

    const handleUpdateApplicationStatus = async (
        applicationId: number,
        status: FormApplicationStatus,
    ) => {
        setToastTop(undefined);
        try {
            await updateApplicationStatus({ applicationId: applicationId.toString(), status })
                .unwrap();
        } catch {
            setToastTop({
                text: "Не удалось изменить статус заявки",
                type: HintType.Error,
            });
        }
    };

    const renderRequests = () => {
        if (isApplicationsLoading) return <p>{t("host-dashboard.Загрузка...")}</p>;
        if (!applications || applications.data.length === 0) {
            return <Text text={t("host-dashboard.На данный момент заявки отсутсвуют")} />;
        }

        return applications.data.map((application) => (
            <RequestCard
                key={application.id}
                application={application}
                locale={locale}
                onReviewClick={onReviewClick}
                onAcceptClick={(appId) => { handleUpdateApplicationStatus(appId, "accepted"); }}
                onCancelClick={(appId) => { handleUpdateApplicationStatus(appId, "canceled"); }}
            />
        ));
    };

    const onSendReview = handleSubmit(async (data) => {
        const {
            review: { stars, text },
        } = data;
        if (selectedApplication && stars) {
            setToast(undefined);
            try {
                await createVolunteerReview({
                    vacancyId: selectedApplication.vacancy.id,
                    volunteerId: selectedApplication.volunteer.id,
                    rating: stars,
                    description: text,
                })
                    .unwrap();
                await refetch();
                setToast({
                    text: t("host-dashboard.Ваш отзыв был отправлен"),
                    type: HintType.Success,
                });
            } catch (error: unknown) {
                setToast({
                    text: getErrorText(error),
                    type: HintType.Error,
                });
            } finally {
                reset();
            }
        }
    });

    return (
        <>
            <div className={cn(styles.wrapper, className)}>
                {toastTop && <HintPopup text={toastTop.text} type={toastTop.type} />}
                <div className={styles.titleWrapper}>
                    <h3 className={styles.title}>
                        {t("host-dashboard.Заявки")}
                    </h3>
                    <p className={styles.requests}>
                        {t("host-dashboard.Новых заявок")}
                        {": "}
                        <span className={styles.requestsCount}>
                            {applications
                                ? applications.data.filter(
                                    (app) => app.status === "new",
                                ).length
                                : 0}
                        </span>
                    </p>
                </div>
                <div className={styles.requestsWrapper}>
                    <div className={styles.requestsItems}>
                        {renderRequests()}
                    </div>
                    {applications?.data.length ? (
                        <Button
                            variant="FILL"
                            color="BLUE"
                            size="MEDIUM"
                            onClick={navigateTo}
                        >
                            {t("host-dashboard.Посмотреть все")}
                        </Button>
                    ) : null}
                </div>
            </div>
            <Controller
                name="review"
                control={control}
                render={({ field }) => (
                    <HostModalReview
                        value={field.value}
                        onChange={field.onChange}
                        review={selectedApplication ? {
                            vacancyId: selectedApplication.vacancy.id,
                            id: selectedApplication.volunteer.id,
                            firstName: selectedApplication.volunteer.firstName,
                            lastName: selectedApplication.volunteer.lastName,
                            image: selectedApplication.volunteer.image,
                            city: selectedApplication.volunteer.city,
                            country: selectedApplication.volunteer.country,
                            statusApplication: selectedApplication.status,
                        } : null}
                        isOpen={!!selectedApplication}
                        onClose={resetSelectedReview}
                        sendReview={() => onSendReview()}
                        titleText={t("host-dashboard.Оставьте отзыв")}
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
                        locale={locale}
                    />
                )}
            />
        </>
    );
});
