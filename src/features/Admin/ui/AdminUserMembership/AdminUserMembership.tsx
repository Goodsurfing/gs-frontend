import React, { FC, useMemo, useState } from "react";
import {
    FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField,
} from "@mui/material";
import {
    AdminMembership,
    AdminMembershipCategory,
    useGetAdminMembershipTariffsQuery,
    useGetAdminUserMembershipQuery,
    useGrantAdminMembershipMutation,
    useRevokeAdminMembershipMutation,
    formatAdminDate, formatAdminDateTime, formatLogEndDate, MEMBERSHIP_ACTION_LABEL,
    MEMBERSHIP_CATEGORY_LABEL, MEMBERSHIP_ROLE_LABEL, MEMBERSHIP_SOURCE_LABEL,
    MEMBERSHIP_STATUS_LABEL,
} from "@/entities/Admin";
import Button from "@/shared/ui/Button/Button";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import { MiniLoader } from "@/shared/ui/MiniLoader/MiniLoader";
import styles from "./AdminUserMembership.module.scss";

type Term = "tariff" | "forever" | "date";

interface AdminUserMembershipProps {
    userId: string;
    userName: string;
}

const toYmd = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const addDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

/**
 * Членство пользователя в админке: что действует сейчас, ручная выдача
 * (тариф, срок, комментарий) и снятие, ниже — журнал: кто, когда и что делал.
 */
export const AdminUserMembership: FC<AdminUserMembershipProps> = ({ userId, userName }) => {
    const { data, isLoading, isError } = useGetAdminUserMembershipQuery(userId);
    const { data: tariffs = [] } = useGetAdminMembershipTariffsQuery();
    const [grant, { isLoading: isGranting }] = useGrantAdminMembershipMutation();
    const [revoke, { isLoading: isRevoking }] = useRevokeAdminMembershipMutation();

    const [tariffCode, setTariffCode] = useState("");
    const [term, setTerm] = useState<Term>("tariff");
    const [endDate, setEndDate] = useState("");
    const [comment, setComment] = useState("");
    const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
    const [revokeTarget, setRevokeTarget] = useState<AdminMembership | null>(null);
    const [toast, setToast] = useState<ToastAlert>();

    const tariff = tariffs.find((item) => item.code === tariffCode);
    const today = toYmd(addDays(1));

    const resolvedEndDate = useMemo(() => {
        if (term === "forever") return undefined;
        if (term === "date") return endDate || undefined;
        return tariff ? toYmd(addDays(tariff.durationDays)) : undefined;
    }, [term, endDate, tariff]);

    const termText = resolvedEndDate
        ? `до ${resolvedEndDate.split("-").reverse().join(".")}`
        : "бессрочно";
    const canGrant = !!tariff && (term !== "date" || !!endDate) && !isGranting;

    const handleGrant = async () => {
        if (!tariff) return;
        setToast(undefined);
        try {
            await grant({
                userId,
                tariffCode: tariff.code,
                endDate: resolvedEndDate,
                comment: comment.trim() || undefined,
            }).unwrap();
            setToast({ text: `Членство «${tariff.name}» выдано ${termText}`, type: HintType.Success });
            setComment("");
        } catch {
            setToast({ text: "Не удалось выдать членство", type: HintType.Error });
        } finally {
            setIsGrantModalOpen(false);
        }
    };

    const handleRevoke = async () => {
        if (!revokeTarget) return;
        setToast(undefined);
        try {
            await revoke({
                userId,
                category: revokeTarget.category as AdminMembershipCategory,
                comment: comment.trim() || undefined,
            }).unwrap();
            setToast({ text: `Членство «${revokeTarget.tariffName}» снято`, type: HintType.Success });
            setComment("");
        } catch {
            setToast({ text: "Не удалось снять членство", type: HintType.Error });
        } finally {
            setRevokeTarget(null);
        }
    };

    if (isLoading) return <MiniLoader />;
    if (isError || !data) return <p className={styles.empty}>Не удалось загрузить членство</p>;

    return (
        <section className={styles.wrapper} aria-labelledby="admin-membership-title">
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <h2 id="admin-membership-title" className={styles.title}>Членство</h2>

            {data.memberships.length === 0 ? (
                <p className={styles.empty}>Членства не было</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Тариф</th>
                            <th>Статус</th>
                            <th>Откуда</th>
                            <th>Начало</th>
                            <th>Действует до</th>
                            <th aria-label="Действия" />
                        </tr>
                    </thead>
                    <tbody>
                        {data.memberships.map((membership) => (
                            <tr
                                key={membership.id}
                                className={membership.active ? styles.active : undefined}
                            >
                                <td>
                                    {membership.tariffName}
                                    <span className={styles.caption}>
                                        {MEMBERSHIP_CATEGORY_LABEL[membership.category]}
                                    </span>
                                </td>
                                <td>
                                    {membership.active ? "Действует" : (
                                        MEMBERSHIP_STATUS_LABEL[membership.status]
                                        ?? membership.status
                                    )}
                                </td>
                                <td>
                                    {MEMBERSHIP_SOURCE_LABEL[membership.source]
                                        ?? membership.source}
                                </td>
                                <td>{formatAdminDate(membership.startDate)}</td>
                                <td>{membership.privileged ? "бессрочно" : formatAdminDate(membership.endDate)}</td>
                                <td>
                                    {membership.active && (
                                        <button
                                            type="button"
                                            className={styles.revoke}
                                            onClick={() => setRevokeTarget(membership)}
                                            disabled={isRevoking}
                                        >
                                            Снять
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className={styles.form}>
                <h3 className={styles.subtitle}>Выдать вручную</h3>
                <FormControl size="small" className={styles.field}>
                    <InputLabel id="admin-membership-tariff">Тариф</InputLabel>
                    <Select
                        labelId="admin-membership-tariff"
                        label="Тариф"
                        value={tariffCode}
                        onChange={(event) => setTariffCode(event.target.value)}
                    >
                        {tariffs.map((item) => (
                            <MenuItem key={item.code} value={item.code}>
                                {`${item.name} — ${MEMBERSHIP_ROLE_LABEL[item.forRole] ?? item.forRole}, ${item.durationDays} дн.`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <RadioGroup
                    row
                    aria-label="Срок"
                    value={term}
                    onChange={(event) => setTerm(event.target.value as Term)}
                >
                    <FormControlLabel
                        value="tariff"
                        control={<Radio size="small" />}
                        label={tariff ? `Срок тарифа (${tariff.durationDays} дн.)` : "Срок тарифа"}
                    />
                    <FormControlLabel value="forever" control={<Radio size="small" />} label="Бессрочно" />
                    <FormControlLabel value="date" control={<Radio size="small" />} label="До даты" />
                </RadioGroup>
                {term === "date" && (
                    <TextField
                        size="small"
                        type="date"
                        label="Действует до"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: today }}
                        className={styles.field}
                    />
                )}
                <TextField
                    size="small"
                    label="Комментарий (попадёт в журнал)"
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    inputProps={{ maxLength: 1000 }}
                    multiline
                    className={styles.field}
                />
                <p className={styles.caption}>
                    Действующее членство той же категории заменяется новым. Бессрочное — бесплатное
                    привилегированное.
                </p>
                <Button
                    className={styles.button}
                    color="GREEN"
                    size="SMALL"
                    variant="FILL"
                    disabled={!canGrant}
                    onClick={() => setIsGrantModalOpen(true)}
                >
                    Выдать членство
                </Button>
            </div>

            <h3 className={styles.subtitle}>Журнал ручных действий</h3>
            {data.history.length === 0 ? (
                <p className={styles.empty}>Вручную членство не выдавали и не снимали</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Когда</th>
                            <th>Кто</th>
                            <th>Действие</th>
                            <th>Тариф</th>
                            <th>До</th>
                            <th>Комментарий</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.history.map((entry) => (
                            <tr key={entry.id}>
                                <td>{formatAdminDateTime(entry.createdAt)}</td>
                                <td>
                                    {entry.adminName}
                                    {entry.adminEmail && (
                                        <span className={styles.caption}>{entry.adminEmail}</span>
                                    )}
                                </td>
                                <td>{MEMBERSHIP_ACTION_LABEL[entry.action]}</td>
                                <td>{entry.tariffCode}</td>
                                <td>{formatLogEndDate(entry)}</td>
                                <td className={styles.comment}>{entry.comment ?? "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <ConfirmActionModal
                isModalOpen={isGrantModalOpen}
                description={tariff ? `Выдать «${userName}» членство «${tariff.name}» ${termText}?` : ""}
                onConfirm={handleGrant}
                onClose={() => setIsGrantModalOpen(false)}
                confirmTextButton="Выдать"
                cancelTextButton="Отмена"
                isLoading={isGranting}
            />
            <ConfirmActionModal
                isModalOpen={!!revokeTarget}
                description={revokeTarget
                    ? `Снять у «${userName}» членство «${revokeTarget.tariffName}»? `
                        + "Оно перестанет действовать сразу."
                    : ""}
                onConfirm={handleRevoke}
                onClose={() => setRevokeTarget(null)}
                confirmTextButton="Снять"
                cancelTextButton="Отмена"
                isLoading={isRevoking}
            />
        </section>
    );
};
