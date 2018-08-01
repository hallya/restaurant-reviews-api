function factoriseElements(
  results,
  targetedKeys = ['ip', 'id', 'name', 'comments', 'rating', 'createdAt', 'updatedAt'],
  keyElements = 'reviews') {
  
  return results.reduce((acc, entry) => {
    let review = {};
    if (!acc[keyElements]) acc[keyElements] = [];
    for (let key in entry) {
      targetedKeys.includes(key)
        ? review[key] = entry[key]
        : acc[key] = entry[key];
    }
    acc[keyElements].push(review);
    return acc;
  }, {})
}

module.exports = factoriseElements;