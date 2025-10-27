import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bolu-Chat',
            version: '1.0.0',
            description: 'App de mensajeria en tiempo real',
            contact: {
                name: 'Franco Torrico'
            },
            servers: [
                {
                    url: 'http://localhost:9999',
                    description: 'Local server'
                }
            ]
        }
    },
    apis: ['./swagger/*.js']
};

// Va a generar la api a partir de los comentarios que detecte 
const specs = swaggerJsdoc(options);
export default specs;