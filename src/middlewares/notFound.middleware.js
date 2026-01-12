export const notFoundHandler = (req, res) => {
  if (req.accepts('html')) {
    return res.status(404).render('frontend/404');
  }

  if (req.accepts('json')) {
    return res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  }

  res.status(404).send('Not Found');
};
