import pandas as pd
from io import BytesIO
from datetime import datetime 


def parse_csv(file_contents: bytes) ->pd.DataFrame:
    """
    Read CSV into DataFrame
    - Convert timestamp (ms) to datetime
    - Extract hour, day_of_week, month, date
    - Parse charStats into correct/incorrect/extra/missed columns
    - Return cleaned DataFrame
    """
    # Convert bytes to Dataframe (BytesIo wraps the bytes so pandas can read it like a file)
    # on_bad_lines='skip' will skip malformed lines instead of erroring
    df = pd.read_csv(BytesIO(file_contents), on_bad_lines='skip')

    print(f"Loaded CSV: {len(df)} tests found")
    print(f"Columns: {list(df.columns)}")

    # Verify required columns exist
    required_columns = ['wpm', 'acc']
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"CSV is missing required columns: {missing_columns}")

    # Check if timestamp column exists, if not try to find alternative
    if 'timestamp' not in df.columns:
        raise ValueError("CSV is missing 'timestamp' column. Please export your data from MonkeyType with timestamps included.")

    #Convert timestamp from milliseconds to datetime 
    # unit = 'ms' tells pandas the timestamp is in milliseconds 

    df['datetime'] = pd.to_datetime(df['timestamp'], unit = 'ms')
    print(f" Date Range: {df['datetime'].min()} to {df['datetime'].max()}")

    #Extract hour, day of week, month from datetime 
    df['hour'] = df['datetime'].dt.hour              # 0-23 (for "when you type best")
    df['day_of_week'] = df['datetime'].dt.day_name() # "Monday", "Tuesday", etc.
    df['day_of_week_num'] = df['datetime'].dt.dayofweek  # 0=Monday, 6=Sunday
    df['month'] = df['datetime'].dt.to_period('M')   # "2024-12", "2025-01", etc.
    df['date'] = df['datetime'].dt.date              # Just the date (no time)
    df['year'] = df['datetime'].dt.year              # 2024, 2025, etc.
    
    print(f"Date range: {df['datetime'].min()} to {df['datetime'].max()}")


    # Parse charStats string into separate columns
    # charStats format: "correct;incorrect;extra;missed"

    # Check if charStats column exists
    if 'charStats' in df.columns:
        # Fill NaN/None values with "0;0;0;0" before splitting
        df['charStats'] = df['charStats'].fillna('0;0;0;0')
        
        # Split the string by ';' and convert to integers with error handling
        char_stats_split = df['charStats'].str.split(';', expand=True)
        
        # Convert to numeric, coercing errors to NaN, then fill with 0
        df['chars_correct'] = pd.to_numeric(char_stats_split[0], errors='coerce').fillna(0).astype(int)
        df['chars_incorrect'] = pd.to_numeric(char_stats_split[1], errors='coerce').fillna(0).astype(int)
        df['chars_extra'] = pd.to_numeric(char_stats_split[2], errors='coerce').fillna(0).astype(int)
        df['chars_missed'] = pd.to_numeric(char_stats_split[3], errors='coerce').fillna(0).astype(int)
        
        # Calculate total characters typed (useful for analysis)
        df['total_chars'] = df['chars_correct'] + df['chars_incorrect'] + df['chars_extra']
        
        print(f" Parsed Char stats")
    else:
        # If charStats doesn't exist, create default columns with 0
        print(f" Warning: charStats column not found, using default values")
        df['chars_correct'] = 0
        df['chars_incorrect'] = 0
        df['chars_extra'] = 0
        df['chars_missed'] = 0
        df['total_chars'] = 0


    #Clean and validate data 
    # Note: total_chars already calculated above
    
    # Step 5: Clean and validate data
    
    # Remove rows with missing critical values
    df = df.dropna(subset=['wpm', 'acc', 'timestamp'])
    
    # Remove invalid tests (WPM = 0 or negative, accuracy out of range)
    df = df[df['wpm'] > 0]
    df = df[(df['acc'] >= 0) & (df['acc'] <= 100)]
    
    # Fill missing consistency values with 0 (some tests might not have this)
    df['consistency'] = df['consistency'].fillna(0)
    
    # Fill missing restartCount with 0
    df['restartCount'] = df['restartCount'].fillna(0).astype(int)
    
    print(f"Data cleaned: {len(df)} valid tests remaining")

     # Sort by timestamp (chronological order)
    df = df.sort_values('timestamp').reset_index(drop=True)
    
    print(f"Data sorted chronologically")
    print(f"Final shape: {len(df)} tests x {len(df.columns)} features\n")
    
    return df 