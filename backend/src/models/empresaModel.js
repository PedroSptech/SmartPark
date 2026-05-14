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

module.exports = { buscarPorCnpj, buscarPorId, cadastrar, listar, autenticar };
