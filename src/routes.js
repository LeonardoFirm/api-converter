/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /convert:
 *   post:
 *     summary: Converte uma imagem para o formato especificado.
 *     description: Este endpoint converte a imagem enviada para o formato especificado. Não é necessário um token JWT para usar esta API, exceto para desenvolvedores que queiram acessá-la de forma programática.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               format:
 *                 type: string
 *                 description: Formato de saída desejado (jpg, png, webp, etc.).
 *           example:
 *             format: "png"
 *             image: "@path/to/your/image.jpg"
 *     responses:
 *       200:
 *         description: Retorna a imagem convertida.
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Erro de requisição. Isso ocorre quando o formato de saída não é especificado ou o arquivo de imagem não é enviado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Formato de conversão não especificado"
 *       500:
 *         description: Erro interno do servidor. Isso pode ocorrer devido a falha na conversão de imagem ou erro interno inesperado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao processar a imagem"
 *     security: []  # Nenhuma autenticação obrigatória aqui
 *     x-codeSamples:
 *       - lang: "curl"
 *         label: "Exemplo de Curl"
 *         source: |
 *           curl -X 'POST' \
 *             'http://localhost:3000/convert' \
 *             -H 'accept: image/*' \
 *             -H 'Content-Type: multipart/form-data' \
 *             -F 'image=@path/to/your/image.jpg' \
 *             -F 'format=png'
 *       - lang: "Node.js"
 *         label: "Exemplo de implementação no backend (Node.js)"
 *         source: |
 *           const formData = new FormData();
 *           formData.append('image', fileInput.files[0]);
 *           formData.append('format', 'png');
 *
 *           fetch('/convert', {
 *             method: 'POST',
 *             body: formData
 *           })
 *           .then(response => {
 *             if (response.ok) {
 *               return response.blob();
 *             }
 *             throw new Error('Falha na conversão');
 *           })
 *           .then(blob => {
 *             const downloadUrl = URL.createObjectURL(blob);
 *             const a = document.createElement('a');
 *             a.href = downloadUrl;
 *             a.download = 'imagem_convertida.png';
 *             a.click();
 *           })
 *           .catch(error => console.error('Erro ao converter imagem:', error));
 */


import express from 'express';
import multer from 'multer';
import { convertImage } from './converter.js';
import { UPLOAD_DIR } from './config.js';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: UPLOAD_DIR });

router.post('/convert', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });

    const { format } = req.body;
    if (!format) return res.status(400).json({ error: 'Formato de conversão não especificado' });

    try {
        const convertedImagePath = await convertImage(req.file.path, format);
        const convertedImage = fs.readFileSync(convertedImagePath);

        res.setHeader('Content-Type', `image/${format}`);
        res.send(convertedImage);

        fs.unlinkSync(convertedImagePath);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
