import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { pool } from './config/db.js';

import agendamentosRoutes from './routes/agendamentos.routes.js';
import medicosRoutes from './routes/medicos.routes.js';

const app = express();

const PORT = process.env.PORT || 3000;

// Permitir comunicação com o frontend
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Permitir recebimento de JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {

    res.send('API de Agendamento Médico funcionando!');

});

// Rotas da API
app.use('/api/agendamentos', agendamentosRoutes);

app.use('/api/medicos', medicosRoutes);

// Inicializar o servidor após testar o banco
async function iniciarServidor() {

    try {

        await pool.execute('SELECT 1');

        console.log('MySQL conectado com sucesso!');

        app.listen(PORT, () => {

            console.log(
                `API ouvindo em http://localhost:$DIL3`
            );

        });

    } catch (error) {

        console.error(
            'Erro ao conectar ao MySQL:',
            error.message
        );

        process.exit(1);

    }

}

iniciarServidor();