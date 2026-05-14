
function cadastrar() {
	var cnpj = ipt_cnpj.value;
	var raza_social = ipt_rzsocial.value;
	var logradouro = ipt_logradouro.value;
	var cep = ipt_cep.value;
	var numero = ipt_numero.value;
	var cidade = ipt_cidade.value;
	var estado = ipt_estado.value;
	var senha = ipt_passw.value;
	var confirmar_senha = ipt_confirm_passw.value;

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
		console.log("Credenciais invalidas");
		return false;
	}

	fetch("/empresas/cadastrar", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			cnpjServer: cnpj,
			logradouroServer: logradouro,
			razaoServer: raza_social,
			codigoServer: 'TESTE',
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
				// cardErro.style.display = "block";

				// mensagem_erro.innerHTML =
				// 	"Cadastro realizado com sucesso! Redirecionando para tela de Login...";

				// setTimeout(() => {
				// 	window.location = "login.html";
				// }, "2000");

				// limparFormulario();
			} else {
				throw "Houve um erro ao tentar realizar o cadastro!";
			}
		})
		.catch(function (resposta) {
			console.log(`#ERRO: ${resposta}`);
		});

	return false;
}
