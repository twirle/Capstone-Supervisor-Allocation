import { findHungarianAssignments } from "../hungarian.js";
import { findGreedyAssignments } from "../greedy.js";
import { findGaleShapleyAssignments } from "../galeShapley.js";
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

// Calculate additional statistics for given assignments
function calculateJaccardStatistics(assignments, jaccardScores) {
  const scores = assignments.map(
    ([supervisor, student]) => jaccardScores[supervisor][student]
  );

  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;
  const sortedScores = scores.slice().sort((a, b) => a - b);
  const median =
    sortedScores.length % 2 === 0
      ? (sortedScores[sortedScores.length / 2 - 1] +
          sortedScores[sortedScores.length / 2]) /
        2
      : sortedScores[Math.floor(sortedScores.length / 2)];
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  return { total, average, median, min, max };
}

// Benchmarking function
function benchmarkAlgorithm(algorithmFunc, jaccardScores, iterations) {
  const times = [];
  const memoryUsage = [];
  const scores = [];
  const detailedStats = [];

  for (let i = 0; i < iterations; i++) {
    const time = measureExecutionTime(() => algorithmFunc(jaccardScores));
    const memory = measureMemoryUsage(() => algorithmFunc(jaccardScores));
    const assignments = algorithmFunc(jaccardScores);
    const score = calculateTotalJaccardScore(assignments, jaccardScores);
    const stats = calculateJaccardStatistics(assignments, jaccardScores);

    times.push(time);
    memoryUsage.push(memory);
    scores.push(score);
    detailedStats.push(stats);
  }

  return { times, memoryUsage, scores, detailedStats };
}

// Save results to CSV
function saveResultsToCSV(results, filename) {
  const headers =
    "Algorithm,Time (ms),Memory (bytes),Total Jaccard Score,Average Jaccard Score,Median Jaccard Score,Min Jaccard Score,Max Jaccard Score\n";
  let data = "";

  const addResults = (algorithm, times, memory, scores, detailedStats) => {
    for (let i = 0; i < times.length; i++) {
      data += `${algorithm},${times[i]},${memory[i]},${scores[i]},${detailedStats[i].average},${detailedStats[i].median},${detailedStats[i].min},${detailedStats[i].max}\n`;
    }
  };

  addResults(
    "Greedy",
    results.greedy.times,
    results.greedy.memoryUsage,
    results.greedy.scores,
    results.greedy.detailedStats
  );
  addResults(
    "Gale-Shapley",
    results.galeShapley.times,
    results.galeShapley.memoryUsage,
    results.galeShapley.scores,
    results.galeShapley.detailedStats
  );
  addResults(
    "Hungarian",
    results.hungarian.times,
    results.hungarian.memoryUsage,
    results.hungarian.scores,
    results.hungarian.detailedStats
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
    };

    const resultFilename = `benchmark_${size.name.toLowerCase()}.csv`;
    saveResultsToCSV(results, resultFilename);
    console.log(`Results saved to ${resultFilename}`);
  });
}

runBenchmarks();
// Run the script with: node --expose-gc benchmarking.js
