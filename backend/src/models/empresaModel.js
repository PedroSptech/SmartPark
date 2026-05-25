var database = require("../database/config");

function buscarPorId(id) {
	var instrucaoSql = `SELECT * FROM empresa WHERE id = '${id}'`;

	return database.executar(instrucaoSql);
}

function listar() {
	var instrucaoSql = `SELECT id_cliente, razao_social_empresa, cnpj_empresa, codigo_ativacao FROM cliente`;

	return database.executar(instrucaoSql);
}

function buscarPorCnpj(cnpj) {
	var instrucaoSql = `SELECT * FROM cliente WHERE cnpj_empresa = '${cnpj}'`;

	return database.executar(instrucaoSql);
}

function autenticar(cnpj, senha) {
	var instrucaoSql = `
			SELECT 
				id_cliente as empresa_id, 
				razao_social_empresa nome, 
				codigo_ativacao as codigo
			FROM cliente 
			WHERE cnpj_empresa = '${cnpj}' AND senha_cliente = '${senha}';
	`;

	return database.executar(instrucaoSql);
}

function cadastrar(
	razaoSocial,
	cnpj,
	codigo,
	logradouro,
	numero_logradouro,
	cidade,
	estado,
	cep,
	senha,
) {
	var instrucaoSql = `
  INSERT INTO cliente
  (cnpj_empresa, codigo_ativacao, logradouro,
   numero_logradouro, cidade, estado, cep, razao_social_empresa, senha_cliente)
  VALUES 
  ('${cnpj}',  '${codigo}', '${logradouro}', '${numero_logradouro}', '${cidade}', '${estado}', '${cep}','${razaoSocial}', '${senha}')`;

	return database.executar(instrucaoSql);
}

function cadastrarFuncionario(nome, email, senha, id_cliente) {
	var instrucaoSql = `
		INSERT INTO funcionario
			(nome_funcionario, email_funcionario, senha_funcionario, fkCliente)
		VALUES
			('${nome}', '${email}', '${senha}', ${id_cliente});
	`

	return database.executar(instrucaoSql)
}

function buscarDadosPerfil(idEmpresa) {
	var instrucaoSql = `
		SELECT razao_social_empresa, cnpj_empresa
		FROM cliente
		WHERE id_cliente = ${idEmpresa};
	`;
	return database.executar(instrucaoSql);
}



function buscarEstacionamentos(idEmpresa) {
	var instrucaoSql = `
        SELECT e.id_estacionamento, e.nome_shopping, e.qtd_vaga_total, c.logradouro, c.numero_logradouro 
        FROM estacionamento e
        JOIN cliente c ON e.fkCliente = c.id_cliente
        WHERE c.id_cliente = ${idEmpresa};
    `;
	return database.executar(instrucaoSql);
}

function buscarFuncionarios(idEmpresa) {
	var instrucaoSql = `
        SELECT f.nome_funcionario, f.email_funcionario, c.razao_social_empresa as local_trabalho 
        FROM funcionario f
        JOIN cliente c ON f.fkCliente = c.id_cliente
        WHERE c.id_cliente = ${idEmpresa};
    `;
	return database.executar(instrucaoSql);
}

module.exports = {
	buscarPorCnpj,
	buscarPorId,
	cadastrar,
	listar,
	autenticar,
	buscarDadosPerfil,
	buscarEstacionamentos,
	buscarFuncionarios,
	cadastrarFuncionario
};
