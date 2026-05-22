var empresaModel = require("../models/empresaModel");

function buscarPorCnpj(req, res) {
  var cnpj = req.query.cnpj;

  empresaModel.buscarPorCnpj(cnpj).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function listar(_, res) {
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

function autenticar(req, res) {
  const cnpj = req.body.cnpjServer
  const senha = req.body.senhaServer

  if (cnpj == undefined) {
    return res.status(400).send("Seu cnpj está undefined!");
  } else if (senha == undefined) {
    return res.status(400).send("Sua senha está indefinida!");
  } else {
    empresaModel.autenticar(cnpj, senha)
      .then(
        function (resultadoAutenticar) {
          if (resultadoAutenticar.length == 1) {
            console.log(resultadoAutenticar);

            return res.json({
              id: resultadoAutenticar[0].empresa_id,
              nome: resultadoAutenticar[0].nome,
              codigo: resultadoAutenticar[0].codigo,
            });
          } else if (resultadoAutenticar.length == 0) {
            return res.status(403).send("Cnpj e/ou senha inválido(s)");
          }
        }
      )
  }
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
      return res
        .status(401)
        .json({ mensagem: `a empresa com o cnpj ${cnpj} já existe` });
    } else {
      empresaModel.cadastrar(razaoSocial, cnpj, codigo, logradouro, numero, cidade, estado, cep, senha).then((resultado) => {
        return res.status(201).json(resultado);
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

    for (let i = 0; i < 3; i++) {
      code.push(alphabet[Math.floor(Math.random() * alphabet.length)])
    }
    return code.join('')
  }
}

function buscarPerfil(req, res) {
  var idEmpresa = req.params.idEmpresa;

  if (idEmpresa == undefined) {
    return res.status(400).send("ID da empresa está undefined!");
  }

  let dadosPerfil = {};
  empresaModel.buscarDadosPerfil(idEmpresa).then((resEmpresa) => {
    dadosPerfil.empresa = resEmpresa[0];

    empresaModel.buscarEstacionamentos(idEmpresa).then((resEstacionamentos) => {
      dadosPerfil.estacionamentos = resEstacionamentos;

      empresaModel.buscarFuncionarios(idEmpresa).then((resFuncionarios) => {
        dadosPerfil.funcionarios = resFuncionarios;
        console.log(dadosPerfil)
        res.status(200).json(dadosPerfil);
      });
    });
  }).catch((erro) => {
    console.log(erro);
    res.status(500).json(erro.sqlMessage);
  });
}

module.exports = {
  autenticar,
  buscarPorCnpj,
  buscarPorId,
  cadastrar,
  listar,
  buscarPerfil
};
