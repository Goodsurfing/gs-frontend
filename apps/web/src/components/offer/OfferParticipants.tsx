"use client";

import { useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { browserApi } from "@/lib/browserApi";
import { mediaUrl } from "@/lib/media";
import type { OfferPerson, Page } from "@/lib/offerReview";

import { ShowNext } from "./ShowNext";
import { SectionTitle } from "./parts";

export interface ParticipantsLabels {
    title: string;
    description: string;
    empty: string;
    error: string;
    showNext: string;
    anonymous: string;
}

const PER_PAGE = 6;

export const personName = (person: OfferPerson, anonymous: string) => `${person.firstName || ""} ${person.lastName || ""}`.trim() || anonymous;

/**
 * «Участники»: первые шесть приходят с сервера, «Посмотреть следующие»
 * догружает по шесть (OfferContributorsCard старого фронта).
 */
export function OfferParticipants({ offerId, initial, volunteerHref, labels }: {
    offerId: number;
    /** null — первая страница не загрузилась */
    initial: Page<OfferPerson> | null;
    /** Адрес страницы волонтёра с {id} */
    volunteerHref: string;
    labels: ParticipantsLabels;
}) {
    const [items, setItems] = useState(initial?.items ?? []);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(initial === null);
    const [loading, setLoading] = useState(false);
    const total = initial?.total;

    const more = async () => {
        setLoading(true);
        try {
            const { data } = await browserApi().GET("/api/v1/profile/vacancy-participant/list/{vacancyId}", {
                params: { path: { vacancyId: offerId }, query: { page: page + 1, limit: PER_PAGE } },
            });
            if (!data) throw new Error("participants");
            setItems((prev) => [...prev, ...(data.data ?? [])]);
            setPage(page + 1);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="participants" className="mt-10 border-t border-black pt-5">
            <SectionTitle>{`${labels.title} ${total !== undefined ? `(${total})` : ""}`}</SectionTitle>
            <p className="mt-5">{labels.description}</p>
            <div className="my-5 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-10 gap-y-5">
                {error && <div>{labels.error}</div>}
                {!error && items.length === 0 && labels.empty}
                {!error && items.map((person) => {
                    const name = personName(person, labels.anonymous);
                    return (
                        <a
                            key={person.id}
                            href={volunteerHref.replace("{id}", person.id)}
                            className="flex w-full items-center gap-5 rounded-[2px] border border-accent-bg bg-white p-2.5 transition-all duration-300 hover:scale-105 hover:shadow-[0_5px_20px_0_rgb(33_33_33/15%)]"
                        >
                            <Avatar src={mediaUrl(person.image, "small")} name={name} size={40} />
                            <span className="text-[14px] font-medium">{name}</span>
                        </a>
                    );
                })}
            </div>
            {!error && total !== undefined && items.length > 0 && items.length < total && (
                <ShowNext onClick={more} disabled={loading} label={labels.showNext} />
            )}
        </div>
    );
}
