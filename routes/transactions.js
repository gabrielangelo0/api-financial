const express = require('express');

const { readDB, writeDB } = require('../db');

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Transactions
 *     description: CRUD de transações financeiras
 */

function getNextId(transactions) {
  if (!transactions.length) return 1;
  const ids = transactions.map((t) => Number(t.id) || 0);
  return Math.max(...ids) + 1;
}

/**
 * @openapi
 * /transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Lista todas as transações
 *     responses:
 *       200:
 *         description: Lista de transações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get('/', (req, res) => {
  const db = readDB();
  const transactions = db.transactions || [];
  return res.json(transactions);
});

/**
 * @openapi
 * /transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Retorna uma transação pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res) => {
  const db = readDB();
  const transactions = db.transactions || [];
  const id = Number(req.params.id);
  const transaction = transactions.find((t) => Number(t.id) === id);

  if (!transaction) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  return res.json(transaction);
});

/**
 * @openapi
 * /transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Cria uma nova transação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: Transação criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Campos obrigatórios ausentes ou inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', (req, res) => {
  const { title, amount, category, date, type } = req.body || {};

  if (!title || !amount || !category || !date || !type) {
    return res
      .status(400)
      .json({ error: 'title, amount, category, date e type são obrigatórios' });
  }

  if (type !== 'entrada' && type !== 'saida') {
    return res.status(400).json({ error: "type deve ser 'entrada' ou 'saida'" });
  }

  const db = readDB();
  if (!db.transactions) db.transactions = [];

  const transaction = {
    title,
    amount: String(amount),
    category,
    date,
    type,
    id: getNextId(db.transactions),
  };

  db.transactions.push(transaction);
  writeDB(db);

  return res.status(201).json(transaction);
});

/**
 * @openapi
 * /transactions/{id}:
 *   put:
 *     tags: [Transactions]
 *     summary: Atualiza uma transação existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       200:
 *         description: Transação atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Transação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', (req, res) => {
  const db = readDB();
  if (!db.transactions) db.transactions = [];

  const id = Number(req.params.id);
  const index = db.transactions.findIndex((t) => Number(t.id) === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  const { title, amount, category, date, type } = req.body || {};

  if (type && type !== 'entrada' && type !== 'saida') {
    return res.status(400).json({ error: "type deve ser 'entrada' ou 'saida'" });
  }

  const current = db.transactions[index];
  const updated = {
    ...current,
    ...(title !== undefined && { title }),
    ...(amount !== undefined && { amount: String(amount) }),
    ...(category !== undefined && { category }),
    ...(date !== undefined && { date }),
    ...(type !== undefined && { type }),
    id: current.id,
  };

  db.transactions[index] = updated;
  writeDB(db);

  return res.json(updated);
});

/**
 * @openapi
 * /transactions/{id}:
 *   delete:
 *     tags: [Transactions]
 *     summary: Remove uma transação
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Transação removida com sucesso
 *       404:
 *         description: Transação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (req, res) => {
  const db = readDB();
  if (!db.transactions) db.transactions = [];

  const id = Number(req.params.id);
  const index = db.transactions.findIndex((t) => Number(t.id) === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Transação não encontrada' });
  }

  db.transactions.splice(index, 1);
  writeDB(db);

  return res.status(204).send();
});

module.exports = router;
