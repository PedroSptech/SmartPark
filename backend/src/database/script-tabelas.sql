

WITH HistoricoVagas AS (
    SELECT 
        e.nome_shopping,
        r.registroSensor AS status_atual,
        r.dtHr_leitura AS hr_entrada,
        LEAD(r.dtHr_leitura) OVER (PARTITION BY r.fkSensor ORDER BY r.dtHr_leitura) AS hr_saida,
        LEAD(r.registroSensor) OVER (PARTITION BY r.fkSensor ORDER BY r.dtHr_leitura) AS status_seguinte
    FROM registros r
    JOIN sensor s ON r.fkSensor = s.id_sensor
    JOIN vaga v ON s.fkVaga = v.id_vaga
    JOIN estacionamento e ON v.fkEstacionamento = e.id_estacionamento
)
SELECT 
    nome_shopping,
    ROUND(AVG(TIMESTAMPDIFF(MINUTE, hr_entrada, hr_saida)), 2) AS tempo_medio_geral_minutos
FROM HistoricoVagas
WHERE status_atual = 1 AND status_seguinte = 0 AND hr_saida IS NOT NULL
GROUP BY nome_shopping
ORDER BY tempo_medio_geral_minutos DESC;