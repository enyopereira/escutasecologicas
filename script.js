"use strict";

const video = document.getElementById("videoEcologia");
const iniciar = document.getElementById("botaoIniciar");
const parar = document.getElementById("botaoParar");
const confirmar = document.getElementById("botaoConfirmar");
const mensagem = document.getElementById("mensagem");

const botoes = [...document.querySelectorAll("#botoes button")];
const botoesSom = [...document.querySelectorAll("[data-som]")];
const audios = [...document.querySelectorAll("audio")];

const selecionados = new Set();

let operacao = 0;
let emReproducao = false;

// Comentários apresentados ao confirmar a composição.
const comentarios = {
  vento:
    "Vento: sugere movimento do ar e a sensação de espaço aberto.",

  vaca:
    "Vaca: relaciona o som aos animais visíveis na paisagem.",

  bentevi:
    "Bem-te-vi: acrescenta uma presença que pode estar fora do enquadramento.",

  trem:
    "Trem: sugere uma atividade além da imagem e transforma a percepção do lugar."
};

// Exibe uma mensagem na tela.
function avisar(texto) {
  mensagem.textContent = texto;
  mensagem.hidden = false;
}

// Interrompe o vídeo e todos os sons.
// Quando solicitado, retorna as mídias ao início.
function interromper(voltarAoInicio = false) {
  operacao++;
  emReproducao = false;

  video.pause();

  audios.forEach(audio => {
    audio.pause();
  });

  if (voltarAoInicio) {
    video.currentTime = 0;

    audios.forEach(audio => {
      audio.currentTime = 0;
    });
  }
}

// Reproduz desde o começo, com os sons selecionados.
async function iniciarVideo() {
  interromper(true);

  const tentativa = operacao;

  mensagem.hidden = true;

  const midias = [
    video,
    ...[...selecionados].map(id => document.getElementById(id))
  ];

  emReproducao = true;

  try {
    // Inicia todas as mídias na mesma ação do usuário.
    // Arquivos separados não garantem sincronismo de precisão.
    await Promise.all(
      midias.map(midia => midia.play())
    );
  } catch (erro) {
    // Ignora uma tentativa cancelada por outra ação.
    if (tentativa !== operacao) return;

    interromper();

    avisar(
      "Não foi possível reproduzir. Confira ecologia1.mp4 " +
      "e os MP3 selecionados na mesma pasta dos arquivos da página."
    );

    console.error(erro);
  }
}

// Ativa ou desativa cada som.
// As alterações são aplicadas ao pressionar Iniciar novamente.
botoesSom.forEach(botao => {
  botao.addEventListener("click", () => {
    const id = botao.dataset.som;

    if (selecionados.has(id)) {
      selecionados.delete(id);
    } else {
      selecionados.add(id);
    }

    botao.setAttribute(
      "aria-pressed",
      String(selecionados.has(id))
    );

    avisar(
      "Seleção atualizada. Pressione Iniciar para ouvir desde o começo."
    );
  });
});

// Botão Iniciar.
iniciar.addEventListener("click", iniciarVideo);

// Botão Parar: retorna ao início e mantém as escolhas.
parar.addEventListener("click", () => {
  interromper(true);

  avisar(
    "Reprodução parada. Suas escolhas foram mantidas."
  );
});

// Botão Confirmar: apresenta o feedback.
confirmar.addEventListener("click", () => {
  interromper();

  if (!selecionados.size) {
    avisar(
      "Nenhum som selecionado. Escolha um ou mais sons para compor a paisagem."
    );

    return;
  }

  const texto = [...selecionados].map(id => comentarios[id]);

  texto.push(
    selecionados.size === 4
      ? "Todos os sons precisam do mesmo destaque? Retire uma camada e escute novamente."
      : "Como suas escolhas mudaram a percepção da imagem? Experimente outra combinação."
  );

  avisar(texto.join("\n\n"));
});

// Ao terminar, mantém o último quadro e interrompe os sons.
video.addEventListener("ended", () => {
  interromper();

  avisar(
    "Fim do vídeo. Pressione Iniciar para repetir " +
    "ou Confirmar para receber o feedback."
  );
});

// Trata falhas de carregamento durante a reprodução.
[video, ...audios].forEach(midia => {
  midia.addEventListener("error", () => {
    const midiaEmUso =
      midia === video || selecionados.has(midia.id);

    if (emReproducao && midiaEmUso) {
      interromper();

      avisar(
        "Falha ao carregar uma mídia. Confira os nomes e os formatos dos arquivos."
      );
    }
  });
});

// Navegação pelo teclado ou controle que envie essas teclas.
document.addEventListener("keydown", event => {
  const indice = botoes.indexOf(document.activeElement);

  const direcao = {
    ArrowRight: 1,
    ArrowDown: 1,
    ArrowLeft: -1,
    ArrowUp: -1
  }[event.key];

  if (direcao) {
    event.preventDefault();

    const proximo =
      indice < 0
        ? 0
        : (indice + direcao + botoes.length) % botoes.length;

    botoes[proximo].focus();

    botoes[proximo].scrollIntoView({
      block: "nearest",
      inline: "nearest"
    });
  } else if (
    event.key === "Enter" ||
    event.key === "OK" ||
    event.key === "Select"
  ) {
    event.preventDefault();

    // Evita acionamentos repetidos ao manter a tecla pressionada.
    if (event.repeat) return;

    if (indice < 0) {
      iniciar.focus();
    } else {
      botoes[indice].click();
    }
  }
});

// Estado inicial: vídeo parado e botão Iniciar em foco.
video.pause();
iniciar.focus();