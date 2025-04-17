const natural = require('natural');
const { cosineSimilarity } = require('./cosine_similarity');

const generateMatches = (users) => {
  if (users.length < 2) {
    return [];
  }

  const text_col = "combined_text";
  const categorical_cols = ["gender", "department", "preferred_study", "socialization_preference", "meeting_preference", "join_reason"];
  const numeric_cols = ["age", "introvert_scale", "discussion_level"];

  // Prepare documents for TF-IDF
  const documents = users.map(user => user[text_col] || '');
  const userIds = users.map(user => user.UserID);

  // TF-IDF Vectorization using natural library
  const tfidf = new natural.TfIdf();
  
  // Add documents to the corpus
  documents.forEach(document => {
    tfidf.addDocument(document);
  });

  // Create TF-IDF matrix
  const matrix = [];
  for (let i = 0; i < documents.length; i++) {
    const vector = [];
    tfidf.listTerms(i).forEach(item => {
      vector.push(item.tfidf);
    });
    matrix.push(vector);
  }

  // Ensure all vectors have the same length by padding with zeros
  const maxLength = Math.max(...matrix.map(vec => vec.length));
  const paddedMatrix = matrix.map(vec => {
    if (vec.length < maxLength) {
      return [...vec, ...Array(maxLength - vec.length).fill(0)];
    }
    return vec;
  });

  const similarityMatrix = cosineSimilarity(paddedMatrix, paddedMatrix);

  // Set diagonal to -1 to avoid self-matching
  for (let i = 0; i < similarityMatrix.length; i++) {
    similarityMatrix[i][i] = -1;
  }

  const matches = [];
  const threshold = 0.5; // Adjust as needed

  for (let i = 0; i < similarityMatrix.length; i++) {
    for (let j = i + 1; j < similarityMatrix.length; j++) {
      if (similarityMatrix[i][j] > threshold) {
        matches.push({
          user1Id: userIds[i],
          user2Id: userIds[j],
          score: similarityMatrix[i][j]
        });
      }
    }
  }

  return matches;
};

module.exports = { generateMatches };