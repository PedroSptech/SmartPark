const usuario = {
	name: "Jeremy",
	cnpj: "00525574000183",
	password: "jeremy@123",
};

function switchTab(tab) {
	if (tab === 'empresa') {
		formFuncionario.style.display = 'none';

		formEmpresa.style.display = 'block';
		tabEmpresa.classList.add('tab-active');
		tabFuncionario.classList.remove('tab-active');
		return;
	}

	formEmpresa.style.display = 'none';

	formFuncionario.style.display = 'block';
	tabFuncionario.classList.add('tab-active');
	tabEmpresa.classList.remove('tab-active');
}

function registerUser() {
	const name = ipt_nome.value;
	const email = ipt_email.value;
	const passw = ipt_passw.value;
	const c_passw = ipt_confirm_passw.value;

	if (name == "" || email == "" || passw == "" || c_passw == "") {
		cardErro.style.display = "block";
		error_message.innerHTML = "Preencha todos os campos";
		return;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
		cardErro.style.display = "block";
		error_message.innerHTML = "Email inválido";
		return;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (passw.length < 6) {
		cardErro.style.display = "block";
		error_message.innerHTML = "Senha muito curta";
		return;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (passw !== c_passw) {
		cardErro.style.display = "block";
		error_message.innerHTML = "As senhas não coincidem";
		return;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	alert("Cadastro realizado com sucesso!");
	window.location.href = "./login.html";
}

function loginUser() {
	const cnpj = ipt_cnpj_em.value;
	const passw = ipt_passw_em.value;

	const user = {
		cnpj,
		passw,
	};

	if (user.cnpj == usuario.cnpj && user.passw == usuario.password) {
		window.location.href = "./dashboard.html";
	} else {
		cardErro.style.display = "block";
		error_message.innerHTML = "Usuario inválido.";
		setInterval(sumirMensagem, 5000);
		return;
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
        • Horário fraco (30% das vagas): <b>${fmtN(Math.round(hF))} veículos</b>
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