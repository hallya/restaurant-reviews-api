function handleError(error) {
  console.error(error);
  return res.json(error) || null;
}

function catchError(err) {
  console.error(err)
  return res.status(400).send('Something broke!')
}

module.exports = {
  handleError,
  catchError
};