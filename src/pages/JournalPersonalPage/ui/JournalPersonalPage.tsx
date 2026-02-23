import React from "react";
import { useParams } from "react-router-dom";
import { MainPageLayout } from "@/widgets/MainPageLayout";

import { JournalPersonal } from "@/widgets/Journal";

const JournalPersonalPage = () => {
    const { id } = useParams<{ id: string; }>();
    return (
        <MainPageLayout>
            {id && (
                <JournalPersonal journalId={id} />
            )}
        </MainPageLayout>
    );
};

export default JournalPersonalPage;
