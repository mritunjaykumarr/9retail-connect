import pandas as pd
import numpy as np

class BaselineForecaster:
    """
    Weighted Moving Average & Exponential Smoothing Baseline Model.
    Ideal for cold-start SKUs or short historical data windows (< 60 days).
    """

    @staticmethod
    def forecast_weighted_moving_average(df_sku, horizon_days=30, weights=[0.1, 0.2, 0.3, 0.4]):
        """
        Calculates 4-week weighted moving average with recent weeks weighted higher.
        """
        if df_sku.empty:
            return 100, 80, 120

        # Sort by date
        df_sorted = df_sku.sort_values('date')
        daily_sales = df_sorted.set_index('date')['quantity'].resample('D').sum().fillna(0)
        
        # Take last 28 days
        last_28 = daily_sales.tail(28)
        if len(last_28) < 7:
            avg_daily = daily_sales.mean() if len(daily_sales) > 0 else 10
        else:
            # Chunk into 4 weeks
            weeks = [last_28.iloc[i*7:(i+1)*7].mean() for i in range(min(4, len(last_28)//7))]
            if len(weeks) < 4:
                avg_daily = np.mean(weeks)
            else:
                avg_daily = np.average(weeks, weights=weights[:len(weeks)])

        predicted_total = int(avg_daily * horizon_days)
        std_dev = np.std(daily_sales) if len(daily_sales) > 1 else avg_daily * 0.15
        
        margin = int(1.96 * std_dev * np.sqrt(horizon_days))
        lower_bound = max(0, predicted_total - margin)
        upper_bound = predicted_total + margin

        return predicted_total, lower_bound, upper_bound
