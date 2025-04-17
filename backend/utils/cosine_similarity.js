const cosineSimilarity = (matrixA, matrixB) => {
  const numRowsA = matrixA.length;
  const numColsA = matrixA[0].length;
  const numRowsB = matrixB.length;
  const numColsB = matrixB[0].length;

  if (numColsA !== numColsB) {
    throw new Error("Matrices must have the same number of columns for cosine similarity.");
  }

  const similarityMatrix = Array(numRowsA)
    .fill(null)
    .map(() => Array(numRowsB).fill(0));

  for (let i = 0; i < numRowsA; i++) {
    for (let j = 0; j < numRowsB; j++) {
      let dotProduct = 0;
      let magnitudeA = 0;
      let magnitudeB = 0;

      for (let k = 0; k < numColsA; k++) {
        dotProduct += matrixA[i][k] * matrixB[j][k];
        magnitudeA += matrixA[i][k] * matrixA[i][k];
        magnitudeB += matrixB[j][k] * matrixB[j][k];
      }

      magnitudeA = Math.sqrt(magnitudeA);
      magnitudeB = Math.sqrt(magnitudeB);

      if (magnitudeA !== 0 && magnitudeB !== 0) {
        similarityMatrix[i][j] = dotProduct / (magnitudeA * magnitudeB);
      } else {
        similarityMatrix[i][j] = 0;
      }
    }
  }

  return similarityMatrix;
};

exports.cosineSimilarity = cosineSimilarity;