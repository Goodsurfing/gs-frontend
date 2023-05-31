import React, { FC } from "react";

import { ShortDescriptionProps } from "./types";

import Textarea from "@/UI/Textarea/Textarea";

const ShortDescription: FC<ShortDescriptionProps> = () => (
    <Textarea label="Краткое описание" description="Не более 250 знаков" maxLength={250} />
);

export default ShortDescription;
