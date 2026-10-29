import type { ReactNode } from "react";

/** Карточка итога оплаты (DonationPaySuccessPage / DonationPayFailPage старого фронта): значок, заголовок, текст, кнопки */
export function PaymentResult({ success, title, text, children }: { success: boolean; title: string; text: string; children: ReactNode }) {
    return (
        <div className="mx-auto max-w-[600px] px-4 py-[60px]">
            <div className="rounded-[20px] border border-[#dbe6ef] bg-white px-8 py-10 text-center shadow-[0_10px_30px_rgb(16_44_74/6%)]">
                <div aria-hidden className={`mx-auto mb-5 h-16 w-16 rounded-full text-[32px] leading-[64px] ${success ? "bg-[#e8f5e9] text-[#2e7d32]" : "bg-[#ffebee] text-[#c62828]"}`}>
                    {success ? "✓" : "✗"}
                </div>
                <h1 className="mb-3 text-[28px] font-bold text-[#0c2238]">{title}</h1>
                <p className="mb-6 text-[16px] leading-[1.5] text-[#536a81]">{text}</p>
                <div className="flex flex-col items-center gap-3">{children}</div>
            </div>
        </div>
    );
}

export const resultButton = "inline-block rounded-[10px] border border-primary bg-primary px-[70px] py-4 text-[16px] leading-[120%] text-white transition-all duration-300 hover:bg-white hover:text-primary";
export const resultLink = "inline-block text-center text-[16px] leading-[120%] text-caption hover:underline down-lg:w-full";
