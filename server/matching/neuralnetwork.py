import numpy as np
import pandas as pd
import time
import tracemalloc
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from keras.models import Sequential
from keras.layers import Dense
from scipy.optimize import linear_sum_assignment
import csv
import json

# Load Jaccard scores from CSV


def load_jaccard_scores(filename):
    return pd.read_csv(filename, header=None).values

# Create dataset for training the neural network


def create_dataset(jaccard_scores):
    X, y = [], []
    num_supervisors = jaccard_scores.shape[0]
    num_students = jaccard_scores.shape[1]
    for i in range(num_supervisors):
        for j in range(num_students):
            X.append([i, j, jaccard_scores[i][j]])
            y.append(jaccard_scores[i][j])
    return np.array(X), np.array(y)

# Define the neural network model


def build_model(input_dim):
    model = Sequential()
    model.add(Dense(64, input_dim=input_dim, activation='relu'))
    model.add(Dense(32, activation='relu'))
    model.add(Dense(1, activation='linear'))
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

# Function to get assignments from predicted scores


def get_assignments(predicted_scores, X_full, num_supervisors, num_students):
    cost_matrix = np.zeros((num_supervisors, num_students))
    for idx, score in enumerate(predicted_scores):
        supervisor, student = X_full[idx][:2]
        cost_matrix[int(supervisor), int(student)] = score
    row_ind, col_ind = linear_sum_assignment(cost_matrix, maximize=True)
    return list(zip(row_ind, col_ind))

# Calculate total Jaccard score for given assignments


def calculate_total_jaccard_score(assignments, jaccard_scores):
    return sum(jaccard_scores[supervisor][student] for supervisor, student in assignments)

# Measure execution time


def measure_execution_time(fn):
    start_time = time.perf_counter()
    fn()
    end_time = time.perf_counter()
    return end_time - start_time

# Measure memory usage


def measure_memory_usage(fn):
    tracemalloc.start()
    fn()
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return peak

# Benchmark the neural network


def benchmark_neural_network(jaccard_scores, iterations):
    X, y = create_dataset(jaccard_scores)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    model = build_model(X_train.shape[1])
    model.fit(X_train, y_train, epochs=100, batch_size=10, verbose=0)

    X_full = scaler.transform(np.array([[i, j, jaccard_scores[i][j]] for i in range(
        jaccard_scores.shape[0]) for j in range(jaccard_scores.shape[1])]))

    times = []
    memory_usage = []
    total_scores = []
    assignments = []

    for _ in range(iterations):
        time_taken = measure_execution_time(lambda: model.predict(X_test))
        memory_used = measure_memory_usage(lambda: model.predict(X_test))

        predicted_scores = model.predict(X_full)
        assignment = get_assignments(
            predicted_scores, X_full, jaccard_scores.shape[0], jaccard_scores.shape[1])
        total_score = calculate_total_jaccard_score(assignment, jaccard_scores)

        times.append(time_taken)
        memory_usage.append(memory_used)
        total_scores.append(total_score)
        assignments.append(assignment)

    return times, memory_usage, total_scores, assignments

# Save benchmark results to CSV


def save_benchmark_results(filename, results):
    with open(filename, 'w', newline='') as csvfile:
        fieldnames = [
            'Algorithm', 'Time (ms)', 'Memory (bytes)', 'Total Jaccard Score', 'Assignments']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for result in results:
            for time, memory, score, assignment in zip(result['times'], result['memory'], result['scores'], result['assignments']):
                # Ensure assignment elements are int
                assignment = [[int(a), int(b)] for a, b in assignment]
                writer.writerow({'Algorithm': result['algorithm'], 'Time (ms)': time, 'Memory (bytes)': memory,
                                'Total Jaccard Score': score, 'Assignments': json.dumps(assignment)})

# Main benchmarking function


def run_benchmarks():
    sizes = [
        {'filename': 'jaccard_scores_small.csv', 'name': 'Small'},
        {'filename': 'jaccard_scores_medium.csv', 'name': 'Medium'},
        {'filename': 'jaccard_scores_large.csv', 'name': 'Large'},
    ]

    iterations = 10  # Number of iterations for each size to get average results

    results = []

    for size in sizes:
        print(f"Benchmarking {size['name']} case:")
        jaccard_scores = load_jaccard_scores(size['filename'])

        times, memory_usage, total_scores, assignments = benchmark_neural_network(
            jaccard_scores, iterations)

        results.append({
            'algorithm': 'Neural Network',
            'times': times,
            'memory': memory_usage,
            'scores': total_scores,
            'assignments': assignments
        })

        save_benchmark_results(
            f"benchmark_nn_{size['name'].lower()}.csv", results)
        print(f"Results saved to benchmark_nn_{size['name'].lower()}.csv")


run_benchmarks()
