import React, { useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  List,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import { RootState } from "../../store/store";
import { removeThreshold } from "../../store/reducers/threshHoldReducer";

const cardVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.15, type: "spring", stiffness: 100 },
  }),
};

const ThresholdListPage: React.FC = () => {
  const dispatch = useDispatch();
  const thresholds = useSelector(
    (state: RootState) => state.thresholds.thresholds
  );

  // Memoize conversion from object to array so that it only re-computes when thresholds change
  const thresholdItems = useMemo(
    () => Object.entries(thresholds),
    [thresholds]
  );

  // Memoize the delete handler
  const handleDelete = useCallback(
    (coinName: string) => {
      dispatch(removeThreshold(coinName));
    },
    [dispatch]
  );

  return (
    <Box p={3} sx={{ maxWidth: 600, margin: "auto" }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        My Price Thresholds
      </Typography>
      {thresholdItems.length === 0 ? (
        <Typography align="center">No thresholds set.</Typography>
      ) : (
        <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {thresholdItems.map(([coinName, { upper, lower }], index) => (
            <motion.div
              key={coinName}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6">Coin: {coinName}</Typography>
                  <Typography variant="body2">
                    Upper Threshold: {upper ?? "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    Lower Threshold: {lower ?? "N/A"}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "flex-end", marginTop: "-50px" }}
                >
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(coinName)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </CardActions>
              </Card>
            </motion.div>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ThresholdListPage;
