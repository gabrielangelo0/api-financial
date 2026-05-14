const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticação',
      version: '1.0.0',
      description: 'API Node + Express com autenticação via JWT, usando db.json como banco.',
    },
    servers: [
      { url: 'https://api-financial-production-1881.up.railway.app', description: 'Produção (Railway)' },
      { url: 'http://localhost:3000', description: 'Servidor local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1778103375728' },
            name: { type: 'string', example: 'Gabriel' },
            email: { type: 'string', format: 'email', example: 'gabriel@test.com' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Gabriel' },
            email: { type: 'string', format: 'email', example: 'gabriel@test.com' },
            password: { type: 'string', format: 'password', example: '123456' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'gabriel@test.com' },
            password: { type: 'string', format: 'password', example: '123456' },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            title: { type: 'string', example: 'Salario' },
            amount: { type: 'string', example: '237000' },
            category: { type: 'string', example: 'Finança' },
            date: { type: 'string', example: '15/04/2026' },
            type: { type: 'string', enum: ['entrada', 'saida'], example: 'entrada' },
          },
        },
        TransactionInput: {
          type: 'object',
          required: ['title', 'amount', 'category', 'date', 'type'],
          properties: {
            title: { type: 'string', example: 'Salario' },
            amount: { type: 'string', example: '237000' },
            category: { type: 'string', example: 'Finança' },
            date: { type: 'string', example: '15/04/2026' },
            type: { type: 'string', enum: ['entrada', 'saida'], example: 'entrada' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
