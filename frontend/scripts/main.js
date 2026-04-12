const usuario = {
  name: "Jeremy",
  email: "jeremy@gmail.com",
  password: "jeremy@123"
}

function registerUser() {
  const name = ipt_nome.value
  const email = ipt_email.value
  const passw = ipt_passw.value
  const c_passw = ipt_confirm_passw.value

  if (name == "" || email == "" || passw == "" || c_passw == "") {
    alert("Preencha todos os campos")
    return
  }

  if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
    alert("Email inválido")
    return
  }

  if (passw.length < 6) {
    alert("Senha muito curta")
    return
  }

  if (passw !== c_passw) {
    alert("As senhas não coincidem")
    return
  }

  alert("Cadastro realizado com sucesso!")
  window.location.href = "./login.html"
}

function loginUser() {
  const email = ipt_email.value
  const passw = ipt_passw.value

  const user = {
    email,
    passw
  }

  if (user.email == usuario.email && user.passw == usuario.password) {
    window.location.href = "./dashboard.html";
  } else {
    alert("Email ou senha inválidos");
  }
}