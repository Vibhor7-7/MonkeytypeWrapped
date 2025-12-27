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
    # Slide 1: THe Hook 

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

    # Slide 2: Year in Numbers 
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
    
    # Slide 4: Peak Performance 

    all_time_pb = df['wpm'].max()
    pb_index = df['wpm'].idmax() #index of max WPM
    pb_date = str(df.loc[pb_index, 'datetime'])

    #count perfect accuary tests (100%)
    perfect_accuracy_count = len(df[df['acc']==100])
    perfect_accuracy_pct = (perfect_accuracy_count/len(df))*100

    #Count personal bests (new highest WPM at that point in time)
    # cunmax gives the running max at the point 
    total_pbs_hit = (df['wpm']==df ['wpm'].cummax).sum()

    # WPM thresholds (e.g., how many tests > 100 WPM, > 120 WPM)
    thresholds = [100, 110, 120, 130, 140]
    threshold_data = []

    for threshold in thresholds:
        count = len(df[df['wpm'] >= threshold])
        pct = (count / len(df)) * 100 if len(df) > 0 else 0
        threshold_data.append({
            "wpm": threshold,
            "count": count,
            "pct": round(pct, 1)
        })

    peak_performance = { 
        "allTimePb": round(all_time_pb, 2),
        "pbDate": pb_date,
        "totalPbsHit": int(total_pbs_hit),
        "perfectAccuracyCount": perfect_accuracy_count,
        "perfectAccuracyPct": round(perfect_accuracy_pct, 1),
        "thresholds": threshold_data
    }

    print(f"Peak Performance: {round(all_time_pb, 2)} WPM PB, {total_pbs_hit} PBs hit")
    
    #Slide 8: Your Quirks 

    avg_restarts = df['restartCount'].mean()
    max_restarts = int(df['restartCount'].max())

    #Percentage of tests on first try (no restarts)
    first_try_count = len(df[df['restartCount']==0])
    first_try_pct = (first_try_count/len(df))*100
    
    # TIme wasted on restarted tests (rough estimate)
    # Assume each restart wastes 3 seconds on avg 
    time_wasted_seconds = df['restartCount'].sum() * 3
    time_wasted_minutes = time_wasted_seconds / 60

    if 'mode' in df.columns:
        mode_counts = df['mode'].value_counts()
        favourite_mode = str(mode_counts.index(0))
        favorite_mode_count = int(mode_counts.iloc[0]) if len(mode_counts) > 0 else 0
    else:
        favorite_mode = "unknown"
        favorite_mode_count = 0
    
    # Classify restart addiction level
    if avg_restarts < 0.5:
        restart_level = "casual"
    elif avg_restarts < 1.5:
        restart_level = "moderate"
    elif avg_restarts < 3:
        restart_level = "perfectionist"
    else:
        restart_level = "extreme"
    quirks = {
        "avgRestarts": round(avg_restarts, 2),
        "maxRestarts": max_restarts,
        "firstTryPct": round(first_try_pct, 1),
        "timeWastedMinutes": round(time_wasted_minutes, 1),
        "favoriteMode": favorite_mode,
        "favoriteModeCount": favorite_mode_count,
        "restartAddictionLevel": restart_level
    }
    print(f" Quirks: {round(avg_restarts, 2)} avg restarts, {restart_level} level")

    # Slide 9: Accuracy Deep Dive 
    overall_accuracy = df['acc'].mean()

    #Total errors by type 
    total_wrong_key = df ['chars_incorrect'].sum()
    total_extra = df['chars_extra'].sum()
    total_missed = df['chars_missed'].sum()
    total_errors = total_wrong_key + total_extra + total_missed

    # Error breakdown percentages
    error_breakdown = {
        "wrongKey": {
            "count": int(total_wrong_key),
            "pct": round((total_wrong_key / total_errors * 100) if total_errors > 0 else 0, 1)
        },
        "extraChars": {
            "count": int(total_extra),
            "pct": round((total_extra / total_errors * 100) if total_errors > 0 else 0, 1)
        },
        "missedChars": {
            "count": int(total_missed),
            "pct": round((total_missed / total_errors * 100) if total_errors > 0 else 0, 1)
        }
    }

    #Clutch Factor: accuracy when typing fast vs slow (top 10% of tests)
    fast_threshold = df['wpm'].quantile(0.9)
    fast_tests = df[df['wpm'] >= fast_threshold]
    fast_accuracy = fast_tests['acc'].mean() if len(fast_tests) > 0 else 0

    # Bottom 10% slowest tests
    slow_threshold = df['wpm'].quantile(0.10)
    slow_tests = df[df['wpm'] <= slow_threshold]
    slow_accuracy = slow_tests['acc'].mean() if len(slow_tests) > 0 else 0
    
    clutch_difference = fast_accuracy - slow_accuracy

    accuracy_data = {
        'overallAccuracy': round(overall_accuracy,2),
        "totalErrors": int(total_errors),
        "errorBreakdown": error_breakdown,
        "clutchFactor": {
            "fastTestsAccuracy": round(fast_accuracy, 2), 
            "slowTestsAccuracy": round(slow_accuracy, 2),
            "difference": round(clutch_difference, 2)
        } 
    }

    print(f"Accuracy: {round(overall_accuracy, 2)}% overall, {int(total_errors)} total errors ")
    return {
        "hook": hook_data,
        "yearInNumbers": year_in_numbers,
        "peakPerformance": peak_performance,
        "quirks": quirks
    }


    ...