import pandas as pd 
import numpy as np
from sklearn.cluster import KMeans 
from sklearn.preprocessing import StandardScaler # Makes features comparable 

def find_optimimal_k(features_scaled, k_range=(2,6)): 
    """
    Find optimal number of clusters using Silhouette Score.
    
    Why Silhouette Score?
    - Measures how similar a point is to its own cluster vs other clusters
    - Higher score = better defined clusters
    - Range: -1 (wrong cluster) to 1 (perfect fit)
    
    Args:
        features_scaled: Scaled feature matrix
        k_range: Range of k values to test (default: 2 to 6)
        
    Returns:
        Optimal k value
    """
    print(f"\n🔍 Testing k values from {k_range[0]} to {k_range[1]}...")

    best_k = 2 
    best_score = -1 
    scores = {}

    for k in range(k_range[0], k_range[1]+1):
        #Try Clutstering with k clusters 
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        labels = kmeans.fit_predict(features_scaled)

        #Calculate Silhouette Score
        score = silhouette_score(features_scaled, labels)
        scores[k] = score
        print(f" k={k}: Silhouette Score = {score:.3f}")

        if score > best_score:
            best_score = score
            best_k = k  
    print(f"Optimal k found: {best_k} with Silhouette Score = {best_score:.3f}\n")
    return best_k

def name_personas(avg_wpm, avg_acc, avg_consistency): 
    """
    Assign a persona name based on cluster characteristics. 

    Personas:
    - Flow State: High everything (in the zone)
    - Steady Eddie: Balanced, consistent
    - Speed Demon: High WPM, lower accuracy
    - Warm Up: Lower stats (still getting started)
    """
    # Define thresholds (you can adjust these based on your data)
    high_wpm = avg_wpm > 105
    high_acc = avg_acc > 94
    high_consistency = avg_consistency > 85
    
    low_wpm = avg_wpm < 95
    low_acc = avg_acc < 92
    
    # Pattern matching
    if high_wpm and high_acc and high_consistency:
        return {
            "name": "Flow State",
            "description": "You're completely in the zone - high speed with exceptional accuracy and consistency"
        }
    
    elif high_wpm and not high_acc:
        return {
            "name": "Speed Demon",
            "description": "You prioritize speed over accuracy - racing through tests at maximum velocity"
        }
    
    elif high_consistency and not high_wpm:
        return {
            "name": "Steady Eddie",
            "description": "You maintain reliable, consistent performance - the tortoise that wins the race"
        }
    
    elif low_wpm and low_acc:
        return {
            "name": "Warm Up Mode",
            "description": "Still finding your rhythm - these are your practice runs before hitting peak performance"
        }
    
    else:
        return {
            "name": "Balanced Performer",
            "description": "You maintain solid, well-rounded performance across all metrics"
        }


def compute_personas(df: pd.DataFrame) -> dict: 
    """
    se K-means clustering to identify typing personas.
    
    How it works:
    1. Extract features: wpm, accuracy, consistency
    2. Scale features to same range (StandardScaler)
    3. Run K-means clustering (k=4 clusters)
    4. Analyze cluster characteristics
    5. Assign meaningful names based on patterns
    
    Args:
        df: Cleaned DataFrame from parser
        
    Returns:
        Dictionary with persona analysis
    """
    print("\n Starting ML Clustering analysis")

    #Get features for clustering 
    features = df[['wpm', 'acc','consistency']].copy()

    print(f" {len(features)} tests with 3 features")

    # Scale the features to the same range for K-means to work properly 
    scaler = StandardScaler()
    features_scaled = scaler.fit_transform(features)

    print(f" Scaled features (mean=0, std = 1)")

    #  Perform K-means clustering
    # n_clusters = 4: We want 4 different personas
    # random_state = 42: Makes results reproducible (same every time)
    # n_init = 10: Try 10 different starting positions, pick best
    
    n_clusters = 4
    kmeans = KMeans(
        n_clusters=n_clusters,
        random_state=42,
        n_init=10
    )
    
    # Fit the model and predict cluster labels
    cluster_labels = kmeans.fit_predict(features_scaled)
    
    # cluster_labels is an array like: [0, 2, 1, 0, 3, 1, ...]
    # Each number is the cluster ID for that test
    
    print(f"K-means clustering complete ({n_clusters} clusters)")
    
    # Add cluster labels back to original DataFrame
    df['cluster'] = cluster_labels

    # Analyze each cluster's characteristics
    clusters = []
    
    for cluster_id in range(n_clusters):
        # Get all tests in this cluster
        cluster_data = df[df['cluster'] == cluster_id]
        
        # Calculate statistics for this cluster
        cluster_size = len(cluster_data)
        cluster_pct = (cluster_size / len(df)) * 100
        
        avg_wpm = cluster_data['wpm'].mean()
        avg_acc = cluster_data['acc'].mean()
        avg_consistency = cluster_data['consistency'].mean()
        
        clusters.append({
            'id': int(cluster_id),
            'count': int(cluster_size),
            'percentage': round(cluster_pct, 1),
            'avgWpm': round(avg_wpm, 2),
            'avgAccuracy': round(avg_acc, 2),
            'avgConsistency': round(avg_consistency, 2)
        })
    
    print(f" Analyzed {n_clusters} cluster characteristics")
    
    # Name each cluster based on its characteristics 
    for cluster in clusters: 
        persona_info = name_personas(
            cluster['avgWpm'],
            cluster['avgAccuracy'], 
            cluster['avgConsistency']
        )
        cluster['name'] = persona_info['name']
        cluster['description'] = persona_info['description']

    print(f'Named all personas')

    #Find the dominant persona (largest cluster)
    clusters_sorted = sorted(clusters, key=lambda x: x['count'], reverse = True)
    dominant = clusters_sorted[0]

    result = {
        "dominant_persona": { 
            "name": dominant['name'],
            'description': dominant['description'],
            "percentage": dominant['percentage']
        }, 
        "allPersonas": clusters_sorted
    }
    print(f'Dominant persona: {dominant['name']} ({dominant['percentage']}%)')
    return result 


    
    ...

