import sharp from 'sharp';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { OUTPUT_DIR } from './config.js';

const SHARP_SUPPORTED_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'tiff', 'avif'];

// Função para converter imagem
export const convertImage = async (filePath, format) => {
    console.log(`Iniciando conversão de: ${filePath} para formato: ${format}`);

    // Gera o caminho de saída
    const baseName = path.basename(filePath, path.extname(filePath)) || path.basename(filePath);
    const outputFilePath = path.join(OUTPUT_DIR, `${baseName}.${format}`);
    console.log(`Caminho de saída: ${outputFilePath}`);

    // Verifica se o arquivo de entrada existe
    if (!fs.existsSync(filePath)) {
        throw new Error(`Arquivo de entrada não encontrado: ${filePath}`);
    }

    try {
        if (SHARP_SUPPORTED_FORMATS.includes(format)) {
            console.log('Usando sharp para conversão...');
            let image = sharp(filePath);

            switch (format) {
                case 'jpeg':
                case 'jpg':
                    image = image.jpeg({ quality: 100 });
                    break;
                case 'png':
                    image = image.png({ compressionLevel: 0 });
                    break;
                case 'webp':
                    image = image.webp({ quality: 100 });
                    break;
                case 'tiff':
                    image = image.tiff({ compression: 'none' });
                    break;
                case 'avif':
                    image = image.avif({ quality: 100 });
                    break;
            }

            await image.toFile(outputFilePath);
            console.log('Conversão com sharp concluída.');
        } else {
            console.log('Usando ImageMagick como fallback...');
            await convertWithImageMagick(filePath, outputFilePath, format);
            console.log('Conversão com ImageMagick concluída.');
        }

        // Exclui o arquivo de entrada após a conversão
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Arquivo de entrada excluído: ${filePath}`);
        } else {
            console.log(`Arquivo de entrada não encontrado para exclusão: ${filePath}`);
        }

        return outputFilePath;
    } catch (err) {
        console.error('Erro na conversão inicial:', err.message);
        try {
            console.log('Tentando fallback com ImageMagick...');
            await convertWithImageMagick(filePath, outputFilePath, format);
            console.log('Conversão com fallback concluída.');

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Arquivo de entrada excluído após fallback: ${filePath}`);
            } else {
                console.log(`Arquivo de entrada não encontrado após fallback: ${filePath}`);
            }
            return outputFilePath;
        } catch (fallbackErr) {
            throw new Error(`Falha na conversão: ${fallbackErr.message}`);
        }
    }
};

// Fallback para ImageMagick
const convertWithImageMagick = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        console.log(`Executando ImageMagick: magick convert "${inputPath}" "${outputPath}"`);
        exec(`magick convert "${inputPath}" "${outputPath}"`, (error) => {
            if (error) {
                return reject(new Error(`Erro ao converter com ImageMagick: ${error.message}`));
            }
            resolve(outputPath);
        });
    });
};