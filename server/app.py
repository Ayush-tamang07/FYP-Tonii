from flask import Flask, request, jsonify
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model and vectorizer
vectorizer = pickle.load(open('vectorizer.pkl', 'rb'))
model_df = pd.read_pickle('model.pkl')

# Extract the feature matrix from the model dataframe
# This should be a numerical matrix that can be used for cosine similarity
feature_matrix = None
if 'feature_vector' in model_df.columns:
    # If the feature vectors are already in the dataframe
    feature_matrix = np.vstack(model_df['feature_vector'].values)
else:
    # If not, we need to recreate the vectors from the text data
    # This assumes model_df has a 'combined_features' column with text data
    if 'combined_features' in model_df.columns:
        feature_matrix = vectorizer.transform(model_df['combined_features'])

def get_suggestions(user_details, user_preferences):
    # Handle multiple muscle groups
    muscles = user_preferences.get('muscle', '').split(',')
    all_recommendations = []
    
    for muscle in muscles:
        muscle = muscle.strip()
        if not muscle:
            continue
            
        # Create query for this specific muscle
        user_input = f"{user_preferences.get('goal', '')} {user_preferences.get('experience', '')} {user_preferences.get('equipment', '')} {muscle}"
        user_vector = vectorizer.transform([user_input])
        
        # Ensure we have valid feature matrices
        if feature_matrix is not None:
            # Calculate similarity
            similarity_scores = cosine_similarity(user_vector, feature_matrix)[0]
            
            # Add scores to a temporary dataframe
            temp_df = model_df.copy()
            temp_df['similarity_score'] = similarity_scores
            
            # Filter by muscle if possible
            if 'muscle' in temp_df.columns:
                muscle_filtered = temp_df[temp_df['muscle'].str.contains(muscle, na=False, case=False)]
                if not muscle_filtered.empty:
                    temp_df = muscle_filtered
            
            # Get top recommendations for this muscle
            recommendations = temp_df.sort_values(
                by='similarity_score', ascending=False
            ).head(3)
            
            all_recommendations.append(recommendations)
    
    # Combine all recommendations
    if all_recommendations:
        final_recommendations = pd.concat(all_recommendations)
        final_recommendations = final_recommendations.drop_duplicates(subset=['name']).sort_values(
            by='similarity_score', ascending=False
        ).head(5)
        
        # Format the response
        result = []
        for _, row in final_recommendations.iterrows():
            exercise = {
                'name': row['name'],
                'muscle': row.get('muscle', ''),
                'equipment': row.get('equipment', ''),
                'difficulty': row.get('difficulty', '')
            }
            result.append(exercise)
        
        return result
    else:
        return []

@app.route('/suggestion', methods=['POST'])
def suggest_exercises():
    data = request.json
    user_details = data.get('user_details', {})
    user_preferences = data.get('user_preferences', {})

    if not user_details or not user_preferences:
        return jsonify({"error": "Missing user details or preferences"}), 400

    try:
        suggestions = get_suggestions(user_details, user_preferences)
        print(suggestions)
        return jsonify({"suggestions": suggestions})
    except Exception as e:
        print(f"Error generating suggestions: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)