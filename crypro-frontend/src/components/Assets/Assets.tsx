// src/pages/PurchasedAssetsPage.tsx
import React, { useMemo, useCallback, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useGetCoinsQuery } from "../../services/coinApi";
import { useAppSelector } from "../../store/store";
import { useDispatch } from "react-redux";
import { sellCrypto } from "../../store/reducers/buyCryptoReducer"; // Adjust path as needed
import { toast } from "react-toastify";
import { OverallStatsModal } from "../OverAllStatModal/OverAllStatModal";
import { motion } from "framer-motion";

const PurchasedAssetsPage: React.FC = () => {
  const dispatch = useDispatch();
  const purchases = useAppSelector((state) => state.portfolio.purchases);

  // Get coinIds from purchases
  const coinIds = useMemo(
    () => purchases.map((purchase) => purchase.name),
    [purchases]
  );

  const {
    data: marketData,
    isLoading,
    refetch,
  } = useGetCoinsQuery(coinIds, {
    skip: coinIds.length === 0,
    pollingInterval: 60000, // Polls every 60 seconds
  });

  // Memoize getCoinData helper function
  const getCoinData = useCallback(
    (id: string) => marketData?.find((coin: any) => coin.id === id),
    [marketData]
  );

  // Memoize chart data for each purchase
  const chartData = useMemo(() => {
    return purchases
      .map((purchase) => {
        const coin = getCoinData(purchase.name);
        if (!coin) return null;
        const currentPrice = coin.current_price;
        const profitLoss = purchase.amount * (currentPrice - purchase.price);
        return {
          coin: coin.name,
          profitLoss: parseFloat(profitLoss.toFixed(2)),
        };
      })
      .filter(Boolean) as { coin: string; profitLoss: number }[];
  }, [purchases, getCoinData]);

  // Memoize overall profit/loss computation
  const overallProfitLoss = useMemo(() => {
    return purchases.reduce((acc, purchase) => {
      const coin = getCoinData(purchase.name);
      if (!coin) return acc;
      const currentPrice = coin.current_price;
      const profitLoss = purchase.amount * (currentPrice - purchase.price);
      return acc + profitLoss;
    }, 0);
  }, [purchases, getCoinData]);

  // Memoize overall initial investment computation
  const initialInvestment = useMemo(() => {
    return purchases.reduce((acc, purchase) => {
      const net = purchase.amount * purchase.price;
      return acc + net;
    }, 0);
  }, [purchases]);

  // Modal state for Overall Stats
  const [openStats, setOpenStats] = useState(false);
  const handleOpenStats = useCallback(() => setOpenStats(true), []);
  const handleCloseStats = useCallback(() => setOpenStats(false), []);

  const handleSell = useCallback(
    (coinName: string, purchasedAt: string, profitLoss: number) => {
      if (profitLoss <= 0) {
        toast.warning(
          `You sold ${coinName} at a loss of ${profitLoss.toFixed(2)}`,
          { position: "top-center" }
        );
      } else {
        toast.success(
          `You sold ${coinName} at a profit of ${profitLoss.toFixed(2)}`,
          { position: "top-center" }
        );
      }
      dispatch(sellCrypto({ name: coinName, purchasedAt }));
      refetch();
    },
    [dispatch, refetch]
  );

  if (isLoading) {
    return (
      <Box
        padding={5}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} position="relative">
      {/* Stats Button with bounce effect */}
      <Box position="absolute" top={16} right={16}>
        <motion.div
          whileHover={{
            scale: 1.1,
            transition: { type: "spring", stiffness: 300 },
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <Button
            sx={{ backgroundColor: "dodgerblue" }}
            variant="contained"
            onClick={handleOpenStats}
          >
            Stats
          </Button>
        </motion.div>
      </Box>
      <Typography variant="h4" gutterBottom>
        Purchased Assets
      </Typography>
      <Table>
        <TableHead
          style={{
            background: "#0C1643",
            border: "1px solid #0C1643",
            borderRadius: "50px",
          }}
        >
          <TableRow>
            <TableCell style={{ color: "white" }}>Coin</TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Purchased Qty
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Purchase Price (USD)
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Current Price (USD)
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Profit/Loss (USD)
            </TableCell>
            <TableCell style={{ color: "white" }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {purchases.map((purchase) => {
            const coin = getCoinData(purchase.name);
            if (!coin) return null;
            const currentPrice = coin.current_price;
            const profitLoss =
              purchase.amount * (currentPrice - purchase.price);
            return (
              <TableRow key={purchase.id}>
                <TableCell>{coin.name}</TableCell>
                <TableCell align="right">{purchase.amount}</TableCell>
                <TableCell align="right">
                  ${purchase.price.toFixed(2)}
                </TableCell>
                <TableCell align="right">${currentPrice.toFixed(2)}</TableCell>
                <TableCell
                  align="right"
                  style={{ color: profitLoss >= 0 ? "green" : "red" }}
                >
                  ${profitLoss.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      handleSell(
                        purchase.name,
                        purchase.purchasedAt,
                        profitLoss
                      )
                    }
                  >
                    Sell
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Individual Profit/Loss Chart */}
      <Box mt={5}>
        <Typography
          variant="h5"
          gutterBottom
          textAlign={"center"}
          sx={{ textDecoration: "underline", fontWeight: "bold" }}
        >
          Profit/Loss Chart
        </Typography>
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="coin" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="profitLoss" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography color="red" textAlign={"center"}>
            No chart data available
          </Typography>
        )}
      </Box>

      {/* Overall Stats Modal */}
      <OverallStatsModal
        open={openStats}
        onClose={handleCloseStats}
        overallProfitLoss={overallProfitLoss}
        initialInvestment={initialInvestment}
      />
    </Box>
  );
};

export default PurchasedAssetsPage;
