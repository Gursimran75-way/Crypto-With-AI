import { Box, Paper, Typography } from "@mui/material";
import Cryptocurrencies from "../components/Cryptocurrencies/Cryptocurrencies";
import { useAppSelector } from "../store/store";

const HomePage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Paper
      sx={{
        width: "100%",
        display: "flex",
        borderRadius: 3,
        p: 2,
        position: "relative",
        height: "calc(100vh - 16px)",
        overflowY: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          mb: 2,
          pb: 2,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Hi{" "}
          <span
            style={{
              textDecoration: "underline",
              fontWeight: "bold",
              fontSize: "30px",
            }}
          >
            {user?.name}
          </span>
        </Typography>

        <Cryptocurrencies />
      </Box>
    </Paper>
  );
};

export default HomePage;
