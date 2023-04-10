import React, { useState } from "react";

import CalendarComponent from "@/components/ui/CalendarComponent/CalendarComponent";
import Input from "@/components/ui/Input/Input";

const OffersWhereCalendar = () => {
    const [value, setValue] = useState<Date>();

    const onValueChange = () => {

    }

    return (
            <CalendarComponent className={styles.calendar} value={value} onValueChange={setValue} />        
    );
};

export default OffersWhereCalendar;
