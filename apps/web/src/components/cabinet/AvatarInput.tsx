"use client";

import { useState } from "react";

import { MAX_UPLOAD_SIZE } from "@/lib/uploadMedia";

/**
 * Круглая картинка с выбором файла (shared/ui/ProfileInput старого фронта):
 * ссылка «Посмотреть профиль» над кругом, подпись о размере под ним. Если
 * картинка есть — поверх полоса со значком фотоаппарата. Файл больше 5 МБ
 * не принимается, подпись краснеет.
 */
export function AvatarInput({ src, href, labels, onFile }: {
    src?: string;
    /** Ссылка над кругом; нет — не показывается */
    href?: string;
    labels: { view: string; maxSize: string; choose: string };
    onFile: (file: File) => void;
}) {
    const [tooBig, setTooBig] = useState(false);
    return (
        <div className="flex max-w-[182px] flex-col down-1000:mb-[30px] down-1000:pb-4 down-600:mx-auto down-600:mb-0">
            {href && (
                <div className="flex justify-center down-600:hidden">
                    <a href={href} className="relative text-[1rem] font-semibold whitespace-nowrap text-primary no-underline before:absolute before:top-[102%] before:h-[1.7px] before:w-full before:bg-primary">
                        {labels.view}
                    </a>
                </div>
            )}
            <div className="mt-[2.8rem] flex down-1000:justify-center">
                <label
                    aria-label={labels.choose}
                    className={`relative flex h-[172px] w-[172px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary transition-opacity duration-150 hover:opacity-80 hover:duration-0 down-1000:h-[150px] down-1000:w-[150px] down-600:h-[100px] down-600:w-[100px] ${src ? "before:absolute before:top-[70%] before:z-[2] before:h-[53px] before:w-48 before:bg-black before:opacity-50 after:absolute after:top-3/4 after:z-[3] after:h-[26px] after:w-[32.5px] after:bg-[url(/web/images/image-subicon.png)] after:bg-no-repeat" : ""}`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element -- картинка с API или значок фотоаппарата */}
                    <img loading="lazy" decoding="async" src={src || "/web/images/default-image-file.png"} alt="profile-pic" className={src ? "absolute h-full w-full rounded-[inherit] object-cover" : ""} />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                            const file = event.target.files?.[0];
                            event.target.value = "";
                            if (!file) return;
                            setTooBig(file.size > MAX_UPLOAD_SIZE);
                            if (file.size <= MAX_UPLOAD_SIZE) onFile(file);
                        }}
                    />
                </label>
            </div>
            <span className={`mt-[.9rem] text-center text-[.625rem] ${tooBig ? "text-[red]" : "text-[#82949F]"}`}>{labels.maxSize}</span>
        </div>
    );
}
