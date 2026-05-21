var bobiaModel = require("../models/bobiaModel");


async function perguntar(req, res) {
    const pergunta = req.body.pergunta;
    try {
        const resultado = await bobiaModel.gerarResposta(pergunta)
        return res.json({ resultado });
    } catch (error) {
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
  perguntar
};