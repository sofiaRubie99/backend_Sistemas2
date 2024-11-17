"use strict";

require('dotenv').config(); // Carga las variables del archivo .env
const { createClient } = require('redis');
console.log(process.env.REDIS_HOST);

// Configura el cliente de Redis
const client = createClient({
  password: process.env.REDIS_PSW,  // Usar la contraseña de .env
  socket: {
    host: process.env.REDIS_HOST,  // Usar el host de .env
    port: process.env.REDIS_PORT,  // Usar el puerto de .env
  },
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Manejo de errores
client.on('error', (err) => {
  console.log('Redis connection error:', err);
});

// Exporta el manejador de la función para Netlify
exports.handler = async (event, context) => {
  try {
    // Aquí puedes manejar la lógica que quieras, por ejemplo, establecer o obtener algo de Redis.
    const response = await client.get('some_key');  // Ejemplo: Obtener un valor desde Redis

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Connection successful!',
        data: response,
      }),
    };
  } catch (error) {
    console.log('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};
