import pandas as pd 
import numpy as np
from sklearn.cluster import KMeans 
from sklearn.preprocessing import StandardScaler # Makes features comparable
from sklearn.metrics import silhouette_score  # For evaluating clustering quality 

def find_optimal_k(features_scaled, k_range=(2,6)): 
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

def assign_unique_personas(clusters):
    """
    Assign unique persona names to clusters based on relative characteristics.
    Ensures no duplicate persona names by ranking clusters on each metric.
    
    Args:
        clusters: List of cluster dictionaries with avgWpm, avgAccuracy, avgConsistency
        
    Returns:
        Updated clusters list with name and description added
    """
    # Sort clusters to rank them
    wpm_sorted = sorted(enumerate(clusters), key=lambda x: x[1]['avgWpm'], reverse=True)
    acc_sorted = sorted(enumerate(clusters), key=lambda x: x[1]['avgAccuracy'], reverse=True)
    cons_sorted = sorted(enumerate(clusters), key=lambda x: x[1]['avgConsistency'], reverse=True)
    
    # Calculate composite scores for each cluster
    scores = {}
    for i, cluster in enumerate(clusters):
        wpm_rank = next(rank for rank, (idx, _) in enumerate(wpm_sorted) if idx == i)
        acc_rank = next(rank for rank, (idx, _) in enumerate(acc_sorted) if idx == i)
        cons_rank = next(rank for rank, (idx, _) in enumerate(cons_sorted) if idx == i)
        
        # Store ranks for decision making
        scores[i] = {
            'wpm_rank': wpm_rank,
            'acc_rank': acc_rank,
            'cons_rank': cons_rank,
            'total_rank': wpm_rank + acc_rank + cons_rank,
            'cluster': cluster
        }
    
    # Assign personas based on characteristics (ensure uniqueness)
    used_personas = set()
    persona_assignments = {}
    
    # Define all available personas
    personas = {
        'flow_state': {
            "name": "Flow State",
            "description": "You're completely in the zone - high speed with exceptional accuracy and consistency"
        },
        'speed_demon': {
            "name": "Speed Demon",
            "description": "You prioritize speed over accuracy - racing through tests at maximum velocity"
        },
        'steady_eddie': {
            "name": "Steady Eddie",
            "description": "You maintain reliable, consistent performance - the tortoise that wins the race"
        },
        'warm_up': {
            "name": "Warm Up Mode",
            "description": "Still finding your rhythm - these are your practice runs before hitting peak performance"
        },
        'balanced': {
            "name": "Balanced Performer",
            "description": "You maintain solid, well-rounded performance across all metrics"
        }
    }
    
    # Assign personas based on ranking patterns
    for idx, score_data in scores.items():
        cluster = score_data['cluster']
        wpm_rank = score_data['wpm_rank']
        acc_rank = score_data['acc_rank']
        cons_rank = score_data['cons_rank']
        
        # Best overall (top in all or most metrics)
        if score_data['total_rank'] <= 2 and 'flow_state' not in used_personas:
            persona_assignments[idx] = personas['flow_state']
            used_personas.add('flow_state')
        
        # Highest speed but lower accuracy
        elif wpm_rank == 0 and acc_rank >= 2 and 'speed_demon' not in used_personas:
            persona_assignments[idx] = personas['speed_demon']
            used_personas.add('speed_demon')
        
        # Highest consistency but not highest speed
        elif cons_rank == 0 and wpm_rank >= 1 and 'steady_eddie' not in used_personas:
            persona_assignments[idx] = personas['steady_eddie']
            used_personas.add('steady_eddie')
        
        # Lowest overall performance
        elif score_data['total_rank'] >= len(clusters) * 2 and 'warm_up' not in used_personas:
            persona_assignments[idx] = personas['warm_up']
            used_personas.add('warm_up')
        
        # Balanced/middle ground
        elif 'balanced' not in used_personas:
            persona_assignments[idx] = personas['balanced']
            used_personas.add('balanced')
        
        # Fallback: assign remaining personas
        else:
            for persona_key, persona_data in personas.items():
                if persona_key not in used_personas:
                    persona_assignments[idx] = persona_data
                    used_personas.add(persona_key)
                    break
    
    # Apply assignments to clusters
    for idx, persona in persona_assignments.items():
        clusters[idx]['name'] = persona['name']
        clusters[idx]['description'] = persona['description']
    
    return clusters


def compute_personas(df: pd.DataFrame) -> dict: 
    """
    Use K-means clustering to identify typing personas.
    
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
    
    # Name each cluster based on its characteristics ensuring uniqueness
    clusters = assign_unique_personas(clusters)

    print(f'Named all personas')

    #Find the dominant persona (largest cluster)
    clusters_sorted = sorted(clusters, key=lambda x: x['count'], reverse = True)
    dominant = clusters_sorted[0]

    result = {
        "dominantPersona": { 
            "name": dominant['name'],
            "description": dominant['description'],
            "percentage": dominant['percentage']
        }, 
        "allPersonas": clusters_sorted
    }
    print(f"Dominant persona: {dominant['name']} ({dominant['percentage']}%)")
    return result 


    
    ...

