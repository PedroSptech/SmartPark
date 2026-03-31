/*
	
    Comentado com as alterações

	> Pontos a destacar:        
        
    
*/

CREATE DATABASE smart_park;
USE smart_park;

CREATE TABLE funcionario( /* funcionário */
	id_usuario INT PRIMARY KEY AUTO_INCREMENT, /* TABELA PODE TER AUTO-RELACIONAMENTO PARA GESTOR*/
	nome_funcionario VARCHAR(45) NOT NULL,
	email_funcionario VARCHAR(254) NOT NULL, /* Alterei o varchar, email pode ter até 254 caracteres */
	senha_usuario VARCHAR(16) NOT NULL, /* É de se analisar esse VARCHAR() */
	nivel_acesso_usuario VARCHAR(20), -- Apagar usuário comum
	-- CONSTRAINT Cnivel_acesso_usuario CHECK(nivel_acesso_usuario IN('Administrador','Cliente','Usuário Comum')) -- Apagar usuário comum.
	fkCliente INT, /* fkEmpresa, para saber de qual empresa é o funcionário */
	CONSTRAINT ctFkCliente
	FOREIGN KEY (fkCliente) REFERENCES cliente(id_cliente),
    fkGestor INT, -- AUTO RELACIONAMENTO
    CONSTRAINT ctFkGestor
	FOREIGN KEY (fkGestor) REFERENCES funcionario(id_usuario)
);

CREATE TABLE cliente(
	id_cliente INT PRIMARY KEY AUTO_INCREMENT, 
    cnpj_empresa CHAR(14) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,  -- perguntar para o brandão e a julia se é preciso incluir uma tabela endereço ou pode deixar assim
    numero_logradouro INT NOT NULL,
    cidade VARCHAR(40) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep CHAR(8) NOT NULL,
	razao_social_empresa VARCHAR(40) NOT NULL,
    dtHr_cadastro DATETIME DEFAULT NOW() -- o que é isso?
);

CREATE TABLE estacionamento( /*  */
	id_estacionamento INT PRIMARY KEY AUTO_INCREMENT, /* id_estacionamento */ 
    nome_shopping VARCHAR(40) NOT NULL,
    qtd_vaga_total INT NOT NULL,
    qtd_vaga_pcd INT,
    qtd_vaga_idoso INT,
    qtd_vaga_moto INT,
    qtd_vaga_vip INT,
    CONSTRAINT cQtd_vagas
    CHECK (qtd_vaga_pcd + qtd_vaga_idoso + qtd_vaga_moto + qtd_vaga_vip <= qtd_vaga_total),
    valor_diario_vaga DECIMAL(4,2) NOT NULL,
	fkCliente INT NOT NULL, /* fkCliente   1:N   */ 
	CONSTRAINT ctfkClienteEstacionamento
	FOREIGN KEY (fkCliente) REFERENCES cliente(id_cliente)
);

CREATE TABLE vaga(
	id_vaga INT PRIMARY KEY AUTO_INCREMENT,
    tipo_vaga VARCHAR(20), 
    setor_vaga VARCHAR(10), -- S1-02
    /* status_atual VARCHAR(15),*/ -- É DE SE PENSAR EM CRIAR UMA TABELA VAGA_STATUS ou usar o STATUS na tabela sensor e não aqui
    CONSTRAINT cTipo CHECK(tipo_vaga IN('Comum', 'PCD', 'Idoso', 'Moto', 'VIP')),
    CONSTRAINT cStatus CHECK(status_atual IN('Livre', 'Ocupada')), /* essa check de Status é para ser na tabela sensor */
	fkEstacionamento INT NOT NULL, /* fkEstacionamento   1:N   */
	CONSTRAINT ctFkEstacionamentoVaga
	FOREIGN KEY (fkEstacionamento) REFERENCES estacionamento(id_estacionamento)
);

CREATE TABLE sensor( /* E os registros do sensor tão aonde? Inserir informações mais detalhadas do sensor, dos dados capturados */
	id_sensor INT PRIMARY KEY AUTO_INCREMENT,
    modelo_sensor CHAR(5) DEFAULT 'LM393', /* para que modelo sensor se é um único sensor sempre? e da onde tiraram LM393? */
    /*status_conexao VARCHAR(20),*/
    CONSTRAINT cStatusSensor CHECK (status_conexao IN ('Ativo', 'Inativo')),
    fkVaga INT UNIQUE NOT NULL, -- Isso pensando que só usaremos sensores em vagas | 1:1
	FOREIGN KEY (fkVaga) REFERENCES vaga(id_vaga)
);

CREATE TABLE registros(
	id_registro INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	dtHr_leitura DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, -- IMPORTANTE DISCUTIR ESSA QUESTÃO DE DATA - HORA DO REGISTRO
    registroSensor TINYINT(1)
	CHECK (registroSensor IN (0,1)), /* check para verificar valores do sensor (0 ou 1) */
	/* hrLeitura_Entrada TIME DEFAULT NOW() NOT NULL,
    hrLeitura_Saida TIME DEFAULT NOW() NOT NULL, */ -- acho que não faz sentido ter hrLeitura_Entrada e Saida no mesmo registro.
    fkSensor INT,
    CONSTRAINT ctFkSensor
    FOREIGN KEY (fkSensor) REFERENCES sensor(id_sensor)
);

/* CREATE TABLE vaga_status (
    id_status INT PRIMARY KEY AUTO_INCREMENT,
    status_vaga TINYINT(1) NOT NULL, 
    -- 0 = Livre | 1 = Ocupada
    dtHr_status DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cStatusVaga CHECK (status_vaga IN (0,1)),
	fkVaga INT NOT NULL,
    fkSensor INT, -- acho que opcional, mas de se pensar
    FOREIGN KEY (fkVaga) REFERENCES vaga(id_vaga),
    FOREIGN KEY (fkSensor) REFERENCES sensor(id_sensor)
); */

INSERT INTO usuario (nome_usuario, email_usuario, senha_usuario, nivel_acesso_usuario) VALUES 
('Ricardo Souza', 'ricardo.s@email.com', 'ric12345', 'Administrador'),
('Beatriz Lima', 'bealima@email.com', 'bea88776', 'Cliente'),
('Marcos Rocha', 'mrocha@email.com', 'marcos12', 'Usuário Comum'),
('Fernanda Dias', 'fer.dias@email.com', 'fe2024pt', 'Cliente'),
('Thiago Silva', 'thiago.s@email.com', 'th991122', 'Usuário Comum'),
('Juliana Costa', 'ju.costa@email.com', 'juju1020', 'Cliente'),
('Roberto Alves', 'roberto@email.com', 'adm_rob1', 'Administrador'),
('Patrícia Melo', 'patri.m@email.com', 'paty4455', 'Usuário Comum'),
('Lucas Nunes', 'lucas.n@email.com', 'lnunes01', 'Cliente'),
('Carla Mendes', 'carla.m@email.com', 'cm2023xx', 'Cliente');

INSERT INTO empresa (razao_social_empresa, cnpj_empresa, logradouro, numero_logradouro, cidade, estado, cep) VALUES 
('Park Solution S.A.', '11222333000101', 'Rua Augusta', 100, 'São Paulo', 'SP', '01305000'),
('Geral Park LTDA', '44555666000102', 'Av. das Américas', 500, 'Rio de Janeiro', 'RJ', '22631000'),
('Sul Estacionar', '77888999000103', 'Rua dos Andradas', 10, 'Porto Alegre', 'RS', '90020000'),
('Nordeste Vagas', '10111213000104', 'Av. Boa Viagem', 1200, 'Recife', 'PE', '51021000'),
('Centro-Oeste Park', '14151617000105', 'Setor Comercial Sul', 30, 'Brasília', 'DF', '70300000'),
('Minas Park', '18192021000106', 'Av. Afonso Pena', 450, 'Belo Horizonte', 'MG', '30130001'),
('Catarina Park', '22232425000107', 'Rua Bocaiúva', 88, 'Florianópolis', 'SC', '88015530'),
('Amazonas Estac.', '26272829000108', 'Rua Maceió', 200, 'Manaus', 'AM', '69057010'),
('Bahia Vagas', '30313233000109', 'Av. Sete de Setembro', 77, 'Salvador', 'BA', '40060001'),
('Goias Park', '34353637000110', 'Rua 9', 150, 'Goiânia', 'GO', '74110100');

INSERT INTO shopping (razao_social_empresa, nome_shopping, qtd_vaga_total, qtd_vaga_pcd, qtd_vaga_idoso, qtd_vaga_moto, qtd_vaga_vip, valor_diario_vaga) VALUES 
('Park Solution S.A.', 'Shopping SP Center', 400, 10, 10, 40, 5, 25.00),
('Geral Park LTDA', 'Rio Plaza Mall', 600, 15, 15, 60, 10, 30.00),
('Sul Estacionar', 'Shopping dos Pampas', 300, 8, 8, 30, 4, 18.00),
('Nordeste Vagas', 'Recife Garden Shopping', 500, 12, 12, 50, 8, 20.00),
('Centro-Oeste Park', 'Brasília Park', 800, 20, 20, 80, 15, 35.00),
('Minas Park', 'BH Square', 450, 11, 11, 45, 6, 22.50),
('Catarina Park', 'Floripa Seaside', 350, 9, 9, 35, 5, 24.00),
('Amazonas Estac.', 'Manaus Urban Mall', 250, 6, 6, 25, 3, 15.00),
('Bahia Vagas', 'Salvador Mar Shopping', 700, 18, 18, 70, 12, 28.00),
('Goias Park', 'Goiânia Prime Center', 550, 14, 14, 55, 10, 21.00);

INSERT INTO vaga (id_shopping, tipo_vaga, setor_vaga, status_atual) VALUES 
(1, 'Comum', 'A1-01', 'Livre'),
(2, 'PCD', 'B2-02', 'Ocupada'),
(3, 'Idoso', 'C1-03', 'Livre'),
(4, 'Moto', 'D2-04', 'Livre'),
(5, 'VIP', 'E4-05', 'Ocupada'),
(6, 'Comum', 'F1-06', 'Livre'),
(7, 'PCD', 'G6-07', 'Ocupada'),
(8, 'Idoso', 'H1-08', 'Livre'),
(9, 'Moto', 'I8-09', 'Ocupada'),
(10, 'Comum', 'J1-10', 'Livre');

INSERT INTO sensor (id_vaga, status_conexao) VALUES 
(1, 'Inativo'),
(2, 'Ativo'),   
(3, 'Inativo'),
(4, 'Inativo'),
(5, 'Ativo'),
(6, 'Inativo'),
(7, 'Ativo'),
(8, 'Inativo'),
(9, 'Ativo'),
(10, 'Inativo');


SELECT 
    nome_shopping AS 'Nome do Shopping',
    razao_social_empresa AS 'Empresa Responsável',
    valor_diario_vaga AS 'Ticket Médio (R$)',
    CASE
        WHEN valor_diario_vaga >= 30.00 THEN 'Ticket Alto'
        WHEN valor_diario_vaga BETWEEN 20.00 AND 29.99 THEN 'Ticket Intermediário'
        ELSE 'Ticket Baixo'
    END AS 'Classificação do Ticket'
FROM shopping
ORDER BY valor_diario_vaga DESC;


SELECT
	id_sensor AS 'Número do Sensor',
	modelo_sensor AS 'Modelo do Sensor',
	CASE
		WHEN status_conexao = 'Ativo' THEN 'Bloqueado'
		ELSE 'Livre'
    END AS 'Status Atualizado'
FROM sensor;