import { Avatar } from "@/components/ui/Avatar";

/** «Организация»: аватар, название, тип и «Подробнее» (OfferOrganizationCard) */
export function OfferOrganization({ name, type, response, image, href, labels }: {
    name: string;
    type: string;
    /** «Обычно отвечает за …» — responseStatsText; null — не показываем */
    response?: string | null;
    image?: string;
    href: string;
    labels: { title: string; more: string };
}) {
    return (
        <div id="organization" className="mt-10 flex flex-col gap-[30px] rounded-[10px] border border-caption p-[30px]">
            <h3 className="text-[1.17em] font-bold">{labels.title}</h3>
            <div className="flex flex-wrap justify-between gap-[30px]">
                <div className="flex max-w-[680px] flex-col gap-4">
                    <a href={href} className="flex items-center gap-5">
                        <Avatar src={image} name={name} size={30} />
                        <span className="text-[16px] text-primary">{name}</span>
                    </a>
                    <p>{type}</p>
                    {response && <p className="text-[14px] text-caption">{response}</p>}
                </div>
                <a
                    href={href}
                    className="flex h-9 max-w-[185px] min-w-[130px] items-center justify-center rounded-[10px] border border-primary text-[1rem] leading-[1.375rem] text-primary transition-all hover:bg-primary hover:text-white"
                >
                    {labels.more}
                </a>
            </div>
        </div>
    );
}
