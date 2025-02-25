import { useState } from "react";
import { Box, MenuItem, Select, InputLabel, FormControl, Typography } from "@mui/material";
import PredictionETH from "../ETC-Prediction/PredictionETH";
import PredictionBTC from "../BTC-Prediction/PredictionBTC";
import PredictionSOL from "../SOL-Prediction/PredictionSOL";

const SelectPrediction = () => {
  // state to keep track of the selected cryptocurrency, starting with an empty string
  const [selectedCrypto, setSelectedCrypto] = useState("");

  // handle dropdown change
  const handleChange = (event: any) => {
    setSelectedCrypto(event.target.value);
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      {/* Dropdown */}
      <FormControl fullWidth sx={{ mb: 3, width: "100%", boxShadow: 7 }}>
        {/* <InputLabel id="crypto-select-label">Select Cryptocurrency</InputLabel> */}
        <Select
          labelId="crypto-select-label"
          id="crypto-select"
          value={selectedCrypto}
          // label="Select Cryptocurrency"
          onChange={handleChange}
          displayEmpty
        >
          {/* Placeholder option */}
          <MenuItem value="" disabled>
            No crypto selected
          </MenuItem>
          <MenuItem value="BTC">Bitcoin</MenuItem>
          <MenuItem value="ETH">Ethereum</MenuItem>
          <MenuItem value="SOL">Solana</MenuItem>
          <MenuItem value="">None</MenuItem>
        </Select>
      </FormControl>

      {/* Conditionally render components or display a message */}
      {selectedCrypto === "BTC" && <PredictionBTC />}
      {selectedCrypto === "ETH" && <PredictionETH />}
      {selectedCrypto === "SOL" && <PredictionSOL />}
      {selectedCrypto === "" && (
        <Typography sx={{ textAlign:"center"}} variant="body1">No crypto selected. Please select a cryptocurrency.</Typography>
      )}
    </Box>
  );
};

export default SelectPrediction;
