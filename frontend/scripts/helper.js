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
	cardErro.style.display = "none";
}

