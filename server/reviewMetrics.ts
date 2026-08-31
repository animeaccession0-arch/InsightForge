export type ReviewMetricInput = { rating: number };

export function calculateReviewMetrics(rows: ReviewMetricInput[]) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of rows) {
    if (row.rating >= 1 && row.rating <= 5) {
      distribution[row.rating as 1 | 2 | 3 | 4 | 5] += 1;
    }
  }
  const total = rows.length;
  const average = total ? rows.reduce((sum, row) => sum + row.rating, 0) / total : 0;
  return { total, average: Number(average.toFixed(2)), distribution };
}
