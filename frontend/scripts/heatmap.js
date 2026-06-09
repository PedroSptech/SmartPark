const ID_ESTACIONAMENTO = 1;

const URL_SETOR = `http://localhost:80/registros/setor/${ID_ESTACIONAMENTO}`;

// Intervalo de atualização automática em milissegundos
const INTERVALO_ATUALIZACAO_MS = 10000;

// mapa de posições

// valores xp/yp: posição percentual (0–100) dentro do canvas

const POSICOES_SETOR = {
    'A1': { xp: 17, yp: 15 },
    'A2': { xp: 40, yp: 15 },
    'A3': { xp: 62, yp: 15 },
    // 'A4':  { xp: 78, yp: 28 },
    'B1': { xp: 17, yp: 80 },
    'B2': { xp: 40, yp: 80 },
    'B3': { xp: 62, yp: 80 },
    // 'B4':  { xp: 78, yp: 72 },
    'C1': { xp: 94, yp: 35 },
    'C2': { xp: 94, yp: 65 },
};

//   setor - 'A1'
//   xp / yp - posição percentual (vem de POSICOES_SETOR)
//   taxa_ocupacao - percentual geral do setor (usado para cor e label)
//   tipos - array com breakdown por tipo de vaga
//   cada item: { tipo_vaga, total_vagas, vagas_ocupadas, taxa_ocupacao }

let SETORES_DADOS = [];

let chartHeatmap = null;

// fetch agrupando por setor

//   [
//     { setor:'A1', tipo_vaga:'Comum',  total_vagas:2, vagas_ocupadas:2, taxa_ocupacao:100 },
//     { setor:'A1', tipo_vaga:'PCD',    total_vagas:1, vagas_ocupadas:1, taxa_ocupacao:100 },
//     { setor:'A1', tipo_vaga:'VIP',    total_vagas:1, vagas_ocupadas:0, taxa_ocupacao:0   },
//     { setor:'B1', tipo_vaga:'Comum',  total_vagas:2, vagas_ocupadas:1, taxa_ocupacao:50  }
//   ]

//   {
//     A1: { totalGeral:4, ocupadasGeral:3, tipos:[...] },
//     B1: { totalGeral:2, ocupadasGeral:1, tipos:[...] },
//   }

// SETORES_DADOS cruzando com POSICOES_SETOR.

async function buscarDadosSetor() {
    try {
        const resposta = await fetch(URL_SETOR);

        // sem registros
        if (resposta.status === 204) {
            console.warn("Nenhum dado de setor retornado pelo servidor.");
            return;
        }

        if (!resposta.ok) {
            console.error("Erro na requisição:", resposta.status);
            return;
        }

        // linhas vindas do banco
        const linhas = await resposta.json();

        // cada chave do objeto é um setor ('A1', 'B1')
        const agrupado = {};

        linhas.forEach(function (linha) {
            const setor = linha.setor; // ex: 'A1'

            if (!agrupado[setor]) {
                agrupado[setor] = {
                    totalGeral: 0,
                    ocupadasGeral: 0,
                    tipos: []
                };
            }

            // total geral e ocupada geral de cada setor
            agrupado[setor].totalGeral += Number(linha.total_vagas);
            agrupado[setor].ocupadasGeral += Number(linha.vagas_ocupadas);

            // guardar tipos de vaga para colocar no painel lateral
            agrupado[setor].tipos.push({
                tipo_vaga: linha.tipo_vaga,
                total_vagas: Number(linha.total_vagas),
                vagas_ocupadas: Number(linha.vagas_ocupadas),
                taxa_ocupacao: Number(linha.taxa_ocupacao)
            });
        });

        // setores dados cruzando com posicoes setor
        SETORES_DADOS = Object.keys(agrupado)
            .filter(function (setor) {
                // ignora setores sem posição mapeada
                return POSICOES_SETOR[setor] !== undefined;
            })
            .map(function (setor) {
                const grupo = agrupado[setor];
                const pos = POSICOES_SETOR[setor];
                console.log(pos);


                const taxaGeral = grupo.totalGeral === 0
                    ? 0
                    : Math.round((grupo.ocupadasGeral / grupo.totalGeral) * 100);

                return {
                    setor: setor,                   // 'A1'
                    xp: pos.xp,                  // posição x% no canvas
                    yp: pos.yp,                  // posição y% no canvas
                    taxa_ocupacao: taxaGeral,               // número 0–100
                    totalGeral: grupo.totalGeral,
                    ocupadasGeral: grupo.ocupadasGeral,
                    tipos: grupo.tipos              // breakdown por tipo
                };
            });

    } catch (erro) {
        console.error("Falha ao buscar dados do setor:", erro);
    }
}

// getColor retorna a cor da bolha baseada na taxa de ocupação

function getColor(taxa, alpha) {
    alpha = alpha !== undefined ? alpha : 0.82;
    if (taxa > 80) return `rgba(226, 75, 74, ${alpha})`;   // vermelho — crítico
    if (taxa > 50) return `rgba(245, 166, 35, ${alpha})`;  // amarelo  — alerta
    return `rgba(46, 204, 113, ${alpha})`;         // verde    — normal
}

// PLOTAR: cria o Chart.js pela primeira vez
//
// cada setor uma bolha no gráfico
//   x, y - posição no canvas (0–100)
//   r - raio fixo 35 (pode ser proporcional a total_vagas no futuro)
//   v - taxa_ocupacao (usado pelo tooltip e pela cor)

function plotarMapa() {
    const canvas = document.getElementById('heatmapChart');
    const ctx = canvas.getContext('2d');

    const bubbleData = SETORES_DADOS.map(function (s) {
        return {
            x: s.xp,
            y: s.yp,
            r: 35,
            v: s.taxa_ocupacao,
            setor: s.setor,
            tipos: s.tipos,
            totalGeral: s.totalGeral,
            ocupadasGeral: s.ocupadasGeral
        };
    });

    chartHeatmap = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                data: bubbleData,
                backgroundColor: bubbleData.map(function (d) { return getColor(d.v, 0.82); }),
                borderColor: bubbleData.map(function (d) { return getColor(d.v, 1); }),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { display: false, min: 0, max: 100 },
                y: { display: false, min: 0, max: 100 }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        // Linha principal: nome do setor e taxa geral
                        label: function (ctx) {
                            const d = ctx.raw;
                            return `Setor ${d.setor}: ${d.v}% ocupado (${d.ocupadasGeral}/${d.totalGeral})`;
                        },
                        // Linhas extras: breakdown por tipo de vaga
                        afterLabel: function (ctx) {
                            const d = ctx.raw;
                            return d.tipos.map(function (t) {
                                return `  ├ ${t.tipo_vaga}: ${t.vagas_ocupadas}/${t.total_vagas} vagas`;
                            });
                        }
                    }
                }
            },

            onClick: function (evento, elementos) {
                if (!elementos || elementos.length === 0) return;
                const indice = elementos[0].index;
                const dado = chartHeatmap.data.datasets[0].data[indice];
                const setor = SETORES_DADOS.find(function (s) { return s.setor === dado.setor; });
                if (setor) {
                    setorSelecionado = setor.setor;
                    preencherCardSetor(setor);
                }
            }
        }
    });
}

function atualizarMapa() {
    if (!chartHeatmap) return; // ainda não foi plotado

    const bubbleData = SETORES_DADOS.map(function (s) {
        return {
            x: s.xp,
            y: s.yp,
            r: 35,
            v: s.taxa_ocupacao,
            setor: s.setor,
            tipos: s.tipos,
            totalGeral: s.totalGeral,
            ocupadasGeral: s.ocupadasGeral
        };
    });

    // substitui os dados e recalcula as cores
    chartHeatmap.data.datasets[0].data = bubbleData;
    chartHeatmap.data.datasets[0].backgroundColor = bubbleData.map(function (d) { return getColor(d.v, 0.82); });
    chartHeatmap.data.datasets[0].borderColor = bubbleData.map(function (d) { return getColor(d.v, 1); });

    chartHeatmap.update();
}


function preencherCardSetor(setor) {
    document.getElementById('kpi-vazio').style.display = 'none';
    document.getElementById('kpi-detalhe').style.display = 'block';

    const banner = document.getElementById('kpi-banner-setor');
    banner.className = 'card-alerta';
    if (setor.taxa_ocupacao > 80) banner.classList.add('alerta-vermelho');
    else if (setor.taxa_ocupacao > 50) banner.classList.add('alerta-amarelo');
    else banner.classList.add('alerta-verde');

    document.getElementById('kpi-nome-setor').textContent = 'Setor ' + setor.setor;
    document.getElementById('kpi-taxa-geral').textContent =
        setor.taxa_ocupacao + '% ocupado · ' + setor.ocupadasGeral + '/' + setor.totalGeral + ' vagas';

    const lista = document.getElementById('kpi-lista-tipos');
    lista.innerHTML = '';

    setor.tipos.forEach(function (t) {
        const cfg = TIPO_CONFIG[t.tipo_vaga] || { cor: '#888' };
        const pct = t.total_vagas === 0 ? 0 : Math.round(t.vagas_ocupadas / t.total_vagas * 100);

        const div = document.createElement('div');
        div.className = 'card-alerta';
        div.style.background = cfg.cor;
        div.style.borderLeft = `6px solid ${cfg.cor}`;
        div.style.padding = '8px 14px';

        div.innerHTML = `
            <div class="alerta-texto" style="flex:1; display:flex; align-items:center; gap:8px">
                <span style="font-size:0.8rem; min-width:48px">${t.tipo_vaga}</span>
                <div class="kpi-barra-wrap">
                    <div class="kpi-barra" style="width:${pct}%"></div>
                </div>
                <span style="font-size:0.75rem;">${t.vagas_ocupadas}/${t.total_vagas}</span>
            </div>
        `;
        lista.appendChild(div);
    });
}


// cards críticos (taxa > 80%)

function renderCardCriticos() {
    const lista = document.getElementById('kpi-lista-criticos');
    lista.innerHTML = '';

    const criticos = SETORES_DADOS
        .filter(function (s) { return s.taxa_ocupacao > 80; })
        .sort(function (a, b) { return b.taxa_ocupacao - a.taxa_ocupacao; });

    if (criticos.length === 0) {
        lista.innerHTML = '<p class="kpi-hint">Nenhum setor em estado crítico.</p>';
        return;
    }

    criticos.forEach(function (s) {
        const div = document.createElement('div');
        div.className = 'card-alerta alerta-vermelho';
        div.innerHTML = `
            <span class="alerta-icone"></span>
            <div class="alerta-texto">
                <h3>Setor ${s.setor}</h3>
                <p>${s.taxa_ocupacao}% ocupado · ${s.ocupadasGeral}/${s.totalGeral} vagas</p>
            </div>
        `;
        lista.appendChild(div);
    });
}

function renderCardVazios() {
    const lista = document.getElementById('kpi-lista-vazios');
    lista.innerHTML = '';

    const vazios = SETORES_DADOS
        .filter(function (s) { return s.taxa_ocupacao < 20; })
        .sort(function (a, b) { return a.taxa_ocupacao - b.taxa_ocupacao; });

    if (vazios.length === 0) {
        lista.innerHTML = '<p class="kpi-hint">Nenhum setor extremamente vazio.</p>';
        return;
    }

    vazios.forEach(function (s) {
        const div = document.createElement('div');
        div.className = 'card-alerta alerta-verde';
        div.innerHTML = `
            <span class="alerta-icone"></span>
            <div class="alerta-texto">
                <h3>Setor ${s.setor}</h3>
                <p>${s.taxa_ocupacao}% ocupado · ${s.ocupadasGeral}/${s.totalGeral} vagas</p>
            </div>
        `;
        lista.appendChild(div);
    });
}

// função inicial, chamada no onload
// serve para chamar todas as outras funções
async function inicializarMapa() {
    await buscarDadosSetor();
    plotarMapa();
    renderCardCriticos();
    renderCardVazios();

    setInterval(async function () {
        await buscarDadosSetor();
        atualizarMapa();
        renderCardCriticos();
        renderCardVazios();
    }, INTERVALO_ATUALIZACAO_MS);
}

window.onload = function () {
    inicializarMapa();
};
