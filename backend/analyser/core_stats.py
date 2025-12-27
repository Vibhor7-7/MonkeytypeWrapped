import pandas as pd 
import numpy as np 

def calculate_longest_streak(df: pd.DataFrame) -> int:
    ...
    

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
    
    
    return {
        "hook": hook_data
    }
    ...