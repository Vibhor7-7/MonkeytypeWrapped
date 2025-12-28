// API service for MonkeyType Wrapped backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface WrappedData {
  status: string;
  message: string;
  
  // Hook slide
  hook: {
    totalWords: number;
    totalTimeMinutes: number;
    totalTimeHours: number;
    novelComparison: string;
  };
  
  // Year in Numbers slide
  yearInNumbers: {
    totalTests: number;
    activeDays: number;
    totalCharacters: number;
    longestStreak: number;
  };
  
  // Peak Performance slide
  peakPerformance: {
    allTimePb: number;
    pbDate: string;
    totalPbsHit: number;
    perfectAccuracyCount: number;
    perfectAccuracyPct: number;
    thresholds: Array<{
      wpm: number;
      count: number;
      pct: number;
    }>;
  };
  
  // Quirks slide
  quirks: {
    avgRestarts: number;
    maxRestarts: number;
    firstTryPct: number;
    timeWastedMinutes: number;
    favoriteMode: string;
    favoriteModeCount: number;
    restartAddictionLevel: string;
  };
  
  // Accuracy slide
  accuracy: {
    overallAccuracy: number;
    totalErrors: number;
    errorBreakdown: {
      wrongKey: {
        count: number;
        pct: number;
      };
      extraChars: {
        count: number;
        pct: number;
      };
      missedChars: {
        count: number;
        pct: number;
      };
    };
    clutchFactor: {
      fastTestsAccuracy: number;
      slowTestsAccuracy: number;
      difference: number;
    };
  };
  
  // Persona slide
  persona: {
    dominantPersona: {
      name: string;
      description: string;
      percentage: number;
    };
    allPersonas: Array<{
      id: number;
      count: number;
      percentage: number;
      avgWpm: number;
      avgAccuracy: number;
      avgConsistency: number;
      name: string;
      description: string;
    }>;
  };
  
  // Journey slide
  journey: {
    firstMonthAvg: number;
    lastMonthAvg: number;
    improvement: number;
    bestMonth: string;
    bestMonthWpm: number;
    biggestJumpMonth: string;
    biggestJumpAmount: number;
    monthlyTrend: Array<{
      month: string;
      avgWpm: number;
      testCount: number;
    }>;
  };
  
  // Timing slide
  timing: {
    bestHour: number;
    bestHourFormatted: string;
    bestHourWpm: number;
    worstHour: number;
    worstHourFormatted: string;
    worstHourWpm: number;
    mostActiveHour: number;
    mostActiveHourFormatted: string;
    mostActiveHourCount: number;
    bestDay: string;
    bestDayWpm: number;
    mostActiveDay: string;
    mostActiveDayCount: number;
    timePreference: string;
    timeDescription: string;
    hourlyBreakdown: Array<{
      hour: number;
      avgWpm: number;
      testCount: number;
      avgAccuracy: number;
    }>;
    dailyBreakdown: Array<{
      day: string;
      avgWpm: number;
      testCount: number;
      avgAccuracy: number;
    }>;
  };
  
  // Warmup slide
  warmup: {
    coldStartWpm: number;
    warmedUpWpm: number;
    warmupImprovement: number;
    warmupImprovementPercent: number;
    testsUntilPeak: number;
    medianTestsUntilPeak: number;
    totalSessions: number;
    avgTestsPerSession: number;
    longestSession: number;
    warmupQuality: string;
    warmupMessage: string;
    warmupCurve: Array<{
      testNumber: number;
      avgWpm: number;
      sampleSize: number;
    }>;
  };
  
  // Comparisons slide
  comparisons: {
    avgWpm: number;
    maxWpm: number;
    avgAccuracy: number;
    charsPerSecond: number;
    globalPercentile: number;
    skillTier: string;
    tierDescription: string;
    timesFasterThanAvg: number;
    percentOfWorldRecord: number;
    comparisonMessage: string;
    featuredNovel: {
      title: string;
      wordCount: number;
      timeHours: number;
    };
    allNovelComparisons: Array<{
      title: string;
      wordCount: number;
      timeMinutes: number;
      timeHours: number;
    }>;
    totalCharsTyped: number;
    featuredFact: string;
    consistencyScore: number;
    consistencyRating: string;
    wpmStdDev: number;
  };
}

export async function analyzeTypingData(file: File): Promise<WrappedData> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to analyze data');
  }

  return response.json();
}

export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}
