import React, { FC } from "react";
import Textarea from "@/UI/Textarea/Textarea";

import { FullDescriptionProps } from "./types";

const ShortDescription: FC<FullDescriptionProps> = () => (
    <Textarea label="Полное описание" description="Не более 3000 знаков" maxLength={3000} />
);

export default ShortDescription;
