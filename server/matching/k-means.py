import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from scipy.optimize import linear_sum_assignment
import time
import csv
import json
import matplotlib.pyplot as plt

# Sample data preparation


def create_dataset(jaccard_scores):
    X = []
    for i, row in enumerate(jaccard_scores):
        for j, score in enumerate(row):
            X.append([i, j, score])
    return np.array(X)

# Function to perform K-Means clustering


def kmeans_clustering(jaccard_scores, n_clusters):
    X = create_dataset(jaccard_scores)
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    kmeans.fit(X)
    return kmeans

# Function to convert cluster labels to assignments


def get_assignments_from_clusters(kmeans, X_full, num_supervisors, num_students, supervisor_cap=10):
    labels = kmeans.labels_
    cost_matrix = np.zeros((num_supervisors, num_students))
    for idx, label in enumerate(labels):
        supervisor, student, score = X_full[idx]
        cost_matrix[int(supervisor), int(student)] = score

    row_ind, col_ind = linear_sum_assignment(cost_matrix, maximize=True)
    assignments = list(zip(row_ind, col_ind))

    supervisor_student_count = {i: 0 for i in range(num_supervisors)}
    final_assignments = []

    for supervisor, student in assignments:
        if supervisor_student_count[supervisor] < supervisor_cap:
            final_assignments.append((supervisor, student))
            supervisor_student_count[supervisor] += 1

    for student in range(num_students):
        if student not in [a[1] for a in final_assignments]:
            for supervisor in range(num_supervisors):
                if supervisor_student_count[supervisor] < supervisor_cap:
                    final_assignments.append((supervisor, student))
                    supervisor_student_count[supervisor] += 1
                    break

    return final_assignments

# Function to calculate the total Jaccard score for given assignments


def calculate_total_jaccard_score(assignments, jaccard_scores):
    total_score = 0
    for supervisor, student in assignments:
        total_score += jaccard_scores[supervisor][student]
    return total_score

# Function to benchmark K-Means clustering


def benchmark_kmeans(jaccard_scores, n_clusters, iterations=10):
    times = []
    scores = []
    all_assignments = []
    X_full = create_dataset(jaccard_scores)
    for _ in range(iterations):
        start_time = time.perf_counter()

        kmeans = kmeans_clustering(jaccard_scores, n_clusters)
        assignments = get_assignments_from_clusters(
            kmeans, X_full, len(jaccard_scores), len(jaccard_scores[0]))

        end_time = time.perf_counter()
        total_time = end_time - start_time
        times.append(total_time)

        total_jaccard_score = calculate_total_jaccard_score(
            assignments, jaccard_scores)
        scores.append(total_jaccard_score)
        all_assignments.append(assignments)
    return times, scores, all_assignments


# Example benchmarking usage
jaccard_scores_small = np.random.rand(3, 30)
jaccard_scores_medium = np.random.rand(10, 100)
jaccard_scores_large = np.random.rand(30, 300)

times_small, scores_small, assignments_small = benchmark_kmeans(
    jaccard_scores_small, n_clusters=3)
times_medium, scores_medium, assignments_medium = benchmark_kmeans(
    jaccard_scores_medium, n_clusters=10)
times_large, scores_large, assignments_large = benchmark_kmeans(
    jaccard_scores_large, n_clusters=30)

print("K-Means Clustering Benchmarking:")
print("Small case:", times_small, scores_small, assignments_small)
print("Medium case:", times_medium, scores_medium, assignments_medium)
print("Large case:", times_large, scores_large, assignments_large)

# Save results to CSV


def save_benchmark_results(filename, results):
    def convert_assignments_to_native(assignments):
        return [(int(supervisor), int(student)) for supervisor, student in assignments]

    with open(filename, 'w', newline='') as csvfile:
        fieldnames = ['Algorithm',
                      'Time (ms)', 'Total Jaccard Score', 'Assignments']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for algorithm, (times, scores, assignments) in results.items():
            for time, score, assignment in zip(times, scores, assignments):
                writer.writerow({'Algorithm': algorithm, 'Time (ms)': time, 'Total Jaccard Score': score,
                                'Assignments': json.dumps(convert_assignments_to_native(assignment))})


results = {
    'K-Means Small': (times_small, scores_small, assignments_small),
    'K-Means Medium': (times_medium, scores_medium, assignments_medium),
    'K-Means Large': (times_large, scores_large, assignments_large),
}

save_benchmark_results('benchmark_kmeans_results.csv', results)

# Visualization with matplotlib


def plot_benchmark_results(filename, title):
    df = pd.read_csv(filename)

    # Plot time results
    plt.figure(figsize=(10, 5))
    for algorithm in df['Algorithm'].unique():
        subset = df[df['Algorithm'] == algorithm]
        plt.plot(subset.index, subset['Time (ms)'], label=f'{algorithm} Time')

    plt.title(f'{title} - Execution Time')
    plt.xlabel('Iteration')
    plt.ylabel('Time (ms)')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'{title}_time.png')

    # Plot Jaccard score results
    plt.figure(figsize=(10, 5))
    for algorithm in df['Algorithm'].unique():
        subset = df[df['Algorithm'] == algorithm]
        plt.plot(subset.index, subset['Total Jaccard Score'],
                 label=f'{algorithm} Jaccard Score')

    plt.title(f'{title} - Total Jaccard Score')
    plt.xlabel('Iteration')
    plt.ylabel('Total Jaccard Score')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'{title}_jaccard_score.png')

    plt.show()


# Example usage
plot_benchmark_results('benchmark_kmeans_results.csv',
                       'K-Means Benchmark Results')
