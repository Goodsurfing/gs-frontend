import React, { useMemo, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { NotesContainer } from "@/widgets/NotesWidget";
import { statusColors } from "@/widgets/NotesWidget/model/lib/statusColors";

import {
    Application,
    FormApplicationStatus,
} from "@/entities/Application";
import { HostModalReview, useCreateVolunteerReviewMutation } from "@/entities/Review";
import { getErrorText } from "@/shared/lib/getErrorText";
import {
    HintType,
    ToastAlert,
} from "@/shared/ui/HintPopup/HintPopup.interface";
import SelectField from "@/components/SelectField/SelectField";

import { ReviewFields } from "../../model/types/notes";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import { useLocale } from "@/app/providers/LocaleProvider";
import {
    useGetMyHostApplicationsQuery,
    useUpdateApplicationFormStatusByIdMutation,
} from "@/entities/Chat";
import { useGetMyHostQuery } from "@/entities/Host";
import { useLazyGetHostAllOffersByIdQuery } from "@/entities/Offer";
import styles from "./NotesHostForm.module.scss";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";

const APPLICATIONS_PER_PAGE = 10;

interface VacancyOption {
    label: string;
    value: number | undefined;
}

// Раньше все статусы тянулись одной общей страницей и раскладывались по 3
// колонкам уже на фронте — счётчики и постраничность каждой колонки были
// неверными (row 101). Теперь у каждой колонки своя независимая
// пагинация и свой реальный total с бэкенда.
const useApplicationsColumn = (status: FormApplicationStatus, vacancyId?: number) => {
    const [page, setPage] = useState(1);

    const { data, isFetching } = useGetMyHostApplicationsQuery({
        status,
        vacancyId,
        limit: APPLICATIONS_PER_PAGE,
        page,
    });

    return {
        status,
        notes: data?.data ?? [],
        total: data?.pagination.total ?? 0,
        totalPages: data?.pagination
            ? Math.ceil(data.pagination.total / APPLICATIONS_PER_PAGE)
            : 0,
        page,
        setPage,
        isFetching,
    };
};

export const NotesHostForm = () => {
    const defaultValues: DefaultValues<ReviewFields> = {
        review: {
            stars: undefined,
            text: "",
        },
    };

    const { t } = useTranslation("host");
    const [toast, setToast] = useState<ToastAlert>();
    const [toastTop, setToastTop] = useState<ToastAlert>();
    const form = useForm<ReviewFields>({
        mode: "onChange",
        defaultValues,
    });
    const { handleSubmit, control, reset } = form;
    const [selectedApplication,
        setSelectedApplication] = useState<Application | null>(null);

    const [vacancyId, setVacancyId] = useState<number | undefined>(undefined);

    const { data: myHost } = useGetMyHostQuery();
    const [fetchVacancies, { data: vacanciesData }] = useLazyGetHostAllOffersByIdQuery();

    React.useEffect(() => {
        if (myHost?.id) {
            fetchVacancies({
                organizationId: myHost.id,
                limit: 100,
                page: 1,
                statuses: ["active", "disabled"],
            });
        }
    }, [myHost?.id, fetchVacancies]);

    const vacancyOptions = useMemo<VacancyOption[]>(() => [
        { label: t("hostNotes.Все вакансии"), value: undefined },
        ...(vacanciesData?.data ?? []).map((vacancy) => ({
            label: vacancy.title ?? t("hostNotes.Без названия"),
            value: vacancy.id,
        })),
    ], [vacanciesData, t]);

    const newColumn = useApplicationsColumn("new", vacancyId);
    const acceptedColumn = useApplicationsColumn("accepted", vacancyId);
    const canceledColumn = useApplicationsColumn("canceled", vacancyId);
    const columns = [newColumn, acceptedColumn, canceledColumn];

    const [createVolunteerReview] = useCreateVolunteerReviewMutation();
    const [updateApplicationStatus] = useUpdateApplicationFormStatusByIdMutation();
    const { locale } = useLocale();

    const isLoading = columns.every((column) => column.isFetching && column.notes.length === 0);

    const onReviewClick = (application: Application) => {
        setSelectedApplication(application);
    };

    const resetSelectedReview = () => {
        setSelectedApplication(null);
        setToast(undefined);
        reset();
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
                setToast({
                    text: t("hostNotes.Ваш отзыв был отправлен"),
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

    const handleUpdateStatus = async (
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

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination || destination.droppableId === source.droppableId) {
            return;
        }

        handleUpdateStatus(Number(draggableId), destination.droppableId as FormApplicationStatus);
    };

    if (isLoading) {
        return (
            <div><MiniLoader /></div>
        );
    }

    return (
        <div className={styles.wrapper}>
            {toastTop && <HintPopup text={toastTop.text} type={toastTop.type} />}
            <SelectField
                isSearchable={false}
                name="vacancyFilter"
                label={t("hostNotes.Вакансия")}
                options={vacancyOptions}
                value={vacancyOptions.find((option) => option.value === vacancyId)}
                onChange={(option) => {
                    const selected = option as VacancyOption | null;
                    setVacancyId(selected?.value);
                    columns.forEach((column) => column.setPage(1));
                }}
            />
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={styles.notes}>
                    {columns.map((column) => (
                        <NotesContainer
                            key={column.status}
                            onReviewClick={onReviewClick}
                            onAcceptClick={(appId) => handleUpdateStatus(appId, "accepted")}
                            onCancelClick={(appId) => handleUpdateStatus(appId, "canceled")}
                            status={column.status}
                            notes={column.notes}
                            total={column.total}
                            page={column.page}
                            totalPages={column.totalPages}
                            onPageChange={column.setPage}
                            color={statusColors[column.status]}
                            variant="host"
                            isDragDisable={false}
                            locale={locale}
                        />
                    ))}
                </div>
            </DragDropContext>
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
                        titleText={t("hostNotes.Оставьте отзыв")}
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
        </div>
    );
};
