import pandas as pd
import numpy as np


def compute_journey(df: pd.DataFrame) -> dict:
    """Analyze typing progress over time."""
    
    print("\n Analyzing your typing journey...")
    
    # Group by month
    monthly_stats = df.groupby('month').agg({
        'wpm': ['mean', 'count'],
        'acc': 'mean',
        'consistency': 'mean'
    }).reset_index()
    
    monthly_stats.columns = ['month', 'avgWpm', 'testCount', 'avgAcc', 'avgConsistency']
    monthly_stats = monthly_stats.sort_values('month')
    
    print(f" Analyzed {len(monthly_stats)} months of data")
    
    # Compare first and last month
    if len(monthly_stats) > 0:
        first_month_avg = monthly_stats.iloc[0]['avgWpm']   # First row
        last_month_avg = monthly_stats.iloc[-1]['avgWpm']   # Last row (-1 = last)
        improvement = last_month_avg - first_month_avg
    else:
        first_month_avg = 0
        last_month_avg = 0
        improvement = 0
    
    print(f"First month: {first_month_avg:.1f} WPM → Last month: {last_month_avg:.1f} WPM (Δ {improvement:+.1f})")

    # Step 3: Find the best performing month
    if len(monthly_stats) > 0:
        best_month_idx = monthly_stats['avgWpm'].idxmax()  # Index of max WPM
        best_month_row = monthly_stats.loc[best_month_idx]
        
        best_month = str(best_month_row['month'])
        best_month_wpm = best_month_row['avgWpm']
    else:
        best_month = "N/A"
        best_month_wpm = 0
    
    print(f"Best month: {best_month} ({best_month_wpm:.1f} WPM)")
    
    # Calculate month-over-month changes
    # This shows which month had the biggest jump in performance
    if len(monthly_stats) > 1:
        # Calculate difference between consecutive months
        monthly_stats['wpmChange'] = monthly_stats['avgWpm'].diff()
        
        # Find month with biggest positive change
        biggest_jump_idx = monthly_stats['wpmChange'].idxmax()
        biggest_jump_row = monthly_stats.loc[biggest_jump_idx]
        
        biggest_jump_month = str(biggest_jump_row['month'])
        biggest_jump_amount = biggest_jump_row['wpmChange']
    else:
        biggest_jump_month = "N/A"
        biggest_jump_amount = 0
    
    print(f" Biggest improvement: {biggest_jump_month} (+{biggest_jump_amount:.1f} WPM)")

    #Prepare monthly trend data for frontend chart
    monthly_trend = []
    
    for _, row in monthly_stats.iterrows():
        monthly_trend.append({
            "month": str(row['month']),
            "avgWpm": round(row['avgWpm'], 2),
            "testCount": int(row['testCount'])
        })
    
    result = {
        "firstMonthAvg": round(first_month_avg, 2),
        "lastMonthAvg": round(last_month_avg, 2),
        "improvement": round(improvement, 2),
        "bestMonth": best_month,
        "bestMonthWpm": round(best_month_wpm, 2),
        "biggestJumpMonth": biggest_jump_month,
        "biggestJumpAmount": round(biggest_jump_amount, 2),
        "monthlyTrend": monthly_trend
    }
    
    print(f"Journey analysis complete!\n")
    
    return result 

