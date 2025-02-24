// src/components/PriceThresholdAlerts.tsx
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetCoinsQuery } from "../../services/coinApi";
import { useAppSelector } from "../../store/store";

const PriceThresholdAlerts: React.FC = () => {
  const thresholds = useAppSelector((state) => state.thresholds.thresholds);
  const coinIds = Object.keys(thresholds);

  const { data: marketData, isLoading } = useGetCoinsQuery(coinIds, {
    skip: coinIds.length === 0,
    pollingInterval: 60000, // Poll every 60 seconds
  });

  useEffect(() => {
    if (!isLoading && marketData) {
      marketData.forEach((coin: any) => {
        const { id, current_price } = coin;
        const coinThreshold = thresholds[id.toLowerCase()];
        console.log("inside", coin, coinThreshold);

        if (coinThreshold) {
          if (coinThreshold.upper && current_price >= coinThreshold.upper) {
            console.log("upper");
            toast.info(
              `${coin.name} has reached or exceeded the upper threshold of ${coinThreshold.upper} Current price: ${current_price}`
            );
          }
          if (coinThreshold.lower && current_price <= coinThreshold.lower) {
            console.log("lower");
            toast.warning(
              `${coin.name} has dropped to or below the lower threshold of ${coinThreshold.lower} Current price: ${current_price}`
            );
          }
        }
      });
    }
  }, [isLoading, marketData, thresholds]);

  return null; // Component does not render anything
};

export default PriceThresholdAlerts;
