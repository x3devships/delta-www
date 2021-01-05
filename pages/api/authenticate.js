const PASSWORD = 'benice';

export default (req, res) => {
  if (req.headers.authorization === PASSWORD) {
    res.statusCode = 200;
  } else {
    res.statusCode = 401;
  }
  res.end();
};
