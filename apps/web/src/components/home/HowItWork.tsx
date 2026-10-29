import type { Locale } from "@/i18n/config";
import { getTranslator } from "@/i18n/dictionary";
import { routes } from "@/lib/routes";

import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
    { title: "Регистрация", text: "Зарегистрируйтесь и заполните свой профиль, оформите членство" },
    { title: "Выбор вакансии", text: "Выберите, куда вы хотите поехать и чем заняться" },
    { title: "Заявка", text: "Отправьте заявку принимающей стороне о вашем участии" },
    { title: "Подтверждение", text: "Получите подтверждение и обсудите подробности" },
    { title: "Путешествие", text: "Получайте удовольствие от нового места и общения" },
];

/**
 * «Как это работает»: пять шагов с картинками (у чётных картинка сверху),
 * уже 992 px — столбиком, картинка справа. Кнопка ведёт на страницу членства.
 * Как HowItWorkContainer старого фронта (главная, /find-job).
 */
export async function HowItWork({ locale, className = "" }: { locale: Locale; className?: string }) {
    const t = await getTranslator(locale, "main");

    return (
        <div className={`mt-[70px] flex w-full flex-col items-center down-lg:mt-[30px] ${className}`}>
            <div className="mb-20 flex w-full items-center justify-between down-lg:mb-10 down-lg:flex-col">
                {STEPS.map((step, index) => (
                    <Reveal
                        key={step.title}
                        from={index % 2 === 0 ? "down" : "up"}
                        className={`relative flex items-center ${index % 2 === 0 ? "flex-col" : "flex-col-reverse"} down-lg:mb-5 down-lg:w-[450px] down-lg:flex-row-reverse down-lg:justify-between down-xs:w-[320px]`}
                    >
                        <div className="text-center down-lg:ml-5 down-lg:w-[350px] down-lg:text-left down-xs:ml-2.5 down-xs:w-[250px]">
                            <h4 className="text-[1rem] leading-[150%] font-normal text-ink">{t(step.title)}</h4>
                            <p className="mt-1.5 text-[0.875rem] leading-[157%] text-ink-secondary opacity-50">{t(step.text)}</p>
                        </div>
                        {/* eslint-disable-next-line @next/next/no-img-element -- иконки 100×100 из старого фронта */}
                        <img src={`/web/images/how-it-work/img${index + 1}.png`} alt={t(step.title)} loading="lazy" className="my-2.5" />
                    </Reveal>
                ))}
            </div>
            <a
                href={routes.membership(locale)}
                className="inline-block cursor-pointer rounded-[10px] bg-primary px-[50px] py-3.5 text-center text-[1rem] leading-[1.375rem] text-white no-underline transition-colors duration-300 hover:bg-primary-hover"
            >
                {t("Как это работает")}
            </a>
        </div>
    );
}
