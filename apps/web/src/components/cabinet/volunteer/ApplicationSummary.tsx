import { Thumb } from "@/components/ui/Thumb";
import { mediaUrl } from "@/lib/media";
import { applicationDates, applicationStatus, type ApplicationStatus, STATUS_TONE, type VolunteerApplication } from "@/lib/volunteerApplications";

export interface ApplicationSummaryLabels {
    status: Record<ApplicationStatus, string>;
    /** Что дальше — одна строка под статусом */
    next: Record<ApplicationStatus, string>;
    noTitle: string;
}

/**
 * Заявка волонтёра в одну карточку: фото вакансии, название, организатор,
 * даты, статус и что дальше. Общее для телефонного рабочего стола (GS-291)
 * и «Моих заявок» (GS-332); оборачивающая ссылка — у вызывающего.
 */
export function ApplicationSummary({ item, labels, thumb = 56, lazy = false, organizer = false, titleTag: Title = "span" }: {
    item: VolunteerApplication;
    labels: ApplicationSummaryLabels;
    thumb?: number;
    lazy?: boolean;
    /** Показать организатора (на старом бэкенде его нет — строки тогда нет) */
    organizer?: boolean;
    titleTag?: "span" | "h3";
}) {
    const status = applicationStatus(item.status);
    const dates = applicationDates(item);
    // На старом бэкенде (до GS-332) организатора в ответе нет
    const organization = organizer ? (item.vacancy.organization as { name?: string | null } | undefined)?.name?.trim() : undefined;
    return (
        <>
            <Thumb src={mediaUrl(item.vacancy.image, "small")} size={thumb} lazy={lazy} />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
                <Title className="m-0 line-clamp-2 text-[15px] leading-[130%] font-bold text-ink-secondary">{item.vacancy.title?.trim() || labels.noTitle}</Title>
                {organization && <span className="line-clamp-1 text-[13px] leading-[130%] text-ink-secondary">{organization}</span>}
                {dates && <span className="text-[13px] leading-[130%] text-caption">{dates}</span>}
                <span className={`w-fit rounded-full px-2 py-[3px] text-[12px] leading-[130%] font-semibold ${STATUS_TONE[status]}`}>{labels.status[status]}</span>
                <span className="text-[13px] leading-[130%] text-ink-secondary">{labels.next[status]}</span>
            </span>
        </>
    );
}
