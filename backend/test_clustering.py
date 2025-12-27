#!/usr/bin/env python3
# backend/test_clustering.py

import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from analyser import parser, clustering

# Load your CSV
print("📂 Loading CSV file...")
with open('results (1).csv', 'rb') as f:
    contents = f.read()

# Parse it
print("📄 Parsing CSV...")
df = parser.parse_csv(contents)

# Run clustering
print("\n" + "="*60)
print("🧠 RUNNING CLUSTERING ANALYSIS")
print("="*60)

result = clustering.compute_personas(df)

# Print results
print("\n" + "="*60)
print("CLUSTERING TEST RESULTS")
print("="*60)

print(f"\n🎯 Dominant Persona: {result['dominantPersona']['name']}")
print(f"   {result['dominantPersona']['description']}")
print(f"   Percentage: {result['dominantPersona']['percentage']}%")

print(f"\n📊 All Personas:")
for persona in result['allPersonas']:
    print(f"\n{persona['name']} (Cluster {persona['id']})")
    print(f"   Tests: {persona['count']} ({persona['percentage']}%)")
    print(f"   Avg WPM: {persona['avgWpm']}")
    print(f"   Avg Accuracy: {persona['avgAccuracy']}%")
    print(f"   Avg Consistency: {persona['avgConsistency']}%")

print("\n" + "="*60)
print("✅ Test completed successfully!")
print("="*60 + "\n")
