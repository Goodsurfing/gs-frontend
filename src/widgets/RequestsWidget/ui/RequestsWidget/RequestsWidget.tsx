import cn from "classnames";
import { memo, useState } from "react";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ReviewFields } from "@/features/Notes";

import {
    FullFormApplication,
    RequestCard,
} from "@/entities/Application";
import { Locale } from "@/entities/Locale";
import { HostModalReview } from "@/entities/Review";
import { useCreateToVolunteerReviewMutation } from "@/entities/Review/api/reviewApi";

import { getHostNotesPageUrl } from "@/shared/config/routes/AppUrls";
import Button from "@/shared/ui/Button/Button";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { Text } from "@/shared/ui/Text/Text";

import styles from "./RequestsWidget.module.scss";
import { API_BASE_URL } from "@/shared/constants/api";
import { ErrorType } from "@/types/api/error";
import { getErrorText } from "@/shared/lib/getErrorText";
import { useGetMyHostApplicationsQuery } from "@/entities/Chat";

interface RequestsWidgetProps {
    className?: string;
    locale: Locale;
}

export const RequestsWidget = memo((props: RequestsWidgetProps) => {
    const { className, locale } = props;
    const {
        data: applications,
        isLoading: isApplicationsLoading,
    } = useGetMyHostApplicationsQuery();
    const [createToVolunteerReview] = useCreateToVolunteerReviewMutation();
    const { t } = useTranslation("host");
    const navigate = useNavigate();

    const defaultValues: DefaultValues<ReviewFields> = {
        review: {
            stars: undefined,
            text: "",
        },
    };

    const [toast, setToast] = useState<ToastAlert>();
    const [selectedApplication,
        setSelectedApplication] = useState<FullFormApplication | null>(null);
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;

    const navigateTo = () => {
        navigate(getHostNotesPageUrl(locale));
    };

    const onReviewClick = (application: FullFormApplication) => {
        setSelectedApplication(application);
    };

    const resetSelectedReview = () => {
        setSelectedApplication(null);
        setToast(undefined);
        reset();
    };

    const renderRequests = () => {
        if (isApplicationsLoading) return <p>{t("host-dashboard.Загрузка...")}</p>;
        if (!applications || applications.length === 0) {
            return <Text text={t("host-dashboard.На данный момент заявки отсутсвуют")} />;
        }

        const limitedApplications = applications.slice(-5);

        return limitedApplications.map((application) => (
            <RequestCard
                key={application.id}
                application={application}
                locale={locale}
                onReviewClick={onReviewClick}
            />
        ));
    };

    const onSendReview = handleSubmit(async (data) => {
        const {
            review: { stars, text },
        } = data;
        if (selectedApplication && stars) {
            setToast(undefined);
            await createToVolunteerReview({
                applicationForm: `${API_BASE_URL}application_forms/${selectedApplication.id.toString()}`,
                stars,
                text,
            })
                .unwrap()
                .then(() => {
                    setToast({
                        text: t("host-dashboard.Ваш отзыв был отправлен"),
                        type: HintType.Success,
                    });
                })
                .catch((error: ErrorType) => {
                    setToast({
                        text: getErrorText(error),
                        type: HintType.Error,
                    });
                })
                .finally(() => { reset(); });
        }
    });

    return (
        <>
            <div className={cn(styles.wrapper, className)}>
                <div className={styles.titleWrapper}>
                    <h3 className={styles.title}>
                        {t("host-dashboard.Заявки")}
                    </h3>
                    <p className={styles.requests}>
                        {t("host-dashboard.Новых заявок")}
                        {": "}
                        <span className={styles.requestsCount}>
                            {applications
                                ? applications.filter(
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
                    {applications?.length ? (
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
                        application={selectedApplication}
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
