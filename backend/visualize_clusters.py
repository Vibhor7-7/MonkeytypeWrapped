#!/usr/bin/env python3
# backend/visualize_clusters.py

import sys
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from analyser import parser
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

try:
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d import Axes3D
except ImportError:
    print("❌ matplotlib not installed!")
    print("Install with: pip install matplotlib")
    sys.exit(1)

# Load data
print("📂 Loading CSV file...")
with open('results (1).csv', 'rb') as f:
    df = parser.parse_csv(f.read())

# Prepare features
print("🔧 Preparing features...")
features = df[['wpm', 'acc', 'consistency']].copy()
features = features.fillna(features.median())

# Scale
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Cluster
print("🧠 Running K-means clustering...")
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
labels = kmeans.fit_predict(features_scaled)

# 3D plot
print("📊 Creating 3D visualization...")
fig = plt.figure(figsize=(12, 9))
ax = fig.add_subplot(111, projection='3d')

scatter = ax.scatter(
    features['wpm'],
    features['acc'],
    features['consistency'],
    c=labels,
    cmap='viridis',
    alpha=0.6,
    s=50
)

ax.set_xlabel('WPM (Words Per Minute)', fontsize=12)
ax.set_ylabel('Accuracy (%)', fontsize=12)
ax.set_zlabel('Consistency (%)', fontsize=12)
ax.set_title('K-means Clustering of Typing Tests (k=4)', fontsize=14, fontweight='bold')

# Add colorbar
cbar = plt.colorbar(scatter, ax=ax, pad=0.1)
cbar.set_label('Cluster ID', fontsize=12)

print("✅ Visualization ready! Close the window to exit.")
plt.show()
