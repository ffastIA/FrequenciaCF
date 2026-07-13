module.exports = (err, req, res, next) => {
  console.error('[ERROR]', new Date().toISOString(), err.message);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
