import { Box } from "@mui/material";
import ThresholdListPage from "../components/ThreshHoldListing/ThreshHoldListing";

const ThresholdListingPage = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      width={"100%"}
    >
      <ThresholdListPage />
    </Box>
  );
};

export default ThresholdListingPage;
