const { GoogleGenAI } = require("@google/genai");

const chatIA = new GoogleGenAI({ apiKey: process.env.MINHA_CHAVE });

async function gerarResposta(mensagem) {
     try {
        const modeloIA = await chatIA.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${mensagem}`

        });
        const resposta = modeloIA.text;
        const tokens = modeloIA.usageMetadata;

        console.log(resposta);
        console.log("Uso de Tokens:", tokens);

        return resposta;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
  gerarResposta
};