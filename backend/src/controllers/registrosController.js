var registrosModel = require("../models/registrosModel");

function buscarUltimasMedidas(req, res) {
    //ultimos 12 registros capturados
    const limite_linhas = 12; 
    var idEstacionamento = req.params.idEstacionamento;

    registrosModel.buscarUltimasMedidas(idEstacionamento, limite_linhas)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado.reverse());
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar as últimas medidas.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarMedidasEmTempoReal(req, res) {
    var idEstacionamento = req.params.idEstacionamento;

    registrosModel.buscarMedidasEmTempoReal(idEstacionamento)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar a medida em tempo real.", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarMaximoPorData(req, res) {
    var idEstacionamento = req.params.idEstacionamento;
    var data = req.params.data;

    registrosModel.buscarMaximoPorData(idEstacionamento, data)
        .then(function (resultado) {
            res.status(200).json(resultado[0]);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

function buscarVagasPorSetor(req, res) {
    var idEstacionamento = req.params.idEstacionamento;

    registrosModel.buscarVagasPorSetor(idEstacionamento)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum dado de setor encontrado.");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    buscarMaximoPorData,
    buscarVagasPorSetor
};