window.onload = function() {
    const ctxLine = document.getElementById('lineChart').getContext('2d');
    const gradient = ctxLine.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(68, 102, 242, 0.3)');
    gradient.addColorStop(1, 'rgba(68, 102, 242, 0)');

    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: ['01 Aug', '02 Aug', '03 Aug', '04 Aug', '07 Aug', '08 Aug', '09 Aug', '10 Aug', '11 Aug', '14 Aug', '15 Aug', '16 Aug'],
            datasets: [{
                data: [60, 75, 65, 82, 91, 58, 68, 45, 62, 75, 42, 68],
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
};