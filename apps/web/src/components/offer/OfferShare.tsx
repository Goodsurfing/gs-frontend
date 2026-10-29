"use client";

/**
 * «Поделиться вакансией»: ВКонтакте (окно 600×400) и Telegram (ShareBlock
 * старого фронта).
 */
export function OfferShare({ url, title, label }: { url: string; title: string; label: string }) {
    const vk = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    const telegram = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    return (
        <div className="mt-[60px] flex w-full items-center justify-between rounded-[2px] bg-field px-5 py-4">
            <span>{label}</span>
            <div className="flex gap-5">
                <button type="button" aria-label="ВКонтакте" onClick={() => window.open(vk, "Поделиться ВКонтакте", "width=600,height=400")} className="flex cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/icons/offer/vk-mini-logo.svg" alt="vkontakte" />
                </button>
                <button type="button" aria-label="Telegram" onClick={() => window.open(telegram, "_blank")} className="flex cursor-pointer">
                    {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                    <img src="/web/icons/offer/telegram-mini-logo.svg" alt="telegram" />
                </button>
            </div>
        </div>
    );
}
