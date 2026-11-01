/**
 * Карточки академии (CourseCard и LessonCard старого фронта): обложка слева,
 * справа название, показатели, описание и кнопка; уже 992 px — столбиком.
 * Вся карточка — ссылка; кнопка внутри — оформление, не вторая ссылка
 * (в старом фронте ссылка была вложена в ссылку).
 */

const text14 = "text-[14px] leading-[130%] font-medium";
const button = "inline-block w-fit rounded-[10px] bg-primary px-10 py-2.5 text-center text-[1rem] leading-[1.375rem] text-white transition-all duration-300 group-hover:bg-primary-hover down-lg:w-full";

function Rating({ value }: { value: number }) {
    return (
        <div className="flex items-center gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
            <img src="/web/icons/offer/star.svg" alt="star-icon" />
            <span>{value}</span>
        </div>
    );
}

export function CourseCard({ href, title, cover, videos, duration, rating, author, description, labels }: {
    href: string;
    title: string;
    cover?: string;
    videos: number;
    duration: string;
    rating: number;
    author: string;
    description: string;
    labels: { videos: string; author: string; open: string };
}) {
    return (
        <a href={href} className="group flex w-full gap-[30px] text-inherit no-underline down-lg:max-w-[575px] down-lg:flex-col">
            {/* eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища, пропорция превью 307×222 */}
            <img src={cover || "/web/images/default-offer.png"} alt={title} className="block aspect-[307/222] h-auto w-[320px] shrink-0 grow-0 basis-[320px] object-cover down-lg:w-full down-lg:basis-auto" />
            <div className="flex min-w-0 flex-1 flex-col gap-[30px]">
                <div className="flex flex-col gap-2">
                    <h3 className="text-[18px] leading-[130%] font-medium">{title}</h3>
                    <div className={`flex gap-4 ${text14}`}>
                        <div className="text-caption">{videos} {labels.videos}</div>
                        <div className="text-caption">•</div>
                        {duration !== "" && (
                            <>
                                <div className="text-caption">{duration}</div>
                                <div className="text-caption">•</div>
                            </>
                        )}
                        <Rating value={rating} />
                    </div>
                    <span className={`${text14} text-caption`}>{labels.author}: {author}</span>
                    <p className={text14}>{description}</p>
                </div>
                <span className={button}>{labels.open}</span>
            </div>
        </a>
    );
}

export function LessonCard({ href, title, cover, duration, rating, description, open }: {
    href: string;
    title: string;
    cover?: string;
    duration: string;
    rating: number;
    description: string;
    open: string;
}) {
    return (
        <a href={href} className="group flex w-full gap-[30px] text-inherit no-underline down-lg:max-w-[575px] down-lg:flex-col">
            {cover
                // eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища
                ? <img src={cover} alt={title} className="h-full max-h-[300px] w-full max-w-[575px] object-cover" />
                : <div className="h-full max-h-[300px] w-full max-w-[575px] bg-field" />}
            <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-2">
                    <h3 className="text-[18px] leading-[130%] font-medium">{title}</h3>
                    <div className={`flex gap-4 ${text14}`}>
                        <div className="text-caption">{duration}</div>
                        <Rating value={rating} />
                    </div>
                    <p className={text14}>{description}</p>
                </div>
                <span className={button}>{open}</span>
            </div>
        </a>
    );
}
