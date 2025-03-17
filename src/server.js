import express from 'express';
import cors from 'cors';
import { PORT, OUTPUT_DIR, UPLOAD_DIR } from './config.js';
import router from './routes.js';
import fs from 'fs';
import swaggerSetup from './swagger.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());

swaggerSetup(app);

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(router);

app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));
