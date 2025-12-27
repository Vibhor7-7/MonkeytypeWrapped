from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
from io import BytesIO
import sys
from pathlib import Path

# Add the backend directory to the Python path
sys.path.append(str(Path(__file__).parent))

# TODO: Uncomment these imports as we implement each module
# from analyser import parser
# from analyser import core_stats, journey, timing, warmup, comparisons
# from models.schemas import WrappedData

# Initialize FastAPI app
app = FastAPI(
    title="MonkeyType Wrapped API",
    description="Analyze your typing stats and get a Spotify Wrapped-style breakdown",
    version="1.0.0"
)

# CORS Configuration
# This allows your frontend (running on a different port/domain) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Local development
        "http://127.0.0.1:3000",      # Alternative localhost
        # Add your production frontend URL here later
        # "https://your-app.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

# Health check endpoint - useful for deployment monitoring
@app.get("/")
async def root():
    """
    Simple endpoint to verify the API is running.
    Visit http://localhost:8000 to see this response.
    """
    return {
        "message": "MonkeyType Wrapped API is running!",
        "status": "healthy",
        "docs": "/docs"  # FastAPI auto-generates interactive docs
    }

# Main analysis endpoint
@app.post("/api/analyze")
async def analyze_typing_data(file: UploadFile = File(...)):
    """
    Main endpoint: receives a MonkeyType CSV file and returns analyzed stats.
    
    How it works:
    1. Receives CSV file from frontend
    2. Validates file format
    3. Parses CSV into a DataFrame (table structure)
    4. Runs analysis modules (stats, journey, timing, etc.)
    5. Returns JSON with all computed insights
    
    Args:
        file: CSV file uploaded by user (multipart/form-data)
        
    Returns:
        JSON object matching WrappedData schema
    """
    
    # Step 1: Validate file type
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Please upload a CSV file."
        )
    
    try:
        # Step 2: Read file contents into memory
        contents = await file.read()
        
        # Step 3: Parse CSV using pandas directly (temporary - will move to parser.py)
        # This converts the raw CSV into a pandas DataFrame
        df = pd.read_csv(BytesIO(contents))
        
        # Step 4: Validate we have data
        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="CSV file is empty or invalid."
            )
        
        print(f"✓ Received CSV with {len(df)} rows")
        print(f"✓ Columns: {list(df.columns)}")
        
        # Step 5: Return basic info for now (placeholder response)
        # TODO: Replace this with actual analysis once modules are implemented
        response_data = {
            "status": "success",
            "message": "CSV uploaded successfully! Analysis modules coming soon.",
            "rowCount": len(df),
            "columns": list(df.columns),
            "preview": df.head(3).to_dict(orient="records") if len(df) > 0 else []
        }
        
        print("✓ Processing complete!")
        return JSONResponse(content=response_data)
        
    except pd.errors.EmptyDataError:
        raise HTTPException(
            status_code=400,
            detail="CSV file is empty or corrupted."
        )
    except Exception as e:
        # Log the error for debugging
        print(f"✗ Error during analysis: {str(e)}")
        import traceback
        traceback.print_exc()
        
        raise HTTPException(
            status_code=500,
            detail=f"Error processing file: {str(e)}"
        )

# Run with: uvicorn main:app --reload --host 0.0.0.0 --port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)