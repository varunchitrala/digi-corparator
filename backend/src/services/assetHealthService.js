/**
 * Dynamic Asset Health Score Calculation Engine (0 - 100)
 */
const calculateAssetHealthScore = (condition = 'GOOD', complaintCount = 0) => {
  let score = 85;
  switch (condition) {
    case 'EXCELLENT':
      score = 95;
      break;
    case 'GOOD':
      score = 85;
      break;
    case 'FAIR':
      score = 70;
      break;
    case 'POOR':
      score = 45;
      break;
    case 'CRITICAL':
      score = 20;
      break;
    default:
      score = 80;
  }

  // Deduct 5 points per open complaint
  score = Math.max(5, score - (complaintCount * 5));
  return score;
};

module.exports = {
  calculateAssetHealthScore
};
