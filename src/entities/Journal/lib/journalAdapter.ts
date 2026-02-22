import { CreateAdminJournal, GetAdminJournal } from "@/entities/Admin";
import { AdminJournalFormFields } from "@/features/Admin";

export const journalApiAdapter = (data: AdminJournalFormFields): CreateAdminJournal => {
    const {
        description, image, name, isActive,
    } = data;
    return {
        description,
        imageId: image.id,
        name,
        isActive,
    };
};

export const journalAdapter = (data: GetAdminJournal): AdminJournalFormFields => {
    const {
        description, image, name, isActive,
    } = data;
    return {
        description,
        image,
        name,
        isActive,
    };
};
