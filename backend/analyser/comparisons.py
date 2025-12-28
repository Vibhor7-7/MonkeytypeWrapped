import pandas as pd
import numpy as np


def compute_comparisons(df: pd.DataFrame) -> dict:
    """
    Compare user's performance against global benchmarks and fun comparisons.
    
    Calculates:
    - Estimated global percentile (where you rank among all typists)
    - Characters per second
    - Time to type famous novels
    - Speed category classification
    
    Args:
        df: Cleaned DataFrame with 'wpm', 'acc', 'total_chars' columns
        
    Returns:
        Dictionary with comparison metrics
    """
    
    print("\n Comparing your stats globally...")
  
    # CORE METRICS
    avg_wpm = df['wpm'].mean()
    max_wpm = df['wpm'].max()
    avg_accuracy = df['acc'].mean()
    total_chars_typed = df['total_chars'].sum()
    
    # Characters per second = (WPM * 5) / 60
    # (Average word is ~5 characters, 60 seconds per minute)
    chars_per_second = (avg_wpm * 5) / 60
    
    print(f"   Average speed: {avg_wpm:.1f} WPM")
    print(f"   Characters/second: {chars_per_second:.1f}")
    

    # GLOBAL PERCENTILE ESTIMATION
    # Based on typical typing speed distributions:
    # - Average typist: 40-50 WPM
    # - Professional typist: 65-75 WPM
    # - Top 10%: 80+ WPM
    # - Top 1%: 100+ WPM
    # - Elite: 120+ WPM
    
    if avg_wpm >= 130:
        percentile = 99.0
        skill_tier = "Elite"
        tier_description = "You're among the fastest typists in the world!"
    elif avg_wpm >= 100:
        percentile = 95.0
        skill_tier = "Expert"
        tier_description = "You're in the top 1% of typists globally"
    elif avg_wpm >= 85:
        percentile = 90.0
        skill_tier = "Advanced"
        tier_description = "You're in the top 5% of typists"
    elif avg_wpm >= 70:
        percentile = 80.0
        skill_tier = "Proficient"
        tier_description = "You're faster than most professional typists"
    elif avg_wpm >= 55:
        percentile = 65.0
        skill_tier = "Intermediate"
        tier_description = "You're above average for typing speed"
    elif avg_wpm >= 40:
        percentile = 40.0
        skill_tier = "Average"
        tier_description = "You're right at the average typing speed"
    else:
        percentile = 20.0
        skill_tier = "Developing"
        tier_description = "You're building your typing speed"
    
    # Fine-tune percentile based on accuracy
    # High accuracy (>95%) adds bonus, low accuracy (<90%) reduces
    if avg_accuracy > 95:
        percentile = min(99.9, percentile + 2)
    elif avg_accuracy < 90:
        percentile = max(1, percentile - 5)
    
    print(f"   Estimated percentile: {percentile}th")
    print(f"   Skill tier: {skill_tier}")
    

    # NOVEL COMPARISONS (Fun Facts 
    
    # Famous book word counts
    novels = {
        "The Great Gatsby": 47094,
        "Harry Potter and the Sorcerer's Stone": 77325,
        "1984": 88942,
        "To Kill a Mockingbird": 100388,
        "The Hobbit": 95022,
        "Animal Farm": 29966
    }
    
    # How long would it take to type each book at user's average speed?
    novel_comparisons = []
    
    for title, word_count in novels.items():
        # Time in minutes = words / WPM
        time_minutes = word_count / avg_wpm
        time_hours = time_minutes / 60
        
        novel_comparisons.append({
            "title": title,
            "wordCount": word_count,
            "timeMinutes": round(time_minutes, 1),
            "timeHours": round(time_hours, 1)
        })
    
    # Pick the most interesting comparison (closest to a nice number of hours)
    gatsby_time = novels["The Great Gatsby"] / avg_wpm / 60
    featured_novel = {
        "title": "The Great Gatsby",
        "wordCount": novels["The Great Gatsby"],
        "timeHours": round(gatsby_time, 1)
    }
    
    print(f"   Time to type The Great Gatsby: {gatsby_time:.1f} hours")
    
    # SPEED COMPARISONS
    
    # Compare to common speeds
    avg_person_wpm = 40
    pro_typist_wpm = 75
    world_record_wpm = 256  # Guinness World Record
    
    times_faster_than_avg = avg_wpm / avg_person_wpm
    percent_of_world_record = (avg_wpm / world_record_wpm) * 100
    
    # How you compare
    if avg_wpm > pro_typist_wpm:
        comparison_message = f"You type {times_faster_than_avg:.1f}x faster than the average person"
    elif avg_wpm > avg_person_wpm:
        comparison_message = f"You type {times_faster_than_avg:.1f}x faster than average"
    else:
        comparison_message = f"You're {times_faster_than_avg:.1f}x the speed of an average typist"
    

    # TYPING VOLUME COMPARISONS
    # Fun facts about total characters typed
    chars_facts = []
    
    # Bible comparison (King James Version ~3.1M characters)
    bible_chars = 3116480
    bibles_typed = total_chars_typed / bible_chars
    if bibles_typed >= 0.1:
        chars_facts.append({
            "fact": f"You've typed {bibles_typed:.1f}x the entire Bible",
            "value": bibles_typed
        })
    
    # Average novel (~400,000 characters)
    novel_chars = 400000
    novels_typed = total_chars_typed / novel_chars
    if novels_typed >= 0.5:
        chars_facts.append({
            "fact": f"You've typed the equivalent of {novels_typed:.1f} novels",
            "value": novels_typed
        })
    
    # Wikipedia article (average ~4,000 characters)
    wiki_chars = 4000
    wiki_articles = total_chars_typed / wiki_chars
    chars_facts.append({
        "fact": f"You've typed {int(wiki_articles)} Wikipedia articles worth of text",
        "value": int(wiki_articles)
    })
    
    # Pick the most impressive fact
    featured_fact = max(chars_facts, key=lambda x: x['value'])
    

    # How consistent is the user? (lower std dev = more consistent)
    wpm_std = df['wpm'].std()
    consistency_score = max(0, min(100, 100 - (wpm_std / avg_wpm * 100)))
    
    if consistency_score > 80:
        consistency_rating = "Extremely Consistent"
    elif consistency_score > 60:
        consistency_rating = "Consistent"
    elif consistency_score > 40:
        consistency_rating = "Moderately Consistent"
    else:
        consistency_rating = "Variable"
    
    print(f"   Consistency: {consistency_rating} ({consistency_score:.0f}/100)")
    print(f"   Comparison analysis complete!")
    
    # RETURN ALL COMPARISON DATA
    
    return {
        # Core metrics
        "avgWpm": round(float(avg_wpm), 1),
        "maxWpm": round(float(max_wpm), 1),
        "avgAccuracy": round(float(avg_accuracy), 1),
        "charsPerSecond": round(float(chars_per_second), 1),
        
        # Global ranking
        "globalPercentile": round(float(percentile), 1),
        "skillTier": skill_tier,
        "tierDescription": tier_description,
        
        # Comparisons
        "timesFasterThanAvg": round(float(times_faster_than_avg), 1),
        "percentOfWorldRecord": round(float(percent_of_world_record), 1),
        "comparisonMessage": comparison_message,
        
        # Novel comparisons
        "featuredNovel": featured_novel,
        "allNovelComparisons": novel_comparisons,
        
        # Volume facts
        "totalCharsTyped": int(total_chars_typed),
        "featuredFact": featured_fact['fact'],
        "allCharsFacts": chars_facts,
        
        # Consistency
        "consistencyScore": round(float(consistency_score), 1),
        "consistencyRating": consistency_rating,
        "wpmStdDev": round(float(wpm_std), 1)
    }
