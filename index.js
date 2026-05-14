const express = require('express');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const transactionsRoutes = require('./routes/transactions');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API rodando', docs: '/docs' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req, res) => res.json(swaggerSpec));

app.use('/auth', authRoutes);
app.use('/transactions', transactionsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
