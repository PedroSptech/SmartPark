var database = require("../database/config");

function buscarUltimasMedidas(idEstacionamento, limite_linhas) {
    // RAND() -> (Tipo o random{valores entre 0 e 0.999}) Simula a ocupação da vagas 
    // Se o seu sensor real for 1 (ocupado), gera um valor entre 70% e 95%
    // Se o seu sensor real for 0 (livre), gera um valor entre 20% e 45%
    var instrucaoSql = `
        SELECT 
            CASE 
                WHEN r.registroSensor = 1 THEN FLOOR(70 + (RAND() * 25))
                ELSE FLOOR(20 + (RAND() * 25))
            END AS taxa_ocupacao, 
            DATE_FORMAT(r.dtHr_leitura, '%H:%i:%s') AS momento_grafico
        FROM registros r
        JOIN sensor s ON r.fkSensor = s.id_sensor
        JOIN vaga v ON s.fkVaga = v.id_vaga
        WHERE v.fkEstacionamento = ${idEstacionamento}
        ORDER BY r.id_registro DESC 
        LIMIT ${limite_linhas};
    `;
    console.log("Executando a instrução SQL (Com Simulação): \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarMedidasEmTempoReal(idEstacionamento) {
    var instrucaoSql = `
        SELECT 
            CASE 
                WHEN r.registroSensor = 1 THEN FLOOR(70 + (RAND() * 25))
                ELSE FLOOR(20 + (RAND() * 25))
            END AS taxa_ocupacao, 
            DATE_FORMAT(r.dtHr_leitura, '%H:%i:%s') AS momento_grafico
        FROM registros r
        JOIN sensor s ON r.fkSensor = s.id_sensor
        JOIN vaga v ON s.fkVaga = v.id_vaga
        WHERE v.fkEstacionamento = ${idEstacionamento}
        ORDER BY r.id_registro DESC 
        LIMIT 1;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal
};