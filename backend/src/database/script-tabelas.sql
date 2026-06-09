CREATE DATABASE smart_park;
USE smart_park;

-- =========================
-- CLIENTE
-- =========================
CREATE TABLE cliente(
	id_cliente INT PRIMARY KEY AUTO_INCREMENT, 
    cnpj_empresa CHAR(14) NOT NULL,
    codigo_ativacao CHAR(6),
    logradouro VARCHAR(100) NOT NULL, 
    numero_logradouro INT NOT NULL,
    cidade VARCHAR(45) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep CHAR(8) NOT NULL,
	razao_social_empresa VARCHAR(45) NOT NULL,
    dtHr_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    senha_cliente VARCHAR(16) NOT NULL
);

-- =========================
-- FUNCIONARIO
-- =========================
CREATE TABLE funcionario(  
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
	nome_funcionario VARCHAR(45) NOT NULL,
	email_funcionario VARCHAR(254) NOT NULL,
	senha_funcionario VARCHAR(16) NOT NULL, 
	fkCliente INT NOT NULL,
	FOREIGN KEY (fkCliente) REFERENCES cliente(id_cliente)
);

-- =========================
-- ESTACIONAMENTO
-- =========================
CREATE TABLE estacionamento(
	id_estacionamento INT PRIMARY KEY AUTO_INCREMENT,
    nome_shopping VARCHAR(40) NOT NULL,
    qtd_vaga_total INT NOT NULL,
    qtd_vaga_pcd INT,
    qtd_vaga_idoso INT,
    qtd_vaga_moto INT,
    qtd_vaga_vip INT,
    valor_diario_vaga DECIMAL(6,2) NOT NULL,
	fkCliente INT NOT NULL,
    
	CHECK (
		qtd_vaga_pcd + qtd_vaga_idoso + qtd_vaga_moto + qtd_vaga_vip <= qtd_vaga_total
	),
    
	FOREIGN KEY (fkCliente) REFERENCES cliente(id_cliente)
);

-- =========================
-- VAGA
-- =========================
CREATE TABLE vaga(
	id_vaga INT PRIMARY KEY AUTO_INCREMENT,
    tipo_vaga VARCHAR(20), 
    setor_vaga VARCHAR(10),
    
	CHECK(tipo_vaga IN ('Comum', 'PCD', 'Idoso', 'Moto', 'VIP')),
    
	fkEstacionamento INT NOT NULL,
	FOREIGN KEY (fkEstacionamento) REFERENCES estacionamento(id_estacionamento)
);

-- =========================
-- SENSOR
-- =========================
CREATE TABLE sensor(
	id_sensor INT PRIMARY KEY AUTO_INCREMENT,
    fkVaga INT UNIQUE NOT NULL,
	FOREIGN KEY (fkVaga) REFERENCES vaga(id_vaga)
);

-- =========================
-- REGISTROS
-- =========================
CREATE TABLE registros(
	id_registro INT PRIMARY KEY AUTO_INCREMENT,
	dtHr_leitura DATETIME DEFAULT CURRENT_TIMESTAMP,
    registroSensor TINYINT(1),
    
	CHECK (registroSensor IN (0,1)),
    
    fkSensor INT NOT NULL,
    FOREIGN KEY (fkSensor) REFERENCES sensor(id_sensor)
);

-- =========================
-- CLIENTES
-- =========================
INSERT INTO cliente
(cnpj_empresa, codigo_ativacao, logradouro, numero_logradouro, cidade, estado, cep, razao_social_empresa, senha_cliente)
VALUES
('12345678000199', 'SPK001', 'Av. Paulista', 2300, 'São Paulo', 'SP', '01310100', 'Shopping Paulista', 'paulista123'),
('98765432000155', 'SPK002', 'Av. Morumbi', 1089, 'São Paulo', 'SP', '04707000', 'Shopping Morumbi', 'morumbi123');

-- =========================
-- FUNCIONARIOS
-- =========================
INSERT INTO funcionario
(nome_funcionario, email_funcionario, senha_funcionario, fkCliente)
VALUES
('Gustavo Costa', 'gustavo@paulista.com', '123', 1),
('Mariana Oliveira', 'mariana@paulista.com', '123', 1),
('Lucas Ferreira', 'lucas@morumbi.com', '123', 2);

-- =========================
-- ESTACIONAMENTO
-- =========================
INSERT INTO estacionamento
(nome_shopping, qtd_vaga_total, qtd_vaga_pcd, qtd_vaga_idoso, qtd_vaga_moto, qtd_vaga_vip, valor_diario_vaga, fkCliente)
VALUES
('Shopping Paulista', 500, 20, 30, 50, 15, 35.00, 1),
('Shopping Morumbi', 700, 25, 40, 70, 20, 40.00, 2);

-- =========================
-- VAGAS (EXEMPLO INICIAL)
-- =========================
INSERT INTO vaga (tipo_vaga, setor_vaga, fkEstacionamento)
VALUES
('Comum', 'A1-01', 1),
('Comum', 'A1-02', 1),
('PCD', 'A1-03', 1),
('Idoso', 'A1-04', 1),
('VIP', 'A1-05', 1),
('Comum', 'B1-01', 2),
('Comum', 'B1-02', 2),
('Moto', 'B1-03', 2),
('PCD', 'B1-04', 2),
('VIP', 'B1-05', 2);

-- =========================
-- SENSORES
-- =========================
INSERT INTO sensor (fkVaga)
SELECT id_vaga FROM vaga;

-- =========================
-- REGISTROS INICIAIS
-- =========================
INSERT INTO registros (registroSensor, fkSensor)
VALUES
(1,1),(0,2),(1,3),(0,4),(1,5),
(1,6),(1,7),(0,8),(1,9),(0,10);

-- =========================
-- CONSULTAS PRINCIPAIS
-- =========================

-- Ocupação geral
SELECT
    e.nome_shopping,
    COUNT(v.id_vaga) AS total_vagas,
    SUM(r.registroSensor = 1) AS vagas_ocupadas,
    SUM(r.registroSensor = 0) AS vagas_livres
FROM estacionamento e
JOIN vaga v ON v.fkEstacionamento = e.id_estacionamento
JOIN sensor s ON s.fkVaga = v.id_vaga
JOIN registros r ON r.fkSensor = s.id_sensor
GROUP BY e.id_estacionamento;

-- Status das vagas
SELECT
    e.nome_shopping,
    v.setor_vaga,
    v.tipo_vaga,
    CASE
        WHEN r.registroSensor = 1 THEN 'Ocupada'
        ELSE 'Livre'
    END AS status_vaga
FROM vaga v
JOIN estacionamento e ON v.fkEstacionamento = e.id_estacionamento
JOIN sensor s ON s.fkVaga = v.id_vaga
JOIN registros r ON r.fkSensor = s.id_sensor;

-- Taxa de ocupação
SELECT
    e.nome_shopping,
    ROUND(
        (SUM(r.registroSensor = 1) / COUNT(v.id_vaga)) * 100,
        2
    ) AS taxa_ocupacao
FROM estacionamento e
JOIN vaga v ON v.fkEstacionamento = e.id_estacionamento
JOIN sensor s ON s.fkVaga = v.id_vaga
JOIN registros r ON r.fkSensor = s.id_sensor
GROUP BY e.id_estacionamento;

-- Tipo de vaga
SELECT
    v.tipo_vaga,
    COUNT(v.id_vaga) AS total,
    SUM(r.registroSensor = 1) AS ocupadas,
    SUM(r.registroSensor = 0) AS livres
FROM vaga v
JOIN sensor s ON s.fkVaga = v.id_vaga
JOIN registros r ON r.fkSensor = s.id_sensor
GROUP BY v.tipo_vaga;

-- Funcionários
SELECT
    f.nome_funcionario,
    f.email_funcionario,
    c.razao_social_empresa
FROM funcionario f
JOIN cliente c ON f.fkCliente = c.id_cliente;