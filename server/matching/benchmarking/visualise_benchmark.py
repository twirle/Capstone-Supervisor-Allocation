import pandas as pd
import matplotlib.pyplot as plt


def plot_benchmark_results(filename, title):
    df = pd.read_csv(filename)

    algorithms = df['Algorithm'].unique()

    # Plot time results
    plt.figure(figsize=(10, 5))
    for algorithm in algorithms:
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
    for algorithm in algorithms:
        subset = df[df['Algorithm'] == algorithm]
        plt.plot(subset.index, subset['Total Jaccard Score'],
                 label=f'{algorithm} Jaccard Score')

    plt.title(f'{title} - Total Jaccard Score')
    plt.xlabel('Iteration')
    plt.ylabel('Total Jaccard Score')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'{title}_jaccard_score.png')

    # Scatter plot of Execution Time vs. Jaccard Score
    plt.figure(figsize=(10, 5))
    for algorithm in algorithms:
        subset = df[df['Algorithm'] == algorithm]
        plt.scatter(subset['Time (ms)'],
                    subset['Total Jaccard Score'], label=algorithm)

    plt.title(f'{title} - Execution Time vs. Total Jaccard Score')
    plt.xlabel('Time (ms)')
    plt.ylabel('Total Jaccard Score')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'{title}_time_vs_jaccard_score.png')

    # Plot average Jaccard score results
    plt.figure(figsize=(10, 5))
    for algorithm in algorithms:
        subset = df[df['Algorithm'] == algorithm]
        plt.plot(subset.index, subset['Average Jaccard Score'],
                 label=f'{algorithm} Average Jaccard Score')

    plt.title(f'{title} - Average Jaccard Score')
    plt.xlabel('Iteration')
    plt.ylabel('Average Jaccard Score')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'{title}_average_jaccard_score.png')

    # Plot median Jaccard score results
    plt.figure(figsize=(10, 5))
    for algorithm in algorithms:
        subset = df[df['Algorithm'] == algorithm]
        plt.plot(subset.index, subset['Median Jaccard Score'],
                 label=f'{algorithm} Median Jaccard Score')

    plt.title(f'{title} - Median Jaccard Score')
    plt.xlabel('Iteration')
    plt.ylabel('Median Jaccard Score')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'{title}_median_jaccard_score.png')

    # Plot minimum Jaccard score results
    plt.figure(figsize=(10, 5))
    for algorithm in algorithms:
        subset = df[df['Algorithm'] == algorithm]
        plt.plot(subset.index, subset['Min Jaccard Score'],
                 label=f'{algorithm} Min Jaccard Score')

    plt.title(f'{title} - Minimum Jaccard Score')
    plt.xlabel('Iteration')
    plt.ylabel('Min Jaccard Score')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'{title}_min_jaccard_score.png')

    # Plot maximum Jaccard score results
    plt.figure(figsize=(10, 5))
    for algorithm in algorithms:
        subset = df[df['Algorithm'] == algorithm]
        plt.plot(subset.index, subset['Max Jaccard Score'],
                 label=f'{algorithm} Max Jaccard Score')

    plt.title(f'{title} - Maximum Jaccard Score')
    plt.xlabel('Iteration')
    plt.ylabel('Max Jaccard Score')
    plt.legend()
    plt.grid(True)
    plt.savefig(f'{title}_max_jaccard_score.png')

    plt.show()

    # Summary statistics
    summary_stats = df.groupby('Algorithm').agg(
        mean_time=('Time (ms)', 'mean'),
        std_time=('Time (ms)', 'std'),
        mean_jaccard_score=('Total Jaccard Score', 'mean'),
        std_jaccard_score=('Total Jaccard Score', 'std'),
        avg_jaccard_score=('Average Jaccard Score', 'mean'),
        median_jaccard_score=('Median Jaccard Score', 'mean'),
        min_jaccard_score=('Min Jaccard Score', 'mean'),
        max_jaccard_score=('Max Jaccard Score', 'mean')
    )

    print(f'\nSummary Statistics for {title}:')
    print(summary_stats)


# Example usage
plot_benchmark_results('benchmark_small.csv', 'Small Case')
plot_benchmark_results('benchmark_medium.csv', 'Medium Case')
plot_benchmark_results('benchmark_large.csv', 'Large Case')
