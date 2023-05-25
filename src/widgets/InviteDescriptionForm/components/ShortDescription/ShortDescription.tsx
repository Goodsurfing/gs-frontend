import React, { FC } from "react";
import Textarea from "@/UI/Textarea/Textarea";

import { ShortDescriptionProps } from "./types";

const ShortDescription: FC<ShortDescriptionProps> = () => (
    <Textarea label="Краткое описание" description="Не более 250 знаков" maxLength={250} />
);

export default ShortDescription;
