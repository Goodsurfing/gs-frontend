const DEFAULT_TAG_COLOR = "#3DABF7";

/**
 * Карточка статьи (новости, блог) — как entities/Article/ui/ArticleCard
 * старого фронта: обложка, заголовок, дата и цветные теги категорий, лайки и комментарии.
 */
export function ArticleCard({ href, image, name, created, tags, likeCount, reviewCount }: {
    href: string;
    image?: string;
    name: string;
    created: string;
    tags: { id: number; name: string; color: string }[];
    likeCount: number;
    reviewCount: number;
}) {
    return (
        <a href={href} className="w-full text-inherit no-underline">
            <div className="flex cursor-pointer flex-col">
                {/* eslint-disable-next-line @next/next/no-img-element -- обложка из хранилища */}
                <img src={image} alt={name} className="h-[250px] w-full object-cover" />
                <span className="mt-5 text-[18px] font-medium">{name}</span>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="text-[14px] text-caption">{created}</span>
                    {tags.map((tag) => (
                        <div
                            key={tag.id}
                            style={{ backgroundColor: tag.color || DEFAULT_TAG_COLOR }}
                            className={`flex max-w-[200px] items-center justify-center overflow-hidden rounded-[40px] px-2.5 py-[3px] text-ellipsis whitespace-nowrap ${tag.name.length > 25 ? "text-[12px]" : "text-[14px]"}`}
                        >
                            {tag.name}
                        </div>
                    ))}
                </div>
                <p className="mt-2 text-[14px] text-caption" />
                <div className="mt-2 flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/icons/ui/thumbs-up.svg" alt="likes" className="mr-1.5 h-4 w-4" />
                    <span className="text-[14px] font-bold">{likeCount}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/icons/ui/comment.svg" alt="comments" className="mr-1.5 ml-3.5 h-4 w-4" />
                    <span className="text-[14px] font-bold">{reviewCount}</span>
                </div>
            </div>
        </a>
    );
}
