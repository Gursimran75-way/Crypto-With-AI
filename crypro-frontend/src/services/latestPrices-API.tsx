import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const coinbaseApi = createApi({
  reducerPath: "coinbaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api.exchange.coinbase.com" }),
  endpoints: (builder) => ({
    fetchCoinbasePrices: builder.query<number[], void>({
      query: () => "/products/BTC-USD/candles?granularity=86400",
      transformResponse: (response: number[][]) => {
        // Sort data by time ascending
        const sortedData = response.sort((a, b) => a[0] - b[0]);
        // Extract closing prices (index 4)
        return sortedData.map((candle) => candle[4]).slice(-10);
      },
    }),
    fetchCoinbaseETHPrices: builder.query<number[], void>({
      query: () => "/products/ETH-USD/candles?granularity=86400",
      transformResponse: (response: number[][]) => {
        // Sort data by time ascending
        const sortedData = response.sort((a, b) => a[0] - b[0]);
        // Extract closing prices (index 4)
        return sortedData.map((candle) => candle[4]).slice(-10);
      },
    }),
    fetchCoinbaseSOLPrices: builder.query<number[], void>({
      query: () => "/products/SOL-USD/candles?granularity=86400",
      transformResponse: (response: number[][]) => {
        // Sort data by time ascending
        const sortedData = response.sort((a, b) => a[0] - b[0]);
        // Extract closing prices (index 4)
        return sortedData.map((candle) => candle[4]).slice(-10);
      },
    }),
  }),
});

// Export the auto-generated hook
export const { useLazyFetchCoinbasePricesQuery, useLazyFetchCoinbaseETHPricesQuery, useLazyFetchCoinbaseSOLPricesQuery } = coinbaseApi;
