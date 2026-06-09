//TODO: EXPLICAR CODE
function switchTab(tab, type) {
	if (tab === "empresa") {
		formFuncionario.style.display = "none";
		formEmpresa.style.display = type == 1 ? "block" : "flex";
		tabEmpresa.classList.add("tab-active");
		tabFuncionario.classList.remove("tab-active");
	} else {
		formEmpresa.style.display = "none";
		formFuncionario.style.display = type == 1 ? "block" : "flex";
		tabFuncionario.classList.add("tab-active");
		tabEmpresa.classList.remove("tab-active");
	}
}

function sumirMensagem() {
	const cardErro = document.getElementById("cardErro");

	if (cardErro) {
		cardErro.style.display = "none";
	}
}

function invalidoMensagem(message) {
	const cardErro = document.getElementById("cardErro");
	const cardMessage = document.getElementById("cardMessage");
	const errorMessage = document.getElementById("error_message");

	cardErro.style.display = "block";
	cardMessage.style.display = "none";
	errorMessage.textContent = message;
}

function validoMensagem(message) {
	const cardErro = document.getElementById("cardErro");
	const cardMessage = document.getElementById("cardMessage");
	const successMessage = document.getElementById("success_message");

	cardErro.style.display = "none";
	cardMessage.style.display = "block";
	successMessage.textContent = message;
}

function emailValido(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function senhaValida(senha) {
	return senha.length >= 8;
}
