import { Box } from "@mui/material";
import ThresholdManager from "../components/ThreshHoldManager/ThreshHoldManager";

const ThreshHoldManagerPage = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
      height={"100vh"}
    >
      <ThresholdManager />
    </Box>
  );
};

export default ThreshHoldManagerPage;
