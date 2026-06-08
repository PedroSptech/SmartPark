var express = require("express");
var router = express.Router();

var registrosController = require("../controllers/registrosController");

router.get("/ultimas/:idEstacionamento", function (req, res) {
    registrosController.buscarUltimasMedidas(req, res);
});

router.get("/tempo-real/:idEstacionamento", function (req, res) {
    registrosController.buscarMedidasEmTempoReal(req, res);
});

router.get("/historico/:idEstacionamento/:data", function (req, res) {
    registrosController.buscarMaximoPorData(req, res);
});

router.get("/setor/:idEstacionamento", function (req, res) {
    registrosController.buscarVagasPorSetor(req, res);
});

module.exports = router;