import pandas as pd 
import numpy as np 

def calculate_longest_streak(df: pd.DataFrame) -> int:
    """
    Calculate the longest consecutive streak of active days. 
    
    How it works: 
    1. Get unique sorted dates 
    2. Find gaps > 1 day (the streak breaks)
    3. Return longest streak length

     Args:
        df: DataFrame with 'date' column
        
    Returns:
        Longest streak in days
    """

    # Get unique dates and sort them
    unique_dates = sorted(df['date'].unique())
    
    if len(unique_dates) == 0:
        return 0

    # Convert to pandas series 
    date_series = pd.Series(unique_dates)

    # Calculate difference between consecutive dates (in days)
    # diff() gives us the gap: [day1, day2, day3] -> [NaN, 1, 1] for consecutive days
    date_diffs = date_series.diff().dt.days

    # Find where streaks break (gap > 1 day)
    # Create a "streak_id" that increments at each break
    streak_breaks = (date_diffs>1).cumsum()

    # Group by streak_id and count days in each streak
    streak_lengths = date_series.groupby(streak_breaks).size()

    # Return the longest streak
    longest = int(streak_lengths.max())
    
    return longest 


def compute_core_stats(df: pd.DataFrame)-> dict: 
    """
    Compute basic statistics for multiple slides.
    
    Calculates:
    - Total words, time, characters
    - Active days and streaks
    - Personal bests
    - Accuracy and error breakdowns
    - Restart habits and quirks
    
    Args:
        df: Cleaned DataFrame from parser
        
    Returns:
        Dictionary with stats for hook, yearInNumbers, peakPerformance, quirks, accuracy
    """
    # Info for slide 1: THe Hook 

    total_words = (df['wpm'] * df['testDuration']/ 60).sum()

    total_time_min = df['testDuration'].sum()/60
    total_time_hours = total_time_min/60

    #Novel Comparison 
    gatsby_words=47094
    novel_percentage = (total_words/gatsby_words)*100
    if novel_percentage >=100:
        novel_comparison = f'{int(novel_percentage/100)} copies of The Great Gatsby'
    else: 
        novel_comparison = f"{novel_percentage:.1f}% of The Great Gatsby"
    
    hook_data = {
        "totalWords": int(total_words),
        "totalTimeMinutes": round(total_time_min,1),
        "totalTimeHours": round(total_time_hours,1),
        "novelComparison": novel_comparison
    }
    print(f"Hook: {int(total_words)} words, {round(total_time_hours, 1)} hours")

    #Info for Slide 2: Year in Numbers 
    total_tests = len(df)
    
    # count unique days with activity 
    unique_dates = df['date'].nunique()
    date_range_days = (df['date'.max()-df['date'].min()]).days+1
    active_days_pct = (unique_dates/date_range_days)*100

    #Total chars typed 
    total_characters = df['total_chars'].sum()

    #Longest streak 
    longest_streak = calculate_longest_streak(df)
    
    year_in_numbers = { 
        'totalTests': total_tests,
        'activeDays': unique_dates,
        'totalDays':date_range_days,
        'activeDaysPct':round(active_days_pct),
        'totalCharacters':int(total_characters),
        'longestStreak':longest_streak,
        "dateRange":{
            "start": str(df['date'.min()]),
            "end":str(df['date'].max())
        }
    }
    
    print(f"Year in Numbers: {total_tests} tests, {unique_dates} active days")
    
    return {
        "hook": hook_data,
        "yearInNumbers": year_in_numbers
    }
    ...