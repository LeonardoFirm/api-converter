import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const TEST_SECRET = process.env.TEST_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET não encontrado no .env');
  process.exit(1); // Encerra a aplicação se a chave secreta não for encontrada
}

// Geração do token de produção (com a chave secreta do .env)
const productionPayload = {
  userId: 1,
  username: 'cliente_producao',
};

const productionToken = jwt.sign(productionPayload, JWT_SECRET, { expiresIn: '1h' }); // O token vai expirar em 1 hora

// Geração do token de teste (com chave secreta fixa)
const testPayload = {
  userId: 2,
  username: 'developer_teste',
};

const testToken = jwt.sign(testPayload, TEST_SECRET, { expiresIn: '1h' }); // Token para testar no Swagger

console.log('Token de Produção JWT gerado:', productionToken);
console.log('Token de Teste JWT gerado:', testToken);
