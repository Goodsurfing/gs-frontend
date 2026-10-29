import type { ReactNode } from "react";

/** Заголовок и сетка карточек: колонки от 400 px (уже 576 px — от 200 px), как в старом фронте. */
export function TeamSection({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section>
            <h2 className="text-center text-[1.5rem] font-bold">{title}</h2>
            <div className="mt-6 grid w-full grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 down-sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
                {children}
            </div>
        </section>
    );
}
