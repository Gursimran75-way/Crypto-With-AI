// import React, { useEffect, useState } from "react";

// const TestPage = () => {
//   const [imageSrc, setImageSrc] = useState("");

//   useEffect(() => {
//     fetch("http://localhost:8000/plot")
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setImageSrc("data:image/png;base64," + data.image);
//       })
//       .catch((error) => {
//         console.error("Error fetching plot:", error);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Actual vs Predicted Prices (Last 100 Days)</h2>
//       {imageSrc ? (
//         <img src={imageSrc} alt="Price Prediction Plot" />
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default TestPage;







// import React, { useState } from "react";

// const TestPage = () => {
//   const [pricesInput, setPricesInput] = useState("");
//   const [imageSrc, setImageSrc] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Convert input string into an array of numbers
//     const pricesArray = pricesInput
//       .split(",")
//       .map((p) => parseFloat(p.trim()))
//       .filter((p) => !isNaN(p));

//     if (pricesArray.length !== 10) {
//       alert("Please enter exactly 10 prices separated by commas.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:8000/predict-plot", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ last_prices: pricesArray }),
//       });

//       if (!response.ok) {
//         throw new Error("Error fetching prediction");
//       }

//       const data = await response.json();
//       if (data.plot_image) {
//         setImageSrc("data:image/png;base64," + data.plot_image);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       alert("Error fetching prediction plot.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
//       <h2>Price Trend Prediction (Next 5 Days)</h2>
//       <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
//         <label style={{ display: "block", marginBottom: "0.5rem" }}>
//           Enter last 10 prices (comma separated):
//         </label>
//         <input
//           type="text"
//           value={pricesInput}
//           onChange={(e) => setPricesInput(e.target.value)}
//           placeholder="45000, 45500, 46000, 45800, ..."
//           style={{
//             width: "100%",
//             padding: "8px",
//             marginBottom: "1rem",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//           }}
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#1976d2",
//             color: "white",
//             border: "none",
//             borderRadius: "4px",
//             cursor: "pointer",
//           }}
//         >
//           {loading ? "Predicting..." : "Predict"}
//         </button>
//       </form>
//       {imageSrc ? (
//         <div>
//           <h3>Prediction Plot</h3>
//           <img src={imageSrc} alt="Price Prediction Plot" style={{ maxWidth: "100%" }} />
//         </div>
//       ) : (
//         <p>{loading ? "Loading..." : "No prediction plot yet."}</p>
//       )}
//     </div>
//   );
// };

// export default TestPage;





import React, { useEffect, useState } from "react";

const TestPage = () => {
  const [imageSrc, setImageSrc] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the previous 10 days prices from Coinbase Exchange API
  const fetchCoinbasePrices = async () => {
    try {
      const response = await fetch(
        "https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400"
      );
      if (!response.ok) {
        throw new Error("Error fetching Coinbase data");
      }
      const data = await response.json();
      // Coinbase returns an array of arrays: [time, low, high, open, close, volume]
      // We sort by time ascending and extract the close price (index 4).
      const sortedData = data.sort((a: any, b: any) => a[0] - b[0]);
      const closingPrices = sortedData.map((candle: any) => candle[4]);
      // Take the last 10 closing prices.
      const last10 = closingPrices.slice(-10);
      return last10;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Get last 10 prices from Coinbase Exchange API
      const pricesArray = await fetchCoinbasePrices();

      // Now call your FastAPI endpoint with the last 10 prices.
      console.log(pricesArray)
      const response = await fetch("http://localhost:8000/predict-plot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ last_prices: pricesArray }),
      });

      if (!response.ok) {
        throw new Error("Error fetching prediction");
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      setImageSrc(objectUrl);
    } catch (error) {
      console.error("Error:", error);
      alert("Error fetching prediction plot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Trigger the submission when the component loads.
    handleSubmit();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h2>Price Trend Prediction (Next 5 Days)</h2>
      {loading ? <p>Loading...</p> : imageSrc ? <img src={imageSrc} alt="Prediction Plot" style={{ maxWidth: "100%" }} /> : <p>No prediction plot yet.</p>}
    </div>
  );
};

export default TestPage;


