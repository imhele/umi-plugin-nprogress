export default {
  'GET /api/timeout': (req, res) => {
    const timeout = Number(req.query.ms || 0) || 3000;
    setTimeout(() => res.send('Ok.'), timeout);
  },
};
