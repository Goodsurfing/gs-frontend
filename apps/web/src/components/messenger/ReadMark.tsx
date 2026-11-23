/** Одна галочка — доставлено, две — прочитано собеседником */
export function ReadMark({ read, label, className = "" }: { read: boolean; label: string; className?: string }) {
    return (
        <svg aria-label={read ? label : undefined} aria-hidden={read ? undefined : true} role={read ? "img" : undefined} viewBox="0 0 18 12" className={`mr-1 inline-block h-3 w-[18px] align-[-1px] ${read ? "text-primary" : "text-caption"} ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 6.5 4.5 10 11 2" />
            {read && <path d="M7.5 9.5 8 10l6.5-8" />}
        </svg>
    );
}
