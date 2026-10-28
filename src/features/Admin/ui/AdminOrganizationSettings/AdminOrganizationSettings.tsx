import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLocale } from "@/app/providers/LocaleProvider";
import {
    AdminOrganization,
    useActivateOrganizationMembershipMutation,
    useDeleteOrganizationMutation,
    useToggleAdminOrganizationActiveMutation,
} from "@/entities/Admin";
import { getAdminOrganizationsPageUrl } from "@/shared/config/routes/AppUrls";
import { getErrorText } from "@/shared/lib/getErrorText";
import Button from "@/shared/ui/Button/Button";
import { ConfirmActionModal } from "@/shared/ui/ConfirmActionModal/ConfirmActionModal";
import HintPopup from "@/shared/ui/HintPopup/HintPopup";
import { HintType, ToastAlert } from "@/shared/ui/HintPopup/HintPopup.interface";

import styles from "./AdminOrganizationSettings.module.scss";

interface AdminOrganizationSettingsProps {
    organizationId: string;
    data: AdminOrganization;
}

type Action = "toggle" | "delete" | "membership";

/**
 * Действия с организацией в админке. Раньше «Заблокировать» и «Удалить»
 * только показывали уведомление и ничего не отправляли на сервер; теперь
 * они вызывают API, плюс GS-199 — выдача членства организации.
 */
export const AdminOrganizationSettings: FC<AdminOrganizationSettingsProps> = (props) => {
    const { organizationId, data } = props;
    const navigate = useNavigate();
    const { locale } = useLocale();
    const [action, setAction] = useState<Action | null>(null);
    const [toast, setToast] = useState<ToastAlert | null>(null);

    const [toggleActive, { isLoading: isToggling }] = useToggleAdminOrganizationActiveMutation();
    const [deleteOrganization, { isLoading: isDeleting }] = useDeleteOrganizationMutation();
    const [activateMembership,
        { isLoading: isActivating }] = useActivateOrganizationMembershipMutation();

    const descriptions: Record<Action, string> = {
        toggle: data.isActive
            ? "Заблокировать организацию? Её вакансии перестанут быть видны."
            : "Разблокировать организацию?",
        delete: "Удалить организацию безвозвратно?",
        membership: "Выдать организации членство? Владелец получит членство организатора бесплатно и бессрочно.",
    };

    const run = async () => {
        if (!action) return;
        setToast(null);
        try {
            if (action === "toggle") {
                await toggleActive(organizationId).unwrap();
                setToast({
                    text: data.isActive ? "Организация заблокирована" : "Организация разблокирована",
                    type: HintType.Success,
                });
            }
            if (action === "membership") {
                await activateMembership(organizationId).unwrap();
                setToast({ text: "Членство организации выдано", type: HintType.Success });
            }
            if (action === "delete") {
                await deleteOrganization(organizationId).unwrap();
                navigate(getAdminOrganizationsPageUrl(locale));
            }
        } catch (error) {
            setToast({ text: getErrorText(error), type: HintType.Error });
        } finally {
            setAction(null);
        }
    };

    return (
        <div className={styles.wrapper}>
            {toast && <HintPopup text={toast.text} type={toast.type} />}
            <Button
                className={styles.button}
                color="GREEN"
                size="SMALL"
                variant="FILL"
                onClick={() => setAction("membership")}
                disabled={isActivating || data.isHostMembership}
            >
                {data.isHostMembership ? "Членство уже есть" : "Выдать членство"}
            </Button>
            <Button
                className={styles.button}
                color="GRAY"
                size="SMALL"
                variant="FILL"
                onClick={() => setAction("toggle")}
                disabled={isToggling}
            >
                {data.isActive ? "Заблокировать организацию" : "Разблокировать организацию"}
            </Button>
            <Button
                className={styles.button}
                color="RED"
                size="SMALL"
                variant="FILL"
                onClick={() => setAction("delete")}
                disabled={isDeleting}
            >
                Удалить организацию
            </Button>
            <ConfirmActionModal
                description={action ? descriptions[action] : ""}
                onConfirm={run}
                onClose={() => setAction(null)}
                isModalOpen={action !== null}
                isLoading={isToggling || isDeleting || isActivating}
            />
        </div>
    );
};
