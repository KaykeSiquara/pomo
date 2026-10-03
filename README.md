# pomo

Zeus e Poseidon, irmãos, numa luta contada pela rolagem.

**[Ver a peça](https://kaykesiquara.github.io/pomo/)** · [Read in English](README.en.md)

## Sobre

*pomo* é um scrollytelling sobre dois irmãos que já foram aliados. A história começa no Olimpo ainda inteiro, volta a um passado pintado num vaso grego, atravessa o céu e o mar e termina numa luta em cinco movimentos. Quem conta tudo é uma narradora que só se revela no fim.

A peça tem versão em português e em inglês, som composto em código e uma versão estática para quem prefere menos movimento.

## Como foi feito

- **HTML, CSS e JavaScript**, sem etapa de build.
- **[GSAP](https://gsap.com) e ScrollTrigger** prendem cada capítulo à rolagem.
- **Canvas 2D** desenha a luta inteira.
- **[Tone.js](https://tonejs.github.io)** compõe a música e os efeitos em tempo real. A biblioteca é baixada depois que a página abre e só toca se o som for ligado na abertura.
- **[Gentium Book Plus](https://fonts.google.com/specimen/Gentium+Book+Plus)**, que inclui o grego antigo das inscrições.

## Como o motor funciona

- **O relógio da história.** A luta não tem um tempo próprio: a rolagem move um único número, o tempo da história, e tudo é desenhado a partir dele. A câmera lenta é esse tempo andando mais devagar que a rolagem.
- **Corpos por articulações.** Zeus e Poseidon são esqueletos com poses-chave. Entre uma pose e outra, cada articulação segue uma curva suave que passa por todas as poses sem ultrapassá-las. Por cima disso entra uma física leve: o tronco inclina ao acelerar e ao frear, os joelhos absorvem as aterrissagens, as extremidades atrasam um pouco, e a capa e o cabelo seguem o vento e a inércia.
- **Câmera e luz.** A câmera segue uma trilha de posições, com tremores nos impactos e uma deriva de câmera na mão. Os raios são fontes de luz dinâmicas que iluminam o chão, os corpos e a chuva.
- **Camadas por movimento.** O código da luta segue a ordem da história: cada movimento acrescenta ao anterior a sua coreografia, os seus efeitos e as suas falas.
- **Memórias.** As lembranças são desenhadas como pintura de vaso em figuras negras, com os mesmos esqueletos da luta.
- **Som.** Música, efeitos e o abafamento da câmera lenta passam por um canal único. Os efeitos dos capítulos de antes da luta nascem das próprias animações.
- **Navegação.** Uma barra fina no alto mostra o progresso e leva a cada capítulo.
- **Acessibilidade.** Com movimento reduzido, a luta vira uma sequência de quadros estáticos com legenda. Cada cena tem descrição para leitores de tela, e a abertura avisa que há clarões de luz.

## Estrutura

```
index.html        a página e os capítulos de antes da luta
css/estilo.css    os estilos
js/pomo.js        os capítulos, o motor da luta, o som e os idiomas
```

## Rodar localmente

Abra o `index.html` no navegador. Se preferir servir a pasta:

```bash
npx serve .
# ou
python3 -m http.server
```

## Créditos

Design e código: Kayke Siquara ([GitHub](https://github.com/KaykeSiquara)).

Bibliotecas: GSAP e Tone.js. Fonte: Gentium Book Plus (SIL Open Font License).
