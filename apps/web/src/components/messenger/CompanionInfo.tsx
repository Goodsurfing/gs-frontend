"use client";

import type { components } from "@goodsurfing/api";
import { useEffect, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import { formatDay } from "@/lib/messenger";
import { textSlice } from "@/lib/textSlice";
import type { Locale } from "@/i18n/config";

export type CompanionProfile = components["schemas"]["ElementByIdResult"];

export interface CompanionLabels {
    title: string;
    close: string;
    volunteer: string;
    host: string;
    viewOrganization: string;
    skills: string;
    noSkills: string;
    languages: string;
    noLanguages: string;
    projects: string;
    noProjects: string;
    loading: string;
}

/**
 * Карточка собеседника справа от переписки (UserInfoCard старого фронта):
 * роль, дата рождения, имя, место; «Посмотреть организацию»; умения, языки
 * и до трёх проектов, где он участвовал.
 */
export function CompanionInfo({ locale, user, name, hrefs, dict, open, onClose, labels }: {
    locale: Locale;
    user: CompanionProfile;
    name: string;
    hrefs: { volunteer: string; organization: string; offer: string };
    dict: { skills: Record<string, string>; languages: Record<string, string>; levels: Record<string, string> };
    open: boolean;
    onClose: () => void;
    labels: CompanionLabels;
}) {
    const volunteer = user.volunteer as CompanionProfile["volunteer"] | null;
    const projectIds = (volunteer?.participatedVacancyIds ?? []).slice(0, 3);
    const [projects, setProjects] = useState<{ id: number; title: string }[] | null>(null);

    useEffect(() => {
        if (projectIds.length === 0) return;
        let cancelled = false;
        void Promise.all(projectIds.map((id) => browserApi()
            .GET("/api/v1/vacancy/{id}", { params: { path: { id: Number(id) } } })
            .then(({ data }) => (data ? { id: Number(id), title: (data as { description?: { title?: string | null } | null }).description?.title ?? "" } : null))
            .catch(() => null)))
            .then((list) => {
                if (!cancelled) setProjects(list.filter((item): item is { id: number; title: string } => item !== null));
            });
        return () => {
            cancelled = true;
        };
        // Список проектов меняется вместе с собеседником
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectIds.join(",")]);

    const roles = [volunteer ? labels.volunteer : null, user.hostId ? labels.host : null].filter(Boolean).join(", ");
    const place = user.country && user.city ? `${user.country}, ${user.city}` : (user.country || user.city || "");
    const languages = volunteer?.languages ?? [];
    const caption = "text-[0.75rem] text-caption";

    return (
        <aside
            aria-label={labels.title}
            className={`w-full max-w-[320px] overflow-x-hidden overflow-y-auto bg-white ${open ? "block" : "hidden"} down-xl:absolute down-xl:right-0 down-xl:h-full down-xl:shadow-[-15px_0_20px_0_rgba(33,33,33,0.05)]`}
        >
            <div className="sticky top-0 flex h-[60px] items-center justify-between gap-2.5 border-b border-primary bg-white px-4">
                <span className="font-medium">{labels.title}</span>
                <button type="button" aria-label={labels.close} onClick={onClose} className="flex cursor-pointer border-0 bg-transparent p-0">
                    <span aria-hidden className="h-5 w-5 bg-caption" style={{ maskImage: "url(/web/icons/messenger/delete.svg)", WebkitMaskImage: "url(/web/icons/messenger/delete.svg)", maskSize: "contain", maskRepeat: "no-repeat" }} />
                </button>
            </div>
            <div className="flex flex-col gap-[30px] px-4 py-5">
                <a href={hrefs.volunteer.replace("{id}", user.id)} className="flex gap-4 text-inherit no-underline">
                    <Avatar src={mediaUrl(user.image, "small")} name={name} size={70} />
                    <div className="flex flex-col gap-1 break-words">
                        <span className={caption}>
                            {roles}
                            <br />
                            {user.birthDay ? formatDay(locale, user.birthDay) : ""}
                        </span>
                        <span className="text-[1rem] text-ink-secondary">{name}</span>
                        <span className={caption}>{place}</span>
                    </div>
                </a>
                {user.hostId && (
                    <a href={hrefs.organization.replace("{id}", user.hostId)} className="rounded-[10px] border border-primary p-2.5 text-center text-primary no-underline transition-all duration-300 hover:bg-primary hover:text-white">
                        {labels.viewOrganization}
                    </a>
                )}
                {volunteer && (
                    <div className="flex flex-col gap-2">
                        <span className={caption}>{labels.skills}</span>
                        {(volunteer.skills ?? []).length === 0
                            ? <span>{labels.noSkills}</span>
                            : (volunteer.skills ?? []).map((skill) => {
                                // Значок умения есть в ответе, но не описан в OpenAPI
                                const icon = mediaUrl((skill as { image?: { contentUrl?: string | null } | null }).image, "small");
                                return (
                                    <span key={skill.id} className="flex items-center gap-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element -- значок умения с API */}
                                        {icon && <img src={icon} alt="" className="h-5 w-5" />}
                                        {dict.skills[skill.name] ?? skill.name}
                                    </span>
                                );
                            })}
                    </div>
                )}
                <div className="flex flex-col gap-2">
                    <span className={caption}>{labels.languages}</span>
                    <div>
                        {languages.length === 0 ? labels.noLanguages : languages.map((item, index) => (
                            <span key={`${item.language}-${index}`}>
                                {index > 0 && ", "}
                                <span className="text-ink-secondary">{dict.languages[item.language] ?? item.language}</span>
                                {item.languageLevel && <span className="text-caption">/{dict.levels[item.languageLevel] ?? item.languageLevel}</span>}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <span className={caption}>{labels.projects}</span>
                    <ul className="flex list-inside flex-col gap-1 pt-[5px]">
                        {projectIds.length === 0 && <span className="text-[0.75rem] text-primary">{labels.noProjects}</span>}
                        {projectIds.length > 0 && projects === null && <span className="text-[0.75rem] text-primary">{labels.loading}</span>}
                        {(projects ?? []).map((project) => (
                            <li key={project.id} className="text-[0.75rem] text-primary">
                                <a href={hrefs.offer.replace("{id}", String(project.id))} className="text-primary underline decoration-transparent transition-all duration-200 hover:decoration-primary">
                                    {textSlice(project.title, 30, "")}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </aside>
    );
}
