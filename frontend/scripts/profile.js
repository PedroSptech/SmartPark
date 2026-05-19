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
    document.getElementById("email_usuario").innerText = `contato@${dados.empresa.razao_social_empresa.replace(/\s+/g, '').toLowerCase()}.com.br`;
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

carregarPerfil();