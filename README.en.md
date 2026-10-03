# pomo

Zeus and Poseidon, brothers, in a fight told through scrolling.

**[See the piece](https://kaykesiquara.github.io/pomo/)** · [Leia em português](README.md)

## About

*pomo* is a scrollytelling piece about two brothers who were once allies. The story begins on an Olympus that is still whole, goes back to a past painted on a Greek vase, crosses the sky and the sea, and ends in a fight in five movements. Everything is told by a narrator who only reveals herself at the end.

The title is Portuguese: *pomo* is an old word for apple, and the *pomo da discórdia* is the apple of discord.

The piece is available in Portuguese and English, has sound composed in code, and has a static version for people who prefer less motion.

## How it was made

- **HTML, CSS and JavaScript**, with no build step.
- **[GSAP](https://gsap.com) and ScrollTrigger** pin each chapter to the scroll.
- **Canvas 2D** draws the whole fight.
- **[Tone.js](https://tonejs.github.io)** composes the music and the sound effects in real time. The library downloads after the page opens and only plays if sound is switched on at the start.
- **[Gentium Book Plus](https://fonts.google.com/specimen/Gentium+Book+Plus)**, which includes the ancient Greek of the inscriptions.

## How the engine works

- **The story clock.** The fight has no time of its own: scrolling moves a single number, the story time, and everything is drawn from it. Slow motion is that time running slower than the scroll.
- **Bodies made of joints.** Zeus and Poseidon are skeletons with key poses. Between poses, each joint follows a smooth curve that passes through every pose without overshooting it. On top of that runs light physics: the torso leans when accelerating and braking, the knees absorb landings, the extremities lag slightly, and the cape and hair follow wind and inertia.
- **Camera and light.** The camera follows a track of positions, with shakes on impacts and a handheld drift. Lightning bolts are dynamic light sources that light the floor, the bodies and the rain.
- **Layers by movement.** The fight code follows the order of the story: each movement adds its own choreography, effects and lines on top of the previous one.
- **Memories.** The flashbacks are drawn as black-figure vase painting, using the same skeletons as the fight.
- **Sound.** Music, effects and the slow-motion muffling go through a single channel. The effects of the chapters before the fight are triggered by the animations themselves.
- **Navigation.** A thin bar at the top shows progress and takes you to each chapter.
- **Accessibility.** With reduced motion, the fight becomes a sequence of still frames with captions. Every scene has a description for screen readers, and the opening screen warns about flashing lights.

## Structure

```
index.html        the page and the chapters before the fight
css/estilo.css    the styles
js/pomo.js        the chapters, the fight engine, the sound and the languages
```

## Run locally

Open `index.html` in a browser. To serve the folder instead:

```bash
npx serve .
# or
python3 -m http.server
```

## Credits

Design and code: Kayke Siquara ([GitHub](https://github.com/KaykeSiquara)).

Libraries: GSAP and Tone.js. Typeface: Gentium Book Plus (SIL Open Font License).
