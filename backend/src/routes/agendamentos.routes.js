import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

//GET
router.get('/', async (req, res) => {

    try {

        const { medico_id, data } = req.query;

        let sql = `
            SELECT
                a.id,
                a.medico_id,
                a.paciente_nome,
                a.data_hora,
                a.observacao,
                m.nome AS medico_nome,
                m.especialidade

            FROM agendamentos a

            INNER JOIN medicos m
            ON a.medico_id = m.id

            WHERE 1=1
        `;

        const params = [];

        // Filtro por médico
        if (medico_id) {

            const medicoId = Number(medico_id);

            if (!Number.isInteger(medicoId) || medicoId <= 0) {
                return res.status(400).json({
                    error: 'ID do médico inválido.'
                });
            }

            sql += ' AND a.medico_id = ?';

            params.push(medicoId);
        }

        // Filtro por data
        if (data) {

            if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
                return res.status(400).json({
                    error: 'Data inválida. Utilize YYYY-MM-DD.'
                });
            }

            sql += ' AND DATE(a.data_hora) = ?';

            params.push(data);
        }

        sql += ' ORDER BY a.data_hora ASC';

        const [agendamentos] = await pool.execute(
            sql,
            params
        );

        return res.status(200).json(agendamentos);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: 'Erro ao buscar agendamentos.'
        });

    }

});



//POST
router.post('/', async (req, res) => {

    try {

        const {
            medico_id,
            paciente_nome,
            data_hora,
            observacao
        } = req.body ?? {};

        // Validação do médico
        const medicoId = Number(medico_id);

        if (
            !medico_id ||
            !Number.isInteger(medicoId) ||
            medicoId <= 0
        ) {
            return res.status(400).json({
                error: 'Informe um médico válido.'
            });
        }

        // Validação do paciente
        if (
            typeof paciente_nome !== 'string' ||
            paciente_nome.trim() === ''
        ) {
            return res.status(400).json({
                error: 'Informe o nome do paciente.'
            });
        }

        // Validação da data
        if (
            typeof data_hora !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(data_hora)
        ) {
            return res.status(400).json({
                error: 'Informe uma data e hora válidas.'
            });
        }

        // Conversão para o formato do MySQL
        const dataHoraBanco = data_hora.replace('T', ' ');

        const dataHoraFinal =
            dataHoraBanco.length === 16
                ? dataHoraBanco + ':00'
                : dataHoraBanco;

        // Observação é opcional
        const observacaoFinal =
            typeof observacao === 'string'
                ? observacao.trim() || null
                : null;

        // Inserção no banco
        const [resultado] = await pool.execute(
            `INSERT INTO agendamentos
            (medico_id, paciente_nome, data_hora, observacao)
            VALUES (?, ?, ?, ?)`,
            [
                medicoId,
                paciente_nome.trim(),
                dataHoraFinal,
                observacaoFinal
            ]
        );

        return res.status(201).json({
            message: 'Agendamento criado com sucesso!',

            id: resultado.insertId,

            medico_id: medicoId,

            paciente_nome: paciente_nome.trim(),

            data_hora: dataHoraFinal,

            observacao: observacaoFinal
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: 'Erro ao criar agendamento.'
        });

    }

});


//DELETE
router.delete('/:id', async (req, res) => {

    try {

        const id = Number(req.params.id);

        // Validar o ID
        if (!Number.isInteger(id) || id <= 0) {

            return res.status(400).json({
                error: 'ID inválido.'
            });

        }

        // Excluir o agendamento
        const [resultado] = await pool.execute(
            'DELETE FROM agendamentos WHERE id = ?',
            [id]
        );

        // Verificar se houve exclusão
        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                error: 'Agendamento não encontrado.'
            });

        }

        return res.status(200).json({
            message: 'Agendamento cancelado com sucesso!'
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: 'Erro ao cancelar agendamento.'
        });

    }

});

export default router;