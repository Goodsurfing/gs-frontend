/**
 * Заголовок шага с пояснением (Text titleSize="h2" старого фронта): 26 px,
 * под ним через 40 px — текст 14 px, 500; уже 992 px — по центру.
 */
export function StepIntro({ title, text }: { title: string; text?: string }) {
    return (
        <div className={`flex flex-col ${text ? "gap-10" : ""}`}>
            <h1 className="text-[26px] leading-[120%] font-normal text-black down-lg:text-center">{title}</h1>
            {text && <p className="text-[14px] leading-[120%] font-medium text-black down-lg:text-center">{text}</p>}
        </div>
    );
}
