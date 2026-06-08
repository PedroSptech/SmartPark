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

function buscarMaximoPorData(idEstacionamento, data) {
    var instrucaoSql = `
        SELECT 
            MAX(vagas_ocupadas) AS maximo_ocupacao
        FROM (
            SELECT 
                DATE(r.dtHr_leitura) AS dia,
                SUM(r.registroSensor) AS vagas_ocupadas
            FROM registros r
            JOIN sensor s ON r.fkSensor = s.id_sensor
            JOIN vaga v ON s.fkVaga = v.id_vaga
            WHERE v.fkEstacionamento = ${idEstacionamento}
              AND DATE(r.dtHr_leitura) = '${data}'
            GROUP BY r.dtHr_leitura
        ) AS sub;
    `;

    console.log("Executando SQL buscarMaximoPorData:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarVagasPorSetor(idEstacionamento) {
    var instrucaoSql = `
        SELECT
            v.setor_vaga AS setor,
            v.tipo_vaga,
            COUNT(v.id_vaga)              AS total_vagas,
            SUM(r.registroSensor)         AS vagas_ocupadas,
            ROUND(
                SUM(r.registroSensor) / COUNT(v.id_vaga) * 100
            , 0)                          AS taxa_ocupacao
        FROM vaga v
        JOIN sensor s ON s.fkVaga = v.id_vaga
        JOIN (
            SELECT fkSensor, registroSensor
            FROM registros
            WHERE id_registro IN (
                SELECT MAX(id_registro) FROM registros GROUP BY fkSensor
            )
        ) r ON r.fkSensor = s.id_sensor
        WHERE v.fkEstacionamento = ${idEstacionamento}
        GROUP BY v.setor_vaga, v.tipo_vaga
        ORDER BY v.setor_vaga;
    `;
    console.log("Executando SQL buscarVagasPorSetor:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarTempoMedio(idEstacionamento) {
   var instrucaoSql = `
        SELECT 
            e.nome_shopping,
            ROUND(AVG(TIMESTAMPDIFF(MINUTE, entrada.dtHr_leitura, saida.dtHr_leitura)), 2) AS tempo_medio_geral_minutos
        FROM registros entrada
        JOIN sensor s ON entrada.fkSensor = s.id_sensor
        JOIN vaga v ON s.fkVaga = v.id_vaga
        JOIN estacionamento e ON v.fkEstacionamento = e.id_estacionamento
        JOIN registros saida ON saida.fkSensor = entrada.fkSensor 
                            AND saida.registroSensor = 0 
                            AND saida.dtHr_leitura > entrada.dtHr_leitura
        WHERE entrada.registroSensor = 1
        AND e.id_estacionamento = ${idEstacionamento} 
        AND saida.dtHr_leitura = (
            SELECT MIN(r_aux.dtHr_leitura)
            FROM registros r_aux
            WHERE r_aux.fkSensor = entrada.fkSensor
                AND r_aux.registroSensor = 0
                AND r_aux.dtHr_leitura > entrada.dtHr_leitura
        )
        GROUP BY e.nome_shopping;
    `;
    console.log("Executando SQL buscarVagasPorSetor:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarUltimasMedidas,
    buscarMedidasEmTempoReal,
    buscarMaximoPorData,
    buscarVagasPorSetor,
    buscarTempoMedio
};