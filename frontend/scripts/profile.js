if (sessionStorage.TIPO_USUARIO === 'funcionario') {
    window.location = './dashboard.html';
}

function carregarPerfil() {
    var idEmpresa = sessionStorage.ID_USUARIO;

    if (!idEmpresa) {
        window.location = "login.html";
        return;
    }

    fetch(`/empresas/perfil/${idEmpresa}`)
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (dados) {
                    console.log(dados)
                    mostrarPerfil(dados);
                });
            } else {
                console.error("Erro ao buscar dados do perfil.");
            }
        })
        .catch(function (erro) {
            console.error("Erro no fetch do perfil:", erro);
        });
}

function mostrarPerfil(dados) {
    document.getElementById("nome_usuario").innerText = dados.empresa.razao_social_empresa;
    document.getElementById("cnpj_usuario").innerText = `${dados.empresa.razao_social_empresa}, CNPJ ${dados.empresa.cnpj_empresa}`;

    var divEstacionamentos = document.getElementById("lista_estacionamentos");
    divEstacionamentos.innerHTML = "";

    dados.estacionamentos.forEach(est => {
        divEstacionamentos.innerHTML += `
            <p class="profile-franquia">ESTACIONAMENTO:
                <span class="profile-lista-franquia">${est.nome_shopping}</span>
            </p>
            <div class="estacionamento-item">
                <p class="estacionamento-header">Vagas: ${est.qtd_vaga_total}</p>
                <p class="estacionamento-detail">Logradouro: ${est.logradouro}, ${est.numero_logradouro}</p>
                <div class="estacionamento-actions">
                    <a href="dashboard.html?id=${est.id_estacionamento}" class="btn-estacionamento btn-acessar">Acessar Dashboards</a>
                </div>
            </div>
        `;
    });

    var tbodyFuncionarios = document.getElementById("lista_funcionarios");
    tbodyFuncionarios.innerHTML = "";

    dados.funcionarios.forEach(func => {
        tbodyFuncionarios.innerHTML += `
            <tr>
                <td>${func.nome_funcionario}</td>
                <td>${func.email_funcionario}</td>
                <td>${func.local_trabalho}</td>
                <td><button class="btn-remover">Remover</button></td>
            </tr>
        `;
    });
}

function openPopUp() {
    formPopup.style.display = "flex";
}

function closePopUp() {
    formPopup.style.display = "none";
}

function cadastrarFunc() {
    var nome = ipt_nome_func.value.trim();
    var email = ipt_email_func.value.trim();
    var senha = ipt_passw_func.value;

    if (nome === "" || email === "" || senha === "") {
        invalidoMensagem("Preencha todos os campos.");
        return false;
    }

    if (!emailValido(email)) {
        invalidoMensagem("Digite um email válido.");
        return false;
    }

    if (!senhaValida(senha)) {
        invalidoMensagem("A senha deve ter no mínimo 8 caracteres.");
        return false;
    }

    fetch(`/empresas/cadastrar/funcionario/${sessionStorage.ID_USUARIO}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome,
            email,
            senha
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                validoMensagem(
                    "Funcionário cadastrado com sucesso!",
                );

                setTimeout(() => {
                    closePopUp();
                }, "2000");

                ipt_nome_func.value = "";
                ipt_email_func.value = "";
                ipt_passw_func.value = "";
            } else {
                invalidoMensagem("Houve um erro ao tentar realizar o cadastro!");
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

    return false;
}

carregarPerfil();
