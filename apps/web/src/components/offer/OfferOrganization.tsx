import { BadgeChips } from "@/components/achievements/BadgeChips";
import { MembershipBadges } from "@/components/membership/MembershipBadges";
import { SlowReplyChip } from "@/components/achievements/SlowReplyChip";
import { Avatar } from "@/components/ui/Avatar";

/** «Организация»: аватар, название, тип и «Подробнее» (OfferOrganizationCard) */
export function OfferOrganization({ name, type, response, image, href, labels, badges = [], badgesHref = "", slowReply = null, verified = null }: {
    name: string;
    type: string;
    /** «Обычно отвечает за …» — responseStatsText; null — не показываем */
    response?: string | null;
    image?: string;
    href: string;
    labels: { title: string; more: string };
    /** Значки организации («Отзывчивый организатор» и т. п.) */
    badges?: { id: number; name: string; description: string; image: string }[];
    badgesHref?: string;
    /** «Долго отвечает» — подпись и подсказка; null — организация отвечает нормально */
    slowReply?: { label: string; hint: string } | null;
    /** «Верифицированный хост» (GS-245): галочка и «Партнёр Гудсёрфинга», как на странице организации */
    verified?: { badge: string; hint: string; howTo: string; membershipHref: string } | null;
}) {
    return (
        <div id="organization" className="mt-10 flex flex-col gap-[30px] rounded-[10px] border border-caption p-[30px]">
            <h3 className="text-[1.17em] font-bold">{labels.title}</h3>
            <div className="flex flex-wrap justify-between gap-[30px]">
                <div className="flex max-w-[680px] flex-col gap-4">
                    <div className="flex flex-wrap items-center">
                        <a href={href} className="flex items-center gap-5">
                            <Avatar src={image} name={name} size={30} />
                            <span className="text-[16px] text-primary">{name}</span>
                        </a>
                        {verified && (
                            <MembershipBadges
                                badge={verified.badge}
                                membershipHref={verified.membershipHref}
                                labels={{ verified: verified.hint, howTo: verified.howTo }}
                            />
                        )}
                    </div>
                    <p>{type}</p>
                    {response && <p className="text-[14px] text-caption">{response}</p>}
                    {(slowReply || badges.length > 0) && (
                        <div className="flex flex-wrap items-center gap-2">
                            {slowReply && <SlowReplyChip {...slowReply} />}
                            <BadgeChips badges={badges} href={badgesHref} />
                        </div>
                    )}
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
