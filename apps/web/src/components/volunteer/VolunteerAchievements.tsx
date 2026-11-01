"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

export interface Achievement { id: number | string; name: string; image?: string }

function Medal({ achievement }: { achievement: Achievement }) {
    return (
        <div className="flex w-full max-w-[70px] flex-col items-center text-center text-[10px] text-caption">
            {/* eslint-disable-next-line @next/next/no-img-element -- значок из справочника */}
            <img src={achievement.image} alt={achievement.name} className="w-8" />
            <span className="mt-[5px]">{achievement.name}</span>
        </div>
    );
}

/**
 * Достижения в карточке волонтёра: до трёх — все, больше — первые два и «Ещё»,
 * открывающее окно со всеми (AchievementModal старого фронта).
 */
export function VolunteerAchievements({ achievements, labels }: {
    achievements: Achievement[];
    labels: { more: string; title: string; close: string };
}) {
    const [open, setOpen] = useState(false);
    if (achievements.length === 0) return null;
    const visible = achievements.length > 3 ? achievements.slice(0, 2) : achievements;
    return (
        <>
            {visible.map((achievement) => <Medal key={achievement.id} achievement={achievement} />)}
            {achievements.length > 3 && (
                <button type="button" onClick={() => setOpen(true)} className="flex w-full max-w-[70px] cursor-pointer flex-col items-center text-center text-[10px] text-caption">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element -- иконка */}
                        <img src="/web/icons/offer/three-dots.svg" alt="" className="w-8" />
                    </span>
                    <span className="mt-[5px]">{labels.more}</span>
                </button>
            )}
            <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in items-center justify-center bg-black/50">
                        <Dialog.Content aria-describedby={undefined} className="flex max-w-[600px] flex-col justify-center gap-[30px] rounded-[10px] bg-white px-4 py-[25px]">
                            <Dialog.Title asChild><h3>{labels.title}</h3></Dialog.Title>
                            <div className="grid w-full grid-cols-3 gap-2.5">
                                {achievements.map((achievement) => <Medal key={achievement.id} achievement={achievement} />)}
                            </div>
                            <Dialog.Close className="sr-only">{labels.close}</Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    );
}
