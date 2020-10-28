module.exports = (err, req, res, next) => {
  switch (err.status || err.name) {
    case 200:
      res.status(200).json(err.message);
      break;
    case 204:
      console.log("hello");
      res.status(204).end();
      break;
    case 404:
      res.status(404).json(err.message);
      break;
    case "CastError":
      res.status(400).json(err.message);
      break;
    default:
      res.status(500).json("Something went wrong");
      break;
  }
};
