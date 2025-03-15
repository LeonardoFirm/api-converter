import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Conversão de Imagens',
            version: '1.0.0',
            description: `
                **API de Conversão de Imagens**

                Esta API permite converter imagens para diferentes formatos como JPG, PNG, WebP e outros. É voltada para desenvolvedores que precisam realizar conversões de imagens de maneira automatizada em seus sistemas.

                **Autenticação:**
                - A autenticação para testes no Swagger é feita automaticamente utilizando um token de teste.
                - Para uso em produção, é necessário fornecer um token JWT válido.

                **Endpoints disponíveis:**
                - **POST /convert**: Converte uma imagem para o formato especificado.

                **Como usar:**
                1. Faça upload da imagem no campo apropriado.
                2. Escolha o formato desejado (jpg, png, webp, etc.).
                3. Clique em "Executar" para converter a imagem.

                **Nota:** Para proteger as imagens convertidas, o botão direito do mouse foi desativado.
            `,
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor local' },
            { url: 'https://api.seusite.com', description: 'Servidor de produção (substitua pelo seu URL)' }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            authAction: {
                BearerAuth: {
                    name: 'Authorization',
                    schema: {
                        type: 'apiKey',
                        in: 'header',
                        name: 'Authorization',
                    },
                    value: `Bearer ${process.env.TEST_TOKEN}`,
                },
            },
            docExpansion: 'none',
            defaultModelsExpandDepth: -1,
            layout: "BaseLayout",
            deepLinking: true,
        },
        customCss: `
            .swagger-ui .opblock-description img,
            .swagger-ui .response-col_description img {
                pointer-events: none;
                user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
            }
            /* Bloqueia clique direito nas imagens */
            .swagger-ui .opblock-description img,
            .swagger-ui .response-col_description img {
                pointer-events: none;
                -webkit-user-drag: none;
                user-select: none;
            }
        `,
        customJs: `
            window.onload = function() {
                document.addEventListener("contextmenu", function(event) {
                    if (event.target.tagName === "IMG") {
                        event.preventDefault();
                    }
                }, false);
            }
        `
    }));
};
