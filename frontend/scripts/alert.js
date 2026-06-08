var alertas = [];

function alertar(taxaAtual, idEstacionamento) {
    var grauDeAviso = '';
    var grauDeAvisoCor = '';

    var limites = {
        lotado: 95,
        quase_lotado: 80,
        ideal: 50,
        vazio: 20
    };

    var classe_taxa = 'cor-alerta';

    if (taxaAtual >= limites.lotado) {
        classe_taxa = 'cor-alerta alerta-vermelho';
        grauDeAviso = 'Lotado';
        grauDeAvisoCor = 'cor-alerta alerta-vermelho';
        exibirAlerta(taxaAtual, idEstacionamento, grauDeAviso, grauDeAvisoCor);
    }
    else if (taxaAtual >= limites.quase_lotado && taxaAtual < limites.lotado) {
        classe_taxa = 'cor-alerta alerta-amarelo';
        grauDeAviso = 'Quase Lotado';
        grauDeAvisoCor = 'cor-alerta alerta-amarelo';
        exibirAlerta(taxaAtual, idEstacionamento, grauDeAviso, grauDeAvisoCor);
    }
    else {
        classe_taxa = 'cor-alerta ideal';
        removerAlerta(idEstacionamento);
    }
}

function exibirAlerta(taxaAtual, idEstacionamento, grauDeAviso, grauDeAvisoCor) {
    var indice = alertas.findIndex(item => item.idEstacionamento == idEstacionamento);

    if (indice >= 0) {
        alertas[indice] = { idEstacionamento, taxaAtual, grauDeAviso, grauDeAvisoCor };
    } else {
        alertas.push({ idEstacionamento, taxaAtual, grauDeAviso, grauDeAvisoCor });
    }

    exibirCards();
}

function removerAlerta(idEstacionamento) {
    alertas = alertas.filter(item => item.idEstacionamento != idEstacionamento);
    exibirCards();
}

function exibirCards() {
    var mural = document.getElementById('mural_alertas');
    mural.innerHTML = '';

    for (var i = 0; i < alertas.length; i++) {
        var mensagem = alertas[i];
        mural.innerHTML += transformarEmDiv(mensagem);
    }
}

function transformarEmDiv({ idEstacionamento, taxaAtual, grauDeAviso, grauDeAvisoCor }) {
    return `
    <div class="card-alerta ${grauDeAvisoCor}">
        <div class="alerta-icone">&#9888;</div>
        <div class="alerta-texto">
            <h3>Atenção: Estacionamento ${idEstacionamento} está ${grauDeAviso}!</h3>
            <p>A taxa de ocupação atual chegou a ${taxaAtual}%.</p>
        </div>
    </div>
    `;
}
