import pandas as pd
import numpy as np

def compute_warmup(df: pd.DataFrame) -> dict:
    """
    Analyze how typing speed improves during "warmup" at the start of sessions.
    
    A "session" is defined as tests taken within 30 minutes of each other.
    We track:
    - Cold start WPM (first test of session)
    - Warmed up WPM (after 3+ tests)
    - How many tests until peak performance
    - Warmup curve for visualization
    
    Args:
        df: Cleaned DataFrame with 'timestamp', 'wpm' columns
        
    Returns:
        Dictionary with warmup insights
    """
    
    print("\n🔥 Analyzing your warmup patterns...")
    

    # A "session" is a group of tests taken close together in time
    # If there's a 30+ minute gap, we consider it a new session
    
    df = df.sort_values('timestamp').reset_index(drop=True)
    
    # Calculate time difference between consecutive tests (in minutes)
    df['time_diff_minutes'] = df['timestamp'].diff() / (1000 * 60)  # Convert ms to minutes
    
    # Mark the start of a new session (gap > 30 minutes OR first test)
    # cumsum() creates a session ID that increments at each gap
    df['session_id'] = (df['time_diff_minutes'] > 30).fillna(True).cumsum()
    
    # Number each test within its session (1st test, 2nd test, etc.)
    df['test_in_session'] = df.groupby('session_id').cumcount() + 1
    
    print(f"   Identified {df['session_id'].nunique()} typing sessions")
    
    
    # Get all "cold start" tests (first test of each session)
    cold_start_tests = df[df['test_in_session'] == 1]
    cold_start_wpm = cold_start_tests['wpm'].mean()
    
    # Get "warmed up" tests (4th test onwards in a session)
    warmed_up_tests = df[df['test_in_session'] >= 4]
    
    if len(warmed_up_tests) > 0:
        warmed_up_wpm = warmed_up_tests['wpm'].mean()
        warmup_improvement = warmed_up_wpm - cold_start_wpm
        warmup_improvement_pct = (warmup_improvement / cold_start_wpm) * 100
    else:
        # Not enough data to calculate warmed-up performance
        warmed_up_wpm = cold_start_wpm
        warmup_improvement = 0
        warmup_improvement_pct = 0
    
    print(f"   Cold start: {cold_start_wpm:.1f} WPM")
    print(f"   Warmed up: {warmed_up_wpm:.1f} WPM (Δ {warmup_improvement:+.1f} WPM)")
    
    # For each session, find which test number had the highest WPM
    sessions_with_multiple_tests = df[df.groupby('session_id')['session_id'].transform('size') >= 3]
    
    if len(sessions_with_multiple_tests) > 0:
        # Find the test number with max WPM in each session
        peak_test_positions = sessions_with_multiple_tests.groupby('session_id').apply(
            lambda session: session.loc[session['wpm'].idxmax(), 'test_in_session']
        )
        
        avg_tests_until_peak = peak_test_positions.mean()
        median_tests_until_peak = peak_test_positions.median()
    else:
        avg_tests_until_peak = 1
        median_tests_until_peak = 1
    
    print(f"   Average tests until peak: {avg_tests_until_peak:.1f}")
    

    
    # Calculate average WPM for each test position (1st, 2nd, 3rd, etc.)
    warmup_curve = df[df['test_in_session'] <= 10].groupby('test_in_session').agg({
        'wpm': ['mean', 'count']
    }).reset_index()
    
    warmup_curve.columns = ['testNumber', 'avgWpm', 'sampleSize']
    
    # Convert to list of dictionaries for JSON response
    warmup_curve_data = []
    for _, row in warmup_curve.iterrows():
        warmup_curve_data.append({
            "testNumber": int(row['testNumber']),
            "avgWpm": round(float(row['avgWpm']), 1),
            "sampleSize": int(row['sampleSize'])
        })
    
    
    session_stats = df.groupby('session_id').agg({
        'wpm': ['mean', 'count'],
        'test_in_session': 'max'  # Number of tests in session
    }).reset_index()
    
    session_stats.columns = ['session_id', 'avg_wpm', 'test_count', 'max_test_num']
    
    avg_tests_per_session = session_stats['test_count'].mean()
    longest_session = int(session_stats['test_count'].max())
    
    print(f"   Average session length: {avg_tests_per_session:.1f} tests")
    print(f"   Longest session: {longest_session} tests")
    

    
    # Determine if user benefits from warmup
    if warmup_improvement > 5:
        warmup_quality = "Strong Warmup Effect"
        warmup_message = f"You improve by {warmup_improvement:.1f} WPM after warming up!"
    elif warmup_improvement > 2:
        warmup_quality = "Moderate Warmup Effect"
        warmup_message = f"You improve by {warmup_improvement:.1f} WPM after a few tests"
    elif warmup_improvement > 0:
        warmup_quality = "Minimal Warmup Effect"
        warmup_message = "You're fairly consistent from the first test"
    else:
        warmup_quality = "Consistent Performer"
        warmup_message = "You maintain consistent speed throughout sessions"
    
    print(f"   {warmup_quality}")
    print(f"   Warmup analysis complete!")
    
    # RETURN ALL WARMUP DATA
    
    
    return {
        "coldStartWpm": round(float(cold_start_wpm), 1),
        "warmedUpWpm": round(float(warmed_up_wpm), 1),
        "warmupImprovement": round(float(warmup_improvement), 1),
        "warmupImprovementPercent": round(float(warmup_improvement_pct), 1),
        
        "testsUntilPeak": round(float(avg_tests_until_peak), 1),
        "medianTestsUntilPeak": int(median_tests_until_peak),
        
        "totalSessions": int(df['session_id'].nunique()),
        "avgTestsPerSession": round(float(avg_tests_per_session), 1),
        "longestSession": longest_session,
        
        "warmupQuality": warmup_quality,
        "warmupMessage": warmup_message,
        
        "warmupCurve": warmup_curve_data
    }