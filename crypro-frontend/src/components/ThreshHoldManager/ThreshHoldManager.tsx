import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setThreshold } from "../../store/reducers/threshHoldReducer";
import { Box, Button, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface FormData {
  coinName: string;
  upper?: number;
  lower?: number;
}

const ThresholdManager: React.FC = () => {
  const dispatch = useDispatch();

  // Define the validation schema with Yup (memoized so it doesn't re-create on every render)
  const schema = useMemo(
    () =>
      yup.object().shape({
        coinName: yup
          .string()
          .required("Coin name is required")
          .matches(/^[a-z]+$/, "Coin name must be lowercase letters only"),
        upper: yup.number().typeError("Upper threshold must be a number"),
        lower: yup.number().typeError("Lower threshold must be a number"),
      }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      coinName: "",
      upper: undefined,
      lower: undefined,
    },
  });

  // Memoize the submit handler using useCallback
  const onSubmit = useCallback(
    (data: FormData) => {
      dispatch(
        setThreshold({
          coinName: data.coinName,
          upper: data.upper,
          lower: data.lower,
        })
      );
      toast.success("Threshold set successfully");
      reset();
    },
    [dispatch, reset]
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Set Price Threshold
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="coinName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Coin name in lowerCase (e.g., bitcoin, ethereum)"
              fullWidth
              margin="normal"
              error={!!errors.coinName}
              helperText={errors.coinName?.message}
            />
          )}
        />
        <Controller
          name="upper"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Upper Threshold"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.upper}
              helperText={errors.upper?.message}
            />
          )}
        />
        <Controller
          name="lower"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Lower Threshold"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.lower}
              helperText={errors.lower?.message}
            />
          )}
        />
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Set Threshold
        </Button>
      </form>
    </Box>
  );
};

export default ThresholdManager;
