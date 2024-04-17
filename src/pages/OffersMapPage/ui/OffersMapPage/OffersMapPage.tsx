import React from "react";

import { MainPageLayout } from "@/widgets/MainPageLayout";
import { OffersSearchFilter } from "../OffersSearchFilter/OffersSearchFilter";

const OffersMapPage = () => (
    <MainPageLayout>
        <div>
            <OffersSearchFilter />
        </div>
    </MainPageLayout>
);

export default OffersMapPage;
