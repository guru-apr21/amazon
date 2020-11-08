module.exports = (err, req, res) => {
  console.log('I am ');
  console.log(err.type);
  console.log(err);
  switch (err.name || err.type || err.status) {
    case 'TokenExpiredError':
      res.status(400).json('Token expired login to continue');
      break;
    case 'StripeCardError':
      res.status(err.statusCode).json(err.message);
      break;
    case 'StripeInvalidRequestError':
      res.status(err.statusCode).json(err.message);
      break;
    case 200:
      res.status(200).json(err.message);
      break;
    case 204:
      res.status(204).end();
      break;
    case 404:
      res.status(404).json(err.message);
      break;
    case 400:
      res.status(400).json(err.message);
      break;
    case 'CastError':
      res.status(400).json(err.message);
      break;
    default:
      res.status(500).json('Something went wrong');
      break;
  }
};
