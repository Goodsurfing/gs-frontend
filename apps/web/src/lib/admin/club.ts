/**
 * Клуб тестировщиков в админке: данные — снимок, который присылает бот клуба (gs-status-bot)
 * в gs-backend (/admin/v1/club/…). Действия админа — команды боту: бот забирает их,
 * выполняет той же логикой, что кнопки в Telegram (участник получает уведомление),
 * и подтверждает; до подтверждения строка показывает «отправлено боту».
 */

export type ClubCommandKind = "approve" | "reject" | "verdict" | "report" | "issued";
export type ClubCommandState = "sent" | "done" | "failed";

export interface ClubCommand {
    id: string;
    kind: ClubCommandKind;
    tgId: number | null;
    taskId: string | null;
    reportId: number | null;
    value: string | null;
    state: ClubCommandState;
    /** Ответ бота: почему не выполнено */
    result: string | null;
    createdAt: string;
    doneAt: string | null;
}

export type ClubReward = "badge" | "year" | "pin";

export interface ClubParticipant {
    tgId: number;
    name: string;
    username: string | null;
    role: string | null;
    device: string | null;
    experience: string | null;
    status: string;
    prodEmail: string | null;
    joinedAt: string;
    lastActiveAt: string | null;
    points: number;
    pendingPoints: number;
    tasksDone: number;
    rewards: ClubReward[];
    issued: ClubReward[];
    toIssue: ClubReward[];
    command: ClubCommand | null;
    rewardCommands: Partial<Record<ClubReward, ClubCommand>>;
}

export interface ClubAnswers {
    result?: string;
    device?: string;
    q_stuck?: string;
    q_change?: string;
    check?: { state?: string; note?: string };
    [key: string]: unknown;
}

export interface ClubCompletion {
    tgId: number;
    taskId: string;
    taskTitle: string;
    name: string | null;
    username: string | null;
    role: string | null;
    points: number;
    answers: ClubAnswers;
    doneAt: string;
    verdict: string | null;
    command: ClubCommand | null;
}

export interface ClubReport {
    id: number;
    tgId: number;
    name: string | null;
    username: string | null;
    role: string | null;
    text: string;
    at: string;
    status: string;
    files: { kind?: string; name?: string }[];
    command: ClubCommand | null;
}

export interface ClubTask {
    id: string;
    title: string;
    role: string;
    points: number;
    section: string | null;
    status: "open" | "capped" | "released";
    accepted: { role: string | null; device: string | null; count: number }[];
    acceptedTotal: number;
    unreviewed: number;
    rejected: number;
}

export interface ClubSummary {
    syncedAt: string | null;
    syncedMinutesAgo: number | null;
    revision: string | null;
    taskCap: number | null;
    participants: Record<string, number>;
    completions: Record<string, number>;
    reports: Record<string, number>;
    tasks: Record<string, number>;
    rewardsToIssue: number;
    commands: Record<string, number>;
    recentCommands: ClubCommand[];
}

/** Тело POST /admin/v1/club/commands */
export interface ClubCommandBody {
    kind: ClubCommandKind;
    tgId?: number;
    taskId?: string;
    reportId?: number;
    value?: string;
}

export const PARTICIPANT_STATUS: Record<string, string> = {
    new: "заполняет анкету",
    pending: "ждёт одобрения",
    approved: "участник",
    rejected: "отклонён",
    excluded: "исключён",
};

export const ROLE_TITLE: Record<string, string> = { volunteer: "волонтёр", host: "организатор", any: "все" };
export const DEVICE_TITLE: Record<string, string> = { iphone: "iPhone", android: "Android", desktop: "компьютер", tablet: "планшет" };
export const DEVICE_KIND_TITLE: Record<string, string> = { phone: "телефон", desktop: "компьютер" };
export const EXPERIENCE_TITLE: Record<string, string> = { volunteered: "ездил(а) волонтёром", hosted: "принимал(а) волонтёров", none: "пока не ездил(а)" };
export const REWARD_TITLE: Record<ClubReward, string> = { badge: "значок «Первопроходец»", year: "членство на год", pin: "настоящий значок" };

export const VERDICT_TITLE: Record<string, string> = {
    ok: "👌 Принято",
    useful: "💡 Дельное +1",
    important: "🔧 В работу +3",
    rejected: "✖ Не засчитано",
};
export const RESULT_TITLE: Record<string, string> = { yes: "✅ получилось", partly: "🟡 частично", no: "🔴 не получилось" };
export const CHECK_TITLE: Record<string, string> = { done: "✅", partial: "🟡", none: "⚠️" };

export const REPORT_STATUS: Record<string, string> = {
    new: "новое",
    confirmed: "подтверждено +1",
    important: "важно +3",
    rejected: "не ошибка",
};

export const TASK_STATUS: Record<ClubTask["status"], string> = {
    open: "открыто",
    capped: "закрыто — проверено достаточно",
    released: "вышло на прод",
};

export const FILE_KIND_TITLE: Record<string, string> = { photo: "фото", video: "видео", voice: "голосовое", document: "файл", animation: "анимация", video_note: "кружок", audio: "аудио" };

/** «iphone,desktop» → «iPhone, компьютер» */
export const devicesTitle = (devices: string | null | undefined) =>
    (devices ?? "").split(",").filter(Boolean).map((d) => DEVICE_TITLE[d] ?? d).join(", ");

/** Что показать вместо кнопок, пока команда у бота или не выполнилась; null — команды нет */
export function commandNote(command: ClubCommand | null | undefined): { text: string; tone: "wait" | "ok" | "error" } | null {
    if (!command) return null;
    if (command.state === "sent") return { text: `отправлено боту ${command.createdAt}`, tone: "wait" };
    if (command.state === "done") return { text: "выполнено ботом — обновится со следующим снимком", tone: "ok" };
    return { text: `бот не выполнил: ${command.result || "ошибка"}`, tone: "error" };
}

/** Кнопки можно нажимать, если команды нет или прошлая не выполнилась */
export const canAct = (command: ClubCommand | null | undefined) => !command || command.state === "failed";

/** Есть команды у бота — список стоит перечитывать, пока он их не подтвердит */
export const hasSentCommands = (commands: (ClubCommand | null | undefined)[]) => commands.some((c) => c?.state === "sent");

/**
 * Принятые прохождения задания по роли × виду устройства — строки «волонтёр · телефон: 3 из 5».
 * У задания для всех ролей роль не учитывается.
 */
export function acceptedLines(task: Pick<ClubTask, "accepted">, cap: number | null): string[] {
    return task.accepted
        .filter((a) => a.count > 0)
        .map((a) => {
            const who = [a.role ? ROLE_TITLE[a.role] ?? a.role : null, a.device ? DEVICE_KIND_TITLE[a.device] ?? a.device : "устройство не указано"]
                .filter(Boolean)
                .join(" · ");
            return `${who}: ${a.count}${cap ? ` из ${cap}` : ""}`;
        });
}

/** Сколько минут назад — «только что», «12 мин назад», «3 ч назад» */
export function agoText(minutes: number | null): string {
    if (minutes === null) return "ещё не было";
    if (minutes < 1) return "только что";
    if (minutes < 60) return `${minutes} мин назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 48) return `${hours} ч назад`;
    return `${Math.floor(hours / 24)} дн назад`;
}

/** Ссылка на пользователя прода в админке по почте из анкеты */
export const userByEmailHref = (email: string) => `/admin/users?email=${encodeURIComponent(email)}`;
