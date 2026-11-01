import { DocumentLink } from "@/components/ui/DocumentLink";

/** Заголовок и сетка ссылок на документы (две колонки, уже 992 px — одна). */
export function ReportGroup({ title, links, className = "" }: {
    title: string;
    links: { title: string; href: string }[];
    className?: string;
}) {
    return (
        <div className={`flex flex-col ${className}`}>
            <h2 className="text-center text-[1.625rem] font-normal">{title}</h2>
            <div className="mt-[30px] grid w-full grid-cols-2 gap-2.5 down-lg:grid-cols-1">
                {links.map((link) => <DocumentLink key={link.href} title={link.title} href={link.href} />)}
            </div>
        </div>
    );
}
