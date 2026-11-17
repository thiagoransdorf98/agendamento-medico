import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

// Listar médicos
router.get('/', async (req, res) => {

    try {

        const [medicos] = await pool.execute(
            `SELECT id, nome, especialidade
            FROM medicos
            ORDER BY nome`
        );

        return res.status(200).json(medicos);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: 'Erro ao buscar médicos.'
        });

    }

});

export default router;