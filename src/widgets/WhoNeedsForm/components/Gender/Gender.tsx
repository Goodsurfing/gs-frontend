import SwitchComponent from "shared/ui/Switch/ui/Switch";
import { Box, FormControlLabel, Typography } from "@mui/material";
import React, { useState } from "react";

const Gender = () => {
  const [woman, setWoman] = useState<boolean>(true);
  const [man, setMan] = useState<boolean>(false);
  const [other, setOther] = useState<boolean>(false);

  const onWomanChange = () => {
    setWoman(true);
    setMan(false);
    setOther(false);
  };

  const onManChange = () => {
    setMan(true);
    setWoman(false);
    setOther(false);
  };

  const onOtherChange = () => {
    setOther(true);
    setMan(false);
    setWoman(false);
  };

  return (
      <Box sx={{ display: "flex", mt: "30px" }}>
          <FormControlLabel
              label={(
                  <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontWeight: "400",
                        fontSize: "16px",
                        color: "#212121",
                      }}
                  >
                      Женщина
                  </Typography>
                  )}
              control={
                  <SwitchComponent checked={woman} onClick={onWomanChange} />
                }
          />
          <FormControlLabel
              label={(
                  <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontWeight: "400",
                        fontSize: "16px",
                        color: "#212121",
                      }}
                  >
                      Мужчина
                  </Typography>
                  )}
              control={
                  <SwitchComponent checked={man} onClick={onManChange} />
                }
          />
          <FormControlLabel
              label={(
                  <Typography
                      sx={{
                        fontFamily: "Lato",
                        fontWeight: "400",
                        fontSize: "16px",
                        color: "#212121",
                      }}
                  >
                      Другой
                  </Typography>
                  )}
              control={
                  <SwitchComponent checked={other} onClick={onOtherChange} />
                }
          />
      </Box>
  );
};

export default Gender;
