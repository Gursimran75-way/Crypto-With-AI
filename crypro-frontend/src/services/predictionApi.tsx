import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const predictionApi = createApi({
  reducerPath: "predictionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/predict-plot" }),
  endpoints: (builder) => ({
    predictPlot: builder.mutation<
      {
        message: string;
        next_5_day_plot: string;
        accuracy_plot: string;
        predicted_price: number;
        accuracy_metrics: { Accuracy: number };
      },
      number[]
    >({
      query: (lastPrices) => ({
        url: "/bitcoin",
        method: "POST",
        body: { last_prices: lastPrices },
      }),
    }),
    predictPlotETH: builder.mutation<
      {
        message: string;
        next_5_day_plot: string;
        accuracy_plot: string;
        predicted_price: number;
        accuracy_metrics: { Accuracy: number };
      },
      number[]
    >({
      query: (lastPrices) => ({
        url: "/etherium",
        method: "POST",
        body: { last_prices: lastPrices },
      }),
    }),
    predictPlotSOL: builder.mutation<
      {
        message: string;
        next_5_day_plot: string;
        accuracy_plot: string;
        predicted_price: number;
        accuracy_metrics: { Accuracy: number };
      },
      number[]
    >({
      query: (lastPrices) => ({
        url: "/solana",
        method: "POST",
        body: { last_prices: lastPrices },
      }),
    }),
  }),
});

export const { usePredictPlotMutation, usePredictPlotETHMutation, usePredictPlotSOLMutation } = predictionApi;
