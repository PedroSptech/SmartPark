var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(req, res) {
  empresaModel.listar().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function buscarPorId(req, res) {
  var id = req.params.id;

  empresaModel.buscarPorId(id).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function cadastrar(req, res) {
  var cnpj = req.body.cnpjServer;
  var razaoSocial = req.body.razaoServer;
  var logradouro = req.body.logradouroServer;
  var cep = req.body.cepServer;
  var codigo = req.body.codigoServer; 
  var numero = req.body.numeroServer;
  var cidade = req.body.cidadeServer;
  var estado = req.body.estadoServer;
  var senha = req.body.senhaServer

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    // TODO: FAZER FUNÇÂO PARA GERAR CODIGO DE EMPRESA
    if (resultado.length > 0) {
      res
        .status(401)
        .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
    } else {
      empresaModel.cadastrar(razaoSocial, cnpj, codigo, logradouro, numero, cidade, estado, cep, senha).then((resultado) => {
        res.status(201).json(resultado);
      });
    }
  });
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
};
