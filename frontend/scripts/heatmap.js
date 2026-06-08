if (sessionStorage.TIPO_USUARIO === 'funcionario') {
    document.getElementById('botao_perfil').style.display = 'none';
}

window.onload = function () {
    const canvasHeatmap = document.getElementById('heatmapChart');

    const ctxHeatmap = canvasHeatmap.getContext('2d');

    const mapData = [
        { x: 15, y: 20, v: 90, label: 'Setor A1' },
        { x: 50, y: 20, v: 40, label: 'Setor A2' },
        { x: 85, y: 20, v: 70, label: 'Setor A3' },
        { x: 15, y: 80, v: 85, label: 'Setor B1' },
        { x: 50, y: 80, v: 25, label: 'Setor B2' },
        { x: 85, y: 80, v: 10, label: 'Setor VIP' }
    ];

    const getColor = (val) => {
        if (val > 80) return 'rgba(255, 70, 70, 0.8)';
        if (val > 50) return 'rgba(255, 206, 86, 0.8)';
        return 'rgba(75, 192, 192, 0.8)';
    };

    const bubbleData = mapData.map(d => ({
        x: d.x, y: d.y, r: 35, v: d.v, label: d.label
    }));

    new Chart(ctxHeatmap, {
        type: 'bubble',
        data: {
            datasets: [{
                data: bubbleData,
                backgroundColor: bubbleData.map(d => getColor(d.v)),
                borderColor: bubbleData.map(d => getColor(d.v).replace('0.8', '1')),
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
                        label: (ctx) => `${ctx.raw.label}: ${ctx.raw.v}% ocupado`
                    }
                }
            }
        }
    });

};