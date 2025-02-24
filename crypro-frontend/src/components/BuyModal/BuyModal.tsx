import React, { useState, useMemo, useCallback } from "react";
import { Modal, Box, Button, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../../store/store";
import { buyCrypto } from "../../store/reducers/buyCryptoReducer";
import { toast } from "react-toastify";

interface BuyModalProps {
  open: boolean;
  handleClose: () => void;
  symbol: string;
  current_price: number;
  id: number;
  name: string;
}

const BuyModal: React.FC<BuyModalProps> = ({
  open,
  handleClose,
  symbol,
  current_price,
  id,
  name,
}) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<number>(0);

  // Use useMemo to compute totalPrice whenever quantity or current_price changes
  const totalPrice = useMemo(
    () => quantity * current_price,
    [quantity, current_price]
  );

  const handleBuy = useCallback(() => {
    if (quantity <= 0) {
      toast.error("Quantity should be greater than 0");
      return;
    }
    // Dispatch buyCrypto action
    dispatch(
      buyCrypto({
        symbol,
        amount: quantity,
        price: current_price,
        id,
        name,
        purchasedAt: new Date().toISOString(),
      })
    );
    toast.success(`Successfully bought ${quantity} ${symbol}`);
    handleClose();
  }, [quantity, current_price, symbol, id, name, dispatch, handleClose]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Buy {symbol}
        </Typography>
        <TextField
          label="Quantity"
          type="number"
          fullWidth
          margin="normal"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
        />
        <Typography variant="body1">
          Total Price: ${totalPrice.toFixed(2)}
        </Typography>
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button onClick={handleClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleBuy}>
            Buy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default BuyModal;
