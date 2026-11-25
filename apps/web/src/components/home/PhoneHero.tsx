import { SOCIAL_RIBBON_LINKS } from "@/components/layout/SocialRibbon";
import type { QuickPick } from "@/lib/landingMenu";
import type { HeroImage } from "@/lib/heroImages";

/**
 * Первый экран главной на телефоне (GS-292, до 768 px; на компьютере — HeroSlider и поиск слева,
 * без изменений). Всё в пределах 390×844: фото с соцсетями поверх, заголовок, одна-две строки о
 * том, что такое Гудсёрфинг, строка поиска и подборки (посадочные страницы).
 *
 * Медленный интернет: поиск — обычная форма GET в каталог, работает сразу с HTML, до загрузки
 * скриптов. Фото облегчённое (~30 КБ) и `loading="lazy"`: начинает грузиться после CSS, не
 * отнимает у него канал (иначе страница рисуется позже), а на компьютере блок скрыт и фото не
 * грузится совсем. Пока фото нет — размытое превью из data URL под тем же затемнением.
 */
export function PhoneHero({ title, lead, image, catalogHref, picks, labels }: {
    title: string;
    lead: string;
    image: HeroImage & { phone: string };
    catalogHref: string;
    picks: QuickPick[];
    labels: { search: string; placeholder: string; find: string; picks: string; socials: string };
}) {
    return (
        <section
            data-phone-hero
            className="relative hidden overflow-hidden bg-ink bg-cover bg-center down-md:block"
            style={{ backgroundImage: `url(${image.placeholder})` }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element -- облегчённая вырезка для телефона, next/image тут только добавил бы запрос к оптимизатору */}
            <img data-hero src={image.phone} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,24,38,0.55)_0%,rgba(8,24,38,0.35)_40%,rgba(8,24,38,0.7)_100%)]" />
            <div className="relative flex flex-col px-4 pt-3 pb-5">
                <div className="flex items-center justify-end gap-2.5">
                    <span className="text-[13px] leading-[1.3] font-medium text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">{labels.socials}</span>
                    <ul className="m-0 flex list-none items-center gap-2 p-0">
                        {SOCIAL_RIBBON_LINKS.map(({ name, href, icon, round }) => (
                            <li key={name}>
                                <a href={href} target="_blank" rel="noreferrer" aria-label={name} title={name} className={`flex shadow-[0_0_0_1.5px_#fff] ${round ? "rounded-full" : "rounded-[22%]"}`}>
                                    {/* eslint-disable-next-line @next/next/no-img-element -- иконки 24×24 */}
                                    <img src={icon} alt="" aria-hidden width={24} height={24} className="block rounded-[inherit]" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <h2 className="mt-[72px] text-[30px] leading-[1.1] font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.45)]">{title}</h2>
                <p className="mt-3 text-[16px] leading-[1.35] font-medium text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.45)]">{lead}</p>
                <form action={catalogHref} method="get" role="search" className="mt-5 flex h-12 gap-2">
                    <input
                        type="search"
                        name="search"
                        aria-label={labels.search}
                        placeholder={labels.placeholder}
                        enterKeyHint="search"
                        autoComplete="off"
                        className="h-12 min-w-0 flex-1 rounded-[10px] border-0 bg-white px-4 text-[16px] text-ink outline-none placeholder:text-caption focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <button type="submit" className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-[10px] bg-primary px-4 text-[16px] font-semibold text-white">
                        <svg aria-hidden width="16" height="16" viewBox="0 0 18 18" fill="none" className="stroke-white">
                            <path d="M11.2188 11.2192L16.9996 17.0001M7.1315 13.263C10.5178 13.263 13.263 10.5178 13.263 7.1315C13.263 3.74517 10.5178 1 7.1315 1C3.74517 1 1 3.74517 1 7.1315C1 10.5178 3.74517 13.263 7.1315 13.263Z" strokeWidth="2" />
                        </svg>
                        {labels.find}
                    </button>
                </form>
                <nav aria-label={labels.picks} className="-mx-4 mt-3">
                    <ul className="m-0 flex list-none flex-wrap gap-2 px-4">
                        {picks.map((pick) => (
                            <li key={pick.href}>
                                <a href={pick.href} className="flex h-9 items-center rounded-full border border-white/50 bg-white/15 px-3.5 text-[14px] leading-none font-medium whitespace-nowrap text-white backdrop-blur-[2px] active:bg-white/30">
                                    {pick.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </section>
    );
}
