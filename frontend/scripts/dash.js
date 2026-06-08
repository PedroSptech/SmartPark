let myLineChart;
let myBarChart;

window.onload = function() {
    var idEstacionamento = sessionStorage.ID_USUARIO || 1
    inicializarGraficoBarras(idEstacionamento);
    obterDadosGraficoLinha(idEstacionamento); 
    obterDadosVagasOcupadas(idEstacionamento)
    obterTempoMedio(idEstacionamento)

    setInterval(function() {
        console.log("Atualizando o gráfico...");
        obterDadosGraficoLinha(idEstacionamento);
        obterDadosVagasOcupadas(idEstacionamento)
    }, 5000);
};

function obterDadosVagasOcupadas(idEstacionamento) {
    fetch(`/registros/ultimas/${idEstacionamento}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    plotarKpiOcupadas(resposta[resposta.length - 1]);
                });
            } else {
                console.log('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.log(`Erro na obtenção dos dados para o gráfico: ${error.message}`);
        });
}

function obterTempoMedio(idEstacionamento) {
    fetch(`/registros/tempo-medio/${idEstacionamento}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);
                    plotarTempoMedio(resposta[0 ]);
                });
            } else {
                console.log('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.log(`Erro na obtenção dos dados para o gráfico: ${error.message}`);
        });
}

function obterDadosGraficoLinha(idEstacionamento) {
    fetch(`/registros/ultimas/${idEstacionamento}`, { cache: 'no-store' })
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    plotarGraficoLinha(resposta, idEstacionamento);
                });
            } else {
                console.log('Nenhum dado encontrado ou erro na API');
            }
        })
        .catch(function (error) {
            console.log(`Erro na obtenção dos dados para o gráfico: ${error.message}`);
        });
}

function formatarData(date) {
    var ano = date.getFullYear();
                //retorna o mes de 0 a 11, por isso tem +1
    var mes = date.getMonth() + 1;
    if (mes < 10) {
        mes = "0" + mes;
    }

    var dia = date.getDate();
    if (dia < 10) {
        dia = "0" + dia;
    }

    return ano + "-" + mes + "-" + dia;
}

function labelDia(date) {
    var dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
                    //retorna um número de 0 a 6 do dia de hoje da semana
    return dias[date.getDay()];
}

function buscarFeriadoNaData(listaFeriados, dataAtual) {
    var feriadoEncontrado = null;

    for (var i = 0; i < listaFeriados.length; i++) {
        if (listaFeriados[i].date == dataAtual) {
            feriadoEncontrado = listaFeriados[i];
            break;
        }
    }

    return feriadoEncontrado;
}

function dataReferenciaHistorica(date, isFeriado) {
                   //interpola fazendo com que elas não sejam iguais se uma mudar 
    var novaData = new Date(date);
    //se for feriado pega o dado do ano passado se não do mês passado
    if (isFeriado) {
        novaData.setFullYear(novaData.getFullYear() - 1);
    } else {
        novaData.setMonth(novaData.getMonth() - 1);
    }

    return formatarData(novaData);
}

function processarProximosDias(idEstacionamento, proximosDias, listaFeriados, indice, labels, dados, cores, infoKpi) {
    if (indice >= proximosDias.length) {
        renderizarGraficoBarras(labels, dados, cores, infoKpi);
        return;
    }

    var dia = proximosDias[indice];
    var dataFormatada = formatarData(dia);
    var feriado = buscarFeriadoNaData(listaFeriados, dataFormatada);
    var dataRef = dataReferenciaHistorica(dia, feriado);

    fetch("/registros/historico/" + idEstacionamento + "/" + dataRef)
        .then(function (res) {
            if (res.ok) {
                res.json().then(function (json) {
                    var maximo = json.maximo_ocupacao;

                    if (maximo == null || maximo == undefined) {
                        dados.push(null);
                        labels.push(labelDia(dia));
                        cores.push('#e2e8f0');
                        infoKpi.push("Sem informacoes");
                        processarProximosDias(idEstacionamento, proximosDias, listaFeriados, indice + 1, labels, dados, cores, infoKpi);
                        return;
                    }

                    var label = labelDia(dia);
                    if (feriado) {
                        label = label + " (Feriado)";
                    }
                    labels.push(label);

                    if (maximo == 0) {
                        dados.push(null);
                    } else {
                        dados.push(maximo);
                    }

                    if (feriado) {
                        cores.push('#f59e0b');
                        infoKpi.push("Feriado: " + feriado.name + " - Pico ano passado: " + maximo + " vagas");
                    } else {
                        cores.push('#4466f2');
                        infoKpi.push("Pico mes passado (" + dataRef + "): " + maximo + " vagas");
                    }

                    processarProximosDias(idEstacionamento, proximosDias, listaFeriados, indice + 1, labels, dados, cores, infoKpi);
                });
            } else {
                labels.push(labelDia(dia));
                dados.push(null);
                cores.push('#e2e8f0');
                infoKpi.push("Sem informacoes");

                processarProximosDias(idEstacionamento, proximosDias, listaFeriados, indice + 1, labels, dados, cores, infoKpi);
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar historico: " + erro.message);

            labels.push(labelDia(dia));
            dados.push(null);
            cores.push('#e2e8f0');
            infoKpi.push("Sem informacoes");

            processarProximosDias(idEstacionamento, proximosDias, listaFeriados, indice + 1, labels, dados, cores, infoKpi);
        });
}


function plotarKpiOcupadas(resposta) {
    let kpi = document.getElementById("num-ocupacao")
    let card = document.getElementById("vagas-totais")
    let pctOcupacao = resposta.taxa_ocupacao
    kpi.innerText = pctOcupacao + "%"

   if (pctOcupacao <= 20) {
        card.className = "card vagas vagas-critico";
    } else if (pctOcupacao < 80) {
        card.className = "card";
    } else {
        card.className = "card vagas vagas-satisfatorio";
    }
}

function plotarTempoMedio(resposta) {
    let tempo_medi = resposta.tempo_medio_geral_minutos
    let kpi = document.getElementById("tempo-ocupacao")

   if (tempo_medi < 60) {
        kpi.innerText = `${tempo_medi} min`;
    } else {
        const horas = Math.floor(tempo_medi / 60);
        const minutosRestantes = tempo_medi % 60;

        if (minutosRestantes === 0) {
            kpi.innerText = `${horas}h`;
        } else {
            kpi.innerText = `${horas}h ${minutosRestantes}min`;
        }
    }
}

function plotarGraficoLinha(resposta, idEstacionamento) {
    console.log('Iniciando plotagem do gráfico de linhas...');

    let labelsGrafico = [];
    let dadosGrafico = [];

    for (let i = 0; i < resposta.length; i++) {
        let registro = resposta[i];
        
        labelsGrafico.push(registro.momento_grafico); 
        dadosGrafico.push(registro.taxa_ocupacao); 
    }

    const ctxLine = document.getElementById('lineChart').getContext('2d');
    const gradient = ctxLine.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(68, 102, 242, 0.3)');
    gradient.addColorStop(1, 'rgba(68, 102, 242, 0)');

    if (myLineChart) {
        //apaga os dados anteriores para poder plotar o novo
        myLineChart.destroy();
    }

    myLineChart = new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: labelsGrafico, 
            datasets: [{
                data: dadosGrafico, 
                borderColor: '#4466f2',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#4466f2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 100, ticks: { callback: v => v + '%' } },
                x: { grid: { display: false } }
            }
        }
    });
}


function inicializarGraficoBarras(idEstacionamento) {
    var idEst = idEstacionamento;
    var hoje = new Date();
    var anoAtual = hoje.getFullYear();
    var proximosDias = [];

    //Pega a data dos proximos 5 dias
    for (var i = 1; i <= 5; i++) {
        var d = new Date(hoje);
        //da +1 ao dia da data 
        d.setDate(hoje.getDate() + i);
        proximosDias.push(d);
    }

    //poderia ser feito com um json local de feriados 
    var listaFeriados = [];

    //Pega todos os feriados desse ano
    fetch("https://brasilapi.com.br/api/feriados/v1/" + anoAtual)
        .then(function (resAno) {
            resAno.json().then(function (feriadosAno) {
                for (var k = 0; k < feriadosAno.length; k++) {
                    listaFeriados.push(feriadosAno[k]);
                }

                //Pega todos os feriados do ano anterior
                fetch("https://brasilapi.com.br/api/feriados/v1/" + (anoAtual - 1))
                    .then(function (resAnoPassado) {
                        resAnoPassado.json().then(function (feriadosAnoPassado) {
                            for (var j = 0; j < feriadosAnoPassado.length; j++) {
                                listaFeriados.push(feriadosAnoPassado[j]);
                            }

                            //feriado de teste só para aparecer no grafico
                            listaFeriados.push({
                                date: "2026-06-09",
                                name: "Dia do Projeto em grupo",
                                type: "national"
                            });
                            
                            processarProximosDias(idEst, proximosDias, listaFeriados, 0, [], [], [], []);
                        });
                    })
                    .catch(function (erro) {
                        console.log("Erro ao buscar feriados ano passado: " + erro.message);
                        processarProximosDias(idEst, proximosDias, listaFeriados, 0, [], [], [], []);
                    });
            });
        })
        .catch(function (erro) {
            console.log("Erro ao buscar feriados: " + erro.message);
            processarProximosDias(idEst, proximosDias, listaFeriados, 0, [], [], [], []);
        });
}

function renderizarGraficoBarras(labels, dados, cores, infoKpi) {
    var ctxBar = document.getElementById('barChart').getContext('2d');

    if (myBarChart) {
        myBarChart.destroy();
    }

    myBarChart = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: dados,
                backgroundColor: cores,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            var i = context.dataIndex;
                            return infoKpi[i];
                        }
                    }
                }
            },
            scales: {
                y: {
                    display: true,
                    beginAtZero: true
                },
                x: { grid: { display: false } }
            }
        }
    });
}