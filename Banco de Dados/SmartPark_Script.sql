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
    dtHr_cadastro DATETIME DEFAULT NOW(),
    senha_cliente VARCHAR(16) NOT NULL
);
CREATE TABLE funcionario(  
	id_usuario INT PRIMARY KEY AUTO_INCREMENT,
	nome_funcionario VARCHAR(45) NOT NULL,
	email_funcionario VARCHAR(254) NOT NULL,
	senha_funcionario VARCHAR(16) NOT NULL, 
	fkCliente INT NOT NULL,
	CONSTRAINT ctFkCliente
	FOREIGN KEY (fkCliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE estacionamento(
	id_estacionamento INT PRIMARY KEY AUTO_INCREMENT,
    nome_shopping VARCHAR(40) NOT NULL,
    qtd_vaga_total INT NOT NULL,
    qtd_vaga_pcd INT,
    qtd_vaga_idoso INT,
    qtd_vaga_moto INT,
    qtd_vaga_vip INT,
    CONSTRAINT cQtd_vagas
    CHECK (qtd_vaga_pcd + qtd_vaga_idoso + qtd_vaga_moto + qtd_vaga_vip <= qtd_vaga_total),
    valor_diario_vaga DECIMAL(4,2) NOT NULL,
	fkCliente INT NOT NULL,
	CONSTRAINT ctfkClienteEstacionamento
	FOREIGN KEY (fkCliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE vaga(
	id_vaga INT PRIMARY KEY AUTO_INCREMENT,
    tipo_vaga VARCHAR(20), 
    setor_vaga VARCHAR(10), -- S1-02
    CONSTRAINT cTipo CHECK(tipo_vaga IN('Comum', 'PCD', 'Idoso', 'Moto', 'VIP')),
	fkEstacionamento INT NOT NULL,
	CONSTRAINT ctFkEstacionamentoVaga
	FOREIGN KEY (fkEstacionamento) REFERENCES estacionamento(id_estacionamento)
);

CREATE TABLE sensor(
	id_sensor INT PRIMARY KEY AUTO_INCREMENT,
    fkVaga INT UNIQUE NOT NULL,
	FOREIGN KEY (fkVaga) REFERENCES vaga(id_vaga)
);

CREATE TABLE registros(
	id_registro INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	dtHr_leitura DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    registroSensor TINYINT(1)
	CHECK (registroSensor IN (0,1)),
    fkSensor INT NOT NULL,
    CONSTRAINT ctFkSensor
    FOREIGN KEY (fkSensor) REFERENCES sensor(id_sensor)
);

INSERT INTO cliente
(cnpj_empresa, codigo_ativacao, logradouro, numero_logradouro, cidade, estado, cep, razao_social_empresa, senha_cliente)
VALUES
('12345678000199', 'SPK001', 'Av. Paulista', 2300, 'São Paulo', 'SP', '01310100', 'Shopping Paulista', 'paulista123'),
('98765432000155', 'SPK002', 'Av. Roque Petroni Júnior', 1089, 'São Paulo', 'SP', '04707000', 'Shopping Morumbi', 'morumbi123');

INSERT INTO funcionario
(nome_funcionario, email_funcionario, senha_funcionario, fkCliente)
VALUES
('Gustavo Costa', 'gustavo@shoppingpaulista.com', 'gustavo123', 1),
('Mariana Oliveira', 'mariana@shoppingpaulista.com', 'mariana123', 1),
('Lucas Ferreira', 'lucas@shoppingmorumbi.com', 'lucas123', 2);

INSERT INTO estacionamento
(nome_shopping, qtd_vaga_total, qtd_vaga_pcd, qtd_vaga_idoso, qtd_vaga_moto, qtd_vaga_vip, valor_diario_vaga, fkCliente)
VALUES
('Shopping Paulista', 500, 20, 30, 50, 15, 35.00, 1),
('Shopping Morumbi', 700, 25, 40, 70, 20, 40.00, 2);

INSERT INTO vaga
(tipo_vaga, setor_vaga, fkEstacionamento)
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

INSERT INTO sensor (fkVaga)
VALUES
(1),(2),(3),(4),(5),(6),(7),(8),(9),(10);

INSERT INTO registros
(registroSensor, fkSensor)
VALUES
(1,1),
(0,2),
(1,3),
(0,4),
(1,5),
(1,6),
(1,7),
(0,8),
(1,9),
(0,10);

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
JOIN registros r ON r.fkSensor = s.id_sensor
ORDER BY e.nome_shopping, v.setor_vaga;

SELECT
    e.nome_shopping,
    ROUND(
        (SUM(r.registroSensor = 1) / COUNT(v.id_vaga)) * 100,
        2
    ) AS taxa_ocupacao_percentual
FROM estacionamento e
JOIN vaga v ON v.fkEstacionamento = e.id_estacionamento
JOIN sensor s ON s.fkVaga = v.id_vaga
JOIN registros r ON r.fkSensor = s.id_sensor
GROUP BY e.id_estacionamento;

SELECT
    v.tipo_vaga,
    COUNT(v.id_vaga) AS total_tipo,
    SUM(r.registroSensor = 1) AS ocupadas,
    SUM(r.registroSensor = 0) AS livres
FROM vaga v
JOIN sensor s ON s.fkVaga = v.id_vaga
JOIN registros r ON r.fkSensor = s.id_sensor
GROUP BY v.tipo_vaga;

SELECT
    s.id_sensor,
    v.setor_vaga,
    r.dtHr_leitura,
    CASE
        WHEN r.registroSensor = 1 THEN 'Veículo Detectado'
        ELSE 'Sem Veículo'
    END AS leitura
FROM registros r
JOIN sensor s ON r.fkSensor = s.id_sensor
JOIN vaga v ON s.fkVaga = v.id_vaga
ORDER BY r.dtHr_leitura DESC;

SELECT
    f.nome_funcionario,
    f.email_funcionario,
    c.razao_social_empresa
FROM funcionario f
JOIN cliente c ON f.fkCliente = c.id_cliente;

SELECT
    c.razao_social_empresa,
    e.nome_shopping,
    e.qtd_vaga_total
FROM cliente c
JOIN estacionamento e ON e.fkCliente = c.id_cliente
WHERE c.id_cliente = 1;

SELECT
    HOUR(dtHr_leitura) AS hora,
    COUNT(*) AS total_leituras
FROM registros
GROUP BY HOUR(dtHr_leitura)
ORDER BY total_leituras DESC;

SELECT
    v.setor_vaga,
    COUNT(*) AS vezes_ocupada
FROM registros r
JOIN sensor s ON r.fkSensor = s.id_sensor
JOIN vaga v ON s.fkVaga = v.id_vaga
WHERE r.registroSensor = 1
GROUP BY v.id_vaga
ORDER BY vezes_ocupada DESC;

SELECT
    nome_shopping,
    qtd_vaga_total * valor_diario_vaga AS receita_maxima_diaria
FROM estacionamento;