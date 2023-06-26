import React, { FC } from "react";
import Textarea from "@/shared/ui/Textarea/Textarea";

import { ShortDescriptionProps } from "./types";

const ShortDescription: FC<ShortDescriptionProps> = () => {
    return (
        <Textarea label="Краткое описание" description="Не более 250 знаков" maxLength={250} />
    );
};

export default ShortDescription;
