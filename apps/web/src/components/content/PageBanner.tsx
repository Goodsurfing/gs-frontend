/**
 * Цветная плашка с заголовком страницы (юридические страницы, «Наша команда»
 * и т. п. старого фронта) — градиент и размеры оттуда. У амбассадоров свой градиент.
 */
const GRADIENTS = {
    default: "bg-[linear-gradient(257deg,#ebc50c_-1.78%,#00a0a8_103.74%)]",
    ambassadors: "bg-[linear-gradient(257deg,#65ffe3_-1.78%,#1064a0_103.74%)]",
};

export function PageBanner({ title, gradient = "default" }: { title: string; gradient?: keyof typeof GRADIENTS }) {
    return (
        <section className={`flex min-h-[190px] w-full items-center justify-center ${GRADIENTS[gradient]}`}>
            <h1 className="text-center text-[2.5rem] font-semibold text-white down-sm:text-[1.625rem]">{title}</h1>
        </section>
    );
}
