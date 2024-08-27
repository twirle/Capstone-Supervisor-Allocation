import { findHungarianAssignments } from "../hungarian.js";
import { findGreedyAssignments } from "../greedy.js";
import { findGaleShapleyAssignments } from "../galeShapley.js";
import { findKMeansAssignments } from "../k-means.js"; // Ensure this import is correct
import fs from "fs";
import { performance } from "perf_hooks";

// Ensure garbage collection is exposed
if (typeof global.gc !== "function") {
  console.error(
    "Garbage collection is not exposed. Run the script with 'node --expose-gc benchmarking.js'"
  );
  process.exit();
}

// Helper functions
function measureExecutionTime(fn) {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
}

function measureMemoryUsage(fn) {
  global.gc();
  const initialMemory = process.memoryUsage().heapUsed;
  fn();
  global.gc();
  const finalMemory = process.memoryUsage().heapUsed;
  return finalMemory - initialMemory;
}

// Function to load Jaccard scores from CSV
function loadJaccardScores(filename) {
  const data = fs.readFileSync(filename, "utf8");
  const rows = data.trim().split("\n");
  return rows.map((row) => row.split(",").map(parseFloat));
}

// Calculate total Jaccard score for given assignments
function calculateTotalJaccardScore(assignments, jaccardScores) {
  return assignments.reduce(
    (total, [supervisor, student]) =>
      total + jaccardScores[supervisor][student],
    0
  );
}

// Benchmarking function
function benchmarkAlgorithm(
  algorithmFunc,
  jaccardScores,
  iterations,
  clusters = null
) {
  const times = [];
  const memoryUsage = [];
  const scores = [];

  for (let i = 0; i < iterations; i++) {
    const time = measureExecutionTime(() => {
      if (clusters) {
        algorithmFunc(jaccardScores, clusters);
      } else {
        algorithmFunc(jaccardScores);
      }
    });
    const memory = measureMemoryUsage(() => {
      if (clusters) {
        algorithmFunc(jaccardScores, clusters);
      } else {
        algorithmFunc(jaccardScores);
      }
    });
    const assignments = clusters
      ? algorithmFunc(jaccardScores, clusters)
      : algorithmFunc(jaccardScores);
    const score = calculateTotalJaccardScore(assignments, jaccardScores);

    times.push(time);
    memoryUsage.push(memory);
    scores.push(score);
  }

  return { times, memoryUsage, scores };
}

// Save results to CSV
function saveResultsToCSV(results, filename) {
  const headers = "Algorithm,Time (ms),Memory (bytes),Total Jaccard Score\n";
  let data = "";

  const addResults = (algorithm, times, memory, scores) => {
    for (let i = 0; i < times.length; i++) {
      data += `${algorithm},${times[i]},${memory[i]},${scores[i]}\n`;
    }
  };

  addResults(
    "Greedy",
    results.greedy.times,
    results.greedy.memoryUsage,
    results.greedy.scores
  );
  addResults(
    "Gale-Shapley",
    results.galeShapley.times,
    results.galeShapley.memoryUsage,
    results.galeShapley.scores
  );
  addResults(
    "Hungarian",
    results.hungarian.times,
    results.hungarian.memoryUsage,
    results.hungarian.scores
  );
  addResults(
    "K-Means",
    results.kMeans.times,
    results.kMeans.memoryUsage,
    results.kMeans.scores
  );

  fs.writeFileSync(filename, headers + data);
}

// Run benchmarks
function runBenchmarks() {
  const sizes = [
    { numSupervisors: 3, numStudents: 30, name: "Small" },
    { numSupervisors: 10, numStudents: 100, name: "Medium" },
    { numSupervisors: 30, numStudents: 300, name: "Large" },
  ];

  const iterations = 10; // Number of iterations for each size to get average results

  sizes.forEach((size) => {
    console.log(`Benchmarking ${size.name} case:`);
    const filename = `../jaccard_scores_${size.name.toLowerCase()}.csv`;

    const jaccardScores = loadJaccardScores(filename);
    const results = {
      greedy: benchmarkAlgorithm(
        findGreedyAssignments,
        jaccardScores,
        iterations
      ),
      galeShapley: benchmarkAlgorithm(
        findGaleShapleyAssignments,
        jaccardScores,
        iterations
      ),
      hungarian: benchmarkAlgorithm(
        findHungarianAssignments,
        jaccardScores,
        iterations
      ),
      kMeans: benchmarkAlgorithm(
        findKMeansAssignments,
        jaccardScores,
        iterations,
        2
      ), // Added K-Means with 2 clusters
    };

    const resultFilename = `benchmark_${size.name.toLowerCase()}.csv`;
    saveResultsToCSV(results, resultFilename);
    console.log(`Results saved to ${resultFilename}`);
  });
}

runBenchmarks();
// Run the script with: node --expose-gc benchmarking.js
