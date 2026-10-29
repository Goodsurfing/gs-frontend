/** Шапка страниц сборов: жёлто-бирюзовый градиент и белый заголовок (Header страниц отчётности и рейтинга старого фронта) */
export function DonationHeader({ title }: { title: string }) {
    return (
        <section className="flex min-h-[190px] w-full items-center justify-center bg-[linear-gradient(257deg,#EBC50C_-1.78%,#00A0A8_103.74%)]">
            <h1 className="text-center text-[2.5rem] font-semibold text-white down-sm:text-[1.625rem]">{title}</h1>
        </section>
    );
}
