import pandas as pd 
import numpy as np 

def compute_timing(df: pd.DataFrame) -> dict: 
    """
    Analyze WHEN the user types best.
    
    Computes:
    - Best/worst hours for performance
    - Most active typing hours
    - Best days of the week
    - Night owl vs early bird classification
    - Hourly performance breakdown for charts
    
    Args:
        df: Cleaned DataFrame with 'hour', 'day_of_week', 'wpm' columns
        
    Returns:
        Dictionary with timing insights
    """

    hourly_stats = df.groupby('hour').agg(
        {
            'wpm': ['mean', 'count'],
            'acc': 'mean'
        }
    ).reset_index()

     # Flatten column names (pandas creates multi-level columns)
    hourly_stats.columns = ['hour', 'avg_wpm', 'test_count', 'avg_acc']
    
    # Only consider hours with at least 5 tests (to avoid outliers)
    significant_hours = hourly_stats[hourly_stats['test_count'] >= 5]
    
    # Find best and worst hours
    if len(significant_hours) > 0:
        best_hour_row = significant_hours.loc[significant_hours['avg_wpm'].idxmax()]
        worst_hour_row = significant_hours.loc[significant_hours['avg_wpm'].idxmin()]
        most_active_hour_row = hourly_stats.loc[hourly_stats['test_count'].idxmax()]
        
        best_hour = int(best_hour_row['hour'])
        best_hour_wpm = round(float(best_hour_row['avg_wpm']), 1)
        
        worst_hour = int(worst_hour_row['hour'])
        worst_hour_wpm = round(float(worst_hour_row['avg_wpm']), 1)
        
        most_active_hour = int(most_active_hour_row['hour'])
        most_active_count = int(most_active_hour_row['test_count'])
    else:
        # Fallback if insufficient data
        best_hour = int(df.groupby('hour')['wpm'].mean().idxmax())
        best_hour_wpm = round(float(df.groupby('hour')['wpm'].mean().max()), 1)
        worst_hour = int(df.groupby('hour')['wpm'].mean().idxmin())
        worst_hour_wpm = round(float(df.groupby('hour')['wpm'].mean().min()), 1)
        most_active_hour = int(df.groupby('hour').size().idxmax())
        most_active_count = int(df.groupby('hour').size().max())

    #Day of the week analysis 
     # Define day order (Monday = 0, Sunday = 6)
    day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    # Group by day of week
    daily_stats = df.groupby('day_of_week').agg({
        'wpm': ['mean', 'count'],
        'acc': 'mean'
    }).reset_index()
    
    daily_stats.columns = ['day', 'avg_wpm', 'test_count', 'avg_acc']
    
    # Sort by day order
    daily_stats['day'] = pd.Categorical(daily_stats['day'], categories=day_order, ordered=True)
    daily_stats = daily_stats.sort_values('day')
    
    # Find best day
    best_day_row = daily_stats.loc[daily_stats['avg_wpm'].idxmax()]
    best_day = str(best_day_row['day'])
    best_day_wpm = round(float(best_day_row['avg_wpm']), 1)
    
    # Find most active day
    most_active_day_row = daily_stats.loc[daily_stats['test_count'].idxmax()]
    most_active_day = str(most_active_day_row['day'])
    most_active_day_count = int(most_active_day_row['test_count'])
    
    # Night Owl vs Early Bird Classification 
    # Classify hours into time periods
    # Early Bird: 5 AM - 11 AM (hours 5-10)
    # Night Owl: 10 PM - 2 AM (hours 22-23, 0-1)
    
    early_bird_hours = df[df['hour'].between(5, 10)]
    night_owl_hours = df[(df['hour'] >= 22) | (df['hour'] <= 1)]
    
    early_bird_count = len(early_bird_hours)
    night_owl_count = len(night_owl_hours)
    
    # Determine classification
    if night_owl_count > early_bird_count * 1.5:
        time_preference = "Night Owl"
        time_description = f"You typed {night_owl_count} tests late at night (10 PM - 2 AM)"
    elif early_bird_count > night_owl_count * 1.5:
        time_preference = "Early Bird"
        time_description = f"You typed {early_bird_count} tests in the morning (5 AM - 11 AM)"
    else:
        time_preference = "Balanced"
        time_description = "You type consistently throughout the day"

    #Extract data for charts 
    hourly_chart = []
    for hour in range(24): 
        hour_data = hourly_stats[hourly_stats['hour'] == hour]
        if len(hour_data) > 0: 
            hourly_chart.append({
                "hour": hour,
                "avgWpm": round(float(hour_data['avg_wpm'].iloc[0]), 1),
                "testCount": int(hour_data['test_count'].iloc[0]),
                "avgAccuracy": round(float(hour_data['avg_acc'].iloc[0]), 1)
            })
        else:
            hourly_chart.append({
                "hour": hour,
                "avgWpm": 0,
                "testCount": 0,
                "avgAccuracy": 0
            })

    # Create daily breakdown for charts 
    daily_chart = []
    for _, row in daily_stats.iterrows():
        daily_chart.append(
            {
            "day": str(row['day']),
            "avgWpm": round(float(row['avg_wpm']), 1),
            "testCount": int(row['test_count']),
            "avgAccuracy": round(float(row['avg_acc']), 1)
            }
        )
    ...
    def format_hour(hour: int) -> str: 
        """ Convert 24-hour format to 12 hour with AM/PM"""
        if hour == 0:
            return "12 AM"
        elif hour < 12:
            return f"{hour} AM"
        elif hour == 12:
            return "12 PM"
        else:
            return f"{hour - 12} PM"

    print(f"\n🕐 Analyzing your typing schedule...")
    print(f"   Best hour: {format_hour(best_hour)} ({best_hour_wpm} WPM)")
    print(f"   Worst hour: {format_hour(worst_hour)} ({worst_hour_wpm} WPM)")
    print(f"   Most active: {format_hour(most_active_hour)} ({most_active_count} tests)")
    print(f"   Best day: {best_day} ({best_day_wpm} WPM)")
    print(f"   Time preference: {time_preference}")
    print(f"   Timing analysis complete!")
    
    return {
        "bestHour": best_hour,
        "bestHourFormatted": format_hour(best_hour),
        "bestHourWpm": best_hour_wpm,
        
        "worstHour": worst_hour,
        "worstHourFormatted": format_hour(worst_hour),
        "worstHourWpm": worst_hour_wpm,
        
        "mostActiveHour": most_active_hour,
        "mostActiveHourFormatted": format_hour(most_active_hour),
        "mostActiveHourCount": most_active_count,
        
        "bestDay": best_day,
        "bestDayWpm": best_day_wpm,
        
        "mostActiveDay": most_active_day,
        "mostActiveDayCount": most_active_day_count,
        
        "timePreference": time_preference,
        "timeDescription": time_description,
        
        "hourlyBreakdown": hourly_chart,
        "dailyBreakdown": daily_chart
    }