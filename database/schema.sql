
CREATE DATABASE IF NOT EXISTS agendamento_medico
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE agendamento_medico;

-- Tabela de médicos
CREATE TABLE IF NOT EXISTS medicos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    especialidade VARCHAR(100) NOT NULL
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS agendamentos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    medico_id INT UNSIGNED NOT NULL,
    paciente_nome VARCHAR(120) NOT NULL,
    data_hora DATETIME NOT NULL,
    observacao TEXT NULL,

    CONSTRAINT fk_agendamentos_medicos
    FOREIGN KEY (medico_id)
    REFERENCES medicos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- Médicos iniciais
INSERT INTO medicos (nome, especialidade)
SELECT 'Ana Ribeiro', 'Cardiologia'
WHERE NOT EXISTS (
    SELECT 1 FROM medicos WHERE nome = 'Ana Ribeiro'
);

INSERT INTO medicos (nome, especialidade)
SELECT 'Marcos Oliveira', 'Ortopedia'
WHERE NOT EXISTS (
    SELECT 1 FROM medicos WHERE nome = 'Marcos Oliveira'
);

INSERT INTO medicos (nome, especialidade)
SELECT 'Carla Santos', 'Dermatologia'
WHERE NOT EXISTS (
    SELECT 1 FROM medicos WHERE nome = 'Carla Santos'
);

INSERT INTO medicos (nome, especialidade)
SELECT 'Roberto Almeida', 'Neurologia'
WHERE NOT EXISTS (
    SELECT 1 FROM medicos WHERE nome = 'Roberto Almeida'
);

INSERT INTO medicos (nome, especialidade)
SELECT 'Juliana Costa', 'Pediatria'
WHERE NOT EXISTS (
    SELECT 1 FROM medicos WHERE nome = 'Juliana Costa'
);
