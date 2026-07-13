const express = require('express');
const cors = require('cors');
require('@dotenvx/dotenvx').config();
require('./config/env');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/filtros', require('./routes/api/filtros'));
app.use('/api/metricas', require('./routes/api/metricas'));

// Erro handler (deve ser o último middleware)
app.use(require('./middleware/errorHandler'));

// Iniciar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
