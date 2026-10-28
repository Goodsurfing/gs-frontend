/**
 * Треугольная стрелка выпадающих списков (как shared/ui/Arrow старого фронта):
 * вниз — закрыто, вверх — открыто. Состояние берётся из пропса или из
 * data-state="open" ближайшего родителя с классом group (Radix-триггеры).
 */
export function Arrow({ open, className = "" }: { open?: boolean; className?: string }) {
    const up = "border-x-[3px] border-t-0 border-b-[3px] border-x-transparent border-b-current";
    const down = "border-x-[3px] border-t-[3px] border-b-0 border-x-transparent border-t-current";
    const state = open === undefined
        ? `${down} group-data-[state=open]:border-t-0 group-data-[state=open]:border-b-[3px] group-data-[state=open]:border-t-transparent group-data-[state=open]:border-b-current`
        : open ? up : down;

    return <span aria-hidden className={`block h-0 w-0 border-solid text-arrow ${state} ${className}`} />;
}
