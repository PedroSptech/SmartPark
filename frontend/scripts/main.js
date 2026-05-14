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

    <div style="margin-bottom:15px;">
        <b style="font-size:1.2em;">📊 Perfil de Ocupação do seu Estacionamento</b><br>
        • Horário de pico (89% das vagas): <b>${fmtN(Math.round(hP))} veículos</b><br>
        • Horário fraco (30% das vagas): <b>${fmtN(Math.round(hF))} veículos</b><br>
			FONTE (CET): <a href="https://www.cetsp.com.br/media/74631/btcetsp46.pdf">https://www.cetsp.com.br/media/74631/btcetsp46.pdf</a>
    </div>

    <div style="margin-bottom:15px;">
        <b style="font-size:1.2em;">🚨 Dinheiro Perdido Hoje</b><br>
        Você possui <b style="color:#c0392b;">${fmtN(Math.round(vagasOciosas))} vagas ociosas</b> no horário fraco (${ocupacao} de ocupação).<br>
        Isso representa até <b>${fmt(vagasOciosas * precoAtual)}</b> não faturados por período.
    </div>

    <div style="margin-bottom:15px;">
        <b style="font-size:1.2em;">📊 Cenário Atual</b><br>
        • Receita diária: <b>${fmt(totalAtual)}</b>
    </div>

    <div style="margin-bottom:15px;">
        <b style="font-size:1.2em; color:#0056b3;">🚀 Com Smart Parking</b><br>
        • Aumento de fluxo no horário ocioso: <b>+80%</b><br>
        • Nova receita diária: <b>${fmt(totalOtimizado)}</b>
    </div>

    <div style="margin-bottom:15px;">
        <b style="font-size:1.2em; color:green;">💰 Ganho Direto</b><br>
        • <b>+ ${fmt(ganho)} por dia</b><br>
        • <b>+ ${pct}% de aumento</b>
    </div>

    <div style="margin-bottom:15px;">
        <b style="font-size:1.2em;">📅 Projeção Financeira</b><br>
        • Semana: <b>${fmt(semanal)}</b><br>
        • Mês: <b>${fmt(mensal)}</b><br>
        • Ano: <b style="color:green;">${fmt(anual)}</b>
    </div>

    <div style="margin-top:20px; padding-top:10px; border-top:1px solid #eee;">
        <b style="color:#333;">💡 Conclusão</b><br>
        O Smart Parking transforma vagas vazias em receita ativa usando
        <b>dados em tempo real + precificação dinâmica</b>.<br><br>

        <b style="font-size:1.1em; color:green;">
        Seu estacionamento pode gerar ${fmt(anual)} a mais por ano.
        </b>
    </div>
    `;
}