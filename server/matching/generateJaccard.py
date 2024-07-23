import numpy as np
import pandas as pd


def generate_jaccard_scores(num_supervisors, num_students):
    return np.random.rand(num_supervisors, num_students)


# Generate Jaccard scores
jaccard_scores_small = generate_jaccard_scores(3, 30)
jaccard_scores_medium = generate_jaccard_scores(10, 100)
jaccard_scores_large = generate_jaccard_scores(30, 300)

# Save Jaccard scores to CSV files
pd.DataFrame(jaccard_scores_small).to_csv(
    'jaccard_scores_small.csv', index=False, header=False)
pd.DataFrame(jaccard_scores_medium).to_csv(
    'jaccard_scores_medium.csv', index=False, header=False)
pd.DataFrame(jaccard_scores_large).to_csv(
    'jaccard_scores_large.csv', index=False, header=False)

print("Jaccard scores saved to CSV files.")
