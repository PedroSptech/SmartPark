let myLineChart; 

window.onload = function() {
    inicializarGraficoBarras();
    //exemplo: tirar o 1 depois 
    obterDadosGraficoLinha(1); 

    setInterval(function() {
        console.log("Atualizando o gráfico...");
        obterDadosGraficoLinha(1);
    }, 5000);
};

function obterDadosGraficoLinha(idEstacionamento) {
    fetch(`/medidas/ultimas/${idEstacionamento}`, { cache: 'no-store' })
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


function inicializarGraficoBarras() {
    const ctxBar = document.getElementById('barChart').getContext('2d');
    new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: ['SEG', 'TER', 'QUA', 'QUI', 'SEX'],
            datasets: [{
                data: [35, 60, 40, 60, 86],
                backgroundColor: ['#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0', '#4466f2'],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { display: false },
                x: { grid: { display: false } }
            }
        }
    });
}