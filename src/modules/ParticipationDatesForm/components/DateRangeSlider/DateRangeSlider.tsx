import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography";

import { RangeSlider } from "@/shared/ui/RangeSlider/RangeSlider";

const DateRangeSlider = () => (
    <Box sx={{ mt: "33px", display: "flex", flexDirection: "column" }}>
        <Typography
            sx={{
                fontFamily: "Lato",
                fontWeight: 400,
                fontSize: "14px",
                color: "#8494A1",
            }}
        >
            Срок участия (от-до)
        </Typography>
        <Box
            sx={{
                mt: "32px",
                width: 878,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <RangeSlider min={7} max={93} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                    sx={{
                        fontFamily: "Lato",
                        fontWeight: 400,
                        fontSize: "16px",
                    }}
                >
                    7 дней
                </Typography>
                <Typography
                    sx={{
                        fontFamily: "Lato",
                        fontWeight: 400,
                        fontSize: "16px",
                    }}
                >
                    3 месяца
                </Typography>
            </Box>
        </Box>
    </Box>
);

export default DateRangeSlider;
