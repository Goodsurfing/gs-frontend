/**
 * Цветная плашка с заголовком страницы (юридические страницы старого фронта:
 * политика безопасности платежей, правила и т. п.) — градиент и размеры оттуда.
 */
export function PageBanner({ title }: { title: string }) {
    return (
        <section className="flex min-h-[190px] w-full items-center justify-center bg-[linear-gradient(257deg,#ebc50c_-1.78%,#00a0a8_103.74%)]">
            <h1 className="text-center text-[2.5rem] font-semibold text-white down-sm:text-[1.625rem]">{title}</h1>
        </section>
    );
}
