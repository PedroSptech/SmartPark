const cardErro = document.getElementById("cardErro");
const cardMessage = document.getElementById("cardMessage");
const error_message = document.getElementById("error_message");
const success_message = document.getElementById("success_message");

function invalidoMensagem(message) {
	cardErro.style.display = "block";
	cardMessage.style.display = "none";
	error_message.innerHTML = message;
	return;
}

function validoMensagem(message) {
	cardErro.style.display = "none";
	cardMessage.style.display = "block";
	success_message.innerHTML = message;
	return;
}

function sumirMensagem() {
	cardErro.style.display = "none";
}

ipt_cep.addEventListener('input', () => {
	let cep = ipt_cep.value
	if (cep.length == 8) {
		buscarCep(cep);
	}
});

async function buscarCep(cep) {
	console.log(`fazendo requisição: ${cep}`)
	await fetch(`https://viacep.com.br/ws/${cep}/json/ `)
		.then(function (res) {
			if (res.ok) {
				res.json().then((dados) => {
					preencherEndereco(dados)
				})
				return
			} else {
				console.error("Erro ao buscar endereço");
			}
		})
		.catch(function (erro) {
			console.error("Erro:", erro);
		});
}

function preencherEndereco(body_complete) {

	document.getElementById("ipt_cidade").value = body_complete.localidade ?? "Não encontrado"
	document.getElementById("ipt_estado").value = body_complete.uf ?? "Não encontrado"
	document.getElementById("ipt_logradouro").value = body_complete.logradouro ?? "Não encontrado"

	document.getElementById("ipt_cidade").disabled = true
	document.getElementById("ipt_estado").disabled = true
	document.getElementById("ipt_logradouro").disabled = true
}

function cadastrarEmpresa() {
	const cnpj = ipt_cnpj.value;
	const raza_social = ipt_rzsocial.value;
	const cep = ipt_cep.value;
	const logradouro = ipt_logradouro.value;
	const numero = ipt_numero.value;
	const cidade = ipt_cidade.value;
	const estado = ipt_estado.value;
	const senha = ipt_passw.value;
	const confirmar_senha = ipt_confirm_passw.value;

	if (
		cnpj == "" ||
		logradouro == "" ||
		raza_social == "" ||
		cep == "" ||
		cidade == "" ||
		numero == "" ||
		estado == "" ||
		senha == "" ||
		confirmar_senha == ""
	) {
		invalidoMensagem("Preencha todos os campos corretamente.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (cnpj.length < 14) {
		invalidoMensagem("Digite um CNPJ valido.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (senha.length < 8) {
		invalidoMensagem("A senha precisa ter mais de 8 caracteres.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	if (confirmar_senha != senha) {
		invalidoMensagem("Senhas não coicidem.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	btn_submit.style.display = "none";
	loading_gif.style.display = "flex";

	fetch("/empresas/cadastrar", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cnpjServer: cnpj,
			logradouroServer: logradouro,
			razaoServer: raza_social,
			codigoServer: "TESTE",
			cepServer: cep,
			cidadeServer: cidade,
			numeroServer: numero,
			estadoServer: estado,
			senhaServer: senha,
		}),
	})
		.then(function (resposta) {
			console.log("resposta: ", resposta);

			if (resposta.ok) {
				validoMensagem(
					"Cadastro realizado com sucesso! Redirecionando para tela de Login...",
				);

				setTimeout(() => {
					window.location = "../pages/login.html";
				}, "2000");

				limparFormulario();
			} else {
				btn_submit.style.display = "block";
				loading_gif.style.display = "none";
				invalidoMensagem("Houve um erro ao tentar realizar o cadastro!");
			}
		})
		.catch(function (resposta) {
			console.log(`#ERRO: ${resposta}`);
		});

	return false;
}

function entrarEmpresa() {
	const cnpj = ipt_cnpj_em.value;
	const senha = ipt_passw_em.value;

	if (cnpj == "" || senha == "") {
		invalidoMensagem("Preencha todos os campos corretamente.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}


	if (cnpj.length < 14) {
		invalidoMensagem("Digite um CNPJ valido.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	btn_submit.style.display = "none"
	loading_gif.style.display = "flex"

	fetch("/empresas/autenticar", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cnpjServer: cnpj,
			senhaServer: senha,
		}),
	})
		.then(function (resposta) {
			console.log("ESTOU NO THEN DO entrar()!");

			if (resposta.ok) {
				console.log(resposta);

				resposta.json().then((json) => {
					console.log(json);
					console.log(JSON.stringify(json));
					sessionStorage.NOME_USUARIO = json.nome;
					sessionStorage.ID_USUARIO = json.id;
					sessionStorage.EMAIL_USUARIO = json.email;

					validoMensagem(
						"Login realizado com sucesso! Redirecionando para a dashboard!",
					);

					setTimeout(function () {
						window.location = "./dashboard.html";
					}, 1000);
				});
			} else {
				resposta.text().then((texto) => {
					if (resposta.status == 403) {
						btn_submit.style.display = "block"
						loading_gif.style.display = "none"
						invalidoMensagem(texto);
					} else {
						setInterval(sumirMensagem, 5000);
					}
				})
			}
		})
		.catch(function (erro) {
			console.log(erro);
		});

	return false;
}

function entrarFuncionario() {
	const email = ipt_email.value;
	const senha = ipt_passw.value;

	if (email == "" || senha == "") {
		invalidoMensagem("Preencha todos os campos corretamente.");
		return false;
	} else {
		setInterval(sumirMensagem, 5000);
	}

	// CRIAR VALIDAÇÃO DE @ && email && .com
	// if (email.length < 14) {
	// 	invalidoMensagem("Digite um CNPJ valido.");
	//	return false;
	// } else {
	//	setInterval(sumirMensagem, 5000);
	// }

	btn_submit.style.display = "none"
	loading_gif.style.display = "flex"

	fetch("/empresas/autenticar/funcionario", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			emailServer: email,
			senhaServer: senha,
		}),
	})
		.then(function (resposta) {
			console.log("ESTOU NO THEN DO entrar()!");

			if (resposta.ok) {
				console.log(resposta);

				resposta.json().then((json) => {
					console.log(json);
					console.log(JSON.stringify(json));
					sessionStorage.NOME_USUARIO = json.nome;
					sessionStorage.ID_USUARIO = json.id;
					sessionStorage.EMAIL_USUARIO = json.email;

					validoMensagem(
						"Login realizado com sucesso! Redirecionando para a dashboard!",
					);

					setTimeout(function () {
						window.location = "./dashboard.html";
					}, 1000);
				});
			} else {
				resposta.text().then((texto) => {
					if (resposta.status == 403) {
						btn_submit.style.display = "block"
						loading_gif.style.display = "none"
						invalidoMensagem(texto);
					} else {
						setInterval(sumirMensagem, 5000);
					}
				})
			}
		})
		.catch(function (erro) {
			console.log(erro);
		});

	return false;
}
