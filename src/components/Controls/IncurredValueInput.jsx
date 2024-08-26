import { TextField } from "@mui/material";
import React, { useState } from "react";
import { isNumberOnly } from "../../reducer/form";

const IncurredValueInput = ({ serviceId , setIncurredService}) => {
  const [incurredValue, setIncurredValue] = useState(0);
  const [priceError, setPriceError] = useState(false)

  const handleChangeError = () => {
    if (isNumberOnly(incurredValue)) {
      setPriceError(true);
      return;
    }
  };
  const handleChange = (e) => {
    setIncurredValue(Number(e.target.value));
  }


  return (
    <TextField
      value={incurredValue}
      variant="standard"
      required
      error={priceError}
      helperText={priceError ? "Sai định dạng" : "" }
      onChange={handleChange}
      onBlur={(e) => {
          handleChangeError
          if (!priceError) {
            setIncurredService(serviceId, incurredValue);
          }
      }}
      inputProps={{
        style: {
          fontSize: "1.4rem",
          height: 20,
          textAlign: "center",
        },
        type: 'number',
        step: 50000,
        min: 0,
        inputMode: 'numeric', 
        pattern: '[0-9]*'
      }}
    />
  );
}

export default IncurredValueInput