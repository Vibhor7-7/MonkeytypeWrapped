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
    df = pd.read_csv(BytesIO(file_contents))

    print(f"Loaded CSV: {len(df)} tests found")
    print(f"Columns: {list(df.columns)}")

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

    # Split the string by ';' and convert to integers
    char_stats_split = df['charStats'].str.split(';', expand=True).astype(int)
    
    # Assign to new columns with meaningful names
    df['chars_correct'] = char_stats_split[0]
    df['chars_incorrect'] = char_stats_split[1]
    df['chars_extra'] = char_stats_split[2]
    df['chars_missed'] = char_stats_split[3]
    
    # Calculate total characters typed (useful for analysis)
    df['total_chars'] = df['chars_correct'] + df['chars_incorrect'] + df['chars_extra']
    
    print(f" Parsed Char stats")


    #Clean and validate data 
    df['total_chars'] = df['chars_correct'] + df['chars_incorrect'] + df['chars_extra']
    
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