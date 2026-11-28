"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { adminButton, adminButtonDanger, AdminList, type AdminListConfig, type AdminRowContext } from "@/components/admin/AdminList";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminApi } from "@/lib/admin/api";
import {
    acceptedLines,
    agoText,
    canAct,
    CHECK_TITLE,
    type ClubCommand,
    type ClubCommandBody,
    type ClubCompletion,
    type ClubParticipant,
    type ClubReport,
    type ClubReward,
    type ClubSummary,
    type ClubTask,
    commandNote,
    devicesTitle,
    EXPERIENCE_TITLE,
    FILE_KIND_TITLE,
    hasSentCommands,
    PARTICIPANT_STATUS,
    REPORT_STATUS,
    RESULT_TITLE,
    REWARD_TITLE,
    ROLE_TITLE,
    TASK_STATUS,
    userByEmailHref,
    VERDICT_TITLE,
} from "@/lib/admin/club";

/* ── Общее ── */

/** Снимок старше — бот, видимо, не достучался: предупреждаем (бот шлёт раз в 5 минут и после изменений) */
const STALE_MINUTES = 20;

const pill = "rounded-full px-2 py-0.5 text-[12px]";

function CommandBadge({ command }: { command: ClubCommand | null | undefined }) {
    const note = commandNote(command);
    if (!note) return null;
    const tone = note.tone === "wait" ? "bg-status-new/40" : note.tone === "ok" ? "bg-status-accepted/40" : "bg-error/15 text-error";
    return <span className={`${pill} inline-block whitespace-normal ${tone}`}>{note.text}</span>;
}

/** Поставить команду боту; участник получит уведомление, когда бот её выполнит */
function send(ctx: AdminRowContext, body: ClubCommandBody, done: string) {
    void ctx.api.post("club/commands", body)
        .then(() => {
            ctx.notify(`${done} — отправлено боту`, true);
            ctx.reload();
        })
        .catch((e: unknown) => {
            ctx.notify(e instanceof Error ? e.message : "Ошибка");
            ctx.reload();
        });
}

function Who({ name, username, role }: { name: string | null; username: string | null; role?: string | null }) {
    return (
        <span>
            {name ?? "—"}
            {username && <a href={`https://t.me/${username}`} target="_blank" rel="noreferrer" className="ml-1 text-primary hover:underline">@{username}</a>}
            {role && <span className="block text-[12px] text-muted">{ROLE_TITLE[role] ?? role}</span>}
        </span>
    );
}

const SUBTITLE = "Данные — из бота «Клуба первых». Действия выполняет бот: участник получает то же сообщение, что при нажатии кнопки в Telegram.";

function Hint() {
    return <p className="mb-4 text-[13px] text-muted">{SUBTITLE}</p>;
}

/* ── Сводка ── */

function Tile({ label, value, href, accent }: { label: string; value: number | string; href?: string; accent?: boolean }) {
    const body = (
        <>
            <p className="text-[12px] text-muted">{label}</p>
            <p className={`mt-1 text-[26px] font-bold ${accent ? "text-primary" : ""}`}>{typeof value === "number" ? value.toLocaleString("ru-RU") : value}</p>
        </>
    );
    return href
        ? <Link href={href} className="rounded-[8px] bg-surface p-4 hover:shadow-md">{body}</Link>
        : <div className="rounded-[8px] bg-surface p-4">{body}</div>;
}

const COMMAND_TITLE: Record<string, string> = {
    approve: "принять в клуб",
    reject: "отклонить заявку",
    verdict: "оценка сдачи",
    report: "разбор сообщения",
    issued: "награда выдана",
};

export function ClubSummaryView() {
    const api = useAdminApi();
    const [summary, setSummary] = useState<ClubSummary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [version, setVersion] = useState(0);

    useEffect(() => {
        let cancelled = false;
        api.get<ClubSummary>("club/summary")
            .then((res) => {
                if (cancelled) return;
                setSummary(res);
                setError(null);
            })
            .catch((e: unknown) => !cancelled && setError(e instanceof Error ? e.message : "Ошибка"));
        return () => {
            cancelled = true;
        };
    }, [api, version]);

    // Пока команды у бота — перечитываем, чтобы увидеть подтверждение
    const waiting = (summary?.commands.sent ?? 0) > 0;
    useEffect(() => {
        if (!waiting) return;
        const timer = setTimeout(() => setVersion((v) => v + 1), 15_000);
        return () => clearTimeout(timer);
    }, [waiting, summary]);

    if (error && !summary) {
        return (
            <section>
                <h1 className="mb-4 text-[22px] font-bold">Клуб тестировщиков</h1>
                <p className="mb-3 text-error">Не удалось загрузить: {error}</p>
                <button type="button" className={adminButton} onClick={() => setVersion((v) => v + 1)}>Повторить</button>
            </section>
        );
    }
    if (!summary) return <div className="flex justify-center p-8"><Spinner /></div>;

    const p = summary.participants;
    const stale = summary.syncedMinutesAgo === null || summary.syncedMinutesAgo > STALE_MINUTES;
    return (
        <section>
            <h1 className="mb-2 text-[22px] font-bold">Клуб тестировщиков</h1>
            <Hint />
            <p className={`mb-6 rounded-[8px] p-3 ${stale ? "bg-error/10 text-error" : "bg-surface"}`}>
                Последний снимок от бота: {summary.syncedAt ? `${summary.syncedAt} (${agoText(summary.syncedMinutesAgo)})` : "ещё не было"}
                {stale && " — бот давно не присылал данные: стенд ночью выключен или бот не может достучаться до API."}
                {summary.revision && <span className="ml-2 text-[12px] text-muted">версия бота {summary.revision.slice(0, 7)}</span>}
            </p>

            <h2 className="mb-3 text-[18px] font-bold">Участники</h2>
            <div className="mb-8 grid grid-cols-4 gap-3 down-lg:grid-cols-2">
                <Tile label="Ждут одобрения" value={p.pending ?? 0} href="/admin/club/participants?status=pending" accent={(p.pending ?? 0) > 0} />
                <Tile label="В клубе" value={p.approved ?? 0} href="/admin/club/participants?status=approved" />
                <Tile label="Заполняют анкету" value={p.new ?? 0} href="/admin/club/participants?status=new" />
                <Tile label="Отклонены и исключены" value={(p.rejected ?? 0) + (p.excluded ?? 0)} href="/admin/club/participants" />
            </div>

            <h2 className="mb-3 text-[18px] font-bold">Работа команды</h2>
            <div className="mb-8 grid grid-cols-4 gap-3 down-lg:grid-cols-2">
                <Tile label="Сдачи на проверке" value={summary.completions.unreviewed ?? 0} href="/admin/club/completions" accent={(summary.completions.unreviewed ?? 0) > 0} />
                <Tile label="Неразобранные сообщения о проблемах" value={summary.reports.new ?? 0} href="/admin/club/reports" accent={(summary.reports.new ?? 0) > 0} />
                <Tile label="Награды ждут выдачи" value={summary.rewardsToIssue} href="/admin/club/participants?status=approved" accent={summary.rewardsToIssue > 0} />
                <Tile label="Команды у бота" value={`${summary.commands.sent ?? 0}${summary.commands.failed ? ` · не выполнено ${summary.commands.failed}` : ""}`} />
            </div>

            <h2 className="mb-3 text-[18px] font-bold">Задания{summary.taskCap ? <span className="ml-2 text-[13px] font-normal text-muted">закрываются после {summary.taskCap} принятых прохождений по роли и устройству</span> : null}</h2>
            <div className="mb-8 grid grid-cols-4 gap-3 down-lg:grid-cols-2">
                <Tile label="Открыты" value={summary.tasks.open ?? 0} href="/admin/club/tasks" />
                <Tile label="Закрыты порогом" value={summary.tasks.capped ?? 0} href="/admin/club/tasks" />
                <Tile label="Вышли на прод" value={summary.tasks.released ?? 0} href="/admin/club/tasks" />
                <Tile label="Сдачи принято / не засчитано" value={`${(summary.completions.ok ?? 0) + (summary.completions.useful ?? 0) + (summary.completions.important ?? 0)} / ${summary.completions.rejected ?? 0}`} href="/admin/club/completions?verdict=all" />
            </div>

            <h2 className="mb-3 text-[18px] font-bold">Последние команды боту</h2>
            {summary.recentCommands.length === 0 ? <p className="text-muted">Пока не было</p> : (
                <ul className="flex flex-col gap-2">
                    {summary.recentCommands.map((c) => (
                        <li key={c.id} className="flex flex-wrap items-center gap-2 rounded-[8px] bg-surface px-3 py-2">
                            <span className="whitespace-nowrap text-[12px] text-muted">{c.createdAt}</span>
                            <span>{COMMAND_TITLE[c.kind] ?? c.kind}{c.value ? `: ${VERDICT_TITLE[c.value] ?? REPORT_STATUS[c.value] ?? REWARD_TITLE[c.value as ClubReward] ?? c.value}` : ""}</span>
                            <CommandBadge command={c} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

/* ── Участники ── */

function participantCommands(r: ClubParticipant) {
    return [r.command, ...Object.values(r.rewardCommands ?? {})];
}

const participantsConfig: AdminListConfig<ClubParticipant> = {
    title: "Участники клуба",
    path: "club/participants",
    rowKey: (r) => String(r.tgId),
    header: <Hint />,
    filters: [{ key: "status", label: "Статус", options: Object.entries(PARTICIPANT_STATUS).map(([value, label]) => ({ value, label })) }],
    autoReload: (rows) => hasSentCommands(rows.flatMap(participantCommands)),
    columns: [
        { label: "Участник", cell: (r) => <Who name={r.name} username={r.username} /> },
        {
            label: "Анкета",
            cell: (r) => (
                <span className="text-[13px]">
                    {[r.role ? ROLE_TITLE[r.role] ?? r.role : null, devicesTitle(r.device) || null, r.experience ? EXPERIENCE_TITLE[r.experience] ?? r.experience : null].filter(Boolean).join(" · ") || "—"}
                    <span className="block text-[12px] text-muted">с {r.joinedAt}{r.lastActiveAt ? `, был(а) ${r.lastActiveAt}` : ""}</span>
                </span>
            ),
        },
        {
            label: "Статус",
            cell: (r) => (
                <span className="flex flex-col items-start gap-1">
                    <span className={`${pill} ${r.status === "pending" ? "bg-status-new/40" : r.status === "approved" ? "bg-status-accepted/40" : "bg-accent-bg text-muted"}`}>{PARTICIPANT_STATUS[r.status] ?? r.status}</span>
                    <CommandBadge command={r.command} />
                </span>
            ),
        },
        { label: "Очки", cell: (r) => <span>{r.points}{r.pendingPoints ? <span className="block text-[12px] text-muted">+{r.pendingPoints} на проверке</span> : null}<span className="block text-[12px] text-muted">заданий: {r.tasksDone}</span></span> },
        {
            label: "Награды",
            cell: (r) => r.rewards.length === 0 ? "—" : (
                <ul className="text-[13px]">
                    {r.rewards.map((reward) => (
                        <li key={reward}>
                            {REWARD_TITLE[reward] ?? reward}: {r.issued.includes(reward) ? <span className="text-muted">выдано</span> : <b>выдать</b>}
                            {r.rewardCommands?.[reward] && <span className="ml-1"><CommandBadge command={r.rewardCommands[reward]} /></span>}
                        </li>
                    ))}
                </ul>
            ),
        },
        {
            label: "Почта на сайте",
            cell: (r) => r.prodEmail ? <Link href={userByEmailHref(r.prodEmail)} className="text-primary hover:underline">{r.prodEmail}</Link> : <span className="text-muted">не указана</span>,
        },
    ],
    actions: (r, ctx) => (
        <>
            {r.status === "pending" && canAct(r.command) && (
                <>
                    <button type="button" className={adminButton} onClick={() => send(ctx, { kind: "approve", tgId: r.tgId }, "Принять в клуб")}>Принять</button>
                    <button type="button" className={adminButtonDanger} onClick={() => send(ctx, { kind: "reject", tgId: r.tgId }, "Отклонить заявку")}>Отклонить</button>
                </>
            )}
            {r.toIssue.filter((reward) => canAct(r.rewardCommands?.[reward])).map((reward) => (
                <button key={reward} type="button" className={adminButton} title="Отметить, что награда выдана на сайте или вручена — участник получит сообщение" onClick={() => send(ctx, { kind: "issued", tgId: r.tgId, value: reward }, `${REWARD_TITLE[reward]} — выдано`)}>
                    Выдано: {REWARD_TITLE[reward] ?? reward}
                </button>
            ))}
        </>
    ),
};

export function ClubParticipantsList() {
    return <AdminList config={participantsConfig} />;
}

/* ── Сдачи заданий ── */

function Answers({ a }: { a: ClubCompletion["answers"] }) {
    return (
        <div className="max-w-[520px] text-[13px]">
            <p>
                {a.result ? RESULT_TITLE[a.result] ?? a.result : "—"}
                {a.device && <span className="text-muted"> · {devicesTitle(a.device)}</span>}
            </p>
            {a.q_stuck && <p className="mt-1 whitespace-pre-wrap"><span className="text-muted">Где запнулись: </span>{a.q_stuck}</p>}
            {a.q_change && <p className="mt-1 whitespace-pre-wrap"><span className="text-muted">Что поменять: </span>{a.q_change}</p>}
            {a.check?.note && <p className="mt-1 text-muted">{CHECK_TITLE[a.check.state ?? ""] ?? ""} Стейдж: {a.check.note}</p>}
        </div>
    );
}

const VERDICT_FILTER = [
    { value: "new", label: "На проверке" },
    { value: "ok", label: "Принято" },
    { value: "useful", label: "Дельное" },
    { value: "important", label: "В работу" },
    { value: "rejected", label: "Не засчитано" },
    { value: "all", label: "Все" },
];

const completionsConfig: AdminListConfig<ClubCompletion> = {
    title: "Сдачи заданий",
    path: "club/completions",
    rowKey: (r) => `${r.tgId}:${r.taskId}`,
    header: <Hint />,
    filters: [{ key: "verdict", label: "Оценка", options: VERDICT_FILTER, defaultValue: "new" }],
    autoReload: (rows) => hasSentCommands(rows.map((r) => r.command)),
    columns: [
        { label: "Когда", cell: (r) => r.doneAt, className: "whitespace-nowrap" },
        { label: "Участник", cell: (r) => <Who name={r.name} username={r.username} role={r.role} /> },
        { label: "Задание", cell: (r) => <span>{r.taskTitle}<span className="block text-[12px] text-muted">{r.points} ⭐</span></span> },
        { label: "Ответ", cell: (r) => <Answers a={r.answers} /> },
        {
            label: "Оценка",
            cell: (r) => (
                <span className="flex flex-col items-start gap-1">
                    {r.verdict ? <span className="whitespace-nowrap">{VERDICT_TITLE[r.verdict] ?? r.verdict}</span> : <span className={`${pill} bg-status-new/40`}>на проверке</span>}
                    <CommandBadge command={r.command} />
                </span>
            ),
        },
    ],
    actions: (r, ctx) => !r.verdict && canAct(r.command) ? (
        <>
            <button type="button" className={adminButton} onClick={() => send(ctx, { kind: "verdict", tgId: r.tgId, taskId: r.taskId, value: "ok" }, "Принято")}>👌 Принять</button>
            <button type="button" className={adminButton} onClick={() => send(ctx, { kind: "verdict", tgId: r.tgId, taskId: r.taskId, value: "useful" }, "Дельное")}>💡 Дельное +1</button>
            <button type="button" className={adminButton} onClick={() => send(ctx, { kind: "verdict", tgId: r.tgId, taskId: r.taskId, value: "important" }, "В работу")}>🔧 В работу +3</button>
            <button type="button" className={adminButtonDanger} onClick={() => send(ctx, { kind: "verdict", tgId: r.tgId, taskId: r.taskId, value: "rejected" }, "Не засчитано")}>✖ Не засчитать</button>
        </>
    ) : null,
};

export function ClubCompletionsList() {
    return <AdminList config={completionsConfig} />;
}

/* ── Сообщения о проблемах ── */

const REPORT_FILTER = [
    { value: "new", label: "Новые" },
    { value: "confirmed", label: "Подтверждённые" },
    { value: "important", label: "Важные" },
    { value: "rejected", label: "Не ошибка" },
    { value: "all", label: "Все" },
];

const reportsConfig: AdminListConfig<ClubReport> = {
    title: "Сообщения о проблемах",
    path: "club/reports",
    rowKey: (r) => String(r.id),
    header: <Hint />,
    filters: [{ key: "status", label: "Статус", options: REPORT_FILTER, defaultValue: "new" }],
    autoReload: (rows) => hasSentCommands(rows.map((r) => r.command)),
    columns: [
        { label: "№", cell: (r) => <span className="whitespace-nowrap">№{r.id}<span className="block text-[12px] text-muted">{r.at}</span></span> },
        { label: "От кого", cell: (r) => <Who name={r.name} username={r.username} role={r.role} /> },
        {
            label: "Сообщение",
            cell: (r) => (
                <div className="max-w-[560px]">
                    <p className="whitespace-pre-wrap">{r.text || <span className="text-muted">без текста</span>}</p>
                    {r.files.length > 0 && (
                        <p className="mt-1 text-[12px] text-muted">
                            Вложения ({r.files.map((f) => f.name || FILE_KIND_TITLE[f.kind ?? ""] || f.kind || "файл").join(", ")}) — в Telegram у команды клуба
                        </p>
                    )}
                </div>
            ),
        },
        {
            label: "Статус",
            cell: (r) => (
                <span className="flex flex-col items-start gap-1">
                    <span className={`${pill} ${r.status === "new" ? "bg-status-new/40" : "bg-accent-bg text-muted"}`}>{REPORT_STATUS[r.status] ?? r.status}</span>
                    <CommandBadge command={r.command} />
                </span>
            ),
        },
    ],
    actions: (r, ctx) => r.status === "new" && canAct(r.command) ? (
        <>
            <button type="button" className={adminButton} onClick={() => send(ctx, { kind: "report", reportId: r.id, value: "confirmed" }, "Подтверждено")}>Подтвердить +1</button>
            <button type="button" className={adminButton} onClick={() => send(ctx, { kind: "report", reportId: r.id, value: "important" }, "Важно")}>Важно +3</button>
            <button type="button" className={adminButtonDanger} onClick={() => send(ctx, { kind: "report", reportId: r.id, value: "rejected" }, "Не ошибка")}>Не ошибка</button>
        </>
    ) : null,
};

export function ClubReportsList() {
    return <AdminList config={reportsConfig} />;
}

/* ── Задания ── */

function tasksConfig(cap: number | null): AdminListConfig<ClubTask> {
    return {
        title: "Задания клуба",
        path: "club/tasks",
        plain: true,
        rowKey: (r) => r.id,
        header: <p className="mb-4 text-[13px] text-muted">Список и статус — из бота (club/tasks.py). Задание закрывается, когда функция вышла на прод или его достаточно проверили люди с той же ролью и устройством{cap ? ` (${cap} принятых прохождений)` : ""}.</p>,
        columns: [
            { label: "Задание", cell: (r) => <span>{r.title}<span className="block text-[12px] text-muted">{[r.section, r.id].filter(Boolean).join(" · ")}</span></span> },
            { label: "Для кого", cell: (r) => ROLE_TITLE[r.role] ?? r.role },
            { label: "Очки", cell: (r) => r.points },
            { label: "Статус", cell: (r) => <span className={`${pill} ${r.status === "open" ? "bg-status-accepted/40" : "bg-accent-bg text-muted"}`}>{TASK_STATUS[r.status] ?? r.status}</span> },
            {
                label: "Принято",
                cell: (r) => (
                    <span className="text-[13px]">
                        <Link href={`/admin/club/completions?verdict=all&taskId=${encodeURIComponent(r.id)}`} className="text-primary hover:underline">{r.acceptedTotal}</Link>
                        {acceptedLines(r, cap).map((line) => <span key={line} className="block text-[12px] text-muted">{line}</span>)}
                    </span>
                ),
            },
            {
                label: "На проверке",
                cell: (r) => r.unreviewed ? <Link href={`/admin/club/completions?taskId=${encodeURIComponent(r.id)}`} className="text-primary hover:underline">{r.unreviewed}</Link> : "—",
            },
            { label: "Не засчитано", cell: (r) => r.rejected || "—" },
        ],
    };
}

export function ClubTasksList() {
    const api = useAdminApi();
    const [cap, setCap] = useState<number | null>(null);
    useEffect(() => {
        let cancelled = false;
        api.get<ClubSummary>("club/summary").then((s) => !cancelled && setCap(s.taskCap)).catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [api]);
    const config = useMemo(() => tasksConfig(cap), [cap]);
    return <AdminList config={config} />;
}
