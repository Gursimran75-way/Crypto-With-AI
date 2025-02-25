import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  FormControlLabel,
  Checkbox,
  Button,
  Container,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useLazyFetchCoinbasePricesQuery } from "../../services/latestPrices-API";
import { usePredictPlotMutation } from "../../services/predictionApi";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

// Function to fetch the last 10 closing prices from Coinbase Exchange API.
// const fetchCoinbasePrices = async () => {
//   try {
//     const response = await fetch(
//       "https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400"
//     );
//     if (!response.ok) {
//       throw new Error("Error fetching Coinbase data");
//     }
//     const data = await response.json();
//     // Coinbase returns an array of arrays: [time, low, high, open, close, volume]
//     // Sort by time ascending and extract the close price (index 4).
//     const sortedData = data.sort((a: any, b: any) => a[0] - b[0]);
//     const closingPrices = sortedData.map((candle: any) => candle[4]);
//     // Take the last 10 closing prices.
//     return closingPrices.slice(-10);
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

const PredictionBTC = () => {
  const [openDisclaimer, setOpenDisclaimer] = useState(true);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [accuracyPlot, setAccuracyPlot] = useState("");
  const [next5DayPlot, setNext5DayPlot] = useState("");
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);

  const [fetchBTCpriceList] = useLazyFetchCoinbasePricesQuery();
  const [fetchPrediciton, { isLoading: loading }] = usePredictPlotMutation();
  const navigate = useNavigate();

  // Function to fetch predictions from your backend.
  const fetchPredictions = async () => {
    try {
      // First, fetch the last 10 prices from Coinbase.
      const pricesArray = await fetchBTCpriceList().unwrap();
      console.log("Fetched prices BTC:", pricesArray);

      // Now, call your FastAPI endpoint with these prices.
      // const response = await fetch("http://localhost:8000/predict-plot", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ last_prices: pricesArray }),
      // });
      // if (!response.ok) {
      //   throw new Error("Error fetching prediction");
      // }
      // const data = await response.json();
      // // Expected response format:
      // // { message: "Prediction and accuracy plot generated successfully",
      // //   next_5_day_plot: "<base64 string>",
      // //   accuracy_plot: "<base64 string>",
      // //   predicted_price: <number> }

      const data = await fetchPrediciton(pricesArray).unwrap();
      setNext5DayPlot("data:image/png;base64," + data.next_5_day_plot);
      setAccuracyPlot("data:image/png;base64," + data.accuracy_plot);
      setPredictedPrice(data.predicted_price);
    } catch (error) {
      console.error("Error:", error);
      alert("Error fetching prediction plot.");
    }
  };

  // When the disclaimer is accepted, fetch predictions.
  useEffect(() => {
    if (disclaimerAccepted) {
      fetchPredictions();
    }
  }, [disclaimerAccepted]);

  // Apply a blur style to the main content when the modal is open.
  const blurredStyle = openDisclaimer
    ? { filter: "blur(10px)", pointerEvents: "none" }
    : {};

  return (
    <Container>
      {/* Disclaimer Modal */}
      <Modal
        open={openDisclaimer}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={openDisclaimer}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: 4,
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            {/* Close Icon */}
            <IconButton
              onClick={() => navigate("/app")}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                transitionDuration: "0.3s",
                "&:hover": { backgroundColor: "#e9c9" },
              }}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
              Disclaimer
            </Typography>
            <Typography variant="body1" gutterBottom>
              This prediction is based on historical Bitcoin prices. Use this AI
              model prediction for research and informational purposes only. Invest at your
              own risk.
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  color="primary"
                />
              }
              label="I accept the disclaimer"
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (disclaimerAccepted) {
                    setOpenDisclaimer(false);
                  } else {
                    alert("Please accept the disclaimer to continue.");
                  }
                }}
              >
                Continue
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
      {loading && (
        <Box
          width="100%"
          padding={5}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      )}

      {/* Main Content */}
      {!loading && disclaimerAccepted && (
        <Box sx={{ ...blurredStyle, transition: "all 0.3s ease", mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Model Accuracy for BTC
          </Typography>
          {loading ? (
            <Typography align="center">Loading accuracy plot...</Typography>
          ) : accuracyPlot ? (
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <img
                src={accuracyPlot}
                alt="Accuracy Plot"
                style={{ maxWidth: "90%", border: "1px solid #ccc" }}
              />
            </Box>
          ) : (
            <Typography align="center">No accuracy plot available.</Typography>
          )}

          <Typography variant="h4" align="center" gutterBottom>
            Next 5 Day Prediction
          </Typography>
          {loading ? (
            <Typography align="center">
              Loading 5-day prediction plot...
            </Typography>
          ) : next5DayPlot ? (
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <img
                src={next5DayPlot}
                alt="Next 5 Day Prediction Plot"
                style={{ maxWidth: "90%", border: "1px solid #ccc" }}
              />
            </Box>
          ) : (
            <Typography align="center">
              No 5-day prediction plot available.
            </Typography>
          )}

          {loading ? (
            <Typography align="center">Loading predicted price...</Typography>
          ) : predictedPrice !== null ? (
            <Typography variant="h2" align="center" sx={{ mt: 4 }}>
              <span style={{ textDecoration: "underline" }}>
                Tomorrow's Average Price Prediction:
              </span>{" "}
              ${predictedPrice.toFixed(2)}
            </Typography>
          ) : null}
        </Box>
      )}
    </Container>
  );
};

export default PredictionBTC;
