async function gerarResposta() {
    const pergunta = document.getElementById('pergunta').value;

    btn_submit.style.display = "none";
	loading_gif.style.display = "flex";

    const response = await fetch('http://localhost:3333/bobia/perguntar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pergunta })
    });

    const data = await response.json();

    document.getElementById('resposta').style.display = 'block';
    document.getElementById('resposta').innerText = data.resultado;

    btn_submit.style.display = "inline-block";
	loading_gif.style.display = "none";
}
