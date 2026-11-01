import type { ReactNode } from "react";

import { OfferShare } from "@/components/offer/OfferShare";
import { cleanHtml } from "@/lib/html";
import type { ArticleKind } from "@/lib/articleActions";

import { ArticleComments, ArticleLikes, type ArticleTexts } from "./ArticleInteractive";

/**
 * Страница материала (NewsPersonal/BlogPersonal/JournalPersonal/
 * VideoPersonal старого фронта): хлебные крошки, карточка с заголовком,
 * автором, датой, тегами, лайками; содержимое; «Поделиться»; комментарии.
 */
export function ArticleDetail({ kind, id, breadcrumbs, title, author, date, tags, likes, reviews, html, media, shareUrl, volunteerHref, labels }: {
    kind: ArticleKind;
    id: string;
    breadcrumbs: { name: string; href?: string }[];
    title: string;
    author?: { name: string; avatar?: string; href: string };
    date: string;
    tags: { name: string; color: string }[];
    likes: number;
    reviews: number;
    /** HTML из редактора; null — без текста */
    html: string | null;
    /** Видео или журнал под текстом */
    media?: ReactNode;
    shareUrl: string;
    volunteerHref: string;
    labels: ArticleTexts & { share: string; shareTitle: string };
}) {
    return (
        <div className="mx-auto max-w-[1180px] pt-[60px] pb-[100px] max-[1200px]:pt-[30px]">
            <div className="max-[1200px]:px-5">
                <span className="text-[0.875rem] font-medium text-primary">
                    {breadcrumbs.map((item, index) => (
                        <span key={item.name}>
                            {item.href ? <a href={item.href} className="underline decoration-2">{item.name}</a> : <span>{item.name}</span>}
                            {index < breadcrumbs.length - 1 && " / "}
                        </span>
                    ))}
                </span>
            </div>
            <article className="mt-[30px] rounded-[20px] bg-white px-[120px] py-[60px] shadow-[0_5px_20px_0_rgba(14,29,39,0.05)] max-[1200px]:p-5">
                <h1 className="text-center text-[2em] font-bold">{title}</h1>
                <div className="mt-10 flex flex-wrap justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-x-[30px] gap-y-2.5">
                        {author && (
                            <a href={author.href} className="flex items-center gap-2">
                                {/* eslint-disable-next-line @next/next/no-img-element -- аватар */}
                                <img src={author.avatar} alt="auhtor avatar" className="h-[22px] w-[22px] rounded-full object-cover" />
                                <span className="text-[0.875rem] text-primary">{author.name}</span>
                            </a>
                        )}
                        <span className="text-caption">{date}</span>
                        {tags.map((tag) => (
                            <div key={tag.name} style={{ backgroundColor: tag.color }} className="rounded-[40px] px-2.5 py-[3px] text-[0.875rem]">{tag.name}</div>
                        ))}
                    </div>
                    <ArticleLikes kind={kind} id={id} likes={likes} reviews={reviews} texts={labels} />
                </div>
                <div className="mt-10">
                    {html !== null && (
                        <div
                            className={`${media ? "mb-[30px]" : ""} [&_a]:text-primary [&_a]:no-underline [&_a:hover]:underline [&_img]:max-w-full [&_img]:py-[15px] [&_ol]:list-decimal [&_ol]:pt-2.5 [&_ol]:pl-[30px] [&_p]:mt-[15px] [&_ul]:list-disc [&_ul]:pt-2.5 [&_ul]:pl-[30px]`}
                             
                            dangerouslySetInnerHTML={{ __html: cleanHtml(html) }}
                        />
                    )}
                    {media}
                </div>
                <OfferShare url={shareUrl} title={labels.shareTitle} label={labels.share} className="mt-10" />
            </article>
            <div className="mt-[30px] rounded-[20px] bg-white px-[120px] py-10 shadow-[0_5px_20px_0_rgba(14,29,39,0.05)] max-[1200px]:p-5">
                <ArticleComments kind={kind} id={id} count={reviews} volunteerHref={volunteerHref} texts={labels} />
            </div>
        </div>
    );
}
