"use client";

import * as Dialog from "@radix-ui/react-dialog";

/**
 * Окно подтверждения (ConfirmActionModal старого фронта): текст и две кнопки — «да» синяя, «нет» рамкой.
 * size="medium" — вариант кабинета организатора (кнопки MEDIUM, «Отмена» серой рамкой, текст 16px;
 * уже 992 px кнопки во всю ширину).
 */
export function ConfirmDialog({ open, text, confirm, cancel, busy = false, size, onConfirm, onClose }: {
    open: boolean;
    text: string;
    confirm: string;
    cancel: string;
    busy?: boolean;
    size?: "medium";
    onConfirm: () => void;
    onClose: () => void;
}) {
    if (size === "medium") {
        const button = "cursor-pointer rounded-[10px] border px-[100px] py-3 text-label transition-all duration-300 disabled:opacity-70 down-lg:w-full down-lg:px-[15px]";
        return (
            <Dialog.Root open={open} onOpenChange={(value) => !value && onClose()}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in justify-center overflow-y-auto bg-black/50 py-10">
                        <Dialog.Content aria-describedby={undefined} className="flex max-w-[600px] flex-col justify-center gap-[30px] self-center rounded-[10px] bg-white px-4 py-[25px]">
                            <Dialog.Title className="text-center text-[16px] font-normal">{text}</Dialog.Title>
                            <div className="flex flex-wrap justify-center gap-2.5">
                                <button type="button" disabled={busy} onClick={onConfirm} className={`${button} border-primary bg-primary text-white hover:bg-white hover:text-primary`}>{confirm}</button>
                                <button type="button" disabled={busy} onClick={onClose} className={`${button} border-caption text-caption hover:bg-caption hover:text-white`}>{cancel}</button>
                            </div>
                        </Dialog.Content>
                    </Dialog.Overlay>
                </Dialog.Portal>
            </Dialog.Root>
        );
    }
    return (
        <Dialog.Root open={open} onOpenChange={(value) => !value && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[999] flex animate-fade-in items-center justify-center bg-black/50 p-4">
                    <Dialog.Content aria-describedby={undefined} className="flex max-w-[600px] flex-col justify-center gap-[30px] rounded-[10px] bg-white px-4 py-[25px]">
                        <Dialog.Title className="text-center text-[18px] font-medium">{text}</Dialog.Title>
                        <div className="flex justify-center gap-4">
                            <button type="button" disabled={busy} onClick={onConfirm} className="cursor-pointer rounded-[10px] border border-primary bg-primary px-[50px] py-2.5 text-[16px] text-white transition-all hover:bg-white hover:text-primary disabled:opacity-70">{confirm}</button>
                            <button type="button" disabled={busy} onClick={onClose} className="cursor-pointer rounded-[10px] border border-primary px-[50px] py-2.5 text-[16px] text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-70">{cancel}</button>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
