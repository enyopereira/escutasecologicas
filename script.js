const video = document.getElementById("videoEcologia");
const botaoIniciar = document.getElementById("botaoIniciar");
const interfaceTela = document.getElementById("interface");


// Estado inicial
let botaoEmFoco = false;


// Garante que o vídeo começa pausado
video.pause();


// Detecta teclas do teclado / controle remoto
document.addEventListener("keydown", function (event) {

    const teclaOK =
        event.key === "Enter" ||
        event.code === "NumpadEnter" ||
        event.keyCode === 13;


    if (teclaOK) {

        event.preventDefault();


        // PRIMEIRO ENTER:
        // coloca o botão em foco
        if (!botaoEmFoco) {

            botaoIniciar.focus();

            botaoEmFoco = true;

            return;
        }


        // SEGUNDO ENTER:
        // inicia o vídeo
        iniciarVideo();
    }

});


// Permite iniciar também com mouse
botaoIniciar.addEventListener("click", function () {

    iniciarVideo();

});


function iniciarVideo() {

    video.play()
        .then(function () {

            // Remove a interface depois que
            // o vídeo realmente começa
            interfaceTela.style.display = "none";

        })
        .catch(function (erro) {

            console.error(
                "Não foi possível iniciar o vídeo:",
                erro
            );

        });

}