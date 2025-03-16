import express from 'express';
import cors from 'cors';
import { PORT, OUTPUT_DIR, UPLOAD_DIR } from './config.js';
import router from './routes.js';
import fs from 'fs';
import swaggerSetup from './swagger.js';
import path from 'path'; // Importando o módulo path

const app = express();

app.use(cors());

swaggerSetup(app);

// Verificando e criando diretórios, se necessário
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Servindo arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(router);

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
