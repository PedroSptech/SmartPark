const usuario = {
  name: "Jeremy",
  email: "jeremy@gmail.com",
  password: "jeremy@123"
}

// function registerUser() {
//   const name = ipt_nome.value
//   const email = ipt_email.value
//   const passw = ipt_passw.value
//   const c_passw = ipt_confirm_passw.value

//   if(passw !== c_passw) {
//     invalidPassword()
//     return
//   }

//   const user = {
//     ids,
//     name,
//     email,
//     passw
//   }

//   users.push(user)

//   location.href = "../pages/login.html" 
// }

function loginUser() {
  const email = ipt_email.value
  const passw = ipt_passw.value

  const user = {
    email,
    passw
  }

  if(user.email == usuario.email && user.passw == usuario.password) {
    //TODO: MUDAR PARA A USER PAGE / DASHBOARD
    alert("Logado") 
    return
  }

  alert("Email ou senha invalidos")  
}