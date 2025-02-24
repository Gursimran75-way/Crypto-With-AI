import React, { useMemo } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface OverallStatsModalProps {
  open: boolean;
  onClose: () => void;
  overallProfitLoss: number;
  initialInvestment: number;
}

export const OverallStatsModal: React.FC<OverallStatsModalProps> = ({
  open,
  onClose,
  overallProfitLoss,
  initialInvestment,
}) => {
  // Memoize the line chart data so it only recalculates when the values change.
  const lineChartData = useMemo(() => {
    return [
      { name: "Initial Investment", value: initialInvestment },
      { name: "Net Profit/Loss", value: overallProfitLoss },
    ];
  }, [initialInvestment, overallProfitLoss]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Overall Stats
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Initial Investment: ${initialInvestment.toFixed(2)}
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          color={overallProfitLoss >= 0 ? "green" : "red"}
        >
          Net Profit/Loss: ${overallProfitLoss.toFixed(2)}
        </Typography>
        <Box mt={2}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Modal>
  );
};
