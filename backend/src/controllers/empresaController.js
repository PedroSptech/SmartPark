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
  const cnpj = req.body.cnpjServer;
  const razaoSocial = req.body.razaoServer;
  const logradouro = req.body.logradouroServer;
  const cep = req.body.cepServer;
  const numero = req.body.numeroServer;
  const cidade = req.body.cidadeServer;
  const estado = req.body.estadoServer;
  const senha = req.body.senhaServer

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    const codigo = gerarCodigo() 

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

  function gerarCodigo() {
      const alphabet = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ];

      let cnpj_split = cnpj.split('')
      let code = cnpj_split.slice(-3)

      for(let i = 0; i < 3; i++) {
        code.push(alphabet[Math.floor(Math.random() * alphabet.length)])
      } 
      return code.join('')
    }
}

module.exports = {
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
};
