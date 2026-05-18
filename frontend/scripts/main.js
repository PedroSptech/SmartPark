const listaUsuarios = [
    {
        cnpj: "12345678000199",
        password: "jeremy@123",
        tipo: "empresa"
    },
    {
        email: "gustavo@shoppingpaulista.com",
        password: "123",
        tipo: "funcionario"
    }
];

function switchTab(tab) {
    if (tab === 'empresa') {
        formFuncionario.style.display = 'none';
        formEmpresa.style.display = 'block';
        tabEmpresa.classList.add('tab-active');
        tabFuncionario.classList.remove('tab-active');
    } else {
        formEmpresa.style.display = 'none';
        formFuncionario.style.display = 'block';
        tabFuncionario.classList.add('tab-active');
        tabEmpresa.classList.remove('tab-active');
    }
}

function sumirMensagem() {
    cardErro.style.display = "none";
}

const fmt = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const fmtN = (v) => v.toLocaleString('pt-BR');

function calcular() {
    const totalVagas = Number(idTotalVagas.value) || 0;
    const precoAtual = Number(idPrecoAtual.value) || 50;
    const precoPromo = Number(idPrecoPromo.value) || 30;

    if (totalVagas <= 0) {
        cardErro.style.display = "block";
        error_message.innerHTML = "Preencha o número de vagas.";
        return;
    } else {
        setInterval(sumirMensagem, 5000);
    }

    const hP = totalVagas * 0.89;
    const hF = totalVagas * 0.30;

    const totalAtual = (hP + hF) * precoAtual;

    const fatorCrescimento = 1.8;
    const hFNovo = hF * fatorCrescimento;

    const totalOtimizado = (hP * precoAtual) + (hFNovo * precoPromo);

    const ganho = totalOtimizado - totalAtual;
    const pct = totalAtual > 0 ? ((ganho / totalAtual) * 100).toFixed(1) : 0;

    const vagasOciosas = totalVagas > 0 ? totalVagas - hF : 0;
    const ocupacao = totalVagas > 0 ? ((hF / totalVagas) * 100).toFixed(1) + '%' : 'N/A';

    const semanal = ganho * 7;
    const mensal = ganho * 30;
    const anual = ganho * 365;

    mensagem.innerHTML = `

<div class="resultado-box">

    <div class="resultado-item">
        <h3>Ocupação do Estacionamento</h3>

        <div class="linha-info">
            <span>Horário de pico</span>
            <b>${fmtN(Math.round(hP))} veículos</b>
        </div>

        <div class="barra">
            <div class="barra-fill pico"></div>
        </div>

        <div class="linha-info">
            <span>Horário fraco</span>
            <b>${fmtN(Math.round(hF))} veículos</b>
        </div>

        <div class="barra">
            <div class="barra-fill fraco"></div>
        </div>
    </div>

    <div class="resultado-item">
        <h3>Impacto Atual</h3>

        <p>
            Hoje seu estacionamento possui
            <b class="negativo">${fmtN(Math.round(vagasOciosas))} vagas ociosas</b>
            nos horários de menor movimento.
        </p>

        <div class="card-mini">
            <span>Perda estimada</span>
            <b>${fmt(vagasOciosas * precoAtual)}</b>
        </div>

        <div class="card-mini">
            <span>Receita diária atual</span>
            <b>${fmt(totalAtual)}</b>
        </div>
    </div>

    <div class="resultado-item destaque">
        <h3>Projeção com Smart Parking</h3>

        <div class="linha-info">
            <span>Aumento no fluxo ocioso</span>
            <b>+80%</b>
        </div>

        <div class="linha-info">
            <span>Nova receita diária</span>
            <b>${fmt(totalOtimizado)}</b>
        </div>

        <div class="ganho-box">
            <small>Ganho diário</small>
            <h2>+ ${fmt(ganho)}</h2>
            <p>${pct}% de aumento</p>
        </div>
    </div>

    <div class="resultado-item">
        <h3>Projeção Financeira</h3>

        <div class="grid-projecao">

            <div class="projecao-card">
                <span>Semana</span>
                <b>${fmt(semanal)}</b>
            </div>

            <div class="projecao-card">
                <span>Mês</span>
                <b>${fmt(mensal)}</b>
            </div>

            <div class="projecao-card anual">
                <span>Ano</span>
                <b>${fmt(anual)}</b>
            </div>

        </div>
    </div>

    <div class="conclusao">
        <h3>Conclusão</h3>

        <p>
            O Smart Parking ajuda a transformar vagas paradas em receita,
            utilizando monitoramento em tempo real e estratégias inteligentes
            de ocupação.
        </p>

        <div class="resultado-final">
            Seu estacionamento pode gerar
            <b>${fmt(anual)}</b>
            adicionais por ano.
        </div>
    </div>

</div>
    `;
}