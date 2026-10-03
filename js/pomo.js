(() => {
  const raiz = document.documentElement;
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  const TEMPO = { passo: .3, entrada: 1, saida: .8, porPalavra: .34, minimo: 2.4, pan: 1.7 };
  const leitura = (el) => Math.max(TEMPO.minimo, el.textContent.trim().split(/\s+/).length * TEMPO.porPalavra);

  const ruido = (i) => { const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
  const f1 = (n) => (+n).toFixed(1);
  const P2 = (p) => f1(p[0]) + "," + f1(p[1]);
  const caminho = (pts) => "M" + pts.map(P2).join(" L");
  function trinca(x0, y0, x1, y1, amp, semente) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
    const n = Math.max(5, Math.round(len / 18)), nx = -dy / len, ny = dx / len;
    const pts = [[x0, y0]];
    for (let i = 1; i < n; i++) {
      const t = i / n, off = ruido(semente + i) * amp * (.35 + .65 * Math.sin(Math.PI * t));
      pts.push([x0 + dx * t + nx * off, y0 + dy * t + ny * off]);
    }
    pts.push([x1, y1]);
    return pts;
  }

  const palcoI = $("#irmaos .palco"), zeus = $(".estatua--zeus"), poseidon = $(".estatua--poseidon");
  function desenharFresta() {
    const W = palcoI.clientWidth, H = palcoI.clientHeight;
    if (!W || !H) return;
    const yChao = zeus.offsetTop + zeus.offsetHeight, cx = W / 2, cy = yChao + Math.max(7, H * .014);
    const esq = trinca(cx, cy, zeus.offsetLeft + zeus.offsetWidth * (276 / 320), yChao + 3, 5, 11);
    const dir = trinca(cx, cy, poseidon.offsetLeft + poseidon.offsetWidth * (44 / 320), yChao + 3, 5, 37);
    const baixo = trinca(cx, cy, cx + W * .012, H * .965, 8, 73);
    const pe = esq[Math.floor(esq.length * .55)], pd = dir[Math.floor(dir.length * .45)], pb = baixo[Math.floor(baixo.length * .5)];
    const d = [esq, dir, baixo,
      trinca(pe[0], pe[1], pe[0] - W * .03, pe[1] + H * .05, 3, 101),
      trinca(pd[0], pd[1], pd[0] + W * .035, pd[1] + H * .055, 3, 131),
      trinca(pb[0], pb[1], pb[0] - W * .028, pb[1] + H * .025, 3, 151)];
    ["f-esq", "f-dir", "f-baixo", "f-g1", "f-g2", "f-g3"].forEach((id, i) => document.getElementById(id).setAttribute("d", caminho(d[i])));
    $(".brilho-pos").setAttribute("transform", `translate(${f1(cx)} ${f1(cy)})`);
  }

  const PRETO = "#1C1815", ARGILA = "#B2643A", INCISO = "#CC8A5A";
  const POSES = {
    avanco:    { n:[4,-100],  h:[10,-134],  cF:[70,-98],  mF:[108,-108], cT:[-58,-112], mT:[-70,-160], jF:[48,52], pF:[68,114], jT:[-36,56], pT:[-72,112] },
    estocada:  { n:[14,-98],  h:[26,-130],  cF:[58,-76],  mF:[98,-72],   cT:[24,-70],   mT:[64,-66],   jF:[52,50], pF:[74,114], jT:[-34,56], pT:[-70,112] },
    empe:      { n:[0,-100],  h:[5,-134],   cF:[36,-64],  mF:[70,-46],   cT:[-16,-50],  mT:[-14,-4],   jF:[12,56], pF:[18,114], jT:[-12,56], pT:[-20,114] },
    escuta:    { n:[-2,-100], h:[6,-132],   cF:[16,-52],  mF:[22,-6],    cT:[-34,-66],  mT:[-12,-122], jF:[10,56], pF:[16,114], jT:[-10,56], pT:[-18,114] },
    sentado:   { n:[-6,-100], h:[0,-134],   cF:[24,-58],  mF:[50,-66],   cT:[-24,-54],  mT:[6,-24],    jF:[52,2],  pF:[54,60],  jT:[46,6],   pT:[40,62] },
    ajoelhado: { n:[8,-94],   h:[22,-122],  cF:[-6,-46],  mF:[-28,-26],  cT:[-20,-52],  mT:[-36,-30],  jF:[40,26], pF:[44,60],  jT:[-4,58],  pT:[-48,60] },
    puxando:   { n:[-30,-92], h:[-38,-124], cF:[10,-80],  mF:[46,-74],   cT:[6,-72],    mT:[42,-66],   jF:[38,46], pF:[66,112], jT:[-18,58], pT:[-42,112] },
    caindo:    { n:[0,-100],  h:[3,-134],   cF:[44,-128], mF:[64,-170],  cT:[-46,-84],  mT:[-86,-104], jF:[28,52], pF:[36,114], jT:[-30,40], pT:[-70,70] }
  };
  const olho = (h) => `<circle cx="${h[0] + 7}" cy="${h[1] - 3}" r="1.8" fill="${INCISO}"/>`;

  function corpo(P) {
    const [nx, ny] = P.n, len = Math.hypot(nx, ny), ux = nx / len, uy = ny / len, px = -uy, py = ux;
    const em = (a, b) => [nx + px * a + ux * b, ny + py * a + uy * b];
    const quadril = (a, b) => [px * a + ux * b, py * a + uy * b];
    const L = (...pts) => caminho(pts);
    const membros = [L(em(-22, -8), P.cT, P.mT), L([0, 0], P.jT, P.pT), L([0, 0], P.jF, P.pF), L(em(22, -8), P.cF, P.mF), L(P.n, P.h)].join(" ");
    const tronco = `M${P2(em(26, 0))} L${P2(quadril(11, 0))} L${P2(quadril(-11, 0))} L${P2(em(-26, 0))} Z`;
    const incisoes = `M${P2(em(-15, -14))} Q${P2(em(0, -26))} ${P2(em(15, -14))} M${P2(quadril(-11, 18))} L${P2(quadril(11, 18))}`;
    return `<path d="${membros}" fill="none" stroke="${PRETO}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="${tronco}" fill="${PRETO}" stroke="${PRETO}" stroke-width="6" stroke-linejoin="round"/>` +
      `<circle cx="${P.h[0]}" cy="${P.h[1]}" r="17" fill="${PRETO}"/>` +
      `<path d="${incisoes}" fill="none" stroke="${INCISO}" stroke-width="1.5" stroke-linecap="round"/>` + olho(P.h);
  }

  const ATR = {
    nuvem(P) {
      const [x, y] = P.h;
      const tufo = ([dx, dy, r]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${r}" fill="${PRETO}" stroke="${INCISO}" stroke-width="1.1"/>`;
      return [[-12,-12,11],[2,-18,10],[14,-12,8],[-18,0,9],[-16,13,7]].map(tufo).join("") +
        `<circle cx="${x}" cy="${y}" r="17" fill="${PRETO}"/>` + olho(P.h) + [[10,15,7],[4,21,7],[13,23,5]].map(tufo).join("");
    },
    onda(P) {
      const [x, y] = P.h;
      return `<path d="M${x-12},${y-12} C${x-34},${y-8} ${x-34},${y+16} ${x-18},${y+20} C${x-26},${y+8} ${x-20},${y-2} ${x-8},${y}" fill="${PRETO}"/>` +
        `<path d="M${x+2},${y+11} C${x+20},${y+13} ${x+24},${y+32} ${x+10},${y+42} C${x+6},${y+32} ${x-2},${y+24} ${x-6},${y+13} Z" fill="${PRETO}"/>` +
        `<path d="M${x+4},${y+20} q6,-3 8,3 M${x+3},${y+29} q6,-3 7,3 M${x-25},${y+2} q5,-4 8,1 M${x-23},${y+11} q5,-4 8,1" fill="none" stroke="${INCISO}" stroke-width="1.2" stroke-linecap="round"/>`;
    },
    elmo(P) {
      const [x, y] = P.h;
      return `<path d="M${x-19},${y} C${x-20},${y-28} ${x+20},${y-28} ${x+19},${y-4} L${x+5},${y-4} L${x+3},${y+4} L${x-18},${y+16} Z" fill="${PRETO}" stroke="${INCISO}" stroke-width="1.3" stroke-linejoin="round"/>` + olho(P.h);
    },
    crista(P) {
      const [x, y] = P.h;
      return `<path d="M${x-22},${y-12} C${x-14},${y-52} ${x+18},${y-50} ${x+24},${y-16} C${x+12},${y-34} ${x-8},${y-36} ${x-22},${y-12} Z" fill="${PRETO}"/>` +
        `<path d="M${x-18},${y-4} C${x-16},${y-24} ${x+16},${y-26} ${x+18},${y-6} M${x-12},${y-30} l4,-6 M${x-2},${y-35} l3,-6 M${x+8},${y-35} l2,-6" fill="none" stroke="${INCISO}" stroke-width="1.2"/>`;
    },
    diadema(P) {
      const [x, y] = P.h;
      return `<path d="M${x-13},${y-12} L${x-10},${y-26} L${x-5},${y-15} L${x},${y-29} L${x+5},${y-15} L${x+10},${y-26} L${x+13},${y-12} Z" fill="${PRETO}"/>` +
        `<path d="M${x-13},${y-12} Q${x},${y-17} ${x+13},${y-12}" stroke="${INCISO}" stroke-width="1.2" fill="none"/>`;
    },
    vestido(P) {
      const a = P.pF, b = P.pT, fundo = Math.max(a[1], b[1]) - 4;
      const dobras = [.28, .5, .72].map(t => `M${f1(-13 + 28 * t)},2 L${f1(b[0] - 10 + (a[0] - b[0] + 20) * t)},${fundo - 6}`).join(" ");
      return `<path d="M-13,-6 L15,-6 L${a[0] + 10},${fundo} L${b[0] - 10},${fundo} Z" fill="${PRETO}" stroke="${PRETO}" stroke-width="4" stroke-linejoin="round"/>` +
        `<path d="${dobras}" stroke="${INCISO}" stroke-width="1.2" fill="none"/>`;
    },
    escudo(P) {
      const x = P.n[0] - 28, y = P.n[1] + 36;
      return `<circle cx="${x}" cy="${y}" r="27" fill="${PRETO}"/><circle cx="${x}" cy="${y}" r="21" fill="none" stroke="${INCISO}" stroke-width="1.3"/>` +
        `<path d="M${x},${y-9} L${x+3},${y-3} L${x+9},${y} L${x+3},${y+3} L${x},${y+9} L${x-3},${y+3} L${x-9},${y} L${x-3},${y-3} Z" fill="none" stroke="${INCISO}" stroke-width="1.1"/>`;
    },
    cetro(P) {
      const [x, y] = P.mF;
      return `<path d="M${x},${y-86} L${x},${y+126}" stroke="${PRETO}" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${y-90}" r="5" fill="${PRETO}"/>`;
    },
    trono() {
      return `<path d="M-36,8 L44,8 M-32,8 L-32,62 M38,8 L38,62 M-34,8 L-38,-92" stroke="${PRETO}" stroke-width="8" stroke-linecap="round" fill="none"/>` +
        `<path d="M-28,20 L34,20" stroke="${INCISO}" stroke-width="1.2"/><circle cx="-38" cy="-96" r="6" fill="${PRETO}"/>`;
    }
  };

  function raio(cx, cy, ang) {
    const r = ang * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
    const pts = [[-46,6],[-12,-6],[-6,5],[22,-8],[28,3],[52,-10]].map(([x, y]) => P2([cx + x * c - y * s, cy + x * s + y * c])).join(" ");
    return `<polyline points="${pts}" fill="none" stroke="${PRETO}" stroke-width="7" stroke-linejoin="miter" stroke-miterlimit="4"/>`;
  }
  function haste(cx, cy, ang, tras, frente, n) {
    const r = ang * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r), px = -uy, py = ux;
    const fim = [cx + ux * frente, cy + uy * frente], ab = n === 2 ? 11 : 9, meio = (n - 1) / 2;
    let d = `M${P2([cx - ux * tras, cy - uy * tras])} L${P2(fim)} M${P2([fim[0] - px * ab * meio, fim[1] - py * ab * meio])} L${P2([fim[0] + px * ab * meio, fim[1] + py * ab * meio])}`;
    for (let i = 0; i < n; i++) {
      const o = (i - meio) * ab, s = [fim[0] + px * o, fim[1] + py * o];
      d += ` M${P2(s)} L${P2([s[0] + ux * 22, s[1] + uy * 22])}`;
    }
    return `<path d="${d}" fill="none" stroke="${PRETO}" stroke-width="4.5" stroke-linecap="round"/>`;
  }

  function noPainel(o, [lx, ly]) {
    const s = o.s || 1, d = o.dir || 1, r = (o.girar || 0) * Math.PI / 180, X = lx * d * s, Y = ly * s;
    return [o.x + X * Math.cos(r) - Y * Math.sin(r), o.y + X * Math.sin(r) + Y * Math.cos(r)];
  }
  function figura(o) {
    const P = POSES[o.pose], s = o.s || 1, d = o.dir || 1;
    const atras = (o.atras || []).map(k => ATR[k](P)).join(""), frente = (o.frente || []).map(k => ATR[k](P)).join("");
    return `<g transform="translate(${o.x} ${f1(o.y)}) rotate(${o.girar || 0}) scale(${d * s} ${s})">${atras}${corpo(P)}${frente}${o.arma ? o.arma(P) : ""}</g>`;
  }

  function palmeta(x, y) {
    let s = "";
    for (let i = -4; i <= 4; i++) s += `<path transform="translate(${x} ${y}) rotate(${i * 15})" d="M0,0 C-10,-44 -8,-104 0,-128 C8,-104 10,-44 0,0 Z" fill="${PRETO}"/>`;
    const voluta = (k) => `<path d="M${x + k * 64},${y + 22} C${x + k * 64},${y - 14} ${x + k * 14},${y - 14} ${x + k * 10},${y + 8} C${x + k * 8},${y + 18} ${x + k * 26},${y + 20} ${x + k * 28},${y + 8}" fill="none" stroke="${PRETO}" stroke-width="6" stroke-linecap="round"/>`;
    return s + voluta(-1) + voluta(1) + `<circle cx="${x}" cy="${y + 6}" r="10" fill="${PRETO}"/>`;
  }
  function roseta(x, y) {
    let s = `<circle cx="${x}" cy="${y}" r="4" fill="${PRETO}"/>`;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; s += `<circle cx="${f1(x + Math.cos(a) * 10)}" cy="${f1(y + Math.sin(a) * 10)}" r="3" fill="${PRETO}"/>`; }
    return s;
  }
  function pedra(x, y, r, semente) {
    const pts = [];
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2, rr = r * (.72 + .28 * Math.abs(ruido(semente + i))); pts.push(P2([x + Math.cos(a) * rr, y + Math.sin(a) * rr])); }
    return `<polygon points="${pts.join(" ")}" fill="${PRETO}"/>`;
  }
  function altar(x) {
    return `<rect x="${x - 52}" y="372" width="104" height="10" fill="${PRETO}"/><rect x="${x - 44}" y="382" width="88" height="76" fill="${PRETO}"/>` +
      `<path d="M${x - 40},394 L${x + 40},394 M${x - 40},446 L${x + 40},446" stroke="${INCISO}" stroke-width="1.3"/>`;
  }
  function capacete(x, y) {
    return `<g transform="translate(${x} ${y}) scale(1.1)">` +
      `<path d="M-34,-24 C-24,-70 22,-74 34,-30 C20,-56 -16,-56 -34,-24 Z" fill="${PRETO}"/>` +
      `<path d="M-30,36 C-36,0 -28,-34 0,-38 C26,-40 36,-18 34,6 C33,20 30,30 32,40 L14,40 C12,30 12,24 8,22 L-30,36 Z" fill="${PRETO}"/>` +
      `<path d="M10,-10 C16,-14 26,-12 28,-6 C22,-2 14,-4 10,-10 Z" fill="${ARGILA}"/>` +
      `<path d="M-26,-6 C-14,-14 6,-16 26,-14 M-12,-46 l3,-7 M-2,-50 l2,-7 M8,-50 l1,-7 M18,-46 l-1,-7" stroke="${INCISO}" stroke-width="1.2" fill="none"/></g>`;
  }
  function sortes() {
    const simb = { nuvem: "M-8,4 a4,4 0 0 1 3,-6 a5,5 0 0 1 9,0 a4,4 0 0 1 4,6 Z", onda: "M-8,3 C-6,-7 7,-7 5,1 C4,5 -1,4 0,0", espiral: "M0,0 a1.5,1.5 0 1 1 3,0 a3,3 0 1 1 -6,0 a4.5,4.5 0 1 1 9,0" };
    return [[2405, 222, "nuvem"], [2598, 222, "onda"], [2726, 178, "espiral"]].map(([x, y, k]) =>
      `<path d="M2500,262 Q${(2500 + x) / 2},${y - 40} ${x},${y + 15}" fill="none" stroke="${PRETO}" stroke-width="1.8" stroke-dasharray="1 7" stroke-linecap="round"/>` +
      `<circle cx="${x}" cy="${y}" r="14" fill="${PRETO}"/><path transform="translate(${x} ${y})" d="${simb[k]}" fill="none" stroke="${INCISO}" stroke-width="1.3" stroke-linecap="round"/>`).join("");
  }
  function corrente(a, b, sag) {
    const c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag];
    return `<path d="M${P2(a)} Q${P2(c)} ${P2(b)}" fill="none" stroke="${PRETO}" stroke-width="5" stroke-dasharray="8 4"/>`;
  }
  function ondasNoChao(x0, x1) {
    let d = `M${x0},456 L${x1},456`;
    for (let x = x0; x < x1 - 30; x += 42) d += ` M${x},456 C${x + 8},456 ${x + 10},432 ${x + 26},432 C${x + 38},432 ${x + 38},450 ${x + 28},450 C${x + 22},450 ${x + 20},443 ${x + 25},441`;
    return `<path d="${d}" fill="none" stroke="${PRETO}" stroke-width="4" stroke-linecap="round"/>`;
  }
  function nuvens(x, y, k = 1) {
    return [[-30,0,20],[-6,-14,24],[22,-4,20],[42,10,14],[-50,12,13]].map(([dx, dy, r]) =>
      `<circle cx="${f1(x + dx * k)}" cy="${f1(y + dy * k)}" r="${f1(r * k)}" fill="${PRETO}" stroke="${INCISO}" stroke-width="1.2"/>`).join("");
  }
  function sussurro(a, b, curva) {
    const sentido = Math.sign(b[0] - a[0]), fim = [b[0] - sentido * 22, b[1] - 2];
    const c1 = [a[0] + (b[0] - a[0]) * .3, a[1] - curva], c2 = [a[0] + (b[0] - a[0]) * .7, b[1] + curva];
    return `<path d="M${P2(a)} C${P2(c1)} ${P2(c2)} ${P2(fim)}" fill="none" stroke="${PRETO}" stroke-width="2" stroke-dasharray="1.5 8" stroke-linecap="round" opacity=".85"/>`;
  }

  function desenharFriso() {
    const F = {
      p1hades: { pose: "estocada", x: 1050, y: 353, s: .92, frente: ["elmo"], arma: P => haste(P.mF[0], P.mF[1], 0, 60, 50, 2) },
      p1zeus:  { pose: "avanco", x: 1250, y: 344, frente: ["nuvem"], arma: P => raio(P.mT[0], P.mT[1], -18) },
      p1pos:   { pose: "estocada", x: 1430, y: 344, frente: ["onda"], arma: P => haste(P.mF[0], P.mF[1], -4, 120, 96, 3) },
      p1tita:  { pose: "caindo", x: 1790, y: 318, s: 1.38, dir: -1, girar: 24 },
      p2zeus:  { pose: "empe", x: 2290, y: 344, frente: ["nuvem"] },
      p2pos:   { pose: "empe", x: 2710, y: 344, dir: -1, frente: ["onda"] },
      p2hades: { pose: "empe", x: 2862, y: 353, s: .92, dir: -1, frente: ["elmo"] },
      p3pos:   { pose: "puxando", x: 3190, y: 344, frente: ["onda"] },
      p3zeus:  { pose: "ajoelhado", x: 3480, y: 398, frente: ["nuvem"] },
      p3hera:  { pose: "puxando", x: 3770, y: 344, dir: -1, frente: ["vestido", "diadema"] },
      p3atena: { pose: "puxando", x: 3890, y: 344, dir: -1, atras: ["escudo"], frente: ["vestido", "crista"] },
      p4pos:   { pose: "escuta", x: 4250, y: 344, frente: ["onda"] },
      p4zeus:  { pose: "sentado", x: 4760, y: 396, dir: -1, atras: ["trono"], frente: ["nuvem", "cetro"] }
    };
    const J = (k, j) => noPainel(F[k], POSES[F[k].pose][j]);
    const media = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const c1a = media(J("p3pos", "mF"), J("p3pos", "mT")), c1b = media(J("p3zeus", "mF"), J("p3zeus", "mT"));
    const c2a = J("p3zeus", "n"), c2b = media(J("p3hera", "mF"), J("p3hera", "mT")), c2c = media(J("p3atena", "mF"), J("p3atena", "mT"));
    const S = [4505, 222], cabP = J("p4pos", "h"), cabZ = J("p4zeus", "h");

    $("#friso-figuras").innerHTML = [
      palmeta(500, 440), palmeta(5500, 440),
      ...[[1062,112],[2090,118],[2930,104],[3050,150],[4090,132],[4960,118],[1960,400]].map(([x, y]) => roseta(x, y)),
      pedra(1650,170,16,1), pedra(1722,108,12,9), pedra(1905,218,18,17), pedra(1950,330,11,25), pedra(1612,298,10,33),
      figura(F.p1hades), figura(F.p1zeus), figura(F.p1pos), figura(F.p1tita),
      altar(2500), capacete(2500, 340), sortes(), figura(F.p2zeus), figura(F.p2pos), figura(F.p2hades),
      haste(3080, 452, 180, 50, 60, 3), corrente(c1a, c1b, 30), corrente(c2a, c2b, 36), corrente(c2b, c2c, 14),
      figura(F.p3pos), figura(F.p3zeus), figura(F.p3hera), figura(F.p3atena),
      ondasNoChao(4030, 4440), nuvens(4880, 238), nuvens(4650, 134, .7), sussurro(S, cabP, 30), sussurro(S, cabZ, -26),
      figura(F.p4pos), figura(F.p4zeus)
    ].join("");

    const meioCorrente = media(c2a, c2b); meioCorrente[1] += 18;
    const brilhos = { p1: [1580, 120], p2: [2521, 331], p3: meioCorrente, p4p: [cabP[0] - 4, cabP[1] + 2], p4z: [cabZ[0] + 4, cabZ[1] + 2], origem: S };
    $(".trilho").insertAdjacentHTML("beforeend", Object.entries(brilhos).map(([k, [x, y]]) =>
      `<span class="brilho-friso" data-brilho="${k}" aria-hidden="true" style="left:${(x / 60).toFixed(3)}%;top:${(y / 5.2).toFixed(3)}%"></span>`).join(""));

    const cima = trinca(80, 222, 66, 0, 9, 201), baixo = trinca(80, 222, 94, 520, 9, 233);
    const pb = baixo[Math.floor(baixo.length * .55)], pc = cima[Math.floor(cima.length * .5)];
    const d = [cima, baixo, trinca(pb[0], pb[1], pb[0] + 46, pb[1] + 60, 5, 257), trinca(pc[0], pc[1], pc[0] - 40, pc[1] - 34, 5, 281)].map(caminho);
    $$(".racha .r-sombra").forEach((p, i) => p.setAttribute("d", d[i]));
    $$(".racha .r-luz").forEach((p, i) => p.setAttribute("d", d[i]));
  }

  desenharFresta();
  desenharFriso();
  addEventListener("resize", desenharFresta);

  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.addEventListener("refreshInit", desenharFresta);

  const GATILHOS_SOM = [
    [".fenda--principal", (v) => v.strokeDashoffset === 0, ["fissura"]],
    [".racha path", (v) => v.strokeDashoffset === 0, ["fissura"]],
    [".relampago", (v) => v.strokeDashoffset === 0, ["trovao"]],
    [".rachadura", (v) => v.strokeDashoffset === 0, ["racha"]],
    [".clarao-impacto", (v) => v.opacity > .5, ["baque", "estalo", "trovao"]]
  ];
  function sonsDaCena(tl) {
    tl.getChildren(false, true, false).forEach((tw) => {
      const alvos = tw.targets();
      GATILHOS_SOM.forEach(([seletor, quando, nomes]) => {
        if (!quando(tw.vars) || !alvos.some((a) => a && a.matches && a.matches(seletor))) return;
        tl.call(() => { if (window.pomoSom && (!tl.scrollTrigger || tl.scrollTrigger.direction > 0)) window.pomoSom(nomes); }, null, tw.startTime());
      });
    });
  }

  function cena(seletor, construir) {
    const tl = gsap.timeline({ paused: true, defaults: { ease: "none" } });
    construir(tl);
    sonsDaCena(tl);
    ScrollTrigger.create({
      trigger: seletor, start: "top top", pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true,
      end: () => "+=" + Math.round(tl.duration() * innerHeight * TEMPO.passo)
    });
  }
  function frase(tl, alvo, t, { fica = 0 } = {}) {
    const el = typeof alvo === "string" ? $(alvo) : alvo;
    tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: TEMPO.entrada }, t);
    const sai = t + TEMPO.entrada + leitura(el) + fica;
    tl.to(el, { opacity: 0, y: -12, duration: TEMPO.saida }, sai);
    return sai + TEMPO.saida;
  }
  function cintilar(tl, alvo, t, resto = .45) {
    tl.fromTo(alvo, { opacity: 0, scale: .3 }, { opacity: 1, scale: 1.15, duration: .5 }, t)
      .to(alvo, { opacity: resto, scale: .8, duration: .9 }, t + .5);
  }

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    raiz.classList.add("movimento");
    const janela = $(".friso-janela");
    janela.removeAttribute("tabindex");
    desenharFresta();

    gsap.set("#prologo .veu", { opacity: .86 });
    gsap.set(".nevoa--esq", { xPercent: 50 });
    gsap.set(".nevoa--dir", { xPercent: -50 });
    gsap.set(".nevoa--baixo", { yPercent: -22 });
    gsap.set("#camera", { svgOrigin: "800 400", scale: 1.06 });
    cena("#prologo", (tl) => {
      tl.to(".dica", { opacity: 0, duration: .6 }, 0)
        .to("#camera", { scale: 1, duration: 4.4, ease: "power1.out" }, 0)
        .to("#prologo .veu", { opacity: 0, duration: 3.4 }, .4)
        .to(".nevoa--esq", { xPercent: 0, duration: 3.8 }, .4)
        .to(".nevoa--dir", { xPercent: 0, duration: 3.8 }, .4)
        .to(".nevoa--baixo", { yPercent: 0, duration: 3.8 }, .4);
      const f1el = $(".fala--1"), sai1 = Math.max(4.4, leitura(f1el) + .6);
      tl.to(f1el, { opacity: 0, y: -12, duration: TEMPO.saida }, sai1);
      const t = frase(tl, ".fala--2", sai1 + TEMPO.saida + .3);
      tl.to("#camera", { scale: 6, duration: 3, ease: "power2.in" }, t)
        .to("#perto", { y: 220, duration: 3, ease: "power2.in" }, t)
        .to(".nevoa--esq", { xPercent: 50, duration: 2.4 }, t + .4)
        .to(".nevoa--dir", { xPercent: -50, duration: 2.4 }, t + .4)
        .to("#prologo .veu", { opacity: 1, duration: 1.8 }, t + 1.2);
    });

    gsap.set("#irmaos .veu", { opacity: 1 });
    gsap.set(".luz", { opacity: 0 });
    gsap.set(".estatua", { opacity: 0, y: 40 });
    gsap.set(".corte", { attr: { width: 0 } });
    gsap.set(".epiteto", { opacity: 0, y: 10 });
    gsap.set(".fenda", { strokeDashoffset: 1 });
    gsap.set(".brilho", { transformOrigin: "50% 50%" });
    cena("#irmaos", (tl) => {
      const ez = $(".epiteto--zeus"), ep = $(".epiteto--poseidon");
      tl.to("#irmaos .veu", { opacity: 0, duration: 1.4 }, 0)
        .to(".luz--zeus", { opacity: 1, duration: 1.4 }, .6)
        .to(".estatua--zeus", { opacity: 1, y: 0, duration: 1.6, ease: "power1.out" }, .8)
        .to("#corte-zeus .corte", { attr: { width: 216 }, duration: 1 }, 2.2)
        .to(ez, { opacity: 1, y: 0, duration: 1 }, 2.8);
      let t = 3.8 + leitura(ez) * .5;
      tl.to(".luz--poseidon", { opacity: 1, duration: 1.4 }, t - .2)
        .to(".estatua--poseidon", { opacity: 1, y: 0, duration: 1.6, ease: "power1.out" }, t)
        .to("#corte-poseidon .corte", { attr: { width: 216 }, duration: 1 }, t + 1.4)
        .to(ep, { opacity: 1, y: 0, duration: 1 }, t + 2);
      t += 3 + leitura(ep);
      tl.to(".epiteto", { opacity: 0, duration: .8 }, t);
      t = frase(tl, ".fala--3", t + 1.4);
      const f4 = $(".fala--4"), t4 = t + .2;
      tl.fromTo(f4, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: TEMPO.entrada }, t4);
      cintilar(tl, ".brilho", t4 + 1.2);
      tl.to(".fenda--principal", { strokeDashoffset: 0, duration: 1.6, ease: "power2.out" }, t4 + 1.5)
        .to(".fenda--galho", { strokeDashoffset: 0, duration: .9, ease: "power2.out" }, t4 + 2.6);
      const sai4 = Math.max(t4 + TEMPO.entrada + leitura(f4), t4 + 3.6) + .8;
      tl.to(f4, { opacity: 0, y: -12, duration: TEMPO.saida }, sai4)
        .to("#irmaos .veu", { opacity: 1, duration: 1.6 }, sai4 + .4);
    });

    const palcoP = $("#passado .palco"), trilho = $(".trilho");
    const centro = (u) => () => -(u * (trilho.offsetHeight / 520) - palcoP.clientWidth / 2);
    gsap.set(palcoP, { backgroundColor: "#C9CED0" });
    gsap.set(".anfora", { opacity: 0, y: 24, transformOrigin: "50% 50.7%" });
    gsap.set(".vaso", { opacity: 0 });
    gsap.set(".racha path", { strokeDashoffset: 1 });
    cena("#passado", (tl) => {
      tl.to(".anfora", { opacity: 1, y: 0, duration: 1.4, ease: "power1.out" }, .2);
      let t = frase(tl, ".fala--vaso", 1);
      tl.to(".anfora", { scale: 5.6, duration: 2.6, ease: "power2.in" }, t - .6)
        .to(palcoP, { backgroundColor: "#1C1815", duration: 1.8 }, t - .2)
        .to(".marca", { color: "#E6D5BF", duration: 1 }, t + .4)
        .to(".vaso", { opacity: 1, duration: 1 }, t + 1)
        .to(".anfora", { opacity: 0, duration: .6 }, t + 1.4);

      let u = 1440, tu = t + .8;
      const andar = (alvo, ate) => {
        tl.fromTo(trilho, { x: centro(u) }, { x: centro(alvo), duration: Math.max(.01, ate - tu), ease: "none", immediateRender: false }, tu);
        u = alvo; tu = ate;
      };
      let ini = t + 2, fim;
      fim = frase(tl, ".fala--p1", ini); cintilar(tl, '[data-brilho="p1"]', ini + .8);
      andar(1560, fim); andar(2440, fim + TEMPO.pan);
      ini = fim + TEMPO.pan - .4;
      fim = frase(tl, ".fala--p2", ini); cintilar(tl, '[data-brilho="p2"]', ini + .8);
      andar(2560, fim); andar(3440, fim + TEMPO.pan);
      ini = fim + TEMPO.pan - .4;
      fim = frase(tl, ".fala--p3", ini); cintilar(tl, '[data-brilho="p3"]', ini + .8);
      andar(3560, fim); andar(4440, fim + TEMPO.pan);
      ini = fim + TEMPO.pan - .4;
      fim = frase(tl, ".fala--p4a", ini); cintilar(tl, '[data-brilho="p4p"]', ini + .8);
      ini = fim + .2;
      fim = frase(tl, ".fala--p4b", ini); cintilar(tl, '[data-brilho="p4z"]', ini + .8);
      ini = fim + .2;
      fim = frase(tl, ".fala--p4c", ini, { fica: 1.4 });
      cintilar(tl, '[data-brilho="origem"]', ini + 1.4, .6);
      tl.to(".racha path", { strokeDashoffset: 0, duration: 1.8, ease: "power2.out" }, ini + 1.7);
      andar(4560, fim);
      tl.to("#passado .veu", { opacity: 1, duration: 1.8 }, fim - .4)
        .to(".marca", { color: "#4F5659", duration: 1 }, fim);
    });

    return () => { raiz.classList.remove("movimento"); janela.setAttribute("tabindex", "0"); };
  });

  Object.assign(POSES, {
    descendo:  { n:[6,-100], h:[12,-134], cF:[50,-120], mF:[86,-146], cT:[-46,-104], mT:[-80,-126], jF:[22,58], pF:[12,118], jT:[-12,56], pT:[-30,110] },
    subindo:   { n:[8,-100], h:[14,-134], cF:[40,-136], mF:[58,-180], cT:[-36,-118], mT:[-54,-152], jF:[16,58], pF:[4,118], jT:[-16,52], pT:[-34,104] },
    encarando: { n:[2,-100], h:[8,-134], cF:[30,-64], mF:[52,-40], cT:[-24,-60], mT:[-40,-24], jF:[20,56], pF:[34,114], jT:[-16,56], pT:[-30,114] },
    golpe:     { n:[16,-96], h:[28,-128], cF:[64,-90], mF:[110,-92], cT:[-30,-84], mT:[-60,-96], jF:[56,48], pF:[82,114], jT:[-36,58], pT:[-74,112] }
  });
  const CARVAO = "#24282B";
  const corpoVivo = (P) => corpo(P).replaceAll(PRETO, CARVAO).replaceAll(INCISO, "#6B7275");
  const angulo = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  const misturar = (A, B, t) => Object.fromEntries(Object.keys(A).map(k => [k, [A[k][0] + (B[k][0] - A[k][0]) * t, A[k][1] + (B[k][1] - A[k][1]) * t]]));
  const VIVO = {
    zeus(P) {
      const [x, y] = P.h, tufo = ([dx, dy, r]) => `<circle cx="${f1(x + dx)}" cy="${f1(y + dy)}" r="${r}" fill="#F2F3F1" stroke="${CARVAO}" stroke-width="1.6"/>`;
      const r = raio(P.mF[0], P.mF[1], angulo(P.cF, P.mF)), alvo = `stroke="${PRETO}" stroke-width="7"`;
      return [[-14,-14,13],[2,-22,12],[16,-14,10],[-22,0,11],[-20,15,9],[-8,-26,9]].map(tufo).join("") + corpoVivo(P) +
        [[10,15,8],[3,22,8],[14,25,6]].map(tufo).join("") +
        r.replace(alvo, `stroke="#F5F7FA" stroke-width="16" opacity=".22"`) + r.replace(alvo, `stroke="#F5F7FA" stroke-width="5.5"`);
    },
    poseidon(P) {
      const h = haste(P.mF[0], P.mF[1], angulo(P.cF, P.mF), 110, 90, 3);
      return corpoVivo(P) + ATR.onda(P).replaceAll(PRETO, "#2F5D5C").replaceAll(INCISO, "#8FBDB9") +
        h.replaceAll(PRETO, "#1F3B3B") + h.replaceAll(PRETO, "#8FBDB9").replace('stroke-width="4.5"', 'stroke-width="1.4"');
    }
  };
  function boneco(seletor, estilo, seq, quem) {
    const g = $(seletor), caixa = g.closest(".deus"), svg = caixa.querySelector("svg"), est = { k: 0 };
    const tela = document.createElement("canvas");
    tela.className = "deus__tela"; tela.setAttribute("aria-hidden", "true"); caixa.appendChild(tela);
    const desenhar = () => {
      const i = Math.max(0, Math.min(Math.floor(est.k), seq.length - 2)), u = Math.min(1, est.k - i);
      if (window.pomoDeus && window.pomoDeus(tela, quem, seq[i], seq[i + 1], u, est.k)) { svg.style.visibility = "hidden"; tela.style.visibility = "visible"; return; }
      g.innerHTML = estilo(misturar(POSES[seq[i]], POSES[seq[i + 1]], u));
    };
    desenhar();
    (window.pomoDeusesEsperando = window.pomoDeusesEsperando || []).push(desenhar);
    addEventListener("resize", desenhar);
    return { est, desenhar };
  }
  const vivoZeus = boneco(".deus--zeus svg > g", VIVO.zeus, ["descendo", "encarando", "golpe"], "z");
  const vivoPoseidon = boneco(".deus--poseidon svg > g > g", VIVO.poseidon, ["subindo", "encarando", "golpe"], "p");

  (function desenharTravessia() {
    let ceu = `<defs><linearGradient id="g-ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B4145"/><stop offset=".45" stop-color="#5A6165"/><stop offset=".62" stop-color="#7C8387"/><stop offset="1" stop-color="#666D71"/></linearGradient></defs><rect width="600" height="2400" fill="url(#g-ceu)"/>`;
    for (let i = 0; i < 46; i++) ceu += `<circle cx="${f1(300 + ruido(i + 50) * 320)}" cy="${f1(60 + i * 22 + ruido(i) * 30)}" r="${f1(70 + Math.abs(ruido(i + 90)) * 90)}" fill="${["#4C5256", "#5B6266", "#6A7175"][i % 3]}" opacity=".9"/>`;
    ceu += [[430, 180], [480, 470], [400, 760]].map(([x, y], i) => {
      const pts = [[x, y]]; for (let k = 1; k <= 6; k++) pts.push([x + ruido(i * 9 + k) * 34 - k * 4, y + k * 34]);
      return `<path class="relampago" pathLength="1" d="${caminho(pts)}" fill="none" stroke="#F5F7FA" stroke-width="3" stroke-linejoin="miter"/>`;
    }).join("");
    ceu += `<path d="${Array.from({ length: 70 }, (_, i) => `M${(i * 37) % 640 - 20},${1050 + (i * 53) % 700} l-14,46`).join(" ")}" stroke="#AEB4B7" stroke-width="1.4" opacity=".35"/>`;
    ceu += `<path d="M0,1560 L600,1548 L600,2400 L0,2400 Z" fill="#6F7671"/>` +
      `<path d="${Array.from({ length: 18 }, (_, i) => `M0,${1580 + i * 26} L600,${1572 + i * 26}`).join(" ")}" stroke="#7D847E" stroke-width="7" opacity=".7"/>` +
      [[360, 1640], [395, 1652], [520, 1700], [450, 1760]].map(([x, y]) => `<path d="M${x},${y} l14,-12 l14,12 v14 h-28 Z" fill="#555C60"/>`).join("") +
      [[430, 1700], [530, 1790], [470, 1880]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="9" fill="#3E4447"/>` +
        `<path class="fumaca" d="M${x - 10},${y} C${x - 30},${y - 60} ${x + 20},${y - 110} ${x - 6},${y - 170} C${x - 26},${y - 220} ${x + 26},${y - 260} ${x + 6},${y - 320} L${x + 30},${y - 320} C${x + 50},${y - 260} ${x + 4},${y - 220} ${x + 22},${y - 170} C${x + 44},${y - 110} ${x + 2},${y - 60} ${x + 12},${y} Z" fill="#596064" opacity=".75"/>`).join("") +
      `<path d="M600,1980 L520,2060 L470,2140 L380,2240 L300,2400 L600,2400 Z" fill="#555C60"/><rect y="2140" width="600" height="260" fill="#7C8387" opacity=".55"/>`;
    $("#mundo-ceu").innerHTML = ceu;

    let mar = `<defs><linearGradient id="g-mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E6569"/><stop offset=".37" stop-color="#7A8285"/><stop offset=".375" stop-color="#4E6D6C"/><stop offset=".6" stop-color="#2F4C4B"/><stop offset="1" stop-color="#132322"/></linearGradient></defs><rect width="600" height="2400" fill="url(#g-mar)"/>`;
    mar += `<path d="M0,0 L230,0 L170,120 L120,260 L60,420 L0,520 Z" fill="#555C60"/><path d="M0,600 C80,590 160,640 240,700 C290,740 320,800 360,900 L0,900 Z" fill="#646B6F"/>`;
    mar += [[40, 650], [92, 662], [150, 690], [204, 724], [256, 770]].map(([x, y]) => `<path d="M${x},${y} l16,-14 l16,14 v18 h-32 Z" fill="#4A5155"/><rect class="luz-vila" x="${x + 12}" y="${y + 5}" width="7" height="7" fill="#EEF0EC"/>`).join("");
    mar += `<path class="rachadura" pathLength="1" d="M20,760 L60,742 L84,770 L130,752 L168,790 L214,776" fill="none" stroke="#2C3134" stroke-width="2.5"/>` +
      `<path class="rachadura" pathLength="1" d="M100,850 L140,826 L176,850 L226,830 L282,868" fill="none" stroke="#2C3134" stroke-width="2.5"/>`;
    mar += `<path d="M0,900 ${Array.from({ length: 16 }, (_, i) => `Q${i * 40 + 20},${i % 2 ? 914 : 886} ${i * 40 + 40},900`).join(" ")}" fill="none" stroke="#9FB9B7" stroke-width="2" opacity=".6"/>`;
    mar += [110, 330, 500].map(x => `<g class="barco"><path d="M${x - 36},892 L${x + 36},892 L${x + 24},908 L${x - 24},908 Z" fill="#3B4245"/>` +
      `<path d="M${x},892 L${x},836" stroke="#3B4245" stroke-width="3"/><path d="M${x + 2},840 L${x + 30},884 L${x + 2},884 Z" fill="#D3D7D5"/></g>`).join("");
    mar += `<path d="M60,900 L20,1400 L80,1400 L130,900 Z M220,900 L200,1500 L260,1500 L290,900 Z M420,900 L430,1350 L480,1350 L470,900 Z" fill="#9FB9B7" opacity=".08"/>`;
    mar += Array.from({ length: 40 }, (_, i) => `<circle cx="${f1(300 + ruido(i + 300) * 290)}" cy="${f1(1100 + Math.abs(ruido(i + 400)) * 1200)}" r="${f1(3 + Math.abs(ruido(i + 500)) * 7)}" fill="none" stroke="#8FBDB9" stroke-width="1.2" opacity=".45"/>`).join("");
    mar += `<path d="M0,2300 L60,2280 L120,2310 L200,2270 L280,2320 L360,2290 L440,2330 L520,2296 L600,2320 L600,2400 L0,2400 Z" fill="#0E1A1A"/>`;
    $("#mundo-mar").innerHTML = mar;

    const largo = (y, h, cor) => `<rect x="-3000" y="${y}" width="7400" height="${h}" fill="${cor}"/>`;
    $("#lembranca-svg").innerHTML = largo(0, 520, ARGILA) + largo(0, 8, PRETO) + largo(12, 36, "url(#meandro-topo)") + largo(50, 3, PRETO) +
      largo(458, 4, PRETO) + largo(468, 36, "url(#meandro-base)") + largo(508, 12, PRETO) +
      figura({ pose: "avanco", x: 600, y: 344, frente: ["nuvem"], arma: P => raio(P.mT[0], P.mT[1], -18) }) +
      figura({ pose: "estocada", x: 780, y: 344, frente: ["onda"], arma: P => haste(P.mF[0], P.mF[1], -4, 120, 96, 3) });
  })();

  $("#impacto").innerHTML = `<defs><radialGradient id="halo-branco"><stop offset="0" stop-color="#F5F7FA" stop-opacity=".85"/><stop offset="1" stop-color="#F5F7FA" stop-opacity="0"/></radialGradient></defs>` +
    `<path class="fenda-cume" pathLength="1" fill="none" stroke="#2C3134" stroke-width="2" stroke-dasharray="1"/><path class="fenda-cume" pathLength="1" fill="none" stroke="#2C3134" stroke-width="2" stroke-dasharray="1"/>` +
    `<circle class="clarao-impacto" fill="url(#halo-branco)"/><circle class="onda-choque" fill="none" stroke="#EFEEE9" stroke-width="2.5"/>` +
    Array.from({ length: 12 }, () => `<polygon class="destroco" fill="#3B4245"/>`).join("");
  function posicionarImpacto() {
    const p = $("#travessia .palco"), W = p.clientWidth, H = p.clientHeight;
    if (!W || !H) return;
    const s = Math.max(.6, $(".deus--zeus").offsetWidth / 340), chao = H * .78, cx = W / 2, cy = chao - 210 * s;
    $$(".fenda-cume").forEach((el, i) => el.setAttribute("d", caminho(trinca(cx, chao + 4, cx + (i ? 1 : -1) * W * .3, chao + 10, 5, 801 + i * 32))));
    $$(".clarao-impacto, .onda-choque").forEach((c, i) => { c.setAttribute("cx", f1(cx)); c.setAttribute("cy", f1(cy)); c.setAttribute("r", f1((i ? 30 : 110) * s)); });
    $$(".destroco").forEach((el, i) => {
      const a = i / 12 * Math.PI * 2 + ruido(i + 700) * .4, dist = (90 + Math.abs(ruido(i + 720)) * 160) * s;
      el.setAttribute("points", pedra(cx, cy, (5 + Math.abs(ruido(i + 740)) * 7) * s, i * 7).match(/points="([^"]+)"/)[1]);
      el.dataset.dx = f1(Math.cos(a) * dist); el.dataset.dy = f1(Math.sin(a) * dist + 40); el.dataset.r = f1(ruido(i + 760) * 200);
    });
  }
  posicionarImpacto();
  addEventListener("resize", posicionarImpacto);
  ScrollTrigger.addEventListener("refreshInit", posicionarImpacto);

  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    const palcoT = $("#travessia .palco"), dz = $(".deus--zeus"), dp = $(".deus--poseidon"), W = () => palcoT.clientWidth;
    const ateChao = (el) => () => palcoT.clientHeight * .78 - (el.offsetTop + el.offsetHeight * (418 / 440));
    gsap.set("#travessia .veu", { opacity: 1 });
    gsap.set("#mundo-mar", { yPercent: -66.667 });
    gsap.set(".relampago, .rachadura", { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(".fenda-cume", { strokeDashoffset: 1 });
    gsap.set(".fumaca", { scaleY: 0, transformOrigin: "50% 100%" });
    gsap.set(".barco", { transformOrigin: "50% 100%" });
    gsap.set(".lembranca, .clarao-impacto, .onda-choque, .destroco", { opacity: 0 });
    gsap.set(".onda-choque", { transformOrigin: "50% 50%" });

    cena("#travessia", (tl) => {
      tl.to("#travessia .veu", { opacity: 0, duration: 1.4 }, 0)
        .to(".marca", { color: "#EFEEE9", duration: .8 }, .2)
        .to("#mundo-ceu", { yPercent: -44, duration: 5.8 }, .6)
        .to("#mundo-mar", { yPercent: -40, duration: 5.8 }, .6)
        .to(dz, { y: 14, rotation: 3, duration: 2.8 }, 1).to(dz, { y: -6, rotation: -2, duration: 2.8 }, 3.8)
        .to(dp, { y: -14, rotation: -3, duration: 2.8 }, 1).to(dp, { y: 6, rotation: 2, duration: 2.8 }, 3.8);
      $$(".relampago").forEach((r, i) => tl.to(r, { strokeDashoffset: 0, duration: .4 }, 2 + i * 1.6).to(r, { opacity: 0, duration: .9 }, 2.5 + i * 1.6));
      let fim = frase(tl, ".fala--t1", 1);

      const tB = Math.max(fim, 6.4) + .1;
      fim = frase(tl, ".fala--t2", tB);
      tl.to("#mundo-ceu", { yPercent: -62, duration: fim - tB }, tB)
        .to("#mundo-mar", { yPercent: -14, duration: fim - tB }, tB)
        .to(".fumaca", { scaleY: 1, duration: 2.4, stagger: .5, ease: "power1.out" }, tB + .4)
        .to(".barco", { rotation: (i) => [28, -34, 22][i], y: 60, opacity: 0, duration: 2.2, stagger: .6, ease: "power1.in" }, tB + .8)
        .to(".rachadura", { strokeDashoffset: 0, duration: 1.4, stagger: .5 }, tB + 1.2)
        .to(".luz-vila", { opacity: 0, duration: .5, stagger: .45 }, tB + 1.6);

      const tC = fim;
      tl.to("#mundo-ceu", { yPercent: -66.667, duration: 2 }, tC)
        .to("#mundo-mar", { yPercent: 0, duration: 2 }, tC)
        .to(".lado--ceu", { xPercent: -100, duration: 2.2, ease: "power2.inOut" }, tC + 1.6)
        .to(".lado--mar", { xPercent: 100, duration: 2.2, ease: "power2.inOut" }, tC + 1.6)
        .to(".costura", { opacity: 0, duration: .6 }, tC + 1.6)
        .to(dz, { x: () => W() * .11, y: ateChao(dz), rotation: 0, duration: 2.4, ease: "power2.inOut" }, tC + 1.6)
        .to(dp, { x: () => -W() * .11, y: ateChao(dp), rotation: 0, duration: 2.4, ease: "power2.inOut" }, tC + 1.6)
        .to(vivoZeus.est, { k: 1, duration: 2.4, onUpdate: vivoZeus.desenhar }, tC + 1.6)
        .to(vivoPoseidon.est, { k: 1, duration: 2.4, onUpdate: vivoPoseidon.desenhar }, tC + 1.6);
      fim = frase(tl, ".fala--t3", tC + 4.2);

      const tD = fim + .2;
      tl.fromTo(".lembranca", { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1, immediateRender: false }, tD);
      fim = frase(tl, ".fala--t4", tD + .5);
      tl.to(".lembranca", { opacity: 0, duration: .9 }, fim - .9);

      const tE = fim + .2, tI = tE + 1.2;
      tl.to(vivoZeus.est, { k: 2, duration: .9, onUpdate: vivoZeus.desenhar }, tE)
        .to(vivoPoseidon.est, { k: 2, duration: .9, onUpdate: vivoPoseidon.desenhar }, tE)
        .to(dz, { x: () => W() * .17, duration: .7, ease: "power3.in" }, tE + .5)
        .to(dp, { x: () => -W() * .17, duration: .7, ease: "power3.in" }, tE + .5)
        .fromTo(".clarao-impacto", { opacity: 0 }, { opacity: .9, duration: .15, immediateRender: false }, tI)
        .to(".clarao-impacto", { opacity: 0, duration: 1.2 }, tI + .15)
        .fromTo(".onda-choque", { scale: .2, opacity: 1 }, { scale: 7, opacity: 0, duration: 1.4, ease: "power2.out", immediateRender: false }, tI)
        .fromTo(".destroco", { x: 0, y: 0, rotation: 0, opacity: 1 }, { x: (i, el) => +el.dataset.dx, y: (i, el) => +el.dataset.dy, rotation: (i, el) => +el.dataset.r, opacity: 0, duration: 1.8, ease: "power2.out", immediateRender: false }, tI)
        .to(".fenda-cume", { strokeDashoffset: 0, duration: 1, ease: "power2.out" }, tI + .1)
        .to(palcoT, { keyframes: { x: [-10, 8, -6, 4, -2, 0] }, duration: .9 }, tI)
        .to("#travessia .veu", { opacity: 1, duration: 1.6 }, tI + 2.6)
        .to(".marca", { color: "#4F5659", duration: 1 }, tI + 2.8);
    });
  });

  (() => {
    const $ = (s) => document.querySelector(s);
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, u) => a + (b - a) * u;
    const suave = (u) => u * u * (3 - 2 * u);
    const janela = (t, a, b, c, d) => clamp((t - a) / (b - a)) * (1 - clamp((t - c) / (d - c)));
    const hash = (i) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
    const sr = (i) => hash(i) * 2 - 1;
    const ruido = (x) => { const i = Math.floor(x); return lerp(sr(i), sr(i + 1), suave(x - i)); };
    const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
    const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    const polar = (o, a, l) => [o[0] + Math.cos(a) * l, o[1] + Math.sin(a) * l];

    const POSES = {
      cansado:       { n:[10,-80], h:[22,-108], cF:[40,-40], mF:[52,8], cT:[-14,-46], mT:[-6,-6], jF:[40,22], pF:[44,58], jT:[-6,56], pT:[-48,58], curva: .35 },
      levantando:    { n:[18,-86], h:[34,-112], cF:[40,-52], mF:[48,-6], cT:[-6,-52], mT:[6,-14], jF:[44,-4], pF:[48,58], jT:[-4,56], pT:[-46,58], curva: .25 },
      encarando:     { n:[2,-100], h:[8,-134], cF:[30,-64], mF:[52,-40], cT:[-24,-60], mT:[-40,-24], jF:[20,56], pF:[34,114], jT:[-16,56], pT:[-30,114] },
      chamar:        { n:[-4,-100], h:[0,-136], cF:[26,-142], mF:[40,-190], cT:[-30,-62], mT:[-40,-24], jF:[22,56], pF:[36,114], jT:[-18,56], pT:[-34,114], curva: -.15 },
      disparo:       { n:[8,-98], h:[16,-132], cF:[56,-104], mF:[104,-112], cT:[-30,-70], mT:[-44,-34], jF:[34,54], pF:[58,114], jT:[-26,56], pT:[-52,114] },
      disparo2:      { n:[22,-92], h:[34,-122], cF:[66,-86], mF:[112,-80], cT:[-20,-62], mT:[-30,-24], jF:[48,50], pF:[72,114], jT:[-34,58], pT:[-66,112], curva: .25 },
      defesa:        { n:[-2,-98], h:[4,-132], cF:[34,-112], mF:[58,-130], cT:[10,-96], mT:[30,-112], jF:[24,54], pF:[40,114], jT:[-22,56], pT:[-44,114] },
      proteger:      { n:[-6,-98], h:[-2,-130], cF:[26,-96], mF:[40,-124], cT:[-2,-92], mT:[22,-118], jF:[24,54], pF:[40,114], jT:[-20,56], pT:[-40,114], curva: .15 },
      recuo:         { n:[-8,-88], h:[-2,-120], cF:[24,-62], mF:[46,-34], cT:[-32,-58], mT:[-50,-24], jF:[36,42], pF:[48,104], jT:[-28,52], pT:[-60,104], curva: .2 },
      erguerTridente:{ n:[-6,-100], h:[-2,-134], cF:[20,-146], mF:[40,-176], cT:[-6,-140], mT:[18,-168], jF:[30,56], pF:[48,114], jT:[-22,56], pT:[-44,114], curva: -.2 },
      cravar:        { n:[12,-90], h:[22,-122], cF:[44,-60], mF:[56,-14], cT:[28,-56], mT:[46,-12], jF:[44,46], pF:[62,112], jT:[-30,54], pT:[-60,112], curva: .3 },
      atingido:      { n:[-26,-92], h:[-44,-116], cF:[14,-108], mF:[44,-124], cT:[-10,-112], mT:[22,-140], jF:[30,44], pF:[56,96], jT:[2,54], pT:[18,108], curva: -.5 },
      voando:        { n:[-30,-90], h:[-50,-108], cF:[10,-96], mF:[48,-104], cT:[-4,-104], mT:[30,-124], jF:[40,30], pF:[78,60], jT:[24,46], pT:[62,82], curva: -.6 },
      esmagado:      { n:[-6,-100], h:[-16,-128], cF:[30,-112], mF:[58,-92], cT:[-30,-110], mT:[-44,-80], jF:[24,52], pF:[40,108], jT:[-10,54], pT:[-4,112], curva: -.3 },
      sentado:       { n:[-14,-92], h:[-8,-124], cF:[16,-50], mF:[34,-10], cT:[-30,-48], mT:[-20,-6], jF:[44,-14], pF:[84,4], jT:[36,-6], pT:[78,8], curva: .2 },
      invocar:       { n:[-6,-100], h:[-14,-132], cF:[30,-140], mF:[56,-182], cT:[-34,-140], mT:[-56,-180], jF:[26,56], pF:[44,114], jT:[-24,56], pT:[-44,114], curva: -.35 },
      lancar:        { n:[14,-96], h:[26,-128], cF:[56,-84], mF:[98,-70], cT:[40,-80], mT:[86,-62], jF:[46,52], pF:[68,114], jT:[-30,56], pT:[-62,114], curva: .3 },
      rolando:       { n:[22,-70], h:[44,-82], cF:[40,-36], mF:[54,-6], cT:[20,-40], mT:[34,-8], jF:[46,-20], pF:[36,30], jT:[40,-10], pT:[26,40], curva: .6 },
      caido:         { n:[-96,-14], h:[-130,-18], cF:[-70,-40], mF:[-40,-60], cT:[-80,4], mT:[-50,8], jF:[50,-10], pF:[108,6], jT:[48,6], pT:[104,10] },
      caidoErguendo: { n:[-92,-30], h:[-120,-46], cF:[-60,-50], mF:[-30,-74], cT:[-80,-6], mT:[-52,4], jF:[50,-10], pF:[108,6], jT:[48,6], pT:[104,10], curva: -.15 }
    };
    const ombro = (n, t, lado) => [n[0] - Math.sin(t) * 22 * lado - Math.cos(t) * 8, n[1] + Math.cos(t) * 22 * lado - Math.sin(t) * 8];
    function paraAngulos(P) {
      const O = [0, 0], t = ang(O, P.n), oF = ombro(P.n, t, 1), oT = ombro(P.n, t, -1), bF = ang(oF, P.cF), bT = ang(oT, P.cT), xF = ang(O, P.jF), xT = ang(O, P.jT);
      return {
        aTronco: t, lTronco: dist(O, P.n), aCabeca: ang(P.n, P.h) - t, lCabeca: dist(P.n, P.h),
        aBracoF: bF - t, lBracoF: dist(oF, P.cF), aAnteF: ang(P.cF, P.mF) - bF, lAnteF: dist(P.cF, P.mF),
        aBracoT: bT - t, lBracoT: dist(oT, P.cT), aAnteT: ang(P.cT, P.mT) - bT, lAnteT: dist(P.cT, P.mT),
        aCoxaF: xF, lCoxaF: dist(O, P.jF), aCanelaF: ang(P.jF, P.pF) - xF, lCanelaF: dist(P.jF, P.pF),
        aCoxaT: xT, lCoxaT: dist(O, P.jT), aCanelaT: ang(P.jT, P.pT) - xT, lCanelaT: dist(P.jT, P.pT), curva: P.curva || 0
      };
    }
    function cinematica(A) {
      const t = A.aTronco, n = polar([0, 0], t, A.lTronco), h = polar(n, t + A.aCabeca, A.lCabeca);
      const oF = ombro(n, t, 1), oT = ombro(n, t, -1), bF = t + A.aBracoF, bT = t + A.aBracoT;
      const cF = polar(oF, bF, A.lBracoF), mF = polar(cF, bF + A.aAnteF, A.lAnteF), cT = polar(oT, bT, A.lBracoT), mT = polar(cT, bT + A.aAnteT, A.lAnteT);
      const jF = polar([0, 0], A.aCoxaF, A.lCoxaF), pF = polar(jF, A.aCoxaF + A.aCanelaF, A.lCanelaF), jT = polar([0, 0], A.aCoxaT, A.lCoxaT), pT = polar(jT, A.aCoxaT + A.aCanelaT, A.lCanelaT);
      return { n, h, oF, oT, cF, mF, cT, mT, jF, pF, jT, pT, peF: A.aCoxaF + A.aCanelaF - Math.PI / 2, peT: A.aCoxaT + A.aCanelaT - Math.PI / 2, curva: A.curva };
    }
    const ANGULOS = Object.fromEntries(Object.entries(POSES).map(([k, P]) => [k, paraAngulos(P)]));
    const ATRASO = { aCabeca: .1, aBracoF: .04, aAnteF: .11, aBracoT: .04, aAnteT: .11, aCanelaF: .05, aCanelaT: .05 };
    const giro = (a, b, u) => { let d = b - a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return a + d * u; };

    const ZEUS = [
      [0, "cansado", -3.2, 0, 0], [2.6, "cansado", -3.2, 0, 0], [4.4, "levantando", -3.15, 0, 0], [6.2, "encarando", -3.2, 0, 0],
      [7.4, "encarando", -3.25, 0, 0], [8.4, "chamar", -3.1, 0, 0], [10.1, "chamar", -3.15, 0, 0], [10.7, "disparo", -3.05, 0, 0],
      [11.4, "disparo2", -3, 0, 0], [12.45, "disparo2", -3, 0, 0], [13.2, "encarando", -3.2, 0, 0], [14.2, "encarando", -3.3, 0, 0],
      [14.6, "proteger", -3.3, 0, 0], [14.85, "atingido", -3.5, .5, -.2], [15.6, "voando", -5, 1.9, -.7], [16.42, "esmagado", -5.85, .7, -.15],
      [17.3, "sentado", -5.7, 0, 0], [19.4, "sentado", -5.7, 0, 0], [21.4, "levantando", -5.45, 0, 0], [22.8, "encarando", -5.25, 0, 0],
      [23.8, "encarando", -5.2, 0, 0], [25.6, "invocar", -5.2, 0, 0], [29.9, "invocar", -5.2, 0, 0], [30.62, "lancar", -5.1, 0, 0],
      [31.6, "lancar", -5.05, 0, 0], [33.2, "levantando", -5, 0, 0], [34.4, "cansado", -5, 0, 0], [40, "cansado", -5, 0, 0]
    ];
    const POSEIDON = [
      [0, "cansado", 3.2, 0, 0], [3.4, "cansado", 3.2, 0, 0], [5.2, "levantando", 3.15, 0, 0], [7, "encarando", 3.2, 0, 0],
      [10.2, "encarando", 3.2, 0, 0], [10.6, "defesa", 3.25, 0, 0], [12.45, "defesa", 3.45, 0, 0], [12.9, "recuo", 3.8, 0, 0],
      [13.25, "erguerTridente", 3.8, 0, 0], [13.55, "cravar", 3.8, 0, 0], [15.6, "cravar", 3.8, 0, 0], [16.8, "encarando", 3.7, 0, 0],
      [28.4, "encarando", 3.7, 0, 0], [29.8, "defesa", 3.6, 0, 0], [30.62, "defesa", 3.6, 0, 0], [30.78, "atingido", 4.1, .7, .4],
      [30.95, "voando", 4.6, 1.3, 1], [31.8, "rolando", 6.2, .9, 2.6], [32.4, "rolando", 6.9, .3, 4.6], [33, "caido", 7, 0, 6.283],
      [35.4, "caido", 7, 0, 6.283], [37.4, "caidoErguendo", 7, 0, 6.283], [40, "caidoErguendo", 7, 0, 6.283]
    ];
    const CAMERA = [
      [0, 0, 1.5, .8, 0], [4.2, 0, 1.45, .9, 0], [8.2, -1.7, 1.9, 1.15, 0], [10.5, -.5, 1.9, 1.02, 0],
      [11.2, 1.7, 2, 1.4, .025], [12.45, 2, 2, 1.55, -.035], [13.5, 1.6, .9, 1.25, 0], [14.2, -.4, .85, 1.18, 0],
      [14.85, -2.5, 1.05, 1.32, .02], [15.4, -3.6, 1.4, 1.1, -.01], [16.6, -4.5, 1.6, 1.28, -.02], [18.4, -4.6, 1.8, 1.02, 0],
      [21.5, -3.4, 1.5, 1, 0], [23.8, -4, 1.7, 1.06, 0], [25.2, -4.6, 1.5, 1.2, .015], [26.9, -1.8, 9.6, .82, 0],
      [28.3, .9, 11.6, .78, .01], [29.6, 2, 5.4, .8, 0], [30.2, 2.4, 3, .95, .012], [30.62, 2.6, 1.6, 1.14, .025],
      [30.95, 2.8, 1.6, 1.38, -.035], [33.4, 1.1, 1.6, .9, 0], [40, .7, 1.5, .86, 0]
    ];
    const TRECHOS = [[4.2, 1], [10.6, 1.4], [10.95, .6], [12.45, 2.2], [13.6, .5], [14.85, 1], [16.5, .8], [18.4, .8], [24.8, 1.1], [28.2, 1], [29.6, .6], [30.62, 2.8], [30.95, 2.4], [33.4, .9], [40, 1.2]];
    const LENTO = [[10.95, 12.45], [29.6, 30.95]];
    const lentidao = (t) => Math.max(...LENTO.map(([a, b]) => janela(t, a - .3, a, b, b + .35)));
    const TREMORES = [[13.65, .55, 1.4], [14.85, .5, 1.6], [16.42, .4, 1.8], [18.1, .3, 1.8], [29.6, .25, .6], [30.62, 1.4, .9]];
    const IMPULSOS = { "1": [[14.85, 1], [16.42, .8]], "-1": [[30.62, 1.2], [32.4, .5]] };
    const GOLPE = 30.62, IMPACTO = [3.5, 0];
    const ONDA = { t0: 13.62, t1: 14.85, x0: 3.4, x1: -3.3 };
    const frenteOnda = (t) => lerp(ONDA.x0, ONDA.x1, clamp((t - ONDA.t0) / (ONDA.t1 - ONDA.t0)));

    const K = .011;
    function segmentoEm(tab, t) {
      let i = Math.min(tab._i || 0, tab.length - 2);
      while (i > 0 && t < tab[i][0]) i--;
      while (i < tab.length - 2 && t > tab[i + 1][0]) i++;
      return (tab._i = i);
    }
    function inclinacao(t0, t1, t2, v0, v1, v2) {
      const h0 = t1 - t0, h1 = t2 - t1; if (h0 <= 0 || h1 <= 0) return 0;
      const d0 = (v1 - v0) / h0, d1 = (v2 - v1) / h1; if (d0 * d1 <= 0) return 0;
      const w0 = 2 * h1 + h0, w1 = h1 + 2 * h0;
      return (w0 + w1) / (w0 / d0 + w1 / d1);
    }
    const volta = (de, para) => { let d = para - de; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return de + d; };
    function canal(tab, i, t, ler, angular) {
      const n = tab.length, k0 = tab[Math.max(0, i - 1)], k1 = tab[i], k2 = tab[i + 1], k3 = tab[Math.min(n - 1, i + 2)];
      let v0 = ler(k0), v1 = ler(k1), v2 = ler(k2), v3 = ler(k3);
      if (angular) { v0 = volta(v1, v0); v2 = volta(v1, v2); v3 = volta(v2, v3); }
      const m1 = inclinacao(k0[0], k1[0], k2[0], v0, v1, v2), m2 = inclinacao(k1[0], k2[0], k3[0], v1, v2, v3), h = k2[0] - k1[0];
      if (h <= 0) return { v: v1, m1 };
      const s = clamp((t - k1[0]) / h), s2 = s * s, s3 = s2 * s;
      return { v: (2 * s3 - 3 * s2 + 1) * v1 + (s3 - 2 * s2 + s) * h * m1 + (3 * s2 - 2 * s3) * v2 + (s3 - s2) * h * m2, m1 };
    }
    function posicaoEm(tab, t) {
      const i = segmentoEm(tab, t);
      return { i, x: canal(tab, i, t, (k) => k[2]).v, alt: canal(tab, i, t, (k) => k[3]).v, r: canal(tab, i, t, (k) => k[4]).v };
    }
    function estadoEm(tab, t, dir) {
      const pos = posicaoEm(tab, t), i = pos.i, a = tab[i], b = tab[i + 1], dur = b[0] - a[0], M = {};
      for (const k in ANGULOS[a[1]]) {
        const angular = k[0] === "a", ler = (chave) => ANGULOS[chave[1]][k], atraso = Math.min(ATRASO[k] || 0, dur * .35);
        let tt = t;
        if (atraso > 0 && Math.abs(canal(tab, i, a[0], ler, angular).m1) < .05) tt = a[0] + clamp((t - a[0] - atraso) / Math.max(.001, dur - atraso)) * dur;
        M[k] = canal(tab, i, tt, ler, angular).v;
      }
      const folego = Math.sin(t * 2.3 + dir), balanco = ruido(t * .6 + dir * 7);
      M.aTronco += folego * .018 + balanco * .025; M.lTronco += folego * 1.6; M.aCabeca -= folego * .03 + balanco * .04;
      M.aBracoF += folego * .03 + balanco * .05; M.aBracoT -= folego * .03 - balanco * .04;
      let choque = 0;
      (IMPULSOS[dir] || []).forEach(([t0, f]) => { const d = t - t0; if (d >= 0 && d < 1.5) choque += f * Math.exp(-d * 5) * Math.cos(d * 22); });
      M.aTronco -= choque * .25; M.aCabeca -= choque * .45; M.aBracoF += choque * .5; M.aBracoT -= choque * .4; M.curva -= choque * .3;
      const firme = FIRME.some(([i0, i1]) => t > i0 && t < i1), c = Math.cos(pos.r), s = Math.sin(pos.r);
      const pA = posicaoEm(tab, t - .04), pD = posicaoEm(tab, t + .04), ax = (pD.x - 2 * pos.x + pA.x) / .0016, ay = -(pD.alt - 2 * pos.alt + pA.alt) / .0016;
      const pe = (n) => Math.max(POSES[n].pF[1], POSES[n].pT[1]), emPe = clamp((Math.min(pe(a[1]), pe(b[1])) - 90) / 20) * (Math.abs(s) < .3 ? 1 : 0);
      const inclina = clamp((ax * c + ay * s) * dir * .012, firme ? -.1 : -.3, firme ? .1 : .3) * clamp(1 - pos.alt / .3) * emPe;
      M.aTronco += inclina; M.aCabeca -= inclina * .55; M.aBracoF -= inclina * .35; M.aBracoT -= inclina * .35;
      if (pos.alt < .05 && emPe > 0) {
        const altEm = (dt) => posicaoEm(tab, t + dt).alt;
        const flexao = Math.max(clamp(Math.max(altEm(-.07), altEm(-.14), altEm(-.22)) / .5), clamp(Math.max(altEm(.07), altEm(.14)) / .5) * .75) * emPe * .9;
        M.aCoxaF -= .45 * flexao; M.aCanelaF += .9 * flexao; M.aCoxaT -= .45 * flexao; M.aCanelaT += .9 * flexao; M.aTronco += .16 * flexao; M.aCabeca -= .1 * flexao;
      }
      const antes = posicaoEm(tab, t - .05), vx = (pos.x - antes.x) / .05, vy = -(pos.alt - antes.alt) / .05;
      const rx = (vx * c + vy * s) * dir, ry = -vx * s + vy * c, f = (firme ? 0 : 1) * clamp((Math.hypot(rx, ry) - .8) / 3.2);
      if (f > 0) {
        const tras = Math.atan2(-ry, -rx), debate = (k) => ruido(t * 3.2 + k * 1.7) * .55 * f, segue = (abs, peso) => giro(abs, tras, peso * f);
        M.aBracoF = segue(M.aTronco + M.aBracoF, .6) - M.aTronco + debate(1); M.aBracoT = segue(M.aTronco + M.aBracoT, .6) - M.aTronco + debate(2);
        M.aAnteF += debate(3) - .4 * f; M.aAnteT += debate(4) + .4 * f;
        M.aCoxaF = segue(M.aCoxaF, .35) + debate(5); M.aCoxaT = segue(M.aCoxaT, .35) + debate(6);
        M.aCanelaF += .7 * f + debate(7); M.aCanelaT += .6 * f + debate(8); M.aCabeca += debate(9) * .6;
      }
      return { P: cinematica(M), x: pos.x, alt: pos.alt, r: pos.r, dir, sq: choque * .06 };
    }
    const Z = (t) => estadoEm(ZEUS, t, 1), PO = (t) => estadoEm(POSEIDON, t, -1);
    const quadril = (S) => [S.x, -S.alt + (118 - Math.max(S.P.pF[1], S.P.pT[1]) - 118) * K];
    function mundo(S, [jx, jy]) {
      const [hx, hy] = quadril(S), c = Math.cos(S.r), s = Math.sin(S.r), x = S.dir * jx * K, y = jy * K;
      return [hx + x * c - y * s, hy + x * s + y * c];
    }
    function ancora(nome, t) {
      if (Array.isArray(nome)) return nome;
      if (nome === "maoZeus") { const S = Z(t); return mundo(S, S.P.mF); }
      if (nome === "pontaGigante") { const G = caminhoGigante(); return G.main[indiceGigante(t)]; }
      const S = PO(t), P = S.P, a = ang(P.cF, P.mF);
      return mundo(S, [P.mF[0] + Math.cos(a) * 132, P.mF[1] + Math.sin(a) * 132]);
    }
    const carga = (t) => .45 + .55 * janela(t, 8, 9.8, 12.4, 13.2) + .6 * janela(t, 24.8, 26, 30.6, 31.4);

    const RAIOS = [
      [8.2, .55, [-1, -13], [-3.5, -9.4], 11, .8, 2], [8.9, .55, [3, -13], [1.4, -9], 23, .8, 2], [9.6, .55, [-4, -13], [-2, -10], 37, .9, 2],
      [10.6, 1.95, [-2.4, -15], "maoZeus", 41, 2.2, 5], [10.72, 1.85, "maoZeus", "tridente", 53, 2.4, 3],
      [12.45, .75, "tridente", [6.1, -4.4], 67, 1.6, 2], [12.47, .75, "tridente", [4.6, 0], 71, 1.4, 2], [12.5, .75, "tridente", [-6.1, -6.2], 83, 1.4, 2],
      [25.3, 1.4, "maoZeus", [-5.8, -15], 103, 1.1, 3], [26.4, .6, [-1, -15], [1.6, -11.8], 91, 1, 3],
      [27.5, .6, [3.4, -15.5], [.8, -11.4], 97, 1, 3], [27.9, 1.3, "maoZeus", [-4.4, -15], 107, 1.1, 3]
    ];
    const EMISSORES = [
      { tipo: "faisca", t0: 10.74, dur: 1.72, n: 240, x: "tridente", v: 7, g: 9, k: 1.2, vida: .9, semente: 101 },
      { tipo: "faisca", t0: 12.45, dur: .1, n: 120, x: [6.1, -4.4], v: 6, g: 9, k: 1, vida: 1.1, semente: 131 },
      { tipo: "pedra", t0: 12.47, n: 16, x: [6.1, -4.4], v: 3, ang: Math.PI, abre: 1.2, g: 9.8, k: .4, vida: 2.2, tam: .12, semente: 151 },
      { tipo: "poeira", t0: 12.47, n: 10, x: [6.1, -4.4], v: .8, g: -.3, k: .9, vida: 3.5, tam: .9, semente: 171 },
      { tipo: "pedra", t0: ONDA.t0, dur: ONDA.t1 - ONDA.t0, n: 90, frente: (b) => [frenteOnda(b), 0], v: 5, abre: .6, g: 9.8, k: .3, vida: 1.6, tam: .17, semente: 191 },
      { tipo: "poeira", t0: ONDA.t0, dur: ONDA.t1 - ONDA.t0, n: 30, frente: (b) => [frenteOnda(b), -.2], v: .9, g: -.2, k: .8, vida: 4, tam: 1.1, semente: 211 },
      { tipo: "pedra", t0: ONDA.t1, n: 44, x: [ONDA.x1, -.4], v: 6.5, ang: -Math.PI / 2 - .5, abre: .8, g: 9.8, k: .3, vida: 2, tam: .2, semente: 201 },
      { tipo: "poeira", t0: ONDA.t1, n: 22, x: [ONDA.x1, -.4], v: 2, g: -.15, k: .8, vida: 4.5, tam: 1.3, semente: 205 },
      { tipo: "pedra", t0: 16.42, n: 34, x: [-6.1, -3.2], v: 3.8, ang: -.6, abre: 1.4, g: 9.8, k: .3, vida: 2.4, tam: .16, semente: 231 },
      { tipo: "poeira", t0: 16.42, n: 18, x: [-6.1, -3], v: 1, g: -.15, k: .7, vida: 5, tam: 1.2, semente: 251 },
      { tipo: "poeira", t0: 18.1, n: 26, x: [-10.5, -.3], rx: 3, v: 1.4, abre: 1.5, g: -.1, k: .6, vida: 5.5, tam: 1.5, semente: 271 },
      { tipo: "pedra", t0: 18.1, n: 30, x: [-10.5, -.4], rx: 2.6, v: 3, abre: 1.2, g: 9.8, k: .4, vida: 2, tam: .18, semente: 291 },
      { tipo: "poeira", t0: 25.2, dur: 3.2, n: 14, x: [-5.2, -.2], rx: 1.2, v: .5, abre: .6, g: -.3, k: .5, vida: 3.5, tam: .7, semente: 311 },
      { tipo: "pedra", t0: 25.2, dur: 3.6, n: 22, x: [-5.2, 0], rx: 1.7, v: .5, abre: .3, g: -.7, k: .8, vida: 3, tam: .06, semente: 321 },
      { tipo: "pedra", t0: 29.3, dur: 1.3, n: 50, x: [3.4, 0], rx: 3.4, v: .6, abre: .25, g: -1.1, k: .9, vida: 2.2, tam: .07, semente: 343 },
      { tipo: "poeira", t0: 29.6, dur: 1, n: 16, x: [3.4, -.1], rx: 2.6, v: .4, abre: .5, g: -.25, k: .6, vida: 2.5, tam: .9, semente: 344 },
      { tipo: "faisca", t0: 29.6, dur: 1.02, n: 180, x: "pontaGigante", v: 4, g: 4, k: 1.2, vida: .8, semente: 347 },
      { tipo: "faisca", t0: GOLPE, n: 160, x: "tridente", v: 11, g: 9, k: 1.3, vida: 1.1, semente: 345 },
      { tipo: "pedra", t0: GOLPE, n: 130, x: [IMPACTO[0], -.2], rx: 1, v: 10, abre: 1.35, g: 9.8, k: .25, vida: 3.4, tam: .22, semente: 351 },
      { tipo: "poeira", t0: GOLPE, n: 50, x: [IMPACTO[0], -.3], rx: 1.2, v: 6.5, abre: 1.7, g: -.05, k: 1.1, vida: 7, tam: 1.8, semente: 371 },
      { tipo: "brasa", t0: GOLPE, n: 190, x: [IMPACTO[0], -.5], v: 8, abre: 1.6, g: 3, k: .8, vida: 3.2, semente: 391 },
      { tipo: "faisca", t0: GOLPE, n: 230, x: [IMPACTO[0], -.4], v: 14, g: 9, k: 1.4, vida: 1.3, semente: 411 }
    ];
    function raioPts(x0, y0, x1, y1, semente, nivel = 6) {
      let pts = [[x0, y0], [x1, y1]], d = Math.hypot(x1 - x0, y1 - y0) * .18;
      for (let n = 0; n < nivel; n++) {
        const novo = [pts[0]];
        for (let i = 0; i < pts.length - 1; i++) {
          const [ax, ay] = pts[i], [bx, by] = pts[i + 1], nx = ay - by, ny = bx - ax, l = Math.hypot(nx, ny) || 1, o = sr(semente + n * 97 + i * 13) * d;
          novo.push([(ax + bx) / 2 + nx / l * o, (ay + by) / 2 + ny / l * o], pts[i + 1]);
        }
        pts = novo; d *= .55;
      }
      return pts;
    }
    const intensidadeRaio = (a, dur) => clamp(a / .05) * (1 - clamp((a - dur * .55) / (dur * .45))) * (.82 + .18 * ruido(a * 2.6));
    const trinca = (x0, z0, x1, z1, amp, semente, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n; return [lerp(x0, x1, u), lerp(z0, z1, u) + (i && i < n ? sr(semente + i) * amp : 0)]; });
    const FENDA = [trinca(0, 0, -2.4, .3, .18, 5), trinca(0, 0, 2.4, -.25, .18, 9)];
    const RUPTURA = [trinca(3.4, 0, -3.3, .1, .28, 21, 26), trinca(1.2, .05, .2, 1.4, .2, 33, 8), trinca(-1.4, .05, -2.3, -1.2, .2, 41, 8)];
    const LICHT = (() => {
      const ramos = [];
      const crescer = (x, z, a, len, nivel, semente) => {
        if (nivel > 3 || len < .3) return;
        const pts = [[x, z]]; let cx = x, cz = z;
        for (let i = 1; i <= 6; i++) { const d = a + sr(semente + i * 3) * .55; cx += Math.cos(d) * len / 6; cz += Math.sin(d) * len / 6; pts.push([cx, cz]); }
        ramos.push({ pts, nivel });
        for (let b = 0; b < 2; b++) if (hash(semente + b * 7) < .75) crescer(pts[2 + b * 2][0], pts[2 + b * 2][1], a + sr(semente + b * 11) * .9, len * .55, nivel + 1, semente * 3 + b + 1);
      };
      for (let i = 0; i < 11; i++) crescer(IMPACTO[0], 0, (i / 11) * Math.PI * 2 + sr(i + 60) * .2, 2.2 + hash(i + 70) * 2, 0, 500 + i * 37);
      return ramos;
    })();

    const cv = $("#tela-luta");
    let ctx = cv.getContext("2d"), W = 0, H = 0, qualidade = 1;
    const cam = { x: 0, alt: 1.5, zoom: 1, roll: 0 };
    const base = () => Math.min(H / 6.2, W / (W < H ? 7.2 : 9));
    const escala = () => base() * cam.zoom;
    const proj = (wx, wy, p = 1) => { const s = base() * Math.pow(cam.zoom, p); return [W / 2 + (wx - cam.x * p) * s, H * .58 + (wy + cam.alt * p) * s]; };
    const D = 9, FUNDO = -7, Z_FUNDO = -4.6, Z_FRENTE = -.6;
    const kz = (z) => D / Math.max(.4, D - z);
    const noChao = (x, z) => { const s = escala(), k = kz(z); return [W / 2 + (x - cam.x) * s * k, H * .58 + cam.alt * s * k]; };
    const passoZ = (z) => cam.alt * escala() * D / Math.pow(Math.max(.4, D - z), 2);
    function sprite(r, stops) {
      const c = document.createElement("canvas"); c.width = c.height = r * 2;
      const g = c.getContext("2d"), gr = g.createRadialGradient(r, r, 0, r, r, r);
      stops.forEach(([o, cor]) => gr.addColorStop(o, cor)); g.fillStyle = gr; g.fillRect(0, 0, r * 2, r * 2);
      return c;
    }
    const SPR = {
      poeira: sprite(64, [[0, "rgba(152,158,162,.9)"], [.55, "rgba(140,146,150,.35)"], [1, "rgba(140,146,150,0)"]]),
      nuvem: sprite(96, [[0, "rgba(58,64,70,.95)"], [.6, "rgba(54,60,66,.55)"], [1, "rgba(50,56,62,0)"]]),
      luz: sprite(96, [[0, "rgba(232,240,255,1)"], [.25, "rgba(200,214,245,.5)"], [1, "rgba(200,214,245,0)"]]),
      brasa: sprite(24, [[0, "rgba(255,255,255,1)"], [.35, "rgba(214,226,250,.55)"], [1, "rgba(214,226,250,0)"]]),
      contato: sprite(48, [[0, "rgba(4,5,6,.8)"], [.6, "rgba(4,5,6,.38)"], [1, "rgba(4,5,6,0)"]])
    };
    const NUVENS = Array.from({ length: 60 }, (_, i) => ({ x: sr(i + 500) * 16, y: -(7 + hash(i + 600) * 7.5), r: 1.7 + hash(i + 700) * 2.4, p: i % 3 ? .9 : .4 }));

    function ceu() {
      const subida = clamp((cam.alt - 2) / 9), g = ctx.createLinearGradient(0, 0, 0, H), c = (a, b) => Math.round(lerp(a, b, subida));
      g.addColorStop(0, `rgb(${c(28, 18)},${c(32, 21)},${c(36, 24)})`); g.addColorStop(.7, `rgb(${c(66, 40)},${c(72, 45)},${c(77, 50)})`); g.addColorStop(1, `rgb(${c(88, 50)},${c(95, 56)},${c(99, 60)})`);
      ctx.fillStyle = g; ctx.fillRect(-W * .1, -H * .1, W * 1.2, H * 1.2);
    }
    function nuvens(luzes, perto) {
      NUVENS.forEach((n) => {
        if ((n.p > .5) !== perto) return;
        const [x, y] = proj(n.x, n.y, n.p), s = base() * Math.pow(cam.zoom, n.p) * n.r * 1.6;
        if (x < -s || x > W + s || y < -s || y > H + s) return;
        ctx.drawImage(SPR.nuvem, x - s, y - s, s * 2, s * 2);
      });
      ctx.globalCompositeOperation = "lighter";
      luzes.forEach((l) => { if (l.y > -6) return; const [x, y] = proj(l.x, l.y, perto ? .9 : .4), s = escala() * 5 * Math.min(l.i, 1.5); ctx.globalAlpha = clamp(l.i * .5); ctx.drawImage(SPR.luz, x - s, y - s, s * 2, s * 2); });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    }
    function vortice(t) {
      const f = janela(t, 24.8, 26.4, 30.4, 31.6); if (f <= 0) return;
      const c = [1.2, -12.6], abre = 1 + 1.4 * clamp((t - 29.6) / 1);
      for (let i = 0; i < 30; i++) {
        const r = (1 + (i % 6) * .62) * abre, a = i * 2.39 + t * (.62 - r * .05), [x, y] = proj(c[0] + Math.cos(a) * r * 1.7, c[1] + Math.sin(a) * r * .5), s = escala() * (1.2 + (i % 3) * .55);
        ctx.globalAlpha = f * .9; ctx.drawImage(SPR.nuvem, x - s, y - s, s * 2, s * 2);
      }
      const [x, y] = proj(c[0], c[1]), s = escala() * 3.4 * abre, pulso = .3 + .2 * ruido(t * 1.3) + .5 * clamp((t - 28) / 1.8);
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = f * clamp(pulso); ctx.drawImage(SPR.luz, x - s * 1.7, y - s * .6, s * 3.4, s * 1.2);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    }
    function abismo() {
      const yh = H * .58, [, yb] = noChao(0, FUNDO);
      if (yb <= yh) return;
      const g = ctx.createLinearGradient(0, yh - H * .04, 0, yb); g.addColorStop(0, "rgba(118,126,132,.15)"); g.addColorStop(.5, "rgba(128,136,142,.7)"); g.addColorStop(1, "rgba(92,99,105,.95)");
      ctx.fillStyle = g; ctx.fillRect(-W * .1, yh - H * .04, W * 1.2, yb - yh + H * .04 + 2);
      ctx.fillStyle = "rgba(64,70,76,.6)"; ctx.beginPath(); ctx.moveTo(-W * .1, yh + 4);
      for (let i = 0; i <= 14; i++) ctx.lineTo(-W * .1 + i * W * .1, yh - (.008 + hash(i + 40) * .035) * H);
      ctx.lineTo(W * 1.1, yh + 4); ctx.closePath(); ctx.fill();
    }
    function linhaChao(pts, progresso, largura, cor) {
      if (progresso <= 0) return;
      const tela = pts.map(([x, z]) => noChao(x, z)); let total = 0;
      for (let i = 1; i < tela.length; i++) total += Math.hypot(tela[i][0] - tela[i - 1][0], tela[i][1] - tela[i - 1][1]);
      if (total <= 0) return;
      ctx.beginPath(); tela.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.setLineDash([total, total]); ctx.lineDashOffset = total * (1 - clamp(progresso));
      ctx.strokeStyle = cor; ctx.lineWidth = largura * kz(pts[0][1]); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke(); ctx.setLineDash([]);
    }
    function rachaduraChao(pts, progresso, largura) {
      linhaChao(pts, progresso, largura, "rgba(8,10,12,.85)");
      ctx.save(); ctx.translate(0, 1.2); linhaChao(pts, progresso, Math.max(.6, largura * .35), "rgba(170,178,184,.28)"); ctx.restore();
    }
    const POCAS = [[-1.6, 1.3, .9], [2.3, 2.2, 1.2], [-4.4, -1.6, .8], [5.7, .8, 1], [.6, -2.8, 1.1], [-7.2, 2, 1.3], [8.2, -1.2, .9]];
    function piso(t, luzes) {
      const s = escala(), [, yb] = noChao(0, FUNDO);
      if (yb > H * 1.15) return;
      ctx.fillStyle = "#353B3F"; ctx.fillRect(-W * .1, yb, W * 1.2, H * 1.2 - yb);
      for (let r = 0; r < 14; r++) {
        const z0 = FUNDO + r * 1.15, z1 = z0 + 1.15, [, ya] = noChao(0, z0);
        if (ya > H * 1.12) break;
        const k = kz(z0), meia = W / (2 * s * k) + 2, desloc = (r % 2) * .8, longe = 1 - clamp((z0 - FUNDO) / 9);
        for (let x = Math.floor((cam.x - meia) / 1.6) * 1.6 - desloc; x < cam.x + meia; x += 1.6) {
          const h = hash(Math.round((x + desloc) / 1.6) * 31 + r * 17), tom = 74 + h * 20 + longe * 26;
          ctx.fillStyle = `rgb(${Math.round(tom * .93)},${Math.round(tom)},${Math.round(tom * 1.04)})`;
          ctx.beginPath(); ctx.moveTo(...noChao(x + .04, z0 + .04)); ctx.lineTo(...noChao(x + 1.56, z0 + .04)); ctx.lineTo(...noChao(x + 1.56, z1 - .04)); ctx.lineTo(...noChao(x + .04, z1 - .04)); ctx.closePath(); ctx.fill();
          if (h > .7) { ctx.strokeStyle = "rgba(18,21,24,.5)"; ctx.lineWidth = 1; const m1 = noChao(x + .2 + h * .6, z0 + .15), m2 = noChao(x + .5 + h * .9, z1 - .2); ctx.beginPath(); ctx.moveTo(...m1); ctx.lineTo((m1[0] + m2[0]) / 2 + 3, (m1[1] + m2[1]) / 2); ctx.lineTo(...m2); ctx.stroke(); }
          if (h < .18) { const [mx, my] = noChao(x + .8, (z0 + z1) / 2), rr = s * k * .35; ctx.fillStyle = "rgba(24,28,30,.3)"; ctx.beginPath(); ctx.ellipse(mx, my, rr, rr * passoZ(z0) / (s * k), 0, 0, Math.PI * 2); ctx.fill(); }
        }
      }
      POCAS.forEach(([x, z, r]) => {
        const [px, py] = noChao(x, z), rx = r * s * kz(z), ry = r * passoZ(z); if (py > H * 1.1 || py < yb) return;
        ctx.fillStyle = "rgba(30,35,39,.55)"; ctx.beginPath(); ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(170,180,188,.22)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(px, py, rx, ry, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      });
      ctx.globalCompositeOperation = "lighter";
      luzes.forEach((l) => {
        if (l.y > -.3) return;
        const [x, y0] = noChao(l.x, -.4), alto = Math.max(0, Math.min(H * 1.1 - y0, H * .7)), w = s * (.45 + Math.min(l.i, 2) * .45);
        if (alto <= 0) return;
        const g = ctx.createLinearGradient(0, y0, 0, y0 + alto); g.addColorStop(0, `rgba(205,218,244,${Math.min(.3, l.i * .2).toFixed(3)})`); g.addColorStop(1, "rgba(205,218,244,0)");
        ctx.fillStyle = g; ctx.fillRect(x - w / 2, y0, w, alto);
      });
      ctx.globalCompositeOperation = "source-over";
      for (let i = 0; i < (t > 114.4 ? 0 : Math.round(48 * qualidade)); i++) {
        const c = t * 1.3 + hash(i + 3000), fase = c % 1, ciclo = Math.floor(c), x = cam.x + sr(i * 7 + ciclo * 13) * 9, z = lerp(-6, 4, hash(i * 5 + ciclo * 17));
        const [px, py] = noChao(x, z), r = fase * .3; if (py > H || py < yb) continue;
        ctx.strokeStyle = `rgba(196,205,212,${((1 - fase) * .3).toFixed(3)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(px, py, r * s * kz(z), Math.max(.5, r * passoZ(z)), 0, 0, Math.PI * 2); ctx.stroke();
      }
      FENDA.forEach((f) => rachaduraChao(f, 1, 2.6));
      RUPTURA.forEach((f, i) => rachaduraChao(f, (t - ONDA.t0 - i * .25) / (ONDA.t1 - ONDA.t0), i ? 2.2 : 4.2));
      if (t > GOLPE) {
        const a = t - GOLPE, [cx, cy] = noChao(IMPACTO[0], 0), rx = s * 2.2, ry = 2.2 * passoZ(0), brilho = Math.exp(-a * 1.1);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx); g.addColorStop(0, "rgba(8,10,12,.95)"); g.addColorStop(.72, "rgba(20,23,26,.85)"); g.addColorStop(1, "rgba(20,23,26,0)");
        ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx); ctx.translate(-cx, -cy); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        ctx.strokeStyle = "rgba(150,158,164,.4)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(cx, cy, rx * .8, ry * .8, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
        LICHT.forEach((r) => {
          const prog = clamp((a - r.nivel * .03) / .12), larg = Math.max(1, 3 - r.nivel * .6);
          rachaduraChao(r.pts, prog, larg);
          if (brilho > .02) {
            ctx.globalCompositeOperation = "lighter";
            linhaChao(r.pts, prog, larg * 2.4, `rgba(200,215,250,${(brilho * .3).toFixed(3)})`); linhaChao(r.pts, prog, Math.max(.8, larg * .55), `rgba(238,244,255,${(brilho * .9).toFixed(3)})`);
            ctx.globalCompositeOperation = "source-over";
          }
        });
        ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = Math.exp(-a * .9) * .8; ctx.drawImage(SPR.luz, cx - rx, cy - ry * 2, rx * 2, ry * 4);
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }
      const n = ctx.createLinearGradient(0, yb, 0, yb + H * .18); n.addColorStop(0, "rgba(140,148,154,.4)"); n.addColorStop(1, "rgba(140,148,154,0)");
      ctx.fillStyle = n; ctx.fillRect(-W * .1, yb, W * 1.2, H * .18);
    }
    const BLOCOS = Array.from({ length: 28 }, (_, i) => ({ x: lerp(3.1, -3.7, i / 27), larg: .34 + hash(2000 + i) * .18, alto: .55 + hash(2100 + i) * .65, inc: sr(2200 + i) * .35, z: .12 + hash(2300 + i) * .55, perfil: sr(2400 + i) * .15 })).sort((a, b) => a.z - b.z);

    function tambor(cx, cy, a, r, h, lado, quebrado) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(a);
      const g = ctx.createLinearGradient(-r, 0, r, 0);
      g.addColorStop(0, "#25292D"); g.addColorStop(clamp(.34 - lado * .16, .12, .6), "#979EA2"); g.addColorStop(.66, "#666E72"); g.addColorStop(1, "#1F2326");
      ctx.fillStyle = g; ctx.beginPath();
      if (quebrado) { ctx.moveTo(-r, -h / 2); ctx.lineTo(r, -h / 2); for (let i = 0; i <= 9; i++) ctx.lineTo(r - (i / 9) * 2 * r, h / 2 + sr(quebrado + i) * r * .55); ctx.closePath(); }
      else ctx.rect(-r, -h / 2, r * 2, h);
      ctx.fill(); ctx.save(); ctx.clip();
      for (let i = 1; i < 12; i++) {
        const an = -Math.PI / 2 + i / 12 * Math.PI, fx = Math.sin(an) * r, larg = Math.max(.8, Math.cos(an) * r * .09);
        ctx.fillStyle = `rgba(14,17,20,${(.14 + .16 * Math.abs(Math.sin(an))).toFixed(3)})`; ctx.fillRect(fx - larg / 2, -h / 2, larg, h + r);
        ctx.fillStyle = "rgba(225,230,234,.05)"; ctx.fillRect(fx + larg / 2, -h / 2, larg * .7, h + r);
      }
      ctx.restore();
      ctx.fillStyle = "rgba(10,12,14,.42)"; ctx.fillRect(-r, -h / 2, r * 2, 1.4);
      ctx.restore();
    }
    function coluna(x, z, alto, lado, marcas, t) {
      const s = escala() * kz(z), [bx, by] = noChao(x, z), r = .46 * s, topo = by - alto * s;
      if (bx < -r * 4 || bx > W + r * 4 || topo > H) return;
      tambor(bx, (topo + by) / 2, 0, r, by - topo, lado, 0);
      ctx.fillStyle = "rgba(10,12,14,.4)";
      for (let hh = 1.4; hh < alto; hh += 1.4) ctx.fillRect(bx - r, by - hh * s, r * 2, 1.3);
      for (let i = 0; i < 4; i++) {
        const fx = bx + sr(x * 13 + i) * r * .75, comp = (by - topo) * (.3 + hash(x * 3 + i) * .5), g = ctx.createLinearGradient(0, topo, 0, topo + comp);
        g.addColorStop(0, "rgba(16,19,22,.42)"); g.addColorStop(1, "rgba(16,19,22,0)"); ctx.fillStyle = g; ctx.fillRect(fx, topo, r * .16, comp);
      }
      for (let i = 0; i < 5; i++) {
        const y = by - (1 + hash(x * 7 + i) * (alto - 2)) * s, ladoX = hash(x + i * 3) > .5 ? 1 : -1;
        ctx.fillStyle = "rgba(20,23,26,.55)"; ctx.beginPath(); ctx.moveTo(bx + ladoX * r, y); ctx.lineTo(bx + ladoX * r * .8, y + r * .2); ctx.lineTo(bx + ladoX * r, y + r * .4); ctx.fill();
      }
      (marcas || []).forEach(([h, t0]) => {
        if (t < t0) return;
        const y = by - h * s, g = ctx.createRadialGradient(bx, y, 0, bx, y, r * 1.2); g.addColorStop(0, "rgba(8,10,12,.8)"); g.addColorStop(1, "rgba(8,10,12,0)");
        ctx.save(); ctx.beginPath(); ctx.rect(bx - r, topo, r * 2, by - topo); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(bx - r * 1.2, y - r * 1.2, r * 2.4, r * 2.4); ctx.restore();
      });
    }
    function plintoECapitel(x, z, alto) {
      const s = escala() * kz(z), [bx, by] = noChao(x, z);
      ctx.fillStyle = "#41484C"; ctx.fillRect(bx - .66 * s, by - .3 * s, 1.32 * s, .3 * s);
      ctx.fillStyle = "rgba(160,168,174,.18)"; ctx.fillRect(bx - .66 * s, by - .3 * s, 1.32 * s, 1.2);
      if (alto > 30) return;
      const yc = by - alto * s;
      if (yc > H + s || yc < -s * 2) return;
      ctx.fillStyle = "#596165"; ctx.beginPath(); ctx.moveTo(bx - .46 * s, yc + .52 * s); ctx.quadraticCurveTo(bx - .8 * s, yc + .3 * s, bx - .74 * s, yc + .1 * s); ctx.lineTo(bx + .74 * s, yc + .1 * s); ctx.quadraticCurveTo(bx + .8 * s, yc + .3 * s, bx + .46 * s, yc + .52 * s); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#677074"; ctx.fillRect(bx - .8 * s, yc - .26 * s, 1.6 * s, .36 * s);
    }
    const QUEBRA = 3.2, TOPO = 13, BORDA = Array.from({ length: 10 }, (_, i) => [i / 9, sr(1500 + i) * .26]);
    function colunaQuebrada(t, lado) {
      const x = -6.4, z = Z_FRENTE, s = escala() * kz(z), [bx, by] = noChao(x, z), r = .46 * s;
      if (t < 16.42) { coluna(x, z, TOPO, lado, [[6.2, 12.55]], t); plintoECapitel(x, z, TOPO); return; }
      ctx.save(); ctx.beginPath(); ctx.moveTo(bx - r - 2, by + 2);
      BORDA.forEach(([u, d]) => ctx.lineTo(bx - r + u * 2 * r, by - (QUEBRA + d) * s)); ctx.lineTo(bx + r + 2, by + 2); ctx.closePath(); ctx.clip();
      coluna(x, z, QUEBRA + .5, lado, [], t); ctx.restore();
      plintoECapitel(x, z, 99);
      const rach = clamp((t - 16.42) / .35);
      ctx.strokeStyle = "rgba(8,10,12,.8)"; ctx.lineWidth = 1.5;
      [[.3, 1.6], [.64, 2.3], [.47, 1]].forEach(([u, fundo], i) => {
        let px = bx - r + u * 2 * r, py = by - (QUEBRA - .05) * s; ctx.beginPath(); ctx.moveTo(px, py);
        for (let j = 1; j <= Math.round(6 * rach); j++) { px += sr(1550 + i * 9 + j) * r * .28; py += (fundo / 6) * s; ctx.lineTo(px, py); }
        ctx.stroke();
      });
      const u = clamp((t - 16.45) / 1.65), q = u * u, a = -1.5708 * Math.pow(u, 2.2), pancada = Math.max(0, t - 18.1), solta = 1 - Math.exp(-pancada * 3);
      const b0 = [lerp(bx, bx - .5 * s, q), lerp(by - QUEBRA * s, by - r, q)];
      for (let i = 0; i < 7; i++) {
        const hc = i * 1.4 + .7, quique = Math.sin(Math.PI * clamp(pancada * 2.4)) * .3 * s * hash(1700 + i);
        const cx = b0[0] + hc * s * Math.sin(a) + sr(1600 + i) * .6 * s * solta * (1 + i * .3), cy = b0[1] - hc * s * Math.cos(a) - quique;
        tambor(cx, cy, a + sr(1750 + i) * .5 * solta, r, 1.4 * s, lado, i === 0 ? 1500 : 0);
      }
    }
    function templo(t, luzes) {
      let L = null; luzes.forEach((l) => { if (!L || l.i > L.i) L = l; });
      const lado = (x) => (L ? clamp((L.x - x) / 6, -1, 1) : -.3);
      [-9.6, -4.8, 0, 4.8, 9.6].forEach((x) => { coluna(x, Z_FUNDO, 13, lado(x), [], t); plintoECapitel(x, Z_FUNDO, 13); });
      const s = escala() * kz(Z_FUNDO), [x0, y0] = noChao(-13, Z_FUNDO), [x1] = noChao(13, Z_FUNDO);
      if (tempoQuadro < 114.85) { ctx.fillStyle = "#535B5F"; ctx.fillRect(x0, y0 - 14.2 * s, x1 - x0, .95 * s); }
      const nv = ctx.createLinearGradient(0, y0 - 13 * s, 0, y0); nv.addColorStop(0, "rgba(96,104,110,0)"); nv.addColorStop(1, "rgba(118,126,132,.38)");
      ctx.fillStyle = nv; ctx.fillRect(-W * .1, y0 - 13 * s, W * 1.2, 13 * s);
      coluna(6.4, Z_FRENTE, 13, lado(6.4), [[4.4, 12.5], [2.8, 12.6]], t); plintoECapitel(6.4, Z_FRENTE, 13);
      colunaQuebrada(t, lado(-6.4));
    }

    const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const mistura = (a, b, u) => `rgb(${Math.round(lerp(a[0], b[0], u))},${Math.round(lerp(a[1], b[1], u))},${Math.round(lerp(a[2], b[2], u))})`;
    const TOM = {
      peleZ: ["#E6E1D8", "#A49F98", "#46423F"], peleP: ["#C2CFCA", "#7A8783", "#303B39"],
      panoZ: ["#A2AEB8", "#56606A", "#22272C"], panoP: ["#74A8A5", "#2F5D5C", "#122626"],
      cabeloZ: ["#FFFFFF", "#D8DDE0", "#7D858A"], cabeloP: ["#5A8F8C", "#24423F", "#0D1A1A"], bronze: ["#A6BDB6", "#4F6C67", "#1B2826"]
    };
    for (const k in TOM) TOM[k] = TOM[k].map(rgb);
    const formaMembro = (w0, w1, ba, bb, pico = .38) => (L) => {
      const p = new Path2D();
      p.moveTo(0, -w0); p.bezierCurveTo(L * pico * .7, -w0 - ba, L * pico * 1.5, -(w0 + w1) / 2 - ba * .6, L, -w1);
      p.arc(L, 0, w1, -Math.PI / 2, Math.PI / 2);
      p.bezierCurveTo(L * pico * 1.5, (w0 + w1) / 2 + bb * .6, L * pico * .7, w0 + bb, 0, w0);
      p.arc(0, 0, w0, Math.PI / 2, Math.PI * 1.5); p.closePath();
      return p;
    };
    const BRACO = formaMembro(7.6, 5, 2.2, 3.6), ANTEBRACO = formaMembro(5.7, 3.7, 2.8, 1.4, .3), COXA = formaMembro(10.6, 6.6, 2.6, 3.6), CANELA = formaMembro(6.7, 4.1, 4.4, 1, .32), PESCOCO = formaMembro(8.5, 7.2, 1, 1);
    const MAO = () => { const p = new Path2D(); p.moveTo(-1, -4.4); p.quadraticCurveTo(9, -7, 14, -3); p.quadraticCurveTo(17, 1, 13, 4.5); p.quadraticCurveTo(6, 6.5, -1, 4.4); p.closePath(); return p; };
    const PE = () => { const p = new Path2D(); p.moveTo(-6, -4); p.quadraticCurveTo(6, -6.5, 16, -1.5); p.quadraticCurveTo(23, 2, 21, 5.5); p.lineTo(-5, 5.5); p.quadraticCurveTo(-9, 1, -6, -4); p.closePath(); return p; };
    const arco = (curva, L) => (x) => -curva * L * .3 * 4 * (x / L) * (1 - x / L);
    function formaTronco(L, curva) {
      const o = arco(curva, L), q = (x, y) => [x, y + o(x)], p = new Path2D();
      p.moveTo(...q(0, -13)); p.bezierCurveTo(...q(L * .3, -17), ...q(L * .6, -18), ...q(L * .82, -23)); p.quadraticCurveTo(...q(L * .97, -26), ...q(L, -9)); p.lineTo(...q(L, 9));
      p.quadraticCurveTo(...q(L * .97, 25), ...q(L * .84, 28)); p.quadraticCurveTo(...q(L * .7, 31), ...q(L * .62, 21)); p.bezierCurveTo(...q(L * .45, 19), ...q(L * .25, 18), ...q(0, 14)); p.closePath();
      return p;
    }
    const ROSTO = (() => {
      const p = new Path2D();
      p.arc(-2, -2, 16.5, Math.PI * .55, Math.PI * 1.85); p.lineTo(16.5, -5); p.lineTo(18.5, -2.5); p.lineTo(22.5, 4.5); p.lineTo(18, 6.5);
      p.quadraticCurveTo(19.5, 9, 18, 11); p.quadraticCurveTo(17, 16.5, 11, 17.5); p.quadraticCurveTo(2, 17.5, -4.6, 14.3); p.closePath();
      return p;
    })();
    const nuvemDe = (lista) => { const p = new Path2D(); lista.forEach(([x, y, r]) => { p.moveTo(x + r, y); p.arc(x, y, r, 0, Math.PI * 2); }); return p; };
    const CABELO_Z = nuvemDe([[-2, -11, 16], [-12, -3, 14], [-15, 10, 12], [5, -16, 11], [-8, 20, 9], [12, -13, 7]]);
    const BARBA_Z = nuvemDe([[7, 14, 9], [15, 15, 7], [1, 18, 9], [8, 26, 9.5], [15, 23, 7], [5, 34, 7.5], [10, 41, 5.5]]);
    const CABELO_P = new Path2D("M14,-11 Q8,-23 -6,-20 Q-21,-15 -20,2 Q-23,15 -12,21 L-6,12 Q-10,0 -2,-8 Q6,-12 14,-11 Z");
    const BARBA_P = new Path2D("M-4,10 Q4,16 17,13 Q23,23 14,35 Q9,45 1,41 Q-7,31 -4,10 Z");
    const FIOS_Z = new Path2D("M2,22 q3,6 1,12 M9,24 q2,6 0,11 M-8,-6 q-4,6 -3,13 M-2,-20 q-6,4 -9,12");
    const FIOS_P = new Path2D("M3,22 q5,-3 7,2 q1,4 -3,4 M6,31 q5,-3 7,2 M-14,0 q4,-4 7,0 q2,4 -2,5 M-12,12 q4,-4 7,0");

    function luzLocal(S, luzes) {
      const c = mundo(S, [0, -70]); let melhor = { x: c[0] + .3, y: c[1] - 8, i: .35 }, forca = .35 * .6;
      luzes.forEach((l) => { const f = l.i / (1 + ((l.x - c[0]) ** 2 + (l.y - c[1]) ** 2) * .03); if (f > forca) { forca = f; melhor = l; } });
      const dx = melhor.x - c[0], dy = melhor.y - c[1], d = Math.hypot(dx, dy) || 1, cr = Math.cos(-S.r), sn = Math.sin(-S.r);
      return { dx: ((dx * cr - dy * sn) / d) * S.dir, dy: (dx * sn + dy * cr) / d, i: clamp(forca * 1.4), mundo: melhor, forca };
    }
    function parte(a, b, forma, trio, w, luz, plano, escuro) {
      const d = ang(a, b), L = dist(a, b);
      ctx.save(); ctx.translate(a[0], a[1]); ctx.rotate(d);
      const p = forma(L);
      if (plano) ctx.fillStyle = plano;
      else {
        const lado = luz.dx * Math.sin(d) - luz.dy * Math.cos(d), f = luz.i * Math.min(1, Math.abs(lado) + .25);
        const claro = mistura(trio[1], trio[0], .15 + .85 * f), meioTom = mistura(trio[1], trio[0], .08), sombra = mistura(trio[1], trio[2], .6);
        const g = ctx.createLinearGradient(0, -w, 0, w);
        g.addColorStop(0, lado > 0 ? claro : sombra); g.addColorStop(.5, meioTom); g.addColorStop(1, lado > 0 ? sombra : claro);
        ctx.fillStyle = g;
      }
      ctx.fill(p);
      if (escuro && !plano) { ctx.fillStyle = "rgba(6,8,10,.34)"; ctx.fill(p); }
      ctx.restore();
    }
    function inercia(quem, t) {
      const f = quem === "z" ? Z : PO, S = f(t), A = f(t - .06), a = quadril(S), b = quadril(A);
      const vx = (a[0] - b[0]) / .06, vy = (a[1] - b[1]) / .06, c = Math.cos(S.r), s = Math.sin(S.r);
      return { vx: (vx * c + vy * s) * S.dir, vy: -vx * s + vy * c };
    }
    const gravidadeLocal = (S) => Math.atan2(Math.cos(S.r), Math.sin(S.r) * S.dir);
    function cadeia(origem, n, seg, repouso, iner, t, vento, fase, piso = Infinity) {
      const pts = [origem], recuo = clamp(iner.vx * .16, -.45, 1.05) + clamp(iner.vy * .1, 0, .7);
      let a = repouso;
      for (let i = 1; i <= n; i++) {
        const u = i / n, alvo = repouso + recuo * (.35 + .65 * u) + vento * (.12 + .3 * u) * Math.sin(t * 2.4 - i * .85 + fase) + vento * .08 * ruido(t * .9 + fase * 3);
        a = clamp(lerp(a, alvo, .7), repouso - .35, repouso + 1.5);
        const p = polar(pts[i - 1], a, seg); p[1] = Math.min(p[1], piso); pts.push(p);
      }
      return pts;
    }
    const meio = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    function bordas(pts, largura) {
      const E = [], Dd = [];
      pts.forEach((p, i) => {
        const a = ang(pts[Math.max(0, i - 1)], pts[Math.min(pts.length - 1, i + 1)]), w = largura(i / (pts.length - 1));
        E.push([p[0] - Math.sin(a) * w, p[1] + Math.cos(a) * w]); Dd.push([p[0] + Math.sin(a) * w, p[1] - Math.cos(a) * w]);
      });
      return [E, Dd];
    }
    function capa(pts, w0, w1, trio, plano, luz) {
      const [E, Dd] = bordas(pts, (u) => lerp(w0, w1, u)), c = new Path2D(), fe = E[E.length - 1], fd = Dd[Dd.length - 1], fim = ang(pts[pts.length - 2], pts[pts.length - 1]);
      c.moveTo(...E[0]);
      for (let i = 1; i < E.length; i++) c.quadraticCurveTo(...E[i - 1], ...meio(E[i - 1], E[i]));
      c.lineTo(...fe);
      for (let k = 1; k <= 3; k++) { const u0 = (k - .5) / 3, u1 = k / 3, bojo = k % 2 ? 6 : 3; c.quadraticCurveTo(lerp(fe[0], fd[0], u0) + Math.cos(fim) * bojo, lerp(fe[1], fd[1], u0) + Math.sin(fim) * bojo, lerp(fe[0], fd[0], u1), lerp(fe[1], fd[1], u1)); }
      for (let i = Dd.length - 2; i >= 0; i--) c.quadraticCurveTo(...Dd[i + 1], ...meio(Dd[i + 1], Dd[i]));
      c.lineTo(...Dd[0]); c.closePath();
      if (plano) ctx.fillStyle = plano;
      else { const g = ctx.createLinearGradient(...pts[0], ...pts[pts.length - 1]); g.addColorStop(0, mistura(trio[1], trio[2], .55)); g.addColorStop(.6, mistura(trio[1], trio[0], .1 + .35 * luz.i)); g.addColorStop(1, mistura(trio[1], trio[2], .4)); ctx.fillStyle = g; }
      ctx.fill(c);
      if (!plano) {
        ctx.strokeStyle = mistura(trio[1], trio[2], .75); ctx.lineWidth = 1.3; ctx.globalAlpha = .5; ctx.beginPath();
        [-.45, .1, .55].forEach((o) => { const [F] = bordas(pts, (u) => lerp(w0, w1, u) * o); F.slice(1).forEach((q, i) => (i ? ctx.lineTo(...q) : ctx.moveTo(...q))); });
        ctx.stroke(); ctx.globalAlpha = 1;
      }
    }
    function mechas(z, P, t, ger, iner, trio, plano, piso) {
      const rot = ang(P.n, P.h) + Math.PI / 2, c = Math.cos(rot), s = Math.sin(rot), naCabeca = ([x, y]) => [P.h[0] + x * c - y * s, P.h[1] + x * s + y * c];
      (z ? [[-13, -9], [-15, 1], [-11, 10]] : [[-12, -10], [-15, 0], [-12, 11]]).forEach((r, k) => {
        const pts = cadeia(naCabeca(r), z ? 4 : 5, z ? 13 : 14, ger + .6 - k * .12, iner, t, z ? 1 : 1.3, k * 1.3 + (z ? 0 : 2), piso);
        const [E, Dd] = bordas(pts, (u) => (z ? 10 - k : 8 - k * .8) * Math.pow(1 - u, .8)), m = new Path2D();
        m.moveTo(...E[0]);
        for (let i = 1; i < E.length; i++) m.quadraticCurveTo(...E[i - 1], ...meio(E[i - 1], E[i]));
        m.lineTo(...pts[pts.length - 1]);
        for (let i = Dd.length - 2; i >= 0; i--) m.quadraticCurveTo(...Dd[i + 1], ...meio(Dd[i + 1], Dd[i]));
        m.closePath();
        ctx.fillStyle = plano || mistura(trio[1], k === 1 ? trio[0] : trio[2], k === 1 ? .15 : .35); ctx.fill(m);
      });
    }
    function cabeca(z, P, t, luz, plano) {
      const rot = ang(P.n, P.h) + Math.PI / 2, pele = z ? TOM.peleZ : TOM.peleP, cab = z ? TOM.cabeloZ : TOM.cabeloP, c = Math.cos(-rot), s = Math.sin(-rot);
      const lx = luz.dx * c - luz.dy * s, ly = luz.dx * s + luz.dy * c;
      ctx.save(); ctx.translate(P.h[0], P.h[1]); ctx.rotate(rot);
      ctx.fillStyle = plano || mistura(cab[1], cab[2], .3); ctx.fill(z ? CABELO_Z : CABELO_P);
      if (plano) ctx.fillStyle = plano;
      else {
        const g = ctx.createRadialGradient(lx * 10, ly * 10, 2, 0, 0, 26);
        g.addColorStop(0, mistura(pele[1], pele[0], .25 + .7 * luz.i)); g.addColorStop(.6, mistura(pele[1], pele[0], .05)); g.addColorStop(1, mistura(pele[1], pele[2], .6));
        ctx.fillStyle = g;
      }
      ctx.fill(ROSTO);
      if (!plano) {
        ctx.fillStyle = mistura(pele[2], [0, 0, 0], .3); ctx.beginPath(); ctx.ellipse(12, -1.5, 2.8, 1.5, -.15, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = mistura(pele[2], [0, 0, 0], .2); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(8, -5); ctx.quadraticCurveTo(13, -7.5, 17.5, -4); ctx.stroke();
      }
      ctx.save(); ctx.translate(6, 10); ctx.rotate(Math.sin(t * 1.7 + (z ? 0 : 1)) * .05); ctx.translate(-6, -10);
      ctx.fillStyle = plano || mistura(cab[1], lx > 0 ? cab[0] : cab[2], .25); ctx.fill(z ? BARBA_Z : BARBA_P);
      if (!plano) { ctx.strokeStyle = mistura(cab[1], cab[2], .55); ctx.lineWidth = 1.1; ctx.stroke(z ? FIOS_Z : FIOS_P); }
      ctx.restore(); ctx.restore();
    }
    function tridente(P, plano) {
      const a = ang(P.cF, P.mF), ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux, [mx, my] = P.mF, pt = [mx + ux * 92, my + uy * 92];
      ctx.lineCap = "round"; ctx.strokeStyle = plano || mistura(TOM.bronze[1], TOM.bronze[2], .35); ctx.lineWidth = 4.8;
      ctx.beginPath(); ctx.moveTo(mx - ux * 112, my - uy * 112); ctx.lineTo(pt[0], pt[1]); ctx.stroke();
      if (!plano) { ctx.strokeStyle = mistura(TOM.bronze[1], TOM.bronze[0], .5); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(mx - ux * 110 + px * 1.2, my - uy * 110 + py * 1.2); ctx.lineTo(pt[0] + px * 1.2, pt[1] + py * 1.2); ctx.stroke(); }
      const q = (o, f) => [pt[0] + px * o + ux * f, pt[1] + py * o + uy * f], c = new Path2D(), m = (o, f) => c.lineTo(...q(o, f));
      c.moveTo(...q(-12, -4)); m(-13, 10); m(-12.5, 30); m(-8, 23); m(-8.5, 11); m(-2.6, 7); m(-2.8, 34); m(0, 42); m(2.8, 34); m(2.6, 7); m(8.5, 11); m(8, 23); m(12.5, 30); m(13, 10); m(12, -4); m(2, -1); m(-2, -1); c.closePath();
      ctx.fillStyle = plano || mistura(TOM.bronze[1], TOM.bronze[0], .3); ctx.fill(c);
    }
    function figura(quem, S, t, luz, plano) {
      const P = S.P, z = quem === "z", pele = z ? TOM.peleZ : TOM.peleP, pano = z ? TOM.panoZ : TOM.panoP, cab = z ? TOM.cabeloZ : TOM.cabeloP;
      const pinta = (a, b, forma, trio, w, escuro) => parte(a, b, forma, trio, w, luz, plano, escuro);
      const pata = (o, a, forma, escuro) => pinta(o, polar(o, a, 14), forma, pele, 6, escuro);
      const tt = ang([0, 0], P.n), Lt = dist([0, 0], P.n), ar = arco(P.curva || 0, Lt);
      const T = (x, y) => { const X = x * Lt, Y = y + ar(X); return [Math.cos(tt) * X - Math.sin(tt) * Y, Math.sin(tt) * X + Math.cos(tt) * Y]; };
      const iner = inercia(quem, t), ger = gravidadeLocal(S), piso = Math.abs(Math.sin(S.r)) < .35 ? 120 : Infinity;
      capa(cadeia(P.oT, 5, 20, ger + .32, iner, t, 1.1, z ? 0 : 2, piso), 6, 23, pano, plano, luz);
      mechas(z, P, t, ger, iner, cab, plano, piso);
      pinta(P.oT, P.cT, BRACO, pele, 8, true); pinta(P.cT, P.mT, ANTEBRACO, pele, 6, true); pata(P.mT, ang(P.cT, P.mT), MAO, true);
      pinta([0, 0], P.jT, COXA, pele, 11, true); pinta(P.jT, P.pT, CANELA, pele, 7, true); pata(P.pT, P.peT, PE, true);
      pinta([0, 0], P.jF, COXA, pele, 11); pinta(P.jF, P.pF, CANELA, pele, 7); pata(P.pF, P.peF, PE);
      pinta([0, 0], P.n, (L) => formaTronco(L, P.curva || 0), pele, 30);
      if (!plano) {
        ctx.strokeStyle = mistura(pele[1], pele[2], .5); ctx.lineWidth = 1.4; ctx.globalAlpha = .55; ctx.beginPath();
        ctx.moveTo(...T(.64, 21)); ctx.quadraticCurveTo(...T(.74, 12), ...T(.86, 16)); ctx.moveTo(...T(.5, 14)); ctx.lineTo(...T(.16, 11)); ctx.moveTo(...T(.38, 16)); ctx.quadraticCurveTo(...T(.35, 10), ...T(.4, 5));
        ctx.stroke(); ctx.globalAlpha = 1;
      }
      const onda = (k) => Math.sin(t * 2.1 + k + (z ? 0 : 1.7)) * 3;
      const cT = T(.15, -17), cF = T(.15, 18), bT = [P.jT[0] - 9, P.jT[1] + 12 + onda(0)], bF = [P.jF[0] + 9, P.jF[1] + 12 + onda(1)];
      const centro = [(P.jT[0] + P.jF[0]) / 2, Math.max(P.jT[1], P.jF[1]) + 19 + onda(2)];
      const saia = new Path2D(); saia.moveTo(...cT); saia.quadraticCurveTo(cT[0] - 4, (cT[1] + bT[1]) / 2, bT[0], bT[1]);
      saia.quadraticCurveTo((bT[0] + centro[0]) / 2, centro[1] + 4, centro[0], centro[1]); saia.quadraticCurveTo((centro[0] + bF[0]) / 2, centro[1] + 4, bF[0], bF[1]);
      saia.quadraticCurveTo(cF[0] + 6, (cF[1] + bF[1]) / 2, cF[0], cF[1]); saia.closePath();
      if (plano) ctx.fillStyle = plano;
      else { const g = ctx.createLinearGradient(cT[0], cT[1], bF[0], bF[1]); g.addColorStop(0, mistura(pano[1], pano[2], .5)); g.addColorStop(.5, mistura(pano[1], pano[0], .15 + .6 * luz.i)); g.addColorStop(1, mistura(pano[1], pano[2], .35)); ctx.fillStyle = g; }
      ctx.fill(saia);
      const faixa = new Path2D(); faixa.moveTo(...T(.98, -21)); faixa.lineTo(...T(1, -7)); faixa.quadraticCurveTo(...T(.6, 12), ...T(.24, 19)); faixa.lineTo(...T(.12, 6)); faixa.quadraticCurveTo(...T(.5, -6), ...T(.98, -21)); faixa.closePath();
      ctx.fillStyle = plano || mistura(pano[1], pano[0], .1 + .4 * luz.i); ctx.fill(faixa);
      if (!plano) {
        ctx.strokeStyle = mistura(pano[1], pano[2], .7); ctx.lineWidth = 1.3; ctx.globalAlpha = .6; ctx.beginPath();
        [.25, .5, .75].forEach((u) => { const top = [lerp(cT[0], cF[0], u), lerp(cT[1], cF[1], u)]; ctx.moveTo(top[0], top[1]); ctx.quadraticCurveTo(top[0] + 4, (top[1] + centro[1]) / 2, lerp(bT[0], bF[0], u), lerp(bT[1], bF[1], u) + 6); });
        ctx.stroke(); ctx.globalAlpha = 1;
      }
      pinta(P.n, polar(P.n, ang(P.n, P.h), dist(P.n, P.h) * .7), PESCOCO, pele, 9);
      cabeca(z, P, t, luz, plano);
      pinta(P.oF, P.cF, BRACO, pele, 8); pinta(P.cF, P.mF, ANTEBRACO, pele, 6); pata(P.mF, ang(P.cF, P.mF), MAO);
      if (!z) tridente(P, plano);
    }
    function emPose(S, desenho) {
      const [hx, hy] = proj(...quadril(S)), px = escala() * K, sq = S.sq || 0;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(S.r); ctx.scale(S.dir * px * (1 + sq), px * (1 - sq)); ctx.lineJoin = "round"; desenho(); ctx.restore();
    }
    function lutador(quem, S, t, luzes) {
      const quando = quem === "z" ? Z : PO, antes = quando(t - .07), luz = luzLocal(S, luzes);
      const corpo = Math.hypot(antes.x - S.x, antes.alt - S.alt), m0 = mundo(antes, antes.P.mF), m1 = mundo(S, S.P.mF);
      const rapidez = Math.max(clamp((corpo - .18) / .6), clamp((Math.hypot(m1[0] - m0[0], m1[1] - m0[1]) - .35) / .9));
      if (rapidez > 0) {
        const n = 2 + Math.round(rapidez * 3);
        for (let k = n; k >= 1; k--) { const d = k * .035, Sd = quando(t - d); ctx.globalAlpha = .14 * rapidez * (1 - k / (n + 1)); emPose(Sd, () => figura(quem, Sd, t - d, luz, "#9AA4AC")); }
        ctx.globalAlpha = 1;
      }
      ctx.save(); ctx.translate(-1.4, -1.8); emPose(S, () => figura(quem, S, t, luz, "rgba(140,165,200,.2)")); ctx.restore();
      if (luz.forca > .05) {
        const dx = luz.mundo.x - S.x, dy = luz.mundo.y - quadril(S)[1], d = Math.hypot(dx, dy) || 1;
        ctx.save(); ctx.translate(dx / d * 2.8, dy / d * 2.8); emPose(S, () => figura(quem, S, t, luz, `rgba(222,232,248,${clamp(luz.forca * 1.1).toFixed(3)})`)); ctx.restore();
      }
      emPose(S, () => figura(quem, S, t, luz));
      if (quem === "z" && carga(t) > .55) {
        const f = (carga(t) - .55) / .6, sem = Math.floor(t * 7);
        ctx.globalCompositeOperation = "lighter";
        [S.P.mF, S.P.mT].forEach((m, k) => {
          const [wx, wy] = mundo(S, m), [x, y] = proj(wx, wy), s = escala() * .55 * (.6 + f);
          ctx.globalAlpha = clamp(.45 * f + .2); ctx.drawImage(SPR.luz, x - s, y - s, s * 2, s * 2); ctx.globalAlpha = 1;
          for (let i = 0; i < 2; i++) { const a = sr(sem * 3 + i + k * 9) * Math.PI; tracarRaio(raioPts(wx, wy, wx + Math.cos(a) * .45, wy + Math.sin(a) * .45, sem * 11 + i + k * 5, 3), .35, .55 * f); }
        });
        ctx.globalCompositeOperation = "source-over";
      }
    }

    const sombraCv = document.createElement("canvas"), sctx = sombraCv.getContext("2d");
    function sombras(t, luzes) {
      const lutadores = [["p", PO(t)], ["z", Z(t)]], s = escala();
      lutadores.forEach(([, S]) => [S.P.pF, S.P.pT, S.P.n].forEach((p, i) => {
        const [wx, wy] = mundo(S, p), alt = Math.max(0, -wy), [x, y] = noChao(wx, 0), r = s * (i === 2 ? .9 : .5) / (1 + alt * .5), ry = Math.max(2, r * passoZ(0) / s * 1.4);
        ctx.globalAlpha = clamp((i === 2 ? .45 : .85) - alt * .3); ctx.drawImage(SPR.contato, x - r * 1.5, y - ry, r * 3, ry * 2);
      }));
      ctx.globalAlpha = 1;
      let L = null; luzes.forEach((l) => { if (l.y < -.8 && (!L || l.i > L.i)) L = l; });
      if (!L || L.i < .25) return;
      const principal = ctx, [lx, ly] = proj(L.x, L.y), achata = clamp((4 / Math.max(1, -L.y)) * (cam.alt / D) * 2.2, .12, .45);
      ctx = sctx; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, sombraCv.width, sombraCv.height); ctx.scale(sombraCv.width / W, sombraCv.height / H);
      const projetar = (fx, fy, desenho) => { const corte = clamp((fx - lx) / Math.max(40, fy - ly), -2.6, 2.6); ctx.save(); ctx.translate(fx, fy); ctx.transform(1, 0, -corte, -achata, 0, 0); ctx.translate(-fx, -fy); desenho(); ctx.restore(); };
      lutadores.forEach(([q, S]) => { const [fx, fy] = proj(S.x, 0); projetar(fx, fy, () => emPose(S, () => figura(q, S, t, { dx: 0, dy: -1, i: 0 }, "#000"))); });
      [[6.4, 13], [-6.4, t > 16.42 ? QUEBRA : 13]].forEach(([cx, alto]) => { const [fx, fy] = noChao(cx, Z_FRENTE), sk = escala() * kz(Z_FRENTE); projetar(fx, fy, () => { ctx.fillStyle = "#000"; ctx.fillRect(fx - .46 * sk, fy - alto * sk, .92 * sk, alto * sk); }); });
      ctx = principal;
      ctx.globalAlpha = clamp(L.i * .5, 0, .62); ctx.drawImage(sombraCv, 0, 0, W, H); ctx.globalAlpha = 1;
    }

    function tracarRaio(pts, larg, forca, aberracao = 2.5) {
      if (forca <= .01 || pts.length < 2) return;
      const c = new Path2D(); pts.forEach(([x, y], i) => { const [sx, sy] = proj(x, y); i ? c.lineTo(sx, sy) : c.moveTo(sx, sy); });
      ctx.lineJoin = ctx.lineCap = "round";
      [[larg * 9, .05], [larg * 4, .14], [larg * 1.8, .36], [larg * .7, .95]].forEach(([w, al]) => { ctx.strokeStyle = `rgba(205,220,255,${Math.min(1, al * forca).toFixed(3)})`; ctx.lineWidth = w; ctx.stroke(c); });
      ctx.save(); ctx.translate(aberracao, 0); ctx.strokeStyle = `rgba(255,120,150,${Math.min(.35, .12 * forca).toFixed(3)})`; ctx.lineWidth = larg * 1.2; ctx.stroke(c);
      ctx.translate(-aberracao * 2, 0); ctx.strokeStyle = `rgba(110,170,255,${Math.min(.35, .12 * forca).toFixed(3)})`; ctx.stroke(c); ctx.restore();
    }
    function raios(t) {
      ctx.globalCompositeOperation = "lighter";
      RAIOS.forEach((r) => {
        const a = t - r[0]; if (a < 0 || a > r[1]) return;
        const I = intensidadeRaio(a, r[1]), de = ancora(r[2], t), para = ancora(r[3], t), sem = r[4] + Math.floor(t * 5) * 7, pts = raioPts(de[0], de[1], para[0], para[1], sem);
        tracarRaio(pts, r[5], I);
        for (let g = 0; g < r[6]; g++) {
          const p0 = pts[Math.floor(hash(sem + g * 11) * (pts.length - 4)) + 2], d = ang(de, para) + sr(sem + g * 17) * 1.1, len = dist(de, para) * (.15 + hash(sem + g * 19) * .25);
          tracarRaio(raioPts(p0[0], p0[1], p0[0] + Math.cos(d) * len, p0[1] + Math.sin(d) * len, sem + g * 29, 4), r[5] * .45, I * .7);
        }
      });
      ctx.globalCompositeOperation = "source-over";
    }
    let gigante = null;
    function caminhoGigante() {
      if (!gigante) {
        const alvo = ancora("tridente", GOLPE), main = raioPts(1.2, -12.6, alvo[0], alvo[1], 777, 7);
        const ramos = Array.from({ length: 10 }, (_, g) => {
          const i0 = 6 + Math.floor(hash(800 + g) * (main.length * .75)), p = main[i0], d = ang(main[0], alvo) + sr(810 + g) * 1.2, len = 1.6 + hash(820 + g) * 3;
          return { i0, pts: raioPts(p[0], p[1], p[0] + Math.cos(d) * len, p[1] + Math.sin(d) * len, 830 + g * 7, 5) };
        });
        gigante = { main, ramos, lado: raioPts(alvo[0], alvo[1], IMPACTO[0], -.02, 787, 4) };
      }
      return gigante;
    }
    const progressoGigante = (t) => Math.pow(clamp((t - 29.6) / (GOLPE - 29.6)), 1.6);
    const indiceGigante = (t) => Math.max(2, Math.floor(progressoGigante(t) * (caminhoGigante().main.length - 1)));
    function raioGigante(t) {
      if (t < 29.6 || t > 32.8) return;
      const G = caminhoGigante(), sem = Math.floor(t * 10);
      ctx.globalCompositeOperation = "lighter";
      if (t < GOLPE) {
        const p = progressoGigante(t), k = indiceGigante(t), forca = .95 + .25 * ruido(t * 6), larg = 2.8 + p * 2;
        tracarRaio(G.main.slice(0, k + 1), larg, forca, 3 + p * 6);
        G.ramos.forEach((r) => { if (k > r.i0) tracarRaio(r.pts.slice(0, Math.max(2, Math.floor(r.pts.length * clamp((k - r.i0) / 10)))), larg * .35, forca * .8, 3); });
        const [px, py] = proj(...G.main[k]), s = escala() * (1.6 + p * 2);
        ctx.globalAlpha = .95; ctx.drawImage(SPR.luz, px - s, py - s, s * 2, s * 2); ctx.globalAlpha = 1;
        for (let a = 0; a < 4; a++) {
          const f = (t * 2.6 + a / 4) % 1, idx = Math.max(1, Math.floor(k * (1 - f * .85))), [ax, ay] = proj(...G.main[idx]), rr = escala() * (.5 + f * 3.2);
          ctx.strokeStyle = `rgba(210,222,250,${((1 - f) * .4).toFixed(3)})`; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.ellipse(ax, ay, rr, rr * .32, 0, 0, Math.PI * 2); ctx.stroke();
        }
        for (let i = 0; i < 6; i++) {
          const o = G.main[k], a = sr(sem * 3 + i) * Math.PI, len = 1 + hash(sem + i) * 2;
          tracarRaio(raioPts(o[0], o[1], o[0] + Math.cos(a) * len, o[1] + Math.sin(a) * len, sem * 7 + i, 4), .6, .75, 2);
        }
        const [ix, iy] = noChao(IMPACTO[0], 0), wf = escala() * (.8 + p * 2.4), fx = ctx.createLinearGradient(px, py, ix, iy);
        fx.addColorStop(0, `rgba(200,214,245,${(.18 * p).toFixed(3)})`); fx.addColorStop(1, "rgba(200,214,245,0)");
        ctx.fillStyle = fx; ctx.beginPath(); ctx.moveTo(px - wf * .3, py); ctx.lineTo(px + wf * .3, py); ctx.lineTo(ix + wf, iy); ctx.lineTo(ix - wf, iy); ctx.fill();
      } else {
        const a = t - GOLPE, I = 2 * Math.exp(-a * 1.3) + .45 * Math.exp(-a * .5), larg = 4.6 * (1 + 2.2 * Math.exp(-a * 4));
        const [x0, y0] = proj(1.2, -12.6), [x1, y1] = noChao(IMPACTO[0], 0), feixe = ctx.createLinearGradient(x0, y0, x1, y1), wf = escala() * 3.2 * (1 + a);
        feixe.addColorStop(0, "rgba(200,214,245,0)"); feixe.addColorStop(1, `rgba(200,214,245,${(.16 * I).toFixed(3)})`);
        ctx.fillStyle = feixe; ctx.beginPath(); ctx.moveTo(x0 - wf * .2, y0); ctx.lineTo(x0 + wf * .2, y0); ctx.lineTo(x1 + wf, y1); ctx.lineTo(x1 - wf, y1); ctx.fill();
        tracarRaio(G.main, larg, I, 2 + 7 * Math.exp(-a * 2)); tracarRaio(G.lado, larg * .65, I * .9, 4); G.ramos.forEach((r) => tracarRaio(r.pts, larg * .35, I * .6, 3));
        const domo = escala() * (1.6 + 5.5 * (1 - Math.exp(-a * 2)));
        ctx.globalAlpha = clamp(.6 * Math.exp(-a * 1.1)); ctx.drawImage(SPR.luz, x1 - domo, y1 - domo * 1.2, domo * 2, domo * 1.6); ctx.globalAlpha = 1;
        if (a < 2) for (let i = 0; i < 7; i++) { const xa = IMPACTO[0] + sr(sem * 5 + i) * 1.2; tracarRaio(raioPts(xa, -.05, xa + sr(sem * 7 + i) * 2, -.02 - hash(sem + i) * .9, sem * 13 + i, 4), .55, .6 * (1 - a / 2)); }
      }
      ctx.globalCompositeOperation = "source-over";
    }
    function poligono(x, y, s, rot, semente) {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) { const a = rot + k / 6 * Math.PI * 2, r = s * (.65 + .35 * hash(semente + k)); k ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
      ctx.closePath();
    }
    const DESENHO = {
      faisca(q) { const [x, y] = proj(q.x, q.y), [x2, y2] = proj(q.x - q.vx * .035, q.y - q.vy * .035); ctx.strokeStyle = `rgba(228,236,255,${((1 - q.u) * .9).toFixed(3)})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); },
      brasa(q, e, i) { const [x, y] = proj(q.x, q.y), s = (1.5 + hash(e.semente + i) * 2.5) * 3; ctx.globalAlpha = clamp((1 - q.u) * (.6 + .4 * ruido(q.a * 3 + i))); ctx.drawImage(SPR.brasa, x - s, y - s, s * 2, s * 2); ctx.globalAlpha = 1; },
      poeira(q, e) { const [x, y] = proj(q.x, q.y), s = escala() * e.tam * (.5 + q.u * 1.6); ctx.globalAlpha = .38 * Math.sin(Math.PI * q.u); ctx.drawImage(SPR.poeira, x - s, y - s, s * 2, s * 2); ctx.globalAlpha = 1; },
      pedra(q, e, i) {
        const [x, y] = proj(q.x, q.y), [x0, y0] = proj(q.x - q.vx * .045, q.y - q.vy * .045), s = escala() * e.tam * (.5 + hash(e.semente + i) * .9), rot = q.a * sr(e.semente + i * 2) * 8;
        ctx.fillStyle = "#30353A"; ctx.globalAlpha = .3; poligono(x0, y0, s, rot, e.semente + i); ctx.fill();
        ctx.globalAlpha = 1 - clamp((q.u - .8) / .2); poligono(x, y, s, rot, e.semente + i); ctx.fill();
        ctx.fillStyle = "rgba(150,158,164,.35)"; poligono(x - s * .2, y - s * .25, s * .45, rot, e.semente + i + 3); ctx.fill(); ctx.globalAlpha = 1;
      }
    };
    function particulas(t, tipos) {
      EMISSORES.forEach((e) => {
        if (!tipos.includes(e.tipo) || t < e.t0 || t > e.t0 + (e.dur || 0) + e.vida * 1.05) return;
        ctx.globalCompositeOperation = e.tipo === "faisca" || e.tipo === "brasa" ? "lighter" : "source-over";
        const n = Math.round(e.n * qualidade);
        for (let i = 0; i < n; i++) { const q = particula(e, i, t); if (q) DESENHO[e.tipo](q, e, i); }
      });
      ctx.globalCompositeOperation = "source-over";
    }
    let clarao = 0;
    function chuva(t, perto) {
      const n = Math.round((perto ? 110 : 190) * qualidade), p = perto ? 1.25 : .6, larg = 26 / Math.pow(cam.zoom, p), alto = 16, vento = .05 + .035 * ruido(t * .35);
      const alfa = (perto ? .22 : .12) + Math.min(perto ? .4 : .22, clarao * (perto ? .16 : .09));
      ctx.strokeStyle = `rgba(${perto ? "205,214,222" : "172,180,188"},${alfa.toFixed(3)})`; ctx.lineWidth = perto ? 1.4 : 1; ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const x = cam.x * p + (hash(i * 3.3 + (perto ? 1 : 0)) - .5) * larg + t * 1.1, y = -cam.alt * p + ((hash(i * 7.1) * alto + t * 13) % alto) - alto / 2;
        const [a, b] = proj(x, y, p), [c, d] = proj(x - vento, y - .32, p); ctx.moveTo(a, b); ctx.lineTo(c, d);
      }
      ctx.stroke();
    }
    function neblinaBaixa(t) {
      const s = escala();
      for (let i = 0; i < Math.round(10 * qualidade); i++) {
        const z = lerp(-5.5, 2.5, hash(i + 3100)), solto = sr(i + 3200) * 14 + t * (.25 + hash(i + 3300) * .2), x = cam.x + ((solto % 14) + 14) % 14 - 7;
        const [px, py] = noChao(x, z), r = s * kz(z) * (2.2 + hash(i + 3400) * 1.6);
        if (py < 0 || py - r > H) continue;
        ctx.globalAlpha = .09 + .05 * hash(i + 3500) + Math.min(.08, clarao * .03); ctx.drawImage(SPR.poeira, px - r, py - r * .35, r * 2, r * .7);
      }
      ctx.globalAlpha = 1;
    }
    function feixes(luzes) {
      ctx.globalCompositeOperation = "lighter";
      luzes.forEach((l, k) => {
        if (l.y > -5 || l.i < .5) return;
        const [x0, y0] = proj(l.x, l.y), forca = clamp((l.i - .5) / 1.5) * .13, s = escala();
        for (let j = 0; j < 3; j++) {
          const [x1, y1] = noChao(l.x + sr(k * 13 + j * 7) * 5.5, 0), w0 = s * .25, w1 = s * (1.2 + hash(k + j * 5) * 1.4), g = ctx.createLinearGradient(x0, y0, x1, y1);
          g.addColorStop(0, `rgba(200,215,250,${forca.toFixed(3)})`); g.addColorStop(1, "rgba(200,215,250,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x0 - w0, y0); ctx.lineTo(x0 + w0, y0); ctx.lineTo(x1 + w1, y1); ctx.lineTo(x1 - w1, y1); ctx.closePath(); ctx.fill();
        }
      });
      ctx.globalCompositeOperation = "source-over";
    }
    const IMPACTOS_FORTES = [[GOLPE, 1], [47, .7], [48.45, .8], [94.74, .6], [96.6, .7], [98.88, .9], [113.55, 1]];
    function zoomDeImpacto(t) {
      let f = 0;
      IMPACTOS_FORTES.forEach(([t0, forca]) => { const d = t - t0; if (d >= 0 && d < .3) f = Math.max(f, forca * (1 - d / .3)); });
      if (f <= .02) return;
      const tela = ctx.canvas, cx = W / 2, cy = H * .55;
      for (let k = 1; k <= 3; k++) { const e = 1 + .018 * k * f; ctx.globalAlpha = .16 * f; ctx.drawImage(tela, 0, 0, tela.width, tela.height, cx - cx * e, cy - cy * e, W * e, H * e); }
      ctx.globalAlpha = 1;
    }
    function choque(t) {
      const a = t - GOLPE; if (a < 0 || a > 3.5) return;
      const [x, y] = noChao(IMPACTO[0], 0), u = clamp(a / 3.5);
      ctx.globalCompositeOperation = "lighter";
      [[11, 1.5, .6], [6, 2.4, .35]].forEach(([alcance, vel, forca]) => {
        const rr = alcance * (1 - Math.exp(-a * vel));
        ctx.strokeStyle = `rgba(232,238,250,${(forca * (1 - u)).toFixed(3)})`; ctx.lineWidth = 2 + 22 * (1 - u);
        ctx.beginPath(); ctx.ellipse(x, y, rr * escala(), Math.max(1, rr * passoZ(0)), 0, 0, Math.PI * 2); ctx.stroke();
      });
      ctx.globalCompositeOperation = "source-over";
    }
    function bokeh(t) {
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < Math.round(14 * qualidade); i++) {
        const x = cam.x * 1.7 + sr(i + 900) * 9 + Math.sin(t * .3 + i) * .4, y = -cam.alt * 1.7 + sr(i + 950) * 4 - (t * .05) % 4;
        const [sx, sy] = proj(x, y, 1.7), s = escala() * (.25 + hash(i + 980) * .4) * 2;
        ctx.globalAlpha = .05 + .05 * hash(i + 990); ctx.drawImage(SPR.brasa, sx - s, sy - s, s * 2, s * 2);
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    }
    function luzesEm(t) {
      const L = [];
      RAIOS.forEach((r) => { const a = t - r[0]; if (a < 0 || a > r[1]) return; const p = ancora(r[3], t); L.push({ x: p[0], y: p[1], i: intensidadeRaio(a, r[1]) * (r[5] > 1.5 ? 1 : .5) }); });
      if (t > 10.72 && t < 12.6) { const p = ancora("tridente", t); L.push({ x: p[0], y: p[1], i: .7 }); }
      const v = janela(t, 24.8, 26.4, 30.4, 31.6); if (v > 0) L.push({ x: 1.2, y: -12.6, i: v * (.3 + .5 * clamp((t - 27) / 2.6)) });
      if (t >= 29.6 && t < GOLPE) { const p = ancora("pontaGigante", t); L.push({ x: p[0], y: p[1], i: .9 + 1.2 * progressoGigante(t) }); }
      const ai = t - GOLPE; if (ai > 0 && ai < 4) { L.push({ x: 3.3, y: -5, i: 2.2 * Math.exp(-ai * 1.6) }); L.push({ x: IMPACTO[0], y: -.5, i: 1.3 * Math.exp(-ai * 1.3) }); }
      return L;
    }
    function trilha(tab, t) {
      if (t <= tab[0][0]) return tab[0].slice(1);
      if (t >= tab[tab.length - 1][0]) return tab[tab.length - 1].slice(1);
      const i = segmentoEm(tab, t);
      return tab[i].slice(1).map((_, j) => canal(tab, i, t, (k) => k[j + 1]).v);
    }
    function tremor(t) {
      let x = 0, y = 0, r = 0, agito = 0;
      TREMORES.forEach(([t0, amp, k], i) => { const d = t - t0; if (d < 0 || d > 4) return; const e = amp * Math.exp(-k * d * 2.2); agito += e; x += ruido(d * 24 + i * 10) * e * .35; y += ruido(d * 22 + i * 20 + 5) * e * .3; r += ruido(d * 18 + i * 30 + 9) * e * .02; });
      const mao = 1 + Math.min(2, agito * 2);
      x += ruido(t * .55 + 300) * .03 * mao; y += ruido(t * .47 + 400) * .022 * mao; r += ruido(t * .38 + 500) * .004 * mao;
      return { x, y, r };
    }
    function desenhar(t) {
      const [cx, ca, cz, cr] = trilha(CAMERA, t), sk = tremor(t);
      cam.x = cx + sk.x; cam.alt = ca + sk.y; cam.zoom = cz; cam.roll = cr + sk.r;
      const luzes = luzesEm(t), lento = lentidao(t);
      clarao = luzes.reduce((soma, l) => soma + Math.min(l.i, 2), 0);
      ctx.save(); ctx.clearRect(0, 0, W, H);
      ctx.translate(W / 2, H / 2); ctx.rotate(cam.roll); ctx.scale(1.05, 1.05); ctx.translate(-W / 2, -H / 2);
      ceu(); nuvens(luzes, false); vortice(t); abismo(); piso(t, luzes); templo(t, luzes); sombras(t, luzes);
      neblinaBaixa(t);
      particulas(t, ["poeira"]);
      lutador("p", PO(t), t, luzes); lutador("z", Z(t), t, luzes);
      ondaDePedra(t);
      const breu = janela(t, 29.3, 29.9, GOLPE, 31.4) * .52;
      if (breu > 0) { ctx.fillStyle = `rgba(3,5,7,${breu.toFixed(3)})`; ctx.fillRect(-W * .1, -H * .1, W * 1.2, H * 1.2); }
      raioGigante(t); raios(t); particulas(t, ["pedra", "faisca", "brasa"]); choque(t);
      nuvens(luzes, true); feixes(luzes); chuva(t, false); chuva(t, true); bokeh(t);
      ctx.globalCompositeOperation = "lighter";
      luzes.forEach((l) => { const [x, y] = proj(l.x, l.y), s = escala() * 6; ctx.globalAlpha = clamp(l.i * .18, 0, .32); ctx.drawImage(SPR.luz, x - s, y - s, s * 2, s * 2); });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      ctx.restore();
      ctx.globalCompositeOperation = "soft-light";
      const grade = ctx.createLinearGradient(0, 0, 0, H);
      grade.addColorStop(0, "rgba(60,100,140,.3)"); grade.addColorStop(.6, "rgba(90,100,110,.06)"); grade.addColorStop(1, "rgba(150,115,85,.2)");
      ctx.fillStyle = grade; ctx.fillRect(0, 0, W, H);
      if (clarao > .4) { ctx.globalCompositeOperation = "screen"; ctx.fillStyle = `rgba(190,205,240,${Math.min(.16, (clarao - .4) * .06).toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
      ctx.globalCompositeOperation = "source-over";
      zoomDeImpacto(t);
      if (lento > 0) { ctx.globalCompositeOperation = "saturation"; ctx.globalAlpha = lento * .75; ctx.fillStyle = "#808080"; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; }
      const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.hypot(W, H) * .6);
      v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, `rgba(6,8,10,${(.55 + lento * .2).toFixed(3)})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    }
    const icone = document.createElement("link"); icone.rel = "icon"; document.head.appendChild(icone);
    const favicon = (rachado) => { icone.href = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" fill="#C9CED0" stroke="#24282B" stroke-width="2"/>${rachado ? `<path d="M9 7 L15 14 L12 18 L19 25" fill="none" stroke="#24282B" stroke-width="2"/>` : ""}</svg>`); };
    favicon(false);
    const SONS = [[8.2, ["trovao"]], [8.9, ["trovao"]], [9.6, ["trovao"]], [10.62, ["estalo", "trovao"]], [12.47, ["estalo", "trovao"]], [13.62, ["ronco", "baque"]], [ONDA.t1, ["baque", "pedra"]], [16.42, ["baque"]], [18.1, ["baque", "ronco"]], [25.3, ["trovao"]], [26.4, ["trovao"]], [27.5, ["trovao"]], [29.6, ["trovao", "ronco"]], [30.1, ["estalo"]], [GOLPE, ["baque", "vidro", "trovao", "zumbido"]]];
    let tituloGuardado = document.title;
    document.addEventListener("visibilitychange", () => {
      const r = $("#luta").getBoundingClientRect(), naLuta = r.top < innerHeight && r.bottom > 0;
      if (document.hidden && naLuta) { tituloGuardado = document.title; document.title = "eles continuam lutando"; }
      else if (!document.hidden && document.title === "eles continuam lutando") document.title = tituloGuardado;
    });

    Object.entries({
      empunhar:      { n:[6,-98], h:[14,-132], cF:[32,-70], mF:[64,-62], cT:[-20,-62], mT:[-34,-28], jF:[30,54], pF:[50,114], jT:[-22,56], pT:[-46,114], curva: .1 },
      correr:        { n:[24,-94], h:[40,-124], cF:[46,-66], mF:[76,-60], cT:[-6,-64], mT:[-26,-40], jF:[42,40], pF:[50,104], jT:[-30,50], pT:[-70,86], curva: .25 },
      estocada:      { n:[22,-90], h:[36,-120], cF:[60,-84], mF:[104,-82], cT:[-16,-70], mT:[-34,-44], jF:[50,48], pF:[78,112], jT:[-34,58], pT:[-70,112], curva: .2 },
      guarda:        { n:[-2,-98], h:[4,-132], cF:[30,-96], mF:[44,-128], cT:[8,-90], mT:[26,-108], jF:[24,54], pF:[40,114], jT:[-22,56], pT:[-44,114] },
      travar:        { n:[18,-94], h:[30,-124], cF:[44,-84], mF:[70,-96], cT:[30,-78], mT:[58,-90], jF:[44,46], pF:[66,112], jT:[-30,56], pT:[-62,112], curva: .25 },
      golpeLado:     { n:[16,-94], h:[28,-126], cF:[52,-92], mF:[90,-80], cT:[36,-88], mT:[74,-76], jF:[40,50], pF:[60,114], jT:[-26,56], pT:[-54,114], curva: .2 },
      cortar:        { n:[24,-88], h:[40,-116], cF:[50,-50], mF:[78,-20], cT:[34,-46], mT:[62,-14], jF:[48,44], pF:[72,110], jT:[-32,56], pT:[-66,112], curva: .35 },
      ferido:        { n:[-14,-92], h:[-20,-122], cF:[6,-58], mF:[24,-40], cT:[4,-74], mT:[14,-56], jF:[22,52], pF:[34,114], jT:[-26,54], pT:[-50,112], curva: .45 },
      ajoelhado:     { n:[8,-82], h:[18,-112], cF:[30,-46], mF:[46,-18], cT:[16,-60], mT:[30,-38], jF:[40,22], pF:[44,58], jT:[-6,56], pT:[-48,58], curva: .4 },
      erguendoRaiva: { n:[10,-92], h:[22,-126], cF:[36,-86], mF:[60,-110], cT:[-18,-64], mT:[-30,-30], jF:[40,40], pF:[50,104], jT:[-14,56], pT:[-44,112], curva: -.1 },
      hesitar:       { n:[2,-100], h:[10,-132], cF:[20,-62], mF:[30,-22], cT:[-20,-60], mT:[-30,-24], jF:[18,56], pF:[30,114], jT:[-16,56], pT:[-30,114], curva: .15 },
      alcancar:      { n:[16,-96], h:[28,-128], cF:[50,-104], mF:[90,-110], cT:[-14,-66], mT:[-30,-34], jF:[38,52], pF:[60,114], jT:[-24,56], pT:[-50,114], curva: .15 },
      puxar:         { n:[-20,-94], h:[-28,-126], cF:[16,-92], mF:[56,-94], cT:[-6,-88], mT:[30,-96], jF:[34,50], pF:[62,112], jT:[-34,52], pT:[-56,112], curva: -.2 },
      saindo:        { n:[30,-86], h:[50,-108], cF:[66,-90], mF:[104,-96], cT:[54,-74], mT:[92,-78], jF:[-10,40], pF:[-36,96], jT:[-30,30], pT:[-66,74], curva: .1 },
      aperto:        { n:[6,-100], h:[14,-134], cF:[36,-74], mF:[66,-82], cT:[-22,-60], mT:[-36,-26], jF:[22,56], pF:[36,114], jT:[-18,56], pT:[-34,114] }
    }).forEach(([k, P]) => { POSES[k] = P; ANGULOS[k] = paraAngulos(P); });
    const FIRME = [[46.3, 50.55]];
    Object.entries({
      investida:       { n:[26,-90], h:[44,-118], cF:[56,-74], mF:[94,-70], cT:[-8,-62], mT:[-30,-36], jF:[46,42], pF:[58,104], jT:[-34,48], pT:[-74,82], curva: .3 },
      colisao:         { n:[16,-92], h:[30,-122], cF:[52,-82], mF:[96,-80], cT:[36,-76], mT:[74,-76], jF:[42,48], pF:[66,112], jT:[-30,56], pT:[-62,112], curva: .3 },
      deslize:         { n:[-10,-84], h:[-12,-114], cF:[24,-70], mF:[60,-74], cT:[10,-64], mT:[44,-66], jF:[40,30], pF:[60,96], jT:[-36,46], pT:[-62,104], curva: .15 },
      aparaAlto:       { n:[-4,-98], h:[0,-130], cF:[30,-108], mF:[42,-140], cT:[6,-90], mT:[22,-112], jF:[26,54], pF:[42,114], jT:[-24,56], pT:[-46,114], curva: -.1 },
      aparaBaixo:      { n:[4,-94], h:[12,-126], cF:[34,-70], mF:[52,-40], cT:[-10,-64], mT:[6,-40], jF:[30,52], pF:[48,114], jT:[-24,56], pT:[-48,114], curva: .2 },
      saltoPreparo:    { n:[16,-78], h:[28,-108], cF:[40,-50], mF:[62,-40], cT:[-10,-50], mT:[-30,-24], jF:[44,22], pF:[40,70], jT:[-8,30], pT:[-34,70], curva: .45 },
      encolhido:       { n:[18,-76], h:[34,-94], cF:[40,-40], mF:[56,-14], cT:[30,-36], mT:[46,-10], jF:[40,-24], pF:[30,20], jT:[34,-14], pT:[22,26], curva: .6 },
      ergueParaGolpe:  { n:[-6,-98], h:[-2,-130], cF:[-6,-150], mF:[-30,-176], cT:[4,-148], mT:[-14,-176], jF:[30,40], pF:[40,94], jT:[-18,46], pT:[-30,100], curva: -.45 },
      golpeAlto:       { n:[26,-86], h:[44,-112], cF:[60,-74], mF:[92,-36], cT:[46,-70], mT:[80,-34], jF:[40,46], pF:[60,108], jT:[-28,52], pT:[-56,108], curva: .45 },
      bloqueioAlto:    { n:[0,-90], h:[8,-120], cF:[20,-150], mF:[56,-150], cT:[-10,-146], mT:[16,-150], jF:[34,40], pF:[44,104], jT:[-28,44], pT:[-46,106], curva: .1 },
      agachadoImpacto: { n:[2,-80], h:[10,-110], cF:[22,-136], mF:[58,-134], cT:[-8,-132], mT:[18,-136], jF:[42,24], pF:[46,80], jT:[-30,30], pT:[-50,82], curva: .15 },
      empurraoCima:    { n:[-2,-104], h:[4,-138], cF:[24,-170], mF:[56,-180], cT:[-8,-166], mT:[18,-180], jF:[24,58], pF:[38,116], jT:[-20,58], pT:[-38,116], curva: -.25 },
      recuoSalto:      { n:[-8,-98], h:[-10,-130], cF:[24,-80], mF:[52,-84], cT:[-28,-70], mT:[-46,-50], jF:[24,40], pF:[28,92], jT:[-20,44], pT:[-40,96], curva: -.1 },
      golpeBaixo:      { n:[28,-74], h:[48,-96], cF:[56,-36], mF:[90,-14], cT:[42,-30], mT:[76,-10], jF:[50,30], pF:[70,82], jT:[-36,48], pT:[-74,84], curva: .5 },
      golpeLadoZ:      { n:[14,-96], h:[24,-128], cF:[54,-96], mF:[94,-92], cT:[-24,-70], mT:[-44,-50], jF:[38,52], pF:[58,114], jT:[-26,56], pT:[-54,114], curva: .15 },
      revesZ:          { n:[10,-96], h:[22,-128], cF:[20,-104], mF:[-14,-118], cT:[-26,-68], mT:[-42,-44], jF:[32,52], pF:[52,114], jT:[-22,56], pT:[-46,114], curva: .05 },
      torcer:          { n:[10,-96], h:[22,-128], cF:[40,-104], mF:[62,-128], cT:[30,-86], mT:[56,-110], jF:[36,52], pF:[54,114], jT:[-28,56], pT:[-56,114], curva: .1 },
      desequilibrio:   { n:[-24,-90], h:[-36,-118], cF:[0,-118], mF:[-6,-150], cT:[-40,-70], mT:[-60,-60], jF:[26,48], pF:[46,112], jT:[-22,52], pT:[-44,112], curva: -.4 }
    }).forEach(([k, P]) => { POSES[k] = P; ANGULOS[k] = paraAngulos(P); });
    ZEUS.push(
      [41.8, "levantando", -4.9, 0, 0], [43.4, "encarando", -4.8, 0, 0], [44.4, "chamar", -4.8, 0, 0], [45.8, "empunhar", -4.7, 0, 0], [46.4, "empunhar", -4.6, 0, 0],
      [46.75, "investida", -3.5, 0, 0], [47, "colisao", -2.4, 0, 0], [47.06, "colisao", -2.42, 0, 0], [47.4, "deslize", -3.2, 0, 0],
      [47.52, "empunhar", -2, 0, 0], [47.62, "aparaAlto", -1.95, 0, 0], [47.7, "empunhar", -2, 0, 0], [47.8, "aparaBaixo", -2.05, 0, 0],
      [47.95, "saltoPreparo", -2.1, 0, 0], [48.08, "encolhido", -1.9, .9, 1.4], [48.22, "encolhido", -1.6, 1.5, 3.6], [48.36, "ergueParaGolpe", -1.2, 1.4, 5.9],
      [48.45, "golpeAlto", -.95, 1.3, 6.283], [48.58, "golpeAlto", -.95, .75, 6.283],
      [48.8, "encolhido", -1.8, 1.5, 3.3], [48.98, "recuoSalto", -2.45, .25, .2], [49.05, "deslize", -2.5, 0, 0],
      [49.14, "golpeLadoZ", -2, 0, 0], [49.22, "revesZ", -1.95, 0, 0], [49.3, "golpeLadoZ", -1.85, 0, 0],
      [49.42, "travar", -1.55, 0, 0], [49.6, "travar", -1.47, 0, 0], [49.75, "travar", -1.6, 0, 0], [49.9, "travar", -1.45, 0, 0], [50.05, "travar", -1.56, 0, 0], [50.2, "travar", -1.5, 0, 0],
      [50.3, "desequilibrio", -1.75, 0, 0], [50.5, "desequilibrio", -1.62, 0, 0],
      [50.62, "ferido", -1.3, 0, -.08], [51.5, "ferido", -1.45, 0, -.1], [58.2, "ferido", -1.45, 0, -.1], [58.9, "ajoelhado", -1.55, 0, 0], [60.8, "ajoelhado", -1.55, 0, 0],
      [62.2, "erguendoRaiva", -1.55, 0, 0], [63.4, "empunhar", -1.6, 0, 0], [66, "empunhar", -1.6, 0, 0]
    );
    POSEIDON.push(
      [41.8, "levantando", 6.8, 0, 6.283], [43.4, "encarando", 6.6, 0, 6.283], [45.8, "encarando", 6.5, 0, 6.283], [46.4, "empunhar", 6.3, 0, 6.283],
      [46.75, "investida", 3.9, 0, 6.283], [47, "colisao", 2.6, 0, 6.283], [47.06, "colisao", 2.62, 0, 6.283], [47.4, "deslize", 3.4, 0, 6.283],
      [47.52, "empunhar", 1.9, 0, 6.283], [47.62, "estocada", 1.45, 0, 6.283], [47.7, "empunhar", 1.6, 0, 6.283], [47.8, "estocada", 1.5, 0, 6.283],
      [47.9, "empunhar", 1.6, 0, 6.283], [48.1, "golpeBaixo", 1.25, 0, 6.283], [48.3, "bloqueioAlto", 1, 0, 6.283], [48.45, "bloqueioAlto", .95, 0, 6.283],
      [48.52, "agachadoImpacto", .95, 0, 6.283], [48.6, "agachadoImpacto", .95, 0, 6.283], [48.7, "empurraoCima", .95, 0, 6.283], [48.95, "empunhar", 1.3, 0, 6.283],
      [49.14, "aparaAlto", 1.5, 0, 6.283], [49.22, "golpeLado", 1.4, 0, 6.283], [49.3, "aparaBaixo", 1.45, 0, 6.283],
      [49.42, "travar", 1.2, 0, 6.283], [49.6, "travar", 1.27, 0, 6.283], [49.75, "travar", 1.14, 0, 6.283], [49.9, "travar", 1.29, 0, 6.283], [50.05, "travar", 1.18, 0, 6.283], [50.2, "travar", 1.24, 0, 6.283],
      [50.3, "torcer", 1.1, 0, 6.283], [50.45, "golpeLado", 1, 0, 6.283],
      [50.62, "cortar", .8, 0, 6.283], [51.5, "cortar", .85, 0, 6.283], [58.2, "cortar", .85, 0, 6.283], [58.9, "hesitar", 1.05, 0, 6.283], [60.8, "hesitar", 1.1, 0, 6.283],
      [62.4, "encarando", 1.35, 0, 6.283], [66, "encarando", 1.35, 0, 6.283]
    );
    CAMERA.push(
      [42, .9, 1.5, .92, 0], [44.2, 0, 1.6, .96, 0], [45.6, -3.6, 1.7, 1.25, .01], [46.4, -2.4, 1.4, 1.05, 0],
      [46.8, 0, 1.05, 1.1, 0], [47, .05, 1.2, 1.5, .035], [47.12, .05, 1.25, 1.32, -.01], [47.45, 0, 1.3, 1.05, 0],
      [47.62, -.6, 1.3, 1.38, .025], [47.8, -.7, 1.25, 1.45, -.025], [48, -.3, 1.2, 1.2, 0], [48.25, -.3, 2.3, 1, .03],
      [48.45, .1, 2, 1.55, -.04], [48.62, .1, 1.8, 1.42, 0], [48.95, -1, 1.7, 1.05, .02], [49.14, -.3, 1.3, 1.36, -.025],
      [49.22, -.2, 1.3, 1.46, .025], [49.3, -.2, 1.3, 1.52, -.025], [49.6, -.2, 1.25, 1.8, .015], [50.2, -.2, 1.3, 1.9, -.01],
      [50.62, -.5, 1.45, 1.75, -.02], [51.7, -.75, 1.95, 2.3, 0], [52.15, -.75, 2, 3, 0], [57.8, -1, 1.5, 1.55, 0], [58.9, -1.2, 1.05, 1.4, 0],
      [60.8, -1.3, 1.25, 1.3, .01], [62.4, -1.6, 1.45, 1.55, 0], [63.8, -1, 1.5, 1.2, 0], [66, -.6, 1.5, 1.05, 0]
    );
    TRECHOS.push(
      [44.4, 1.4], [46.4, 1], [46.75, .35], [47, .3], [47.06, .55], [47.4, .45], [47.62, .3], [47.64, .2], [47.8, .25], [47.82, .2],
      [48.08, .35], [48.3, .4], [48.45, .3], [48.5, .6], [48.62, .3], [49.05, .5], [49.14, .2], [49.22, .15], [49.3, .15], [49.32, .15],
      [50.2, .9], [50.35, .25], [50.62, .35], [52.15, 2.2], [53.6, .9], [55.1, 1.2], [55.9, .8], [57.8, 1.6], [58.9, .9], [60.8, 1], [62.4, 1], [66, 1.2]
    );
    LENTO.push([50.62, 52.15]);
    TREMORES.push([47, .55, 1.6], [47.62, .15, 2.6], [47.8, .15, 2.6], [48.45, .75, 1.4], [48.66, .3, 2], [49.14, .12, 3], [49.22, .12, 3], [49.3, .16, 3], [49.5, .1, 1.2], [50.25, .2, 2.2], [50.62, .35, 1.8], [58.9, .12, 2.2], [62, .15, 1.6]);
    IMPULSOS["1"].push([47, 1], [47.62, .35], [47.8, .35], [48.45, .6], [48.66, .8], [49.14, .3], [49.22, .3], [49.3, .3], [50.3, .7], [50.62, .9]);
    IMPULSOS["-1"].push([47, 1], [47.62, .3], [47.8, .3], [48.45, 1.1], [49.14, .3], [49.22, .3], [49.3, .3]);
    RAIOS.push(
      [44.5, .7, [-4.4, -15], "maoZeus", 141, 1.2, 3],
      [47, .35, "lanca", "tridente", 181, .7, 2], [47.62, .18, "lanca", "tridente", 183, .4, 1], [47.8, .18, "tridente", "lanca", 185, .4, 1],
      [48.45, .45, "maoZeus", "tridente", 187, .9, 3], [49.14, .14, "lanca", "tridente", 189, .35, 1], [49.22, .14, "tridente", "lanca", 191, .35, 1],
      [49.3, .16, "lanca", "tridente", 193, .4, 1], [49.42, .8, "lanca", "tridente", 195, .45, 2], [50.25, .2, "tridente", "lanca", 197, .5, 1],
      [61.8, .6, [-1.2, -15], "maoZeus", 171, 1, 2]
    );
    EMISSORES.push(
      { tipo: "faisca", t0: 44.6, dur: .6, n: 60, x: "maoZeus", v: 3, g: 6, k: 1.4, vida: .6, semente: 431 },
      { tipo: "poeira", t0: 46.45, dur: .5, n: 12, x: "pesZeus", v: .8, ang: Math.PI + .35, abre: .5, g: -.15, k: 1, vida: 1.6, tam: .45, semente: 501 },
      { tipo: "poeira", t0: 46.45, dur: .5, n: 12, x: "pesPoseidon", v: .8, ang: -.35, abre: .5, g: -.15, k: 1, vida: 1.6, tam: .45, semente: 503 },
      { tipo: "poeira", t0: 47.06, dur: .34, n: 18, x: "pesZeus", v: 1, abre: 1.2, g: -.12, k: .9, vida: 2, tam: .7, semente: 505 },
      { tipo: "poeira", t0: 47.06, dur: .34, n: 18, x: "pesPoseidon", v: 1, abre: 1.2, g: -.12, k: .9, vida: 2, tam: .7, semente: 507 },
      { tipo: "poeira", t0: 48.02, n: 14, x: "pesZeus", v: 1.4, abre: 1.4, g: -.1, k: 1, vida: 1.8, tam: .6, semente: 509 },
      { tipo: "poeira", t0: 49.02, n: 14, x: "pesZeus", v: 1.2, abre: 1.4, g: -.1, k: 1, vida: 1.8, tam: .6, semente: 511 },
      { tipo: "faisca", t0: 47, n: 170, x: "choque", v: 10, g: 9, k: 1.3, vida: .9, semente: 521 },
      { tipo: "brasa", t0: 47, n: 60, x: "choque", v: 5, abre: 1.6, g: 3, k: .9, vida: 1.8, semente: 523 },
      { tipo: "faisca", t0: 47.62, n: 50, x: "choque", v: 6, g: 9, k: 1.3, vida: .6, semente: 525 },
      { tipo: "faisca", t0: 47.8, n: 50, x: "choque", v: 6, g: 9, k: 1.3, vida: .6, semente: 527 },
      { tipo: "faisca", t0: 48.45, n: 210, x: "maoZeus", v: 11, g: 9, k: 1.2, vida: 1, semente: 531 },
      { tipo: "brasa", t0: 48.45, n: 80, x: "maoZeus", v: 6, abre: 1.6, g: 3, k: .9, vida: 2, semente: 533 },
      { tipo: "poeira", t0: 48.47, n: 40, x: "pesPoseidon", v: 3.2, abre: 1.5, g: -.08, k: 1.2, vida: 3.5, tam: 1.1, semente: 535 },
      { tipo: "pedra", t0: 48.47, n: 36, x: "pesPoseidon", v: 5, abre: 1.3, g: 9.8, k: .3, vida: 1.8, tam: .14, semente: 537 },
      { tipo: "faisca", t0: 49.14, n: 45, x: "choque", v: 6, g: 9, k: 1.3, vida: .6, semente: 541 },
      { tipo: "faisca", t0: 49.22, n: 45, x: "choque", v: 6, g: 9, k: 1.3, vida: .6, semente: 543 },
      { tipo: "faisca", t0: 49.3, n: 50, x: "choque", v: 6, g: 9, k: 1.3, vida: .6, semente: 545 },
      { tipo: "faisca", t0: 49.42, dur: .78, n: 150, x: "choque", v: 4, g: 9, k: 1.2, vida: .6, semente: 547 },
      { tipo: "faisca", t0: 50.25, n: 60, x: "choque", v: 7, g: 9, k: 1.3, vida: .6, semente: 549 },
      { tipo: "icor", t0: 50.62, n: 70, x: "feridaZeus", v: 3.2, ang: -Math.PI / 2 - .9, abre: .8, g: 9.8, k: .7, vida: 1.6, semente: 461 },
      { tipo: "icor", t0: 50.9, dur: 10, n: 26, x: "feridaZeus", v: .2, ang: Math.PI / 2, abre: .4, g: 9.8, k: .5, vida: .9, semente: 467 },
      { tipo: "icor", t0: 58.9, n: 26, x: "respingo", v: 1.8, abre: 1, g: 9.8, k: .8, vida: .8, semente: 473 },
      { tipo: "faisca", t0: 61.9, dur: .5, n: 50, x: "maoZeus", v: 3, g: 6, k: 1.4, vida: .6, semente: 479 }
    );
    SONS.push([44.5, ["trovao", "estalo"]], [47, ["baque"]], [48.45, ["baque", "estalo"]], [49.5, ["ronco"]], [61.8, ["trovao"]]);

    const lanca = (t) => clamp((t - 44.6) / 1.1);
    const furia = (t) => janela(t, 61.6, 62.4, 63.4, 64.8);
    const FRENTE_RAIO = 104, TRAS_RAIO = 52, EIXO_RAIO = -.12;
    const tamanhoRaio = (t) => .35 + .65 * suave(lanca(t));
    function fuso(L, w, s) {
      const p = new Path2D(), x = (u) => s * L * u;
      p.moveTo(0, -w * .45);
      p.lineTo(x(.16), -w); p.lineTo(x(.3), -w * .6); p.lineTo(x(.45), -w * .85); p.lineTo(x(.6), -w * .45); p.lineTo(x(.72), -w * .55);
      p.quadraticCurveTo(x(.86), -w * 1.5, x(1), -w * 2.3); p.quadraticCurveTo(x(.88), -w * .8, x(.84), -w * .3);
      p.lineTo(x(1.14), 0);
      p.lineTo(x(.84), w * .3); p.quadraticCurveTo(x(.88), w * .8, x(1), w * 2.3); p.quadraticCurveTo(x(.86), w * 1.5, x(.72), w * .55);
      p.lineTo(x(.6), w * .45); p.lineTo(x(.45), w * .85); p.lineTo(x(.3), w * .6); p.lineTo(x(.16), w); p.lineTo(0, w * .45);
      p.closePath();
      return p;
    }
    const RAIO_PARTES = [fuso(FRENTE_RAIO / 1.14, 7, 1), fuso(TRAS_RAIO / 1.14, 6, -1), (() => { const p = new Path2D(); p.rect(-9, -3.6, 18, 7.2); return p; })()];
    const KERAUNOS = new Path2D(); RAIO_PARTES.forEach((p) => KERAUNOS.addPath(p));
    function keraunos(P, t, plano) {
      const f = lanca(t); if (f <= 0) return;
      const k = tamanhoRaio(t), brilho = f * (.88 + .12 * ruido(t * 9)) * (1 + .6 * furia(t));
      ctx.save(); ctx.translate(P.mF[0], P.mF[1]); ctx.rotate(ang(P.cF, P.mF) + EIXO_RAIO); ctx.scale(k, k);
      if (plano) { ctx.fillStyle = plano; RAIO_PARTES.forEach((p) => ctx.fill(p)); ctx.restore(); return; }
      ctx.lineJoin = "round"; ctx.globalCompositeOperation = "lighter";
      [[22, .06], [10, .15], [4.5, .32]].forEach(([w, al]) => { ctx.strokeStyle = `rgba(190,210,255,${Math.min(1, al * brilho).toFixed(3)})`; ctx.lineWidth = w; ctx.stroke(KERAUNOS); });
      ctx.globalCompositeOperation = "source-over";
      const g = ctx.createLinearGradient(0, -10, 0, 10);
      g.addColorStop(0, "#B9CCF6"); g.addColorStop(.5, "#FFFFFF"); g.addColorStop(1, "#A9BEEE");
      ctx.globalAlpha = .55 + .45 * f; ctx.fillStyle = g; RAIO_PARTES.forEach((p) => ctx.fill(p)); ctx.globalAlpha = 1;
      const sem = Math.floor(t * 14);
      ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = `rgba(225,235,255,${Math.min(1, .8 * brilho).toFixed(3)})`; ctx.lineWidth = 1.2; ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        let x = lerp(-TRAS_RAIO * .7, FRENTE_RAIO * .9, hash(sem * 7 + i)), y = sr(sem * 5 + i) * 4; ctx.moveTo(x, y);
        for (let j = 0; j < 4; j++) { x += sr(sem * 11 + i * 4 + j) * 9; y += (sr(sem * 13 + i * 4 + j) > 0 ? 1 : -1) * (4 + hash(sem + i + j) * 7); ctx.lineTo(x, y); }
      }
      ctx.stroke(); ctx.globalCompositeOperation = "source-over";
      ctx.restore();
    }
    const giroTridente = (t) => (Math.PI * 2 * suave(clamp((t - 47.88) / .22)) - 1.1 * janela(t, 50.2, 50.3, 50.34, 50.46)) % (Math.PI * 2);
    let semArmas = false, tempoFigura = 0;
    const tridenteBase = tridente, figuraBase = figura, cabecaBase = cabeca, ancoraBase = ancora, luzesBase = luzesEm, desenharBase = desenhar, quadroBase = quadro;
    tridente = (P, plano) => {
      if (semArmas) return;
      const g = giroTridente(tempoFigura);
      if (Math.abs(g) < .001) { tridenteBase(P, plano); return; }
      ctx.save(); ctx.translate(P.mF[0], P.mF[1]); ctx.rotate(g); ctx.translate(-P.mF[0], -P.mF[1]); tridenteBase(P, plano); ctx.restore();
    };
    figura = (quem, S, t, luz, plano) => { tempoFigura = t; figuraBase(quem, S, t, luz, plano); };
    cabeca = (z, P, t, luz, plano) => { cabecaBase(z, P, t, luz, plano); if (z && !semArmas) keraunos(P, t, plano); };
    ancora = (nome, t) => {
      if (nome === "lanca") { const S = Z(t), P = S.P, a = ang(P.cF, P.mF) + EIXO_RAIO, l = FRENTE_RAIO * tamanhoRaio(t); return mundo(S, [P.mF[0] + Math.cos(a) * l, P.mF[1] + Math.sin(a) * l]); }
      if (nome === "tridente") { const g = giroTridente(t); if (Math.abs(g) > .001) { const S = PO(t), P = S.P, a = ang(P.cF, P.mF) + g; return mundo(S, [P.mF[0] + Math.cos(a) * 132, P.mF[1] + Math.sin(a) * 132]); } }
      if (nome === "maoPoseidon") { const S = PO(t); return mundo(S, S.P.mF); }
      if (nome === "pesZeus" || nome === "pesPoseidon") { const S = nome === "pesZeus" ? Z(t) : PO(t), P = S.P; return mundo(S, [(P.pF[0] + P.pT[0]) / 2, Math.max(P.pF[1], P.pT[1])]); }
      if (nome === "feridaZeus") { const S = Z(t), P = S.P; return mundo(S, [(P.cF[0] + P.mF[0]) / 2, (P.cF[1] + P.mF[1]) / 2]); }
      if (nome === "choque") { const a = ancora("lanca", t), b = ancora("tridente", t); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
      if (nome === "respingo") { const p = pousoDaGota(); return [p[0], p[1] - .02]; }
      return ancoraBase(nome, t);
    };
    luzesEm = (t) => {
      const L = luzesBase(t), f = lanca(t);
      if (f > 0) { const S = Z(t), m = mundo(S, S.P.mF); L.push({ x: m[0], y: m[1] - .3, i: .5 * f * (1 + .7 * furia(t)) }); }
      return L;
    };
    const GOLPES_DUELO = [[47, 1.3, "choque"], [47.62, .55, "choque"], [47.8, .55, "choque"], [48.45, 1.4, "maoZeus"], [49.14, .5, "choque"], [49.22, .5, "choque"], [49.3, .55, "choque"], [50.25, .6, "choque"]];
    function borrao(mao, ponta, t, cor) {
      const N = 7, A = [], B = [];
      for (let i = 0; i < N; i++) { const tt = t - (N - 1 - i) * .016; A.push(proj(...ancora(mao, tt))); B.push(proj(...ancora(ponta, tt))); }
      let vel = 0; for (let i = 1; i < N; i++) vel += Math.hypot(B[i][0] - B[i - 1][0], B[i][1] - B[i - 1][1]);
      const forca = clamp((vel - escala() * .35) / (escala() * 1.8)); if (forca <= 0) return;
      ctx.globalCompositeOperation = "lighter";
      for (let i = 1; i < N; i++) {
        ctx.fillStyle = `rgba(${cor},${(forca * (i / (N - 1)) * .18).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(...A[i - 1]); ctx.lineTo(...B[i - 1]); ctx.lineTo(...B[i]); ctx.lineTo(...A[i]); ctx.closePath(); ctx.fill();
      }
      ctx.lineCap = ctx.lineJoin = "round"; ctx.strokeStyle = `rgba(${cor},${(forca * .75).toFixed(3)})`; ctx.lineWidth = 2.5;
      ctx.beginPath(); B.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    }
    function efeitosDuelo(t) {
      if (t < 46.3 || t > 50.95) return;
      borrao("maoPoseidon", "tridente", t, "190,228,220");
      borrao("maoZeus", "lanca", t, "205,220,255");
      const s = escala();
      ctx.globalCompositeOperation = "lighter";
      GOLPES_DUELO.forEach(([t0, f, nome]) => {
        const a = t - t0; if (a < 0 || a > .4) return;
        const [wx, wy] = ancora(nome, t0), [x, y] = proj(wx, wy), u = a / .4, fade = (1 - u) * (1 - u), r = s * (.35 + f * .9) * (1 + u * 2.5);
        ctx.globalAlpha = fade * .9; ctx.drawImage(SPR.luz, x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1;
        ctx.strokeStyle = `rgba(240,246,255,${(fade * .9).toFixed(3)})`; ctx.lineWidth = 1.4 + f * 1.4; ctx.lineCap = "round"; ctx.beginPath();
        const n = Math.round(10 + f * 6);
        for (let i = 0; i < n; i++) {
          const an = (i / n) * Math.PI * 2 + sr(Math.round(t0 * 100) + i) * .3, r1 = s * (.12 + u * .5) * f, r2 = r1 + s * (.4 + hash(Math.round(t0 * 50) + i) * .9) * f * (1 - u * .6);
          ctx.moveTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1); ctx.lineTo(x + Math.cos(an) * r2, y + Math.sin(an) * r2);
        }
        ctx.stroke();
        ctx.strokeStyle = `rgba(214,226,255,${(fade * .6).toFixed(3)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, s * (.2 + u * 2.2 * f), 0, Math.PI * 2); ctx.stroke();
      });
      const am = t - 48.47;
      if (am > 0 && am < 1.1) {
        const p = ancora("pesPoseidon", 48.47), [x, y] = noChao(p[0], 0), u = am / 1.1, rr = .3 + u * 3.2;
        ctx.strokeStyle = `rgba(226,234,246,${((1 - u) * .55).toFixed(3)})`; ctx.lineWidth = 2 + 10 * (1 - u); ctx.beginPath(); ctx.ellipse(x, y, rr * s, Math.max(1, rr * passoZ(0)), 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      const clarao = Math.max(0, ...GOLPES_DUELO.filter(([, f]) => f > 1).map(([t0]) => { const a = t - t0; return a >= 0 && a < .2 ? 1 - a / .2 : 0; }));
      if (clarao > 0) { ctx.fillStyle = `rgba(230,238,255,${(clarao * .16).toFixed(3)})`; ctx.fillRect(-W * .1, -H * .1, W * 1.2, H * 1.2); }
    }
    DESENHO.icor = (q, e, i) => {
      if (q.y > .02) return;
      const [x, y] = proj(q.x, q.y), [x2, y2] = proj(q.x - q.vx * .03, q.y - q.vy * .03), s = 1.6 + hash(e.semente + i) * 2.2;
      ctx.globalAlpha = clamp(1 - q.u * .7);
      ctx.strokeStyle = "rgba(228,236,248,.92)"; ctx.lineWidth = s; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.globalCompositeOperation = "lighter"; ctx.drawImage(SPR.brasa, x - s * 3, y - s * 3, s * 6, s * 6); ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };
    const SPR_OURO = sprite(32, [[0, "rgba(255,240,200,1)"], [.3, "rgba(201,161,74,.75)"], [1, "rgba(201,161,74,0)"]]);

    const MEMORIA = { entra: 51.7, cheia: 52.15, sai: 57.8, fora: 58.35, cai: 58.9 };
    let origemGota = null;
    const origemDaGota = () => origemGota || (origemGota = ancora("feridaZeus", 50.62));
    const altoDaGota = () => { const o = origemDaGota(); return [o[0] + .35, o[1] - .7]; };
    const pousoDaGota = () => { const a = altoDaGota(); return [a[0] + .1, 0]; };
    function gota(t) {
      if (t < 50.62 || t > MEMORIA.cai) return null;
      const o = origemDaGota(), a = altoDaGota(), z = pousoDaGota();
      let p, cheio = 0;
      if (t < MEMORIA.entra) { const u = suave((t - 50.62) / (MEMORIA.entra - 50.62)); p = [lerp(o[0], a[0], u), lerp(o[1], a[1], u)]; }
      else if (t < MEMORIA.fora) p = a;
      else { const u = (t - MEMORIA.fora) / (MEMORIA.cai - MEMORIA.fora); p = [lerp(a[0], z[0], u), lerp(a[1], z[1] - .05, u * u)]; }
      if (t >= MEMORIA.entra && t < MEMORIA.fora) cheio = t < MEMORIA.cheia ? Math.pow(clamp((t - MEMORIA.entra) / (MEMORIA.cheia - MEMORIA.entra)), 2.2) : 1 - suave(clamp((t - MEMORIA.sai) / (MEMORIA.fora - MEMORIA.sai)));
      const [x, y] = proj(p[0], p[1]), r0 = escala() * .085;
      return { x, y, r: lerp(r0, Math.hypot(W, H) * 1.08, cheio), cheio };
    }
    function esferaDeIcor(x, y, r, alfa = 1) {
      if (alfa <= 0) return;
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = alfa * .45; ctx.drawImage(SPR.luz, x - r * 4, y - r * 4, r * 8, r * 8);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = alfa;
      const g = ctx.createRadialGradient(x - r * .35, y - r * .35, r * .08, x, y, r);
      g.addColorStop(0, "rgba(250,252,255,.96)"); g.addColorStop(.45, "rgba(194,206,222,.78)"); g.addColorStop(.86, "rgba(116,128,146,.62)"); g.addColorStop(1, "rgba(236,242,255,.92)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.9)"; ctx.beginPath(); ctx.ellipse(x - r * .38, y - r * .42, r * .22, r * .13, -.6, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    const ARGILA = "#A66B4F", ARGILA_FUNDA = "#7A4A36", VERNIZ = "#1C1816", LUZ_NULA = { dx: 0, dy: -1, i: 0 };
    const ZM = [[51.7, "encarando", 0, 0, 0], [53.2, "alcancar", 0, 0, 0], [55.1, "alcancar", 0, 0, 0], [55.9, "puxar", 0, 0, 0], [56.9, "aperto", 0, 0, 0], [60, "aperto", 0, 0, 0]];
    const PM = [[51.7, "alcancar", 0, 0, 0], [55.1, "alcancar", 0, 0, 0], [55.9, "saindo", 0, 0, 0], [56.5, "levantando", 0, 0, 0], [56.9, "aperto", 0, 0, 0], [60, "aperto", 0, 0, 0]];
    const CRONOS = new Path2D("M1.5,-1.8 Q0.6,-2.5 -0.4,-2.1 Q-1.05,-1.8 -1.15,-1.05 L-1.3,-0.75 L-1.62,-0.15 L-1.3,-0.05 L-1.32,0.12 L-0.95,0.2 L-0.85,0.45 L-1.28,0.75 Q-1.15,1.1 -1,1.15 L-1.25,1.9 L-0.9,2.5 Q-0.3,2.2 0.1,1.5 L0.35,1.25 L0.5,3.6 L1.75,3.6 Q1.95,0.5 1.5,-1.8 Z");
    const BOCA = new Path2D("M-1.32,0.12 L-0.95,0.2 L-0.85,0.45 L-1.28,0.75 Z");
    const INCISOES = new Path2D("M-1.25,-0.82 L-0.72,-0.88 M-0.25,1.25 L-0.8,2.25 M0,1.1 L-0.5,2.05 M-0.55,1.25 L-1,2.05 M0.9,-1.6 Q0.6,-1.2 0.9,-0.8 Q1.2,-0.4 0.9,0 Q0.6,0.4 0.95,0.8 M1.35,-1.2 Q1.1,-0.7 1.35,-0.2 Q1.55,0.3 1.3,0.8 M-0.6,-1.95 Q-0.2,-1.6 0.3,-1.9 M-0.05,0.3 Q0.3,0.7 0.15,1.05 M0.55,2.7 Q1.1,2.55 1.7,2.7");
    const CONTORNO = [[1.4, 0], [-1.4, 0], [0, 1.4], [0, -1.4], [1, 1], [-1, 1], [1, -1], [-1, -1]];
    function meandro(y, h) {
      ctx.fillStyle = ARGILA; ctx.fillRect(0, y, W, h);
      const k = h / 6, passo = k * 7, b = y + h - k * .6, tp = y + k * .6;
      ctx.strokeStyle = VERNIZ; ctx.lineWidth = Math.max(1.4, k * .85); ctx.lineJoin = "miter"; ctx.lineCap = "butt"; ctx.beginPath();
      ctx.moveTo(0, b); ctx.lineTo(W, b); ctx.moveTo(0, tp - k * .2); ctx.lineTo(W, tp - k * .2);
      for (let x = -passo; x < W + passo; x += passo) {
        ctx.moveTo(x + k, b); ctx.lineTo(x + k, tp + k * .6); ctx.lineTo(x + k * 6, tp + k * .6); ctx.lineTo(x + k * 6, b - k * 1.3);
        ctx.lineTo(x + k * 3, b - k * 1.3); ctx.lineTo(x + k * 3, tp + k * 2); ctx.lineTo(x + k * 4.5, tp + k * 2);
      }
      ctx.stroke();
    }
    function cabecaDeCronos([x, y], c) {
      ctx.save(); ctx.translate(x, y); ctx.scale(c, c);
      ctx.fillStyle = VERNIZ; ctx.fill(CRONOS);
      ctx.fillStyle = "#0A0807"; ctx.fill(BOCA);
      ctx.strokeStyle = ARGILA; ctx.lineWidth = 1.4 / c; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.stroke(BOCA); ctx.stroke(INCISOES);
      ctx.beginPath(); ctx.arc(-0.95, -0.58, 0.12, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    function gravado(quem, S, [hx, hy], esc, t) {
      const pinta = (plano, dx = 0, dy = 0) => { ctx.save(); ctx.translate(hx + dx, hy + dy); ctx.rotate(S.r); ctx.scale(S.dir * esc, esc); ctx.lineJoin = "round"; figura(quem, S, t, LUZ_NULA, plano); ctx.restore(); };
      CONTORNO.forEach(([dx, dy]) => pinta(ARGILA, dx, dy));
      pinta(VERNIZ);
    }
    function cenaMemoria(t) {
      semArmas = true;
      const u = Math.min(H * .083, W * .14), esc = u * K, yc = H * .8, c = u * .9;
      ctx.fillStyle = VERNIZ; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W / 2, H * .58, H * .05, W / 2, H * .58, Math.max(W, H) * .75);
      g.addColorStop(0, ARGILA); g.addColorStop(1, ARGILA_FUNDA);
      ctx.fillStyle = g; ctx.fillRect(0, H * .32, W, H * .52);
      meandro(H * .255, H * .045); meandro(H * .86, H * .045);
      const PA = cinematica(ANGULOS.alcancar), boca = [W / 2 + .42 * u, yc - Math.max(PA.pF[1], PA.pT[1]) * esc + PA.mF[1] * esc];
      const xBase = boca[0] - PA.mF[0] * esc, centro = [boca[0] + 1.12 * c, boca[1] - .43 * c];
      cabecaDeCronos(centro, c);
      const SZ = estadoEm(ZM, t, 1), xz = xBase - 1.2 * u * suave(clamp((t - 55.1) / .8)) - .8 * u * suave(clamp((t - 55.9) / 1));
      const hz = [xz, yc - Math.max(SZ.P.pF[1], SZ.P.pT[1]) * esc], mao = [hz[0] + SZ.P.mF[0] * esc, hz[1] + SZ.P.mF[1] * esc];
      if (t > 53.5) {
        const SP = estadoEm(PM, t, -1), off = [-SP.P.mF[0] * esc, SP.P.mF[1] * esc], e = suave(clamp((t - 53.6) / 1.2));
        const alvo = [mao[0] + (1 - e) * .7 * c, mao[1] + (1 - e) * .06 * c], b = suave(clamp((t - 55.9) / 1));
        const hp = [lerp(alvo[0] - off[0], mao[0] - off[0], b), lerp(alvo[1] - off[1], yc - Math.max(SP.P.pF[1], SP.P.pT[1]) * esc, b)];
        ctx.save();
        if (t < 56.9) { const recorte = new Path2D(); recorte.rect(-W, -H, W * 3, H * 3); recorte.addPath(CRONOS, new DOMMatrix().translate(centro[0], centro[1]).scale(c)); ctx.clip(recorte, "evenodd"); }
        gravado("p", SP, hp, esc, t); ctx.restore();
      }
      gravado("z", SZ, hz, esc, t);
      ctx.fillStyle = VERNIZ; ctx.fillRect(0, yc, W, Math.max(2, H * .01));
      const v = ctx.createLinearGradient(0, 0, W, 0);
      v.addColorStop(0, "rgba(18,10,6,.5)"); v.addColorStop(.2, "rgba(18,10,6,0)"); v.addColorStop(.8, "rgba(18,10,6,0)"); v.addColorStop(1, "rgba(18,10,6,.5)");
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      semArmas = false;
    }
    desenhar = (t) => {
      if (t >= MEMORIA.cheia && t <= MEMORIA.sai) { cenaMemoria(t); return; }
      desenharBase(t);
      if (t < 44) return;
      const baseT = ctx.getTransform();
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(cam.roll); ctx.scale(1.05, 1.05); ctx.translate(-W / 2, -H / 2);
      const corte = janela(t, 50.32, 50.5, 50.75, 51.15);
      if (corte > 0) {
        ctx.beginPath();
        for (let k = 0; k <= 12; k++) { const p = proj(...ancora("tridente", Math.min(t, 50.62) - .32 + k * .0267)); k ? ctx.lineTo(...p) : ctx.moveTo(...p); }
        ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(200,214,245,${(.25 * corte).toFixed(3)})`; ctx.lineWidth = 14; ctx.stroke();
        ctx.strokeStyle = `rgba(240,246,255,${(.75 * corte).toFixed(3)})`; ctx.lineWidth = 3; ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      }
      if (t > 50.62) {
        const w = ancora("feridaZeus", t), [x, y] = proj(w[0], w[1]), s = escala() * .1 * (1 + .25 * ruido(t * 3));
        ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = .6; ctx.drawImage(SPR.brasa, x - s, y - s, s * 2, s * 2); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }
      efeitosDuelo(t);
      particulas(t, ["icor"]);
      const rp = t - MEMORIA.cai;
      if (rp > 0 && rp < .9) { const z = pousoDaGota(), [x, y] = noChao(z[0], 0), rr = .15 + rp * 1.1; ctx.strokeStyle = `rgba(226,234,246,${((1 - rp / .9) * .6).toFixed(3)})`; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.ellipse(x, y, rr * escala(), Math.max(1, rr * passoZ(0)), 0, 0, Math.PI * 2); ctx.stroke(); }
      const ouro = janela(t, 60.7, 61.1, 61.5, 62.1);
      if (ouro > 0) {
        const S = Z(t), [ox, oy] = mundo(S, [S.P.h[0] - 12, S.P.h[1] - 2]), [x, y] = proj(ox, oy), s = escala() * .14;
        ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = ouro * .85; ctx.drawImage(SPR_OURO, x - s, y - s, s * 2, s * 2); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }
      const g = gota(t);
      if (g) {
        if (g.cheio > .001) {
          ctx.save(); ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.clip(); ctx.setTransform(baseT); cenaMemoria(t); ctx.restore();
          ctx.strokeStyle = "rgba(236,242,255,.85)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.stroke();
          ctx.globalCompositeOperation = "lighter"; ctx.strokeStyle = "rgba(200,214,245,.22)"; ctx.lineWidth = 16; ctx.stroke(); ctx.globalCompositeOperation = "source-over";
          esferaDeIcor(g.x, g.y, g.r, 1 - g.cheio * 5);
        } else esferaDeIcor(g.x, g.y, g.r);
      }
      ctx.restore();
    };

    const TEMPOS_FALAS = [[40.5, 41.3, 43.5, 44.3], [50.8, 51.15, 51.85, 52.25], [52.5, 53.1, 54.4, 54.9], [55.2, 55.7, 57.3, 57.75], [59.3, 59.9, 61.3, 61.9]];
    const FALAS_II = [...document.querySelectorAll(".fala-luta")].slice(1).map((el, i) => [el, TEMPOS_FALAS[i]]).filter(([, tt]) => tt);
    const SONS_II = [
      [46.5, "vento"], [47, "metalForte"], [47.55, "vento"], [47.62, "metal"], [47.8, "metal2"], [47.9, "vento"], [48.05, "vento"], [48.4, "vento"],
      [48.45, "metalForte"], [48.66, "vento"], [49.1, "vento"], [49.14, "metal"], [49.22, "metal2"], [49.3, "metal"], [50.25, "metal2"], [50.5, "vento"],
      [50.62, "corte"], [MEMORIA.cai, "gota"]
    ];
    quadro = (t) => {
      quadroBase(t);
      FALAS_II.forEach(([el, [a, b, c, d]]) => (el.style.opacity = janela(t, a, b, c, d).toFixed(3)));
    };

    Object.entries({
      chamarMar:     { n:[-4,-102], h:[0,-136], cF:[12,-150], mF:[18,-196], cT:[-14,-146], mT:[6,-192], jF:[26,56], pF:[42,114], jT:[-22,56], pT:[-44,114], curva: -.3 },
      olharCima:     { n:[-6,-100], h:[-14,-132], cF:[24,-70], mF:[44,-50], cT:[-26,-62], mT:[-40,-28], jF:[22,56], pF:[36,114], jT:[-20,56], pT:[-38,114], curva: -.2 },
      agarrado:      { n:[18,-80], h:[30,-108], cF:[44,-44], mF:[60,-12], cT:[30,-50], mT:[52,-18], jF:[46,30], pF:[52,80], jT:[-30,44], pT:[-64,82], curva: .45 },
      caminharA:     { n:[8,-100], h:[16,-132], cF:[32,-74], mF:[60,-66], cT:[-16,-64], mT:[-26,-30], jF:[32,50], pF:[52,112], jT:[-14,54], pT:[-40,112], curva: .05 },
      caminharB:     { n:[8,-102], h:[16,-134], cF:[30,-76], mF:[58,-68], cT:[-14,-66], mT:[-24,-32], jF:[6,54], pF:[14,114], jT:[2,50], pT:[24,104], curva: .05 },
      mergulharRaio: { n:[20,-86], h:[34,-114], cF:[46,-50], mF:[56,-2], cT:[20,-56], mT:[40,-20], jF:[44,40], pF:[58,104], jT:[-28,52], pT:[-58,110], curva: .45 },
      eletrocutado:  { n:[-10,-100], h:[-22,-128], cF:[16,-128], mF:[36,-150], cT:[-30,-120], mT:[-50,-140], jF:[20,56], pF:[30,114], jT:[-16,56], pT:[-28,114], curva: -.55 },
      pegarTridente: { n:[10,-100], h:[18,-134], cF:[40,-72], mF:[46,-114], cT:[-20,-60], mT:[-32,-26], jF:[24,56], pF:[38,114], jT:[-18,56], pT:[-34,114] },
      erguerJuntoZ:  { n:[-2,-102], h:[2,-136], cF:[14,-146], mF:[0,-190], cT:[-22,-64], mT:[-30,-28], jF:[24,56], pF:[38,114], jT:[-18,56], pT:[-34,114], curva: -.2 },
      erguerJuntoP:  { n:[-2,-102], h:[6,-136], cF:[22,-146], mF:[44,-188], cT:[-22,-64], mT:[-30,-28], jF:[24,56], pF:[38,114], jT:[-18,56], pT:[-34,114], curva: -.2 }
    }).forEach(([k, P]) => { POSES[k] = P; ANGULOS[k] = paraAngulos(P); });
    FIRME.push([72.9, 74.7]);
    ZEUS.push(
      [66.8, "empunhar", -1.65, 0, 0], [67.8, "olharCima", -1.7, 0, 0], [70.5, "olharCima", -1.75, 0, 0], [70.95, "agarrado", -1.8, 0, 0],
      [71.15, "atingido", -2.7, .6, -.5], [71.5, "voando", -3.7, .45, -.9], [71.9, "agarrado", -4.05, 0, 0], [73.6, "agarrado", -4, 0, 0],
      [74.25, "erguendoRaiva", -3.9, 0, 0], [74.7, "chamar", -3.85, 0, 0], [75, "mergulharRaio", -3.8, 0, 0], [75.12, "eletrocutado", -3.8, 0, 0],
      [82.6, "eletrocutado", -3.8, 0, 0], [83.5, "ajoelhado", -3.7, 0, 0], [88, "ajoelhado", -3.7, 0, 0]
    );
    POSEIDON.push(
      [66.6, "empunhar", 1.4, 0, 6.283], [67.4, "chamarMar", 1.5, 0, 6.283], [70.6, "chamarMar", 1.5, 0, 6.283], [71.2, "empunhar", 1.45, 0, 6.283],
      [72.6, "empunhar", 1.4, 0, 6.283], [73, "caminharA", .95, 0, 6.283], [73.4, "caminharB", .4, 0, 6.283], [73.8, "caminharA", -.15, 0, 6.283],
      [74.2, "caminharB", -.65, 0, 6.283], [74.6, "empunhar", -.9, 0, 6.283], [75, "empunhar", -.95, 0, 6.283], [75.12, "eletrocutado", -.95, 0, 6.283],
      [82.6, "eletrocutado", -.95, 0, 6.283], [83.5, "cansado", -.8, 0, 6.283], [88, "cansado", -.8, 0, 6.283]
    );
    CAMERA.push(
      [67.4, 1.1, 1.45, 1.18, 0], [68.6, .4, 3.2, .62, 0], [70.2, .2, 5.5, .5, .01], [70.9, -.8, 2.6, .78, -.02],
      [71.6, -2.9, 1.7, 1.1, .02], [72.8, -2.4, 1.55, .95, 0], [74.2, -2.2, 1.6, 1.05, 0], [75, -2.6, 1.9, 1.3, .03],
      [76.4, -3.3, 2.1, 1.55, 0], [83.1, -2.6, 1.75, 1.15, 0], [85.6, -2.3, 1.5, 1, 0], [88, -2.3, 1.6, .95, 0]
    );
    TRECHOS.push([67.4, 1.2], [70.4, 2.6], [71.6, 1.4], [73, 1], [74.6, 1.1], [75, .5], [76.4, 2.2], [76.9, .6], [79.6, 1.6], [80.6, .9], [82.6, 1.6], [83.1, .6], [85.6, 1.4], [88, 1.2]);
    LENTO.push([75, 76.4]);
    TREMORES.push([68.4, .12, .3], [70.9, .6, .8], [71.15, .4, 1.5], [75, .5, 1.2], [75.4, .2, 2]);
    IMPULSOS["1"].push([71.15, 1], [75.05, .6], [75.25, .5], [75.45, .45], [75.65, .4]);
    IMPULSOS["-1"].push([75.05, .6], [75.25, .5], [75.45, .45], [75.65, .4]);
    RAIOS.push(
      [68.2, .5, [-6, -16], [-3, -12], 211, 1, 2], [69.4, .5, [5, -17], [2, -13], 213, 1, 2], [74.6, .4, [-4.4, -15], "maoZeus", 215, 1.1, 2],
      [75.05, 1.35, "aguaZeus", "cabecaZeus", 217, .5, 2], [75.05, 1.35, "aguaPoseidon", "cabecaPoseidon", 219, .5, 2]
    );
    EMISSORES.push(
      { tipo: "poeira", t0: 68.4, dur: 2.2, n: 30, frente: (b) => [sr(Math.round(b * 97)) * 12, -10 - hash(Math.round(b * 31)) * 8], v: .8, ang: Math.PI / 2, abre: .6, g: .2, k: .4, vida: 3, tam: 2.2, semente: 601 },
      { tipo: "poeira", t0: 70.95, dur: .5, n: 40, frente: (b) => [sr(Math.round(b * 131)) * 8, -.3], v: 2.5, abre: 1.4, g: -.1, k: 1, vida: 3, tam: 1.6, semente: 611 },
      { tipo: "gotaAgua", t0: 70.95, dur: .6, n: 140, frente: (b) => [sr(Math.round(b * 151)) * 8, -.2], v: 7, abre: 1.2, g: 9.8, k: .4, vida: 1.4, semente: 613 },
      { tipo: "gotaAgua", t0: 71.15, n: 60, x: "pesZeus", v: 5, abre: 1.3, g: 9.8, k: .4, vida: 1.2, semente: 615 },
      { tipo: "gotaAgua", t0: 73, dur: 1.6, n: 30, x: "pesPoseidon", v: 1.6, abre: 1, g: 9.8, k: .6, vida: .7, semente: 617 },
      { tipo: "faisca", t0: 75, n: 160, x: "lanca", v: 8, g: 9, k: 1.2, vida: .9, semente: 621 },
      { tipo: "gotaAgua", t0: 75, n: 70, x: "lanca", v: 5, abre: 1.2, g: 9.8, k: .5, vida: 1.2, semente: 623 },
      { tipo: "poeira", t0: 75.1, dur: 1.2, n: 26, frente: (b) => [lerp(-4.5, -.2, hash(Math.round(b * 173))), -1.4], v: .6, abre: .5, g: -.35, k: .6, vida: 3, tam: 1.2, semente: 625 },
      { tipo: "poeira", t0: 83.2, dur: 2.4, n: 24, frente: (b) => [lerp(-4.6, 0, hash(Math.round(b * 191))), -nivelAgua(b)], v: .4, abre: .5, g: -.3, k: .5, vida: 3.5, tam: 1.1, semente: 631 },
      { tipo: "poeira", t0: 83.4, dur: 4.4, n: 16, x: "lanca", v: .25, abre: .4, g: -.4, k: .5, vida: 2.6, tam: .5, semente: 633 },
      { tipo: "poeira", t0: 83.4, dur: 4.4, n: 16, x: "tridente", v: .25, abre: .4, g: -.4, k: .5, vida: 2.6, tam: .5, semente: 635 }
    );
    SONS.push([68.2, ["trovao"]], [69.4, ["trovao"]], [70.9, ["ronco", "baque"]], [74.6, ["trovao"]], [75, ["estalo", "trovao"]]);

    function nivelAgua(t) { return Math.max(0, 1.4 * suave(clamp((t - 70.85) / .5)) * (1 - suave(clamp((t - 83.2) / 2.4))) + .22 * Math.sin(t * 3.1) * janela(t, 70.9, 71.5, 73, 74.6)); }
    const frenteAgua = (t) => lerp(FUNDO, 9, suave(clamp((t - 70.85) / .7)));
    const eletricidade = (t) => janela(t, 74.98, 75.06, 76.2, 76.9);
    SPR.espuma = sprite(64, [[0, "rgba(236,242,240,.95)"], [.5, "rgba(220,232,230,.45)"], [1, "rgba(220,232,230,0)"]]);
    DESENHO.gotaAgua = (q, e, i) => {
      if (q.y > .02) return;
      const [x, y] = proj(q.x, q.y), [x2, y2] = proj(q.x - q.vx * .03, q.y - q.vy * .03);
      ctx.globalAlpha = clamp(1 - q.u); ctx.strokeStyle = "rgba(204,226,224,.85)"; ctx.lineWidth = 1.4 + hash(e.semente + i) * 1.6; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke(); ctx.globalAlpha = 1;
    };
    let tempoQuadro = 0;
    function ondaGigante(t) {
      const sobe = suave(clamp((t - 67.6) / 2.8)), cai = clamp((t - 70.45) / .7);
      if (sobe <= 0 || cai >= 1) return;
      const z = lerp(-9, -5, cai * cai), s = escala() * kz(z), alto = 21 * sobe * (1 - .7 * cai * cai), yBase = H * 1.2, N = 36, topo = [];
      for (let i = 0; i <= N; i++) {
        const x = cam.x - 26 + 52 * i / N, ondula = Math.sin(x * .35 + t * .8) * .8 + Math.sin(x * .9 - t * 1.3) * .35;
        topo.push([W / 2 + (x - cam.x) * s, H * .58 + (cam.alt - alto - ondula * sobe) * s]);
      }
      const yTopo = Math.min(...topo.map((p) => p[1])), g = ctx.createLinearGradient(0, yTopo, 0, yBase);
      g.addColorStop(0, "#5E8A86"); g.addColorStop(.18, "#3B6663"); g.addColorStop(.6, "#22403F"); g.addColorStop(1, "#162B2B");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(topo[0][0], yBase); topo.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(topo[N][0], yBase); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.clip(); ctx.strokeStyle = "rgba(150,190,186,.14)"; ctx.lineWidth = 2;
      for (let i = 0; i < 28; i++) {
        const x = W * (hash(i + 700) * 1.2 - .1), f = (t * .35 + hash(i + 720)) % 1, y = yBase - f * (yBase - yTopo), l = (yBase - yTopo) * .22;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + sr(i + 740) * 14, y - l); ctx.stroke();
      }
      ctx.restore();
      ctx.globalAlpha = .85;
      for (let i = 0; i <= N; i++) { const [x, y] = topo[i], r = s * (.9 + hash(i * 5 + 3) * .7) * (1 + cai), dy = cai * s * 6 * (1 + hash(i)); ctx.drawImage(SPR.espuma, x - r, y - r * .7 + dy, r * 2, r * 1.4); }
      ctx.globalAlpha = 1;
    }
    function arcosNaAgua(t, ya, s) {
      const el = eletricidade(t); if (el <= 0) return;
      const o = ancora("lanca", 75), sem = Math.floor(t * 12), naAgua = (x, z) => [W / 2 + (x - cam.x) * s * kz(z), ya(z)];
      ctx.globalCompositeOperation = "lighter"; ctx.lineCap = ctx.lineJoin = "round";
      for (let i = 0; i < 9; i++) {
        let x = o[0], z = 0; const a = (i / 9) * Math.PI * 2 + sr(sem * 3 + i) * .4, len = (2.5 + hash(sem + i * 7) * 3) * el, pts = [naAgua(x, z)];
        for (let j = 1; j <= 7; j++) { const d = a + sr(sem * 5 + i * 9 + j) * .7; x += Math.cos(d) * len / 7; z += Math.sin(d) * len / 7 * .6; pts.push(naAgua(x, z)); }
        [[6, .1], [2.6, .35], [1.1, .9]].forEach(([w, al]) => { ctx.strokeStyle = `rgba(210,225,255,${(al * el).toFixed(3)})`; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); });
      }
      ctx.globalCompositeOperation = "source-over";
    }
    function aguaSuperficie(t, luzes) {
      const h = nivelAgua(t), zf = frenteAgua(t); if (h <= .01 || zf <= FUNDO) return;
      const s = escala(), ya = (z) => H * .58 + (cam.alt - h) * s * kz(z), y0 = ya(FUNDO), y1 = zf >= 8.4 ? H * 1.2 : Math.min(H * 1.2, ya(zf));
      if (y1 <= y0) return;
      const g = ctx.createLinearGradient(0, y0, 0, Math.max(y0 + 1, Math.min(y1, H)));
      g.addColorStop(0, "rgba(78,110,112,.94)"); g.addColorStop(1, "rgba(30,68,70,.96)");
      ctx.fillStyle = g; ctx.fillRect(-W * .1, y0, W * 1.2, y1 - y0);
      ctx.strokeStyle = "rgba(170,204,202,.2)"; ctx.lineWidth = 1;
      for (let i = 0; i < 16; i++) {
        const z = lerp(FUNDO, Math.min(zf, 8), i / 15), y = ya(z), k = kz(z); if (y > H * 1.1) break;
        ctx.beginPath();
        for (let x = -W * .1; x <= W * 1.1; x += 24) { const yy = y + Math.sin(x * .02 / k + t * 3 + i) * 2 * k; x === -W * .1 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "lighter";
      luzes.forEach((l) => {
        if (l.y > -1) return;
        const [x] = proj(l.x, l.y), w = s * (.4 + Math.min(l.i, 2) * .4), gr = ctx.createLinearGradient(0, y0, 0, Math.min(y1, H));
        gr.addColorStop(0, `rgba(205,220,240,${Math.min(.35, l.i * .22).toFixed(3)})`); gr.addColorStop(1, "rgba(205,220,240,0)");
        ctx.fillStyle = gr; ctx.fillRect(x - w / 2, y0, w, Math.min(y1, H) - y0);
      });
      ctx.globalCompositeOperation = "source-over";
      if (zf < 8.4) {
        const yf = ya(zf), kf = kz(zf), sem = Math.floor(t * 8);
        ctx.globalAlpha = .75;
        for (let i = 0; i < 44; i++) { const x = W * (i / 44 * 1.2 - .1) + sr(i * 7 + sem) * 12, r = s * kf * (.25 + hash(i * 3 + sem) * .3); ctx.drawImage(SPR.espuma, x - r, yf - r * .6, r * 2, r * 1.2); }
        ctx.globalAlpha = 1;
      }
      arcosNaAgua(t, ya, s);
    }
    function aguaFrente(t) {
      const cortina = janela(t, 70.6, 70.85, 71.05, 71.4);
      if (cortina > 0) {
        const u = clamp((t - 70.6) / .6);
        ctx.globalAlpha = cortina * .6;
        for (let i = 0; i < 46; i++) { const x = W * (i / 46 * 1.2 - .1) + sr(i * 3) * 20, y = -H * .3 + u * H * 1.3 * (.7 + hash(i * 7) * .5), r = escala() * (.6 + hash(i * 11) * .8); ctx.drawImage(SPR.espuma, x - r, y - r, r * 2, r * 2); }
        ctx.globalAlpha = 1;
      }
      particulas(t, ["gotaAgua"]);
      const h = nivelAgua(t); if (h <= .01 || frenteAgua(t) < 0) return;
      const s = escala(), ys = H * .58 + (cam.alt - h) * s, perto = clamp(1 - (cam.alt - h) / .8);
      const tinta = ctx.createLinearGradient(0, ys, 0, H); tinta.addColorStop(0, "rgba(30,74,74,.5)"); tinta.addColorStop(1, "rgba(12,34,36,.82)");
      ctx.fillStyle = tinta; ctx.fillRect(-W * .1, ys, W * 1.2, H * 1.2 - ys);
      if (perto > 0) {
        ctx.globalCompositeOperation = "lighter";
        for (let i = 0; i < 6; i++) {
          const x = W * (hash(i + 900) * 1.1 - .05) + Math.sin(t * .5 + i) * 30, w = W * .04 * (.6 + hash(i + 910)), gr = ctx.createLinearGradient(0, ys, 0, H);
          gr.addColorStop(0, `rgba(170,210,206,${(.12 * perto).toFixed(3)})`); gr.addColorStop(1, "rgba(170,210,206,0)");
          ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x - w, ys); ctx.lineTo(x + w, ys); ctx.lineTo(x + w * 2.2, H); ctx.lineTo(x - w * .4, H); ctx.closePath(); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = `rgba(200,226,224,${(.35 * perto).toFixed(3)})`; ctx.lineWidth = 1;
        for (let i = 0; i < 28; i++) { const f = (t * .6 + hash(i + 950)) % 1, x = W * hash(i + 960) + Math.sin(t * 2 + i) * 6, y = H - f * (H - ys), r = 1.5 + hash(i + 970) * 3; if (y < ys + 4) continue; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke(); }
      }
      ctx.strokeStyle = "rgba(204,228,226,.55)"; ctx.lineWidth = 1.6; ctx.beginPath();
      for (let x = -W * .1; x <= W * 1.1; x += 16) { const y = ys + Math.sin(x * .025 + t * 4) * 2.5 + Math.sin(x * .061 - t * 2.6) * 1.5; x === -W * .1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke();
      const P = PO(t), [px, py] = proj(P.x, -h), rr = s * .55;
      ctx.strokeStyle = "rgba(222,236,236,.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(px, py, rr, Math.max(2, rr * .22), 0, 0, Math.PI * 2); ctx.stroke();
      const el = eletricidade(t);
      if (el > 0) { ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = `rgba(190,210,255,${(.18 * el).toFixed(3)})`; ctx.fillRect(-W * .1, ys, W * 1.2, H * 1.2 - ys); ctx.globalCompositeOperation = "source-over"; }
    }
    const abismoBase = abismo, sombrasBase = sombras, choqueBase = choque, ancoraII = ancora, luzesII = luzesEm, keraunosBase = keraunos, tridenteII = tridente, desenharII = desenhar, quadroII = quadro;
    abismo = () => { abismoBase(); ondaGigante(tempoQuadro); };
    sombras = (t, luzes) => { sombrasBase(t, luzes); aguaSuperficie(t, luzes); };
    choque = (t) => { choqueBase(t); aguaFrente(t); };
    ancora = (nome, t) => {
      if (nome === "cabecaZeus" || nome === "cabecaPoseidon") { const S = nome === "cabecaZeus" ? Z(t) : PO(t); return mundo(S, S.P.h); }
      if (nome === "aguaZeus" || nome === "aguaPoseidon") { const S = nome === "aguaZeus" ? Z(t) : PO(t); return [S.x, -nivelAgua(t)]; }
      return ancoraII(nome, t);
    };
    luzesEm = (t) => { const L = luzesII(t), el = eletricidade(t); if (el > 0) { const p = ancora("lanca", 75); L.push({ x: p[0], y: -1.6, i: 1.3 * el }); } return L; };
    keraunos = (P, t, plano) => {
      keraunosBase(P, t, plano);
      if (t < 83.1 || plano) return;
      ctx.save(); ctx.translate(P.mF[0], P.mF[1]); ctx.rotate(ang(P.cF, P.mF) + EIXO_RAIO); ctx.scale(tamanhoRaio(t), tamanhoRaio(t));
      ctx.strokeStyle = "rgba(20,24,30,.85)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(34, -8); ctx.lineTo(40, -2); ctx.lineTo(36, 2); ctx.lineTo(43, 8); ctx.stroke();
      ctx.restore();
    };
    tridente = (P, plano) => {
      tridenteII(P, plano);
      if (tempoFigura < 83.1 || plano || semArmas) return;
      const a = ang(P.cF, P.mF) + giroTridente(tempoFigura), ux = Math.cos(a), uy = Math.sin(a), px = -uy, py = ux, b = [P.mF[0] + ux * 96, P.mF[1] + uy * 96];
      ctx.strokeStyle = "rgba(10,16,15,.9)"; ctx.lineWidth = 1.4; ctx.beginPath();
      ctx.moveTo(b[0] + px * 4, b[1] + py * 4); ctx.lineTo(b[0] + ux * 6 - px, b[1] + uy * 6 - py); ctx.lineTo(b[0] + ux * 10 + px * 3, b[1] + uy * 10 + py * 3); ctx.lineTo(b[0] + ux * 16 - px * 2, b[1] + uy * 16 - py * 2);
      ctx.stroke();
    };

    const MEMORIA2 = { entra: 76.4, cheia: 76.9, sai: 82.6, fora: 83.1 }, PEGA = 80.55;
    const ZF = [[76.4, "encarando", 0, 0, 0], [79.8, "encarando", 0, 0, 0], [80.5, "aperto", 0, 0, 0], [80.75, "aperto", 0, 0, 0], [81.5, "erguerJuntoZ", 0, 0, 0], [84, "erguerJuntoZ", 0, 0, 0]];
    const PF = [[76.4, "encarando", 0, 0, 0], [79.8, "encarando", 0, 0, 0], [80.5, "pegarTridente", 0, 0, 0], [80.75, "pegarTridente", 0, 0, 0], [81.5, "erguerJuntoP", 0, 0, 0], [84, "erguerJuntoP", 0, 0, 0]];
    const GOLPES_MARTELO = [77.3, 78, 78.7, 79.4], VERMELHO = "#8E3B2A", BRANCO_VASO = "#E9DCC8";
    function anguloMartelo(t) {
      const ALTO = -1.9, BAIXO = -3.64;
      for (const ts of GOLPES_MARTELO) {
        if (t < ts && t > ts - .2) return lerp(ALTO, BAIXO, Math.pow((t - (ts - .2)) / .2, 2));
        if (t >= ts && t < ts + .5) return lerp(BAIXO, ALTO, suave((t - ts) / .5));
      }
      return ALTO;
    }
    function fornalha([x, y], c, t) {
      ctx.save(); ctx.translate(x, y); ctx.scale(c, c);
      const domo = new Path2D("M-0.95,0 Q-1,-2.5 0,-2.7 Q1,-2.5 0.95,0 Z");
      ctx.fillStyle = VERNIZ; ctx.fill(domo);
      ctx.save(); ctx.clip(domo); ctx.strokeStyle = ARGILA; ctx.lineWidth = 1.2 / c; ctx.beginPath();
      for (let i = 1; i < 6; i++) { ctx.moveTo(-1, -i * .45); ctx.lineTo(1, -i * .45); for (let j = -2; j <= 2; j++) { const bx = j * .4 + (i % 2) * .2; ctx.moveTo(bx, -i * .45); ctx.lineTo(bx, -i * .45 + .45); } }
      ctx.stroke(); ctx.restore();
      ctx.fillStyle = VERMELHO; ctx.beginPath(); ctx.moveTo(-.44, 0); ctx.lineTo(-.44, -.82); ctx.quadraticCurveTo(0, -1.34, .44, -.82); ctx.lineTo(.44, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = BRANCO_VASO;
      for (let i = 0; i < 4; i++) { const fx = -.3 + i * .2, h = .42 + .22 * Math.sin(t * 7 + i * 1.7); ctx.beginPath(); ctx.moveTo(fx - .07, 0); ctx.quadraticCurveTo(fx - .06, -h * .6, fx + .03 * Math.sin(t * 9 + i), -h); ctx.quadraticCurveTo(fx + .06, -h * .5, fx + .07, 0); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    function ciclope([x, y], c, t) {
      const r = Math.sin(t * 2.2) * .02, hx = -.84, hy = -4.14 + r;
      ctx.save(); ctx.translate(x, y); ctx.scale(c, c);
      ctx.fillStyle = VERNIZ; ctx.strokeStyle = VERNIZ; ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.lineWidth = .38; ctx.beginPath(); ctx.moveTo(-.34, -1.5); ctx.lineTo(-.42, -.06); ctx.moveTo(.32, -1.5); ctx.lineTo(.4, -.06); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-.74, -1.35); ctx.lineTo(.76, -1.35); ctx.lineTo(.64, -2.08); ctx.lineTo(-.62, -2.08); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-.64, -1.98); ctx.bezierCurveTo(-1.08, -2.6, -1.02, -3.5 + r, -.56, -3.8 + r); ctx.bezierCurveTo(-.1, -3.98 + r, .56, -3.88 + r, .8, -3.4 + r); ctx.bezierCurveTo(1, -2.8, .86, -2.26, .66, -1.98); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(hx, hy, .47, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(hx - .4, hy + .14); ctx.lineTo(hx - .6, hy + .66); ctx.lineTo(hx - .06, hy + .44); ctx.closePath(); ctx.fill();
      ctx.lineWidth = .3; ctx.beginPath(); ctx.moveTo(-.72, -3.46 + r); ctx.quadraticCurveTo(-1.26, -2.96, -1.56, -2.46); ctx.stroke();
      ctx.lineWidth = .06; ctx.beginPath(); ctx.moveTo(-1.56, -2.46); ctx.lineTo(-2.06, -2.28); ctx.moveTo(-1.56, -2.46); ctx.lineTo(-2.08, -2.4); ctx.stroke();
      ctx.save(); ctx.translate(.2, -3.56 + r); ctx.rotate(anguloMartelo(t));
      ctx.lineWidth = .3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(.95, 0); ctx.lineTo(1.65, -.15); ctx.stroke();
      ctx.lineWidth = .08; ctx.beginPath(); ctx.moveTo(1.65, -.15); ctx.lineTo(2.3, -.2); ctx.stroke();
      ctx.fillRect(2.2, -.44, .32, .5);
      ctx.restore();
      ctx.strokeStyle = ARGILA; ctx.fillStyle = ARGILA; ctx.lineWidth = 1.4 / c;
      ctx.beginPath(); ctx.arc(hx - .2, hy - .02, .16, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(hx - .2, hy - .02, .045, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(hx - .44, hy - .24); ctx.lineTo(hx + .06, hy - .32); ctx.moveTo(-.42, -2.62); ctx.quadraticCurveTo(-.1, -2.92, .32, -2.72); ctx.moveTo(-.3, -1.62); ctx.lineTo(.42, -1.62); ctx.moveTo(hx - .38, hy + .3); ctx.lineTo(hx - .2, hy + .5); ctx.stroke();
      ctx.restore();
    }
    function cenaForja(t) {
      const u = Math.min(H * .083, W * .115), esc = u * K, yc = H * .8, c = u * .9, ax = W / 2 + .1 * u, cx = ax + 1.9 * c, topo = yc - 2.16 * u + 7 * esc, xt = ax - .7 * u;
      ctx.fillStyle = VERNIZ; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W / 2, H * .58, H * .05, W / 2, H * .58, Math.max(W, H) * .75);
      g.addColorStop(0, ARGILA); g.addColorStop(1, ARGILA_FUNDA);
      ctx.fillStyle = g; ctx.fillRect(0, H * .32, W, H * .52);
      meandro(H * .255, H * .045); meandro(H * .86, H * .045);
      fornalha([cx + 1.75 * c, yc], c, t);
      ciclope([cx, yc], c, t);
      ctx.fillStyle = VERNIZ;
      ctx.fillRect(ax - .28 * u, topo + .46 * u, .56 * u, yc - topo - .46 * u);
      ctx.beginPath(); ctx.moveTo(ax - .55 * u, topo); ctx.lineTo(ax + .55 * u, topo); ctx.lineTo(ax + .45 * u, topo + .46 * u); ctx.lineTo(ax - .4 * u, topo + .46 * u); ctx.lineTo(ax - .55 * u, topo + .2 * u); ctx.lineTo(ax - .95 * u, topo + .1 * u); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = ARGILA; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(ax - .4 * u, topo + .46 * u); ctx.lineTo(ax + .45 * u, topo + .46 * u); ctx.stroke();
      if (t < PEGA) {
        ctx.save(); ctx.translate(ax, topo - 7 * esc); ctx.scale(esc, esc);
        CONTORNO.forEach(([dx, dy]) => { ctx.save(); ctx.translate(dx / esc, dy / esc); ctx.fillStyle = ARGILA; RAIO_PARTES.forEach((p) => ctx.fill(p)); ctx.restore(); });
        ctx.fillStyle = VERNIZ; RAIO_PARTES.forEach((p) => ctx.fill(p));
        ctx.restore();
        const yg = yc - 2.49 * u, fundo = (yc - yg) / esc, PT = { cF: [0, 40], mF: [0, 0] };
        ctx.save(); ctx.translate(xt, yg); ctx.scale(esc, esc); ctx.beginPath(); ctx.rect(-300, -400, 600, fundo + 400); ctx.clip();
        const finca = (cor, dx = 0, dy = 0) => { ctx.save(); ctx.translate(dx / esc, dy / esc); tridenteBase(PT, cor); ctx.strokeStyle = cor; ctx.lineWidth = 4.8; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(0, 100); ctx.lineTo(0, fundo); ctx.stroke(); ctx.restore(); };
        CONTORNO.forEach(([dx, dy]) => finca(ARGILA, dx, dy)); finca(VERNIZ);
        ctx.restore();
      }
      GOLPES_MARTELO.forEach((ts, k) => {
        const a = t - ts; if (a < 0 || a > .8) return;
        ctx.fillStyle = BRANCO_VASO; ctx.globalAlpha = clamp(1 - a / .8);
        for (let i = 0; i < 16; i++) {
          const an = -Math.PI / 2 + sr(k * 40 + i) * 1.3, v = (1.5 + hash(k * 40 + i) * 2.5) * u;
          ctx.beginPath(); ctx.arc(ax + Math.cos(an) * v * a, topo - 7 * esc + Math.sin(an) * v * a + 4.5 * u * a * a, Math.max(1.2, u * .03), 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
      semArmas = t < PEGA;
      const SZ = estadoEm(ZF, t, 1), SP = estadoEm(PF, t, 1), anda = suave(clamp((t - 79.8) / .7)), volta = suave(clamp((t - 80.75) / .75));
      const mZ = cinematica(ANGULOS.aperto).mF[0] * esc, mP = cinematica(ANGULOS.pegarTridente).mF[0] * esc;
      const xz = lerp(lerp(ax - 2.6 * u, ax - mZ, anda), ax - 1.7 * u, volta), xp = lerp(lerp(ax - 3.5 * u, xt - mP, anda), ax - 2.6 * u, volta);
      gravado("p", SP, [xp, yc - Math.max(SP.P.pF[1], SP.P.pT[1]) * esc], esc, t);
      gravado("z", SZ, [xz, yc - Math.max(SZ.P.pF[1], SZ.P.pT[1]) * esc], esc, t);
      semArmas = false;
      ctx.fillStyle = VERNIZ; ctx.fillRect(0, yc, W, Math.max(2, H * .01));
      const v = ctx.createLinearGradient(0, 0, W, 0);
      v.addColorStop(0, "rgba(18,10,6,.5)"); v.addColorStop(.2, "rgba(18,10,6,0)"); v.addColorStop(.8, "rgba(18,10,6,0)"); v.addColorStop(1, "rgba(18,10,6,.5)");
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    }
    function iris2(t) {
      if (t < MEMORIA2.entra || t > MEMORIA2.fora) return null;
      const p = ancora("lanca", MEMORIA2.entra), [x, y] = proj(p[0], p[1]);
      const cheio = t < MEMORIA2.cheia ? Math.pow(clamp((t - MEMORIA2.entra) / (MEMORIA2.cheia - MEMORIA2.entra)), 2.2) : 1 - suave(clamp((t - MEMORIA2.sai) / (MEMORIA2.fora - MEMORIA2.sai)));
      return { x, y, r: lerp(escala() * .05, Math.hypot(W, H) * 1.08, cheio), cheio };
    }
    desenhar = (t) => {
      tempoQuadro = t;
      if (t >= MEMORIA2.cheia && t <= MEMORIA2.sai) { cenaForja(t); return; }
      desenharII(t);
      const g = iris2(t);
      if (g && g.cheio > .001) {
        ctx.save(); ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.clip(); cenaForja(t); ctx.restore();
        ctx.strokeStyle = "rgba(236,232,224,.8)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.stroke();
      }
    };

    const TEMPOS_III = [[66.6, 67.3, 69.2, 69.9], [75.15, 75.5, 76.2, 76.6], [77.2, 77.8, 79.2, 79.7], [80, 80.5, 82.1, 82.5], [84, 84.6, 86.2, 86.9]];
    const FALAS_III = [...document.querySelectorAll(".fala-luta")].slice(6).map((el, i) => [el, TEMPOS_III[i]]).filter(([, tt]) => tt);
    const SONS_III = [[67.4, "mar"], [70.9, "onda"], [71.15, "respingo"], [73.2, "respingo"], [75, "eletrico"], [77.3, "bigorna"], [78, "bigorna"], [78.7, "bigorna"], [79.4, "bigorna"], [83.2, "chiado"]];
    quadro = (t) => {
      quadroII(t);
      FALAS_III.forEach(([el, [a, b, c, d]]) => (el.style.opacity = janela(t, a, b, c, d).toFixed(3)));
    };

    Object.entries({
      olharMaos:     { n:[8,-98], h:[20,-124], cF:[30,-64], mF:[50,-74], cT:[-6,-64], mT:[16,-78], jF:[24,56], pF:[40,114], jT:[-20,56], pT:[-42,114], curva: .35 },
      guardaPunhos:  { n:[6,-98], h:[14,-130], cF:[30,-80], mF:[40,-112], cT:[14,-76], mT:[28,-106], jF:[28,54], pF:[46,114], jT:[-22,56], pT:[-46,114], curva: .15 },
      socoReto:      { n:[18,-96], h:[28,-126], cF:[60,-104], mF:[104,-108], cT:[10,-80], mT:[24,-108], jF:[42,52], pF:[64,114], jT:[-30,56], pT:[-62,114], curva: .2 },
      socoGancho:    { n:[22,-92], h:[32,-122], cF:[56,-80], mF:[70,-122], cT:[0,-76], mT:[14,-104], jF:[44,50], pF:[64,114], jT:[-30,56], pT:[-60,114], curva: .25 },
      recebeSoco:    { n:[-20,-94], h:[-40,-118], cF:[4,-90], mF:[10,-120], cT:[-24,-84], mT:[-12,-112], jF:[26,50], pF:[44,112], jT:[-24,54], pT:[-50,112], curva: -.5 },
      socoCorpo:     { n:[24,-86], h:[38,-114], cF:[54,-60], mF:[94,-56], cT:[16,-74], mT:[30,-100], jF:[46,44], pF:[64,110], jT:[-32,54], pT:[-64,112], curva: .4 },
      dobrado:       { n:[30,-78], h:[48,-96], cF:[36,-44], mF:[30,-20], cT:[24,-46], mT:[20,-22], jF:[38,48], pF:[50,112], jT:[-20,56], pT:[-40,112], curva: .7 },
      agarrar:       { n:[22,-94], h:[34,-122], cF:[52,-96], mF:[84,-102], cT:[44,-84], mT:[78,-90], jF:[44,46], pF:[66,112], jT:[-30,56], pT:[-62,112], curva: .3 },
      testada:       { n:[30,-92], h:[56,-114], cF:[52,-96], mF:[80,-100], cT:[44,-84], mT:[74,-88], jF:[44,48], pF:[64,112], jT:[-30,56], pT:[-62,112], curva: .35 },
      erguerInimigo: { n:[4,-96], h:[10,-128], cF:[30,-130], mF:[52,-150], cT:[20,-126], mT:[44,-146], jF:[34,44], pF:[46,108], jT:[-28,48], pT:[-46,110], curva: -.1 },
      cobrir:        { n:[26,-74], h:[44,-90], cF:[30,-100], mF:[10,-120], cT:[34,-96], mT:[16,-118], jF:[44,26], pF:[44,68], jT:[-8,40], pT:[-40,62], curva: .65 },
      cobrirOlhar:   { n:[26,-76], h:[48,-96], cF:[30,-100], mF:[14,-118], cT:[34,-96], mT:[20,-116], jF:[44,26], pF:[44,68], jT:[-8,40], pT:[-40,62], curva: .55 },
      pegarDoChao:   { n:[32,-62], h:[52,-82], cF:[52,-22], mF:[60,30], cT:[18,-34], mT:[30,-4], jF:[44,4], pF:[50,52], jT:[-16,20], pT:[-44,54], curva: .65 },
      jurar:         { n:[8,-82], h:[18,-112], cF:[36,-62], mF:[62,-70], cT:[-12,-50], mT:[-20,-14], jF:[40,22], pF:[44,58], jT:[-6,56], pT:[-48,58], curva: .3 },
      jurarCabeca:   { n:[10,-80], h:[26,-104], cF:[36,-62], mF:[62,-70], cT:[-12,-50], mT:[-20,-14], jF:[40,22], pF:[44,58], jT:[-6,56], pT:[-48,58], curva: .4 }
    }).forEach(([k, P]) => { POSES[k] = P; ANGULOS[k] = paraAngulos(P); });
    FIRME.push([93.3, 93.65], [93.95, 94.05], [94.38, 94.55], [95.05, 95.35], [98.1, 98.45], [106.7, 108.75]);
    Object.entries({
      passoGuarda:    { n:[10,-96], h:[18,-128], cF:[34,-80], mF:[44,-112], cT:[16,-76], mT:[30,-106], jF:[38,52], pF:[58,114], jT:[-26,56], pT:[-54,114], curva: .2 },
      preparaJab:     { n:[4,-98], h:[12,-130], cF:[24,-84], mF:[30,-110], cT:[14,-76], mT:[28,-104], jF:[28,54], pF:[46,114], jT:[-22,56], pT:[-46,114], curva: .1 },
      jab:            { n:[12,-98], h:[22,-128], cF:[52,-102], mF:[92,-108], cT:[14,-78], mT:[28,-106], jF:[32,54], pF:[52,114], jT:[-24,56], pT:[-50,114], curva: .15 },
      preparaSoco:    { n:[-6,-96], h:[0,-128], cF:[6,-82], mF:[18,-110], cT:[24,-80], mT:[40,-104], jF:[30,52], pF:[50,114], jT:[-26,54], pT:[-50,112], curva: -.15 },
      socoGrande:     { n:[26,-92], h:[38,-120], cF:[66,-100], mF:[110,-100], cT:[8,-74], mT:[18,-100], jF:[48,50], pF:[72,114], jT:[-34,56], pT:[-70,112], curva: .3 },
      bloqueioBracos: { n:[2,-96], h:[8,-126], cF:[28,-100], mF:[34,-132], cT:[24,-96], mT:[30,-128], jF:[30,52], pF:[48,114], jT:[-24,54], pT:[-48,114], curva: .25 },
      cambalear:      { n:[-14,-94], h:[-26,-122], cF:[10,-62], mF:[22,-30], cT:[-24,-60], mT:[-30,-26], jF:[18,52], pF:[24,114], jT:[-30,52], pT:[-60,112], curva: -.25 },
      preparaGancho:  { n:[14,-82], h:[26,-112], cF:[30,-46], mF:[48,-30], cT:[12,-70], mT:[28,-96], jF:[42,40], pF:[56,104], jT:[-28,48], pT:[-56,106], curva: .45 },
      abaixar:        { n:[22,-70], h:[40,-88], cF:[40,-76], mF:[48,-100], cT:[34,-70], mT:[44,-94], jF:[46,24], pF:[52,76], jT:[-24,40], pT:[-54,78], curva: .6 },
      luto:           { n:[6,-96], h:[18,-120], cF:[14,-56], mF:[18,-18], cT:[-8,-56], mT:[-6,-18], jF:[18,56], pF:[30,114], jT:[-14,56], pT:[-26,114], curva: .45 }
    }).forEach(([k, P]) => { POSES[k] = P; ANGULOS[k] = paraAngulos(P); });
    ZEUS.push(
      [89.6, "levantando", -3.2, 0, 0], [90.6, "empunhar", -2, 0, 0], [91.2, "estocada", -1.5, 0, 0], [91.55, "estocada", -1.5, 0, 0],
      [92, "olharMaos", -1.6, 0, 0], [92.45, "olharMaos", -1.62, 0, 0], [92.75, "luto", -1.65, 0, 0], [93.15, "luto", -1.66, 0, 0],
      [93.4, "guardaPunhos", -1.7, 0, 0], [93.62, "passoGuarda", -1.3, 0, 0],
      [93.7, "preparaJab", -1.25, 0, 0], [93.78, "jab", -1.15, 0, 0], [93.86, "preparaSoco", -1.2, 0, 0], [94, "socoReto", -.95, 0, 0], [94.14, "guardaPunhos", -1, 0, 0],
      [94.4, "guardaPunhos", -1, 0, 0], [94.52, "dobrado", -1.1, 0, 0], [94.74, "dobrado", -1.2, 0, 0], [94.84, "recebeSoco", -1.55, 0, 0], [95, "cambalear", -1.8, 0, 0],
      [95.1, "preparaSoco", -1.6, 0, 0], [95.25, "socoGrande", -.95, 0, 0],
      [95.34, "agarrar", -.62, 0, 0], [95.5, "agarrar", -.52, 0, 0], [95.7, "agarrar", -.64, 0, 0], [95.85, "agarrar", -.55, 0, 0], [95.92, "testada", -.45, 0, 0],
      [96.05, "agarrar", -.5, 0, 0], [96.2, "voando", -.4, .7, -.4], [96.35, "voando", -.3, 1.1, -.8], [96.6, "caido", -2.3, 0, 0], [106.6, "caido", -2.3, 0, 0],
      [107.2, "caidoErguendo", -2.4, 0, 0], [107.7, "levantando", -2, 0, 0], [108.1, "pegarDoChao", -1.26, 0, 0], [108.7, "empunhar", -1.4, 0, 0], [109.5, "empunhar", -1.5, 0, 0]
    );
    POSEIDON.push(
      [89.6, "levantando", -.2, 0, 6.283], [90.6, "empunhar", .7, 0, 6.283], [91.2, "defesa", 1, 0, 6.283], [91.55, "defesa", 1, 0, 6.283],
      [92, "olharMaos", 1.1, 0, 6.283], [92.45, "olharMaos", 1.12, 0, 6.283], [92.75, "luto", 1.15, 0, 6.283], [93.15, "luto", 1.16, 0, 6.283],
      [93.4, "guardaPunhos", 1.2, 0, 6.283], [93.62, "passoGuarda", .55, 0, 6.283], [93.78, "bloqueioBracos", .3, 0, 6.283], [94, "guardaPunhos", .34, 0, 6.283],
      [94.1, "recebeSoco", .6, 0, 6.283], [94.28, "cambalear", .75, 0, 6.283], [94.4, "preparaSoco", .45, 0, 6.283], [94.5, "socoCorpo", .07, 0, 6.283],
      [94.62, "preparaGancho", .12, 0, 6.283], [94.74, "socoGancho", .1, 0, 6.283], [95, "guardaPunhos", .4, 0, 6.283],
      [95.18, "abaixar", .45, 0, 6.283], [95.26, "abaixar", .45, 0, 6.283],
      [95.34, "agarrar", .5, 0, 6.283], [95.5, "agarrar", .58, 0, 6.283], [95.7, "agarrar", .46, 0, 6.283], [95.92, "agarrar", .55, 0, 6.283], [96, "recebeSoco", .72, 0, 6.283],
      [96.15, "erguerInimigo", .55, 0, 6.283], [96.35, "erguerInimigo", .45, 0, 6.283], [96.6, "colisao", .2, 0, 6.283], [97.4, "encarando", 0, 0, 6.283],
      [97.9, "olharCima", -.3, 0, 6.283], [98.2, "investida", -1.5, 0, 6.283], [98.4, "cobrir", -2.15, 0, 6.283], [106.2, "cobrir", -2.2, 0, 6.283], [106.7, "cobrirOlhar", -2.2, 0, 6.283],
      [107.3, "levantando", -1.2, 0, 6.283], [107.6, "encarando", .9, 0, 6.283], [108, "pegarDoChao", 2.06, 0, 6.283], [108.6, "empunhar", 1.9, 0, 6.283], [109.5, "empunhar", 1.8, 0, 6.283]
    );
    CAMERA.push(
      [89.6, -1.8, 1.5, 1.05, 0], [90.6, -.6, 1.4, 1.2, 0], [91.2, -.3, 1.45, 1.4, 0],
      [91.55, -.25, 1.6, 1.75, 0], [92.45, -.3, 1.75, 1.45, 0], [93.15, -.3, 1.6, 1.2, 0],
      [93.4, -.3, 1.5, 1.15, 0], [93.78, -.3, 1.5, 1.4, -.02], [94, .25, 1.55, 1.6, .035], [94.2, .1, 1.45, 1.35, 0],
      [94.5, -.6, 1.3, 1.55, -.03], [94.74, -.75, 1.6, 1.65, .04], [95, -1, 1.5, 1.3, 0], [95.25, -.2, 1.25, 1.35, -.02],
      [95.9, -.1, 1.5, 1.85, .02], [96.35, -.3, 1.9, 1.2, -.02], [96.65, -1.6, 1.2, 1.4, .03], [97.4, -1.2, 1.5, 1.1, 0],
      [97.9, -1.2, 11, .58, 0], [98.4, -1.6, 5, .78, .02], [98.9, -2.2, 1.6, 1.05, -.02], [105.4, -2.2, 1.5, 1.25, 0],
      [107, -1.2, 1.5, 1.1, .01], [108.6, .2, 1.5, 1, 0], [109.5, .15, 1.5, .98, 0]
    );
    TRECHOS.push(
      [89.6, 1.2], [90.6, .8], [91.2, .9], [91.55, 1.6], [92.45, 2.2], [93.15, 1.6], [93.4, .8],
      [93.62, .3], [93.78, .3], [93.8, .2], [94, .3], [94.04, .45], [94.28, .35], [94.5, .3], [94.53, .35], [94.74, .3], [94.77, .4],
      [95, .3], [95.25, .45], [95.34, .25], [95.9, .9], [95.92, .2], [95.95, .35], [96.35, .5], [96.6, .35], [96.65, .6],
      [97.4, .9], [97.9, .8], [98.9, 2.2], [99.8, 1.2], [101.3, 1.2], [104.3, 2.6], [105.4, 1], [107, 1.6], [108.7, 1.2], [109.5, .8]
    );
    LENTO.push([91.2, 93.05], [98.2, 98.9]);
    TREMORES.push([91.2, .1, 1.2], [91.55, .08, 1], [93.78, .1, 3], [94, .3, 2.6], [94.5, .25, 2.6], [94.74, .32, 2.4], [95.92, .25, 2.6], [96.6, .6, 1.6], [96.7, .15, .5], [97.5, .2, .4], [98.4, .45, 1], [98.88, .7, 1.2], [99.1, .5, 1.4]);
    IMPULSOS["1"].push([91.2, .25], [94.5, 1], [94.74, 1.2], [96.6, 1.2], [98.88, .4]);
    IMPULSOS["-1"].push([91.2, .25], [93.78, .4], [94, 1.2], [95.92, .9], [98.88, 1.3]);
    RAIOS.push([91.2, .35, "lanca", "tridente", 231, .35, 1]);
    EMISSORES.push(
      { tipo: "faisca", t0: 91.2, dur: .35, n: 30, x: "lanca", v: 1.2, g: 2, k: 1.5, vida: .6, semente: 705 },
      { tipo: "estilhacoLuz", t0: 91.55, dur: .7, n: 70, x: "lanca", v: .7, ang: -Math.PI / 2, abre: 1.4, g: -.15, k: .9, vida: 2.4, semente: 701 },
      { tipo: "estilhacoLuz", t0: 91.55, dur: .9, n: 40, frente: (b) => { const a = ancora("maoZeus", 91.55), z = ancora("lanca", 91.55), u = hash(Math.round(b * 307)); return [lerp(a[0], z[0], u), lerp(a[1], z[1], u)]; }, v: .4, abre: 1.6, g: .5, k: .8, vida: 2.2, semente: 702 },
      { tipo: "estilhacoBronze", t0: 91.55, dur: .6, n: 34, frente: (b) => { const a = ancora("maoPoseidon", 91.55), z = ancora("tridente", 91.55), u = .4 + hash(Math.round(b * 311)) * .6; return [lerp(a[0], z[0], u), lerp(a[1], z[1], u)]; }, v: .5, abre: 1.4, g: 4, k: .6, vida: 2.4, semente: 703 },
      { tipo: "poeira", t0: 93.45, dur: .25, n: 8, x: "pesZeus", v: .9, ang: Math.PI + .35, abre: .5, g: -.15, k: 1, vida: 1.5, tam: .45, semente: 717 },
      { tipo: "poeira", t0: 93.45, dur: .25, n: 8, x: "pesPoseidon", v: .9, ang: -.35, abre: .5, g: -.15, k: 1, vida: 1.5, tam: .45, semente: 719 },
      { tipo: "icor", t0: 94, n: 26, x: "cabecaPoseidon", v: 2.8, ang: -.6, abre: .6, g: 9.8, k: .7, vida: 1.2, semente: 711 },
      { tipo: "poeira", t0: 94.4, n: 8, x: "pesPoseidon", v: 1, ang: -.35, abre: .6, g: -.15, k: 1, vida: 1.4, tam: .5, semente: 725 },
      { tipo: "icor", t0: 94.5, n: 12, x: "troncoZeus", v: 1.6, ang: Math.PI + .3, abre: .6, g: 9.8, k: .8, vida: 1, semente: 727 },
      { tipo: "icor", t0: 94.74, n: 26, x: "cabecaZeus", v: 2.8, ang: -Math.PI / 2 - .4, abre: .5, g: 9.8, k: .7, vida: 1.3, semente: 713 },
      { tipo: "poeira", t0: 95.12, n: 10, x: "pesZeus", v: 1.2, ang: Math.PI + .35, abre: .6, g: -.15, k: 1, vida: 1.4, tam: .5, semente: 729 },
      { tipo: "icor", t0: 95.92, n: 16, x: "cabecaPoseidon", v: 2.2, ang: -.5, abre: .6, g: 9.8, k: .7, vida: 1.2, semente: 715 },
      { tipo: "poeira", t0: 96.6, n: 34, x: "quadrilZeus", v: 2.6, abre: 1.5, g: -.08, k: 1.1, vida: 3, tam: 1, semente: 721 },
      { tipo: "pedra", t0: 96.6, n: 30, x: "quadrilZeus", v: 4.5, abre: 1.3, g: 9.8, k: .3, vida: 1.6, tam: .13, semente: 723 },
      { tipo: "pedra", t0: 96.75, dur: 1.1, n: 24, frente: (b) => [sr(Math.round(b * 211)) * 6, -9], v: .4, ang: Math.PI / 2, abre: .3, g: 9.8, k: .2, vida: 1.6, tam: .08, semente: 731 },
      { tipo: "poeira", t0: 98.5, dur: .6, n: 50, frente: (b) => [lerp(-7, 4, hash(Math.round(b * 223))), -.4], v: 2.2, abre: 1.5, g: -.1, k: .9, vida: 5, tam: 2.2, semente: 733 },
      { tipo: "pedra", t0: 98.88, n: 40, x: [-2.1, -1.05], v: 5, abre: 1.4, g: 9.8, k: .3, vida: 1.6, tam: .16, semente: 735 },
      { tipo: "poeira", t0: 105, dur: 2, n: 20, frente: (b) => [lerp(-6, 3, hash(Math.round(b * 227))), -.3], v: .3, abre: .5, g: .05, k: .5, vida: 4, tam: 1.6, semente: 737 }
    );
    SONS.push([96.6, ["baque"]], [97.4, ["ronco"]], [98.6, ["baque", "ronco"]], [98.88, ["baque"]]);

    const RACHA = 91.2, ESTILHACA = 91.55, SOLTA = 92.45;
    const PECA_RAIO = { pousa: 92.4, fim: [-.6, -.07], final: .1, pega: 108.1 };
    const PECA_TRIDENTE = { pousa: 92.55, fim: [1.4, -.12], final: Math.PI - .25, pega: 108 };
    const CABO_RAIO = { pousa: 92.85, fim: [-1.3, -.07], final: 0 }, CABO_TRIDENTE = { pousa: 92.95, fim: [1.75, -.05], final: Math.PI };
    const eixoMundo = (S, P, a, l = 50) => { const m = mundo(S, P.mF), q = mundo(S, [P.mF[0] + Math.cos(a) * l, P.mF[1] + Math.sin(a) * l]); return { x: m[0], y: m[1], a: Math.atan2(q[1] - m[1], q[0] - m[0]) }; };
    const INICIO = new Map();
    function inicioPeca(p) {
      if (INICIO.has(p)) return INICIO.get(p);
      let ini;
      if (p === PECA_RAIO) { const S = Z(ESTILHACA); ini = { ...eixoMundo(S, S.P, ang(S.P.cF, S.P.mF) + EIXO_RAIO), t0: ESTILHACA }; }
      else if (p === PECA_TRIDENTE) { const S = PO(ESTILHACA), e = eixoMundo(S, S.P, ang(S.P.cF, S.P.mF)), l = 70 * K; ini = { x: e.x + Math.cos(e.a) * l, y: e.y + Math.sin(e.a) * l, a: e.a, t0: ESTILHACA }; }
      else if (p === CABO_RAIO) { const S = Z(SOLTA); ini = { ...eixoMundo(S, S.P, ang(S.P.cF, S.P.mF) + EIXO_RAIO), t0: SOLTA }; }
      else { const S = PO(SOLTA); ini = { ...eixoMundo(S, S.P, ang(S.P.cF, S.P.mF)), t0: SOLTA }; }
      INICIO.set(p, ini);
      return ini;
    }
    function posPeca(p, t) {
      const o = inicioPeca(p), u = clamp((t - o.t0) / (p.pousa - o.t0)), fim = p.final + Math.PI * 2 * Math.round((o.a - p.final) / (Math.PI * 2));
      return [lerp(o.x, p.fim[0], suave(u)), lerp(o.y, p.fim[1], u * u), lerp(o.a, fim, suave(u)), u >= 1];
    }
    function pedacoRaioLocal(plano, brilho = .6) {
      const P = RAIO_PARTES[0];
      if (plano) { ctx.fillStyle = plano; ctx.fill(P); return; }
      if (brilho > .01) {
        ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round";
        [[16, .05], [7, .12], [3, .25]].forEach(([w, al]) => { ctx.strokeStyle = `rgba(190,210,255,${(al * brilho).toFixed(3)})`; ctx.lineWidth = w; ctx.stroke(P); });
        ctx.globalCompositeOperation = "source-over";
      }
      const g = ctx.createLinearGradient(0, -10, 0, 10); g.addColorStop(0, "#8E9DBA"); g.addColorStop(.5, lerp(0, 1, brilho) > .3 ? "#E6EDFA" : "#C3CCDD"); g.addColorStop(1, "#8395B4");
      ctx.fillStyle = g; ctx.fill(P);
      ctx.strokeStyle = "rgba(20,24,30,.9)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(2, -6); ctx.lineTo(8, -1); ctx.lineTo(3, 2); ctx.lineTo(9, 7); ctx.stroke();
    }
    function pedacoTridenteLocal(plano) {
      ctx.save(); ctx.translate(-70, 0); ctx.beginPath(); ctx.rect(58, -40, 120, 80); ctx.clip();
      tridenteBase({ cF: [-10, 0], mF: [0, 0] }, plano);
      ctx.restore();
      if (plano) return;
      ctx.strokeStyle = "rgba(10,16,15,.9)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-12, -3); ctx.lineTo(-9, 0); ctx.lineTo(-13, 3); ctx.stroke();
    }
    function caboRaioLocal(plano, brilho = .4) {
      const partes = [RAIO_PARTES[1], RAIO_PARTES[2]];
      if (plano) { ctx.fillStyle = plano; partes.forEach((p) => ctx.fill(p)); return; }
      if (brilho > .01) {
        ctx.globalCompositeOperation = "lighter"; ctx.lineJoin = "round";
        [[14, .05], [6, .12]].forEach(([w, al]) => { ctx.strokeStyle = `rgba(190,210,255,${(al * brilho).toFixed(3)})`; ctx.lineWidth = w; partes.forEach((p) => ctx.stroke(p)); });
        ctx.globalCompositeOperation = "source-over";
      }
      const g = ctx.createLinearGradient(0, -10, 0, 10); g.addColorStop(0, "#8E9DBA"); g.addColorStop(.5, "#CBD4E6"); g.addColorStop(1, "#8395B4");
      ctx.fillStyle = g; partes.forEach((p) => ctx.fill(p));
      ctx.strokeStyle = "rgba(20,24,30,.9)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(9, -5); ctx.lineTo(13, -1); ctx.lineTo(9, 2); ctx.lineTo(14, 5); ctx.stroke();
    }
    function caboTridenteLocal(plano) {
      ctx.save(); ctx.beginPath(); ctx.rect(-130, -20, 190, 40); ctx.clip();
      tridenteBase({ cF: [-10, 0], mF: [0, 0] }, plano);
      ctx.restore();
      if (plano) return;
      ctx.strokeStyle = "rgba(10,16,15,.9)"; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(56, -3); ctx.lineTo(60, 0); ctx.lineTo(55, 3); ctx.stroke();
    }
    function pecaNoMundo(desenho, x, y, a) {
      const [sx, sy] = proj(x, y), px = escala() * K;
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(a); ctx.scale(px, px); desenho(); ctx.restore();
    }
    DESENHO.estilhacoLuz = (q, e, i) => {
      const [x, y] = proj(q.x, q.y), s = escala() * (.05 + hash(e.semente + i) * .08), rot = q.a * sr(e.semente + i) * 3 + i;
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = clamp((1 - q.u) * .9); ctx.fillStyle = "rgba(220,232,255,.9)";
      ctx.beginPath(); ctx.moveTo(x + Math.cos(rot) * s * 2.2, y + Math.sin(rot) * s * 2.2); ctx.lineTo(x + Math.cos(rot + 2.6) * s, y + Math.sin(rot + 2.6) * s); ctx.lineTo(x + Math.cos(rot - 2.6) * s, y + Math.sin(rot - 2.6) * s); ctx.closePath(); ctx.fill();
      ctx.drawImage(SPR.brasa, x - s * 3, y - s * 3, s * 6, s * 6);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };
    DESENHO.estilhacoBronze = (q, e, i) => {
      const [x, y] = proj(q.x, Math.min(0, q.y)), s = escala() * (.04 + hash(e.semente + i) * .06), rot = q.a * sr(e.semente + i) * 3 + i;
      ctx.globalAlpha = 1 - clamp((q.u - .85) / .15); ctx.fillStyle = mistura(TOM.bronze[1], TOM.bronze[0], hash(e.semente + i * 3) * .6);
      poligono(x, y, s, rot, e.semente + i); ctx.fill(); ctx.globalAlpha = 1;
    };

    const FRONTAO = (() => {
      const yTopo = (x) => -14.55 - 3.05 * (1 - Math.abs(x) / 12.4), cortes = [-12.4, -9.6, -6.9, -4.1, -1.3, 1.5, 4.2, 7, 9.7, 12.4], ultimo = cortes.length - 1;
      const linhas = cortes.map((x, i) => (i === 0 || i === ultimo) ? [[x, -14.25], [x, yTopo(x)]] : [[x + sr(1800 + i) * .25, -14.25], [x + sr(1810 + i) * .35, (-14.25 + yTopo(x)) / 2], [x + sr(1820 + i) * .25, yTopo(x + sr(1820 + i) * .25)]]);
      return cortes.slice(0, -1).map((_, i) => {
        const esq = linhas[i], dir = linhas[i + 1], pts = [...esq];
        if (esq[esq.length - 1][0] < 0 && dir[dir.length - 1][0] > 0) pts.push([0, -17.6]);
        pts.push(...dir.slice().reverse());
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length, cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
        return { pts, cx, cy, t0: 97.8 + hash(1830 + i) * .3, vx: sr(1840 + i) * 1.2, giro: sr(1850 + i) * 2.4, junta: dir };
      });
    })();
    let texFrontao = null;
    function texturaFrontao() {
      if (texFrontao) return texFrontao;
      const c = document.createElement("canvas"), E = 50, X = (x) => (x + 12.4) * E + 10, Y = (y) => (y + 17.9) * E;
      c.width = 24.8 * E + 20; c.height = 4 * E;
      const g = c.getContext("2d");
      g.fillStyle = "#4D5559"; g.beginPath(); g.moveTo(X(-12.4), Y(-14.25)); g.lineTo(X(0), Y(-17.6)); g.lineTo(X(12.4), Y(-14.25)); g.closePath(); g.fill();
      g.strokeStyle = "#6D767A"; g.lineWidth = .28 * E; g.beginPath(); g.moveTo(X(-12.4), Y(-14.4)); g.lineTo(X(0), Y(-17.45)); g.lineTo(X(12.4), Y(-14.4)); g.stroke();
      g.fillStyle = "#5F676B"; g.fillRect(X(-12.4), Y(-14.55), 24.8 * E, .3 * E);
      g.strokeStyle = "rgba(18,21,24,.5)"; g.lineWidth = 2; g.beginPath(); g.moveTo(X(-12), Y(-14.55)); g.lineTo(X(12), Y(-14.55)); g.stroke();
      const principal = ctx; ctx = g; semArmas = true;
      [["z", 1], ["p", -1]].forEach(([q, d]) => {
        const S = estadoEm([[0, "aperto", 0, 0, 0], [1, "aperto", 0, 0, 0]], 0, d), k = E * K * .9, mx = S.P.mF[0] * k;
        ctx.save(); ctx.translate(X(0) - d * mx, Y(-14.6) - 114 * k); ctx.scale(d * k, k); figura(q, S, 0, LUZ_NULA, "#7A8387"); ctx.restore();
      });
      semArmas = false; ctx = principal;
      return (texFrontao = { c, E, X, Y });
    }
    const QUEDAS = [{ x: -6.2, w: 1.6, h: 1.1, t0: 98.22, giro: .7 }, { x: 1.9, w: 1.3, h: .95, t0: 98.3, giro: -.9 }, { x: 3.2, w: 1.8, h: 1.2, t0: 98.36, giro: .5 }, { x: -2.1, w: 1.35, h: .9, t0: 98.2, giro: -.6, costas: true }];
    function quedas(t) {
      QUEDAS.forEach((b) => {
        const tau = t - b.t0; if (tau < 0) return;
        const chao = b.costas ? -1.05 : -b.h / 2, y = Math.min(-7 + 13 * tau * tau, chao), tPouso = Math.sqrt((chao + 7) / 13);
        if (b.costas && y >= chao) return;
        const rot = b.giro * Math.min(tau, tPouso), [x0, y0] = proj(b.x, y), s = escala(), w = b.w * s, h = b.h * s;
        ctx.save(); ctx.translate(x0, y0); ctx.rotate(rot);
        const g = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, "#9AA1A5"); g.addColorStop(1, "#4A5155");
        ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.strokeStyle = "rgba(18,21,24,.5)"; ctx.lineWidth = 1.2; ctx.strokeRect(-w / 2, -h / 2, w, h);
        ctx.beginPath(); ctx.moveTo(-w * .2, -h / 2); ctx.lineTo(0, 0); ctx.lineTo(-w * .1, h / 2); ctx.stroke();
        ctx.restore();
      });
    }
    const GOLPES_IV = [[93.78, .35, "maoZeus"], [94, .8, "cabecaPoseidon"], [94.5, .65, "troncoZeus"], [94.74, .85, "cabecaZeus"], [95.92, .6, "cabecaPoseidon"], [96.6, 1.1, "quadrilZeus"]];
    function estrelasIV(t) {
      if (t < 91 || t > 97.2) return;
      if (t > 93.7 && t < 96.7) { borrao("cotoveloZeus", "maoZeus", t, "226,232,240"); borrao("cotoveloPoseidon", "maoPoseidon", t, "206,230,224"); }
      const s = escala();
      ctx.globalCompositeOperation = "lighter";
      GOLPES_IV.forEach(([t0, f, nome]) => {
        const a = t - t0; if (a < 0 || a > .4) return;
        const [wx, wy] = ancora(nome, t0), [x, y] = proj(wx, wy), u = a / .4, fade = (1 - u) * (1 - u), r = s * (.35 + f * .9) * (1 + u * 2.5);
        ctx.globalAlpha = fade * .9; ctx.drawImage(SPR.luz, x - r, y - r, r * 2, r * 2); ctx.globalAlpha = 1;
        ctx.strokeStyle = `rgba(240,246,255,${(fade * .9).toFixed(3)})`; ctx.lineWidth = 1.4 + f * 1.4; ctx.lineCap = "round"; ctx.beginPath();
        const n = Math.round(10 + f * 6);
        for (let i = 0; i < n; i++) {
          const an = (i / n) * Math.PI * 2 + sr(Math.round(t0 * 100) + i) * .3, r1 = s * (.12 + u * .5) * f, r2 = r1 + s * (.4 + hash(Math.round(t0 * 50) + i) * .9) * f * (1 - u * .6);
          ctx.moveTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1); ctx.lineTo(x + Math.cos(an) * r2, y + Math.sin(an) * r2);
        }
        ctx.stroke();
        ctx.strokeStyle = `rgba(214,226,255,${(fade * .6).toFixed(3)})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, s * (.2 + u * 2.2 * f), 0, Math.PI * 2); ctx.stroke();
      });
      ctx.globalCompositeOperation = "source-over";
      const clarao = Math.max(0, ...GOLPES_IV.filter(([, f]) => f > 1).map(([t0]) => { const a = t - t0; return a >= 0 && a < .2 ? 1 - a / .2 : 0; }));
      if (clarao > 0) { ctx.fillStyle = `rgba(230,238,255,${(clarao * .16).toFixed(3)})`; ctx.fillRect(-W * .1, -H * .1, W * 1.2, H * 1.2); }
    }

    const MEMORIA3 = { entra: 99.25, cheia: 99.8, sai: 104.3, fora: 104.85 };
    const poeiraIV = (t) => janela(t, 98.55, 99.25, 104.7, 105.5);
    const ZJ = [[99.25, "encarando", 0, 0, 0], [100.6, "encarando", 0, 0, 0], [101.2, "jurar", 0, 0, 0], [102.2, "jurar", 0, 0, 0], [102.8, "jurarCabeca", 0, 0, 0], [106, "jurarCabeca", 0, 0, 0]];
    function cenaJuramento(t) {
      semArmas = true;
      const u = Math.min(H * .083, W * .13), esc = u * K, yc = H * .7, rioFim = H * .84;
      ctx.fillStyle = VERNIZ; ctx.fillRect(0, 0, W, H);
      const g = ctx.createRadialGradient(W / 2, H * .5, H * .05, W / 2, H * .5, Math.max(W, H) * .75);
      g.addColorStop(0, ARGILA); g.addColorStop(1, ARGILA_FUNDA);
      ctx.fillStyle = g; ctx.fillRect(0, H * .32, W, yc - H * .32);
      meandro(H * .255, H * .045); meandro(H * .86, H * .045);
      ctx.fillStyle = VERNIZ; ctx.fillRect(0, yc, W, rioFim - yc);
      const passo = u * .55, desl = (t * u * .35) % passo;
      ctx.strokeStyle = ARGILA; ctx.lineWidth = 1.3;
      for (let r = 1; r <= 3; r++) {
        const y = yc + (rioFim - yc) * r / 4; ctx.beginPath();
        for (let x = -passo * 2 + desl * (r % 2 ? 1 : -1); x < W + passo; x += passo) { ctx.moveTo(x, y); ctx.quadraticCurveTo(x + passo / 2, y - passo * .3, x + passo, y); }
        ctx.stroke();
      }
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillStyle = ARGILA; ctx.font = `${Math.round(u * .34)}px "Gentium Book Plus", Georgia, serif`;
      ctx.fillText("ΣΤΥΞ", W / 2, yc + (rioFim - yc) * .5);
      const SZ = estadoEm(ZJ, t, 1), SP = estadoEm(ZJ, t, -1), entra = suave(clamp((t - 99.4) / 1.2)), mx = cinematica(ANGULOS.jurar).mF[0] * esc;
      const xz = lerp(W / 2 - 3.4 * u, W / 2 - mx, entra), xp = lerp(W / 2 + 3.4 * u, W / 2 + mx, entra);
      const hz = [xz, yc - Math.max(SZ.P.pF[1], SZ.P.pT[1]) * esc], hp = [xp, yc - Math.max(SP.P.pF[1], SP.P.pT[1]) * esc];
      gravado("z", SZ, hz, esc, t); gravado("p", SP, hp, esc, t);
      ctx.fillStyle = VERNIZ; ctx.font = `${Math.round(u * .3)}px "Gentium Book Plus", Georgia, serif`;
      const cz = [hz[0] + SZ.P.h[0] * esc, hz[1] + SZ.P.h[1] * esc], cp = [hp[0] - SP.P.h[0] * esc, hp[1] + SP.P.h[1] * esc];
      ctx.textBaseline = "alphabetic"; ctx.fillText("ΖΕΥΣ", cz[0], cz[1] - .62 * u); ctx.fillText("ΠΟΣΕΙΔΩΝ", cp[0], cp[1] - .62 * u);
      if (t > 101.2) {
        const my = hz[1] + SZ.P.mF[1] * esc;
        ctx.fillStyle = BRANCO_VASO;
        for (let i = 0; i < 7; i++) {
          const f = ((t - 101.2) * .8 + hash(i + 1300)) % 1, y = my + 6 + f * (yc - my + u * .4), x = W / 2 + sr(i + 1310) * u * .12;
          ctx.globalAlpha = Math.sin(Math.PI * f); ctx.beginPath(); ctx.ellipse(x, y, 1.6, 2.6, 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      const v = ctx.createLinearGradient(0, 0, W, 0);
      v.addColorStop(0, "rgba(18,10,6,.5)"); v.addColorStop(.2, "rgba(18,10,6,0)"); v.addColorStop(.8, "rgba(18,10,6,0)"); v.addColorStop(1, "rgba(18,10,6,.5)");
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
      semArmas = false;
    }

    const pisoBase = piso, choqueIII = choque, ancoraIII = ancora, keraunosIII = keraunos, tridenteIII = tridente, desenharIII = desenhar, quadroIII = quadro, sombrasIII = sombras, luzesIII = luzesEm, camada = document.createElement("canvas");
    piso = (t, luzes) => { pisoBase(t, luzes); frontao(t); };
    ancora = (nome, t) => {
      if (nome === "troncoZeus") { const S = Z(t); return mundo(S, [S.P.n[0] * .6, S.P.n[1] * .6]); }
      if (nome === "quadrilZeus") return quadril(Z(t));
      if (nome === "cotoveloZeus" || nome === "cotoveloPoseidon") { const S = nome === "cotoveloZeus" ? Z(t) : PO(t); return mundo(S, S.P.cF); }
      return ancoraIII(nome, t);
    };
    luzesEm = (t) => {
      const L = luzesIII(t);
      if (t >= ESTILHACA) L.pop();
      const r = janela(t, RACHA, ESTILHACA, ESTILHACA + .1, ESTILHACA + 1.3);
      if (r > 0) { const p = inicioPeca(PECA_RAIO); L.push({ x: p.x + Math.cos(p.a) * .8, y: p.y + Math.sin(p.a) * .8, i: .9 * r }); }
      return L;
    };
    keraunos = (P, t, plano) => {
      if (t < ESTILHACA) { keraunosIII(P, t, plano); return; }
      ctx.save(); ctx.translate(P.mF[0], P.mF[1]); ctx.rotate(ang(P.cF, P.mF) + EIXO_RAIO);
      if (t < SOLTA) caboRaioLocal(plano, .4 * (1 - clamp((t - ESTILHACA) / .9)));
      else if (t >= PECA_RAIO.pega) pedacoRaioLocal(plano, .3);
      ctx.restore();
    };
    tridente = (P, plano) => {
      if (tempoFigura < ESTILHACA || semArmas) { tridenteIII(P, plano); return; }
      ctx.save(); ctx.translate(P.mF[0], P.mF[1]); ctx.rotate(ang(P.cF, P.mF));
      if (tempoFigura < SOLTA) caboTridenteLocal(plano);
      else if (tempoFigura >= PECA_TRIDENTE.pega) pedacoTridenteLocal(plano);
      ctx.restore();
    };
    const PECAS = [[PECA_RAIO, () => pedacoRaioLocal(null, .08)], [PECA_TRIDENTE, () => pedacoTridenteLocal(null)], [CABO_RAIO, () => caboRaioLocal(null, 0)], [CABO_TRIDENTE, () => caboTridenteLocal(null)]];
    function pecas(t, noChao) {
      PECAS.forEach(([p, desenho]) => {
        const o = inicioPeca(p); if (t < o.t0 || (p.pega && t >= p.pega)) return;
        const [x, y, a, pousou] = posPeca(p, t); if (pousou !== noChao) return;
        const apaga = 1 - clamp((t - o.t0) / (p.pousa - o.t0));
        pecaNoMundo(p === PECA_RAIO && !pousou ? () => pedacoRaioLocal(null, .55 * apaga) : desenho, x, y, a);
      });
    }
    function rachadurasVivas(t) {
      const r = clamp((t - RACHA) / (ESTILHACA - RACHA)); if (r <= 0 || t >= ESTILHACA) return;
      const linha = (a, b, sem, cor) => {
        const n = [-(b[1] - a[1]), b[0] - a[0]], l = Math.hypot(n[0], n[1]) || 1, pts = [];
        for (let i = 0; i <= 12; i++) { const u = i / 12 * r, o = i && i < 12 ? sr(sem + i) * .05 : 0; pts.push(proj(lerp(a[0], b[0], u) + n[0] / l * o, lerp(a[1], b[1], u) + n[1] / l * o)); }
        ctx.globalCompositeOperation = "lighter"; ctx.lineCap = ctx.lineJoin = "round";
        [[7, .12], [3, .4], [1.2, 1]].forEach(([w, al]) => { ctx.strokeStyle = `rgba(${cor},${al})`; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke(); });
        ctx.globalCompositeOperation = "source-over";
      };
      linha(ancora("lanca", t), ancora("maoZeus", t), 3101, "225,235,255");
      linha(ancora("lanca", t), ancora("tridente", t), 3111, "200,236,228");
    }
    function ecoDaForja(t) {
      const a = janela(t, 91.65, 92.05, 92.65, 93.05) * .3; if (a <= 0) return;
      const u = Math.min(H * .06, W * .1), esc = u * K, yc = H * .5, SZ = estadoEm(ZF, 82, 1), SP = estadoEm(PF, 82, 1);
      ctx.save(); ctx.globalAlpha = a;
      [["p", SP, W / 2 - .45 * u], ["z", SZ, W / 2 + .45 * u]].forEach(([q, S, x]) => {
        ctx.save(); ctx.translate(x, yc - Math.max(S.P.pF[1], S.P.pT[1]) * esc); ctx.scale(esc, esc); figura(q, S, 82, LUZ_NULA, "#D8D4CC"); ctx.restore();
      });
      ctx.restore();
    }
    sombras = (t, luzes) => { sombrasIII(t, luzes); pecas(t, true); };
    choque = (t) => {
      choqueIII(t);
      if (t > 98.35 && t < 106.95) lutador("p", PO(t), t, luzesEm(t));
      rachadurasVivas(t);
      pecas(t, false);
      ecoDaForja(t);
      quedas(t);
      particulas(t, ["estilhacoLuz", "estilhacoBronze"]);
      estrelasIV(t);
      const ouro = janela(t, 106.3, 106.6, 106.9, 107.3);
      if (ouro > 0) {
        const S = PO(t), [ox, oy] = mundo(S, [S.P.h[0] - 12, S.P.h[1] - 2]), [x, y] = proj(ox, oy), s = escala() * .14;
        ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = ouro * .85; ctx.drawImage(SPR_OURO, x - s, y - s, s * 2, s * 2); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }
    };
    desenhar = (t) => {
      if (t >= MEMORIA3.cheia && t <= MEMORIA3.sai) { cenaJuramento(t); return; }
      desenharIII(t);
      const p = poeiraIV(t);
      if (p > 0) { ctx.fillStyle = `rgba(52,56,58,${(.94 * p).toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
      const a = t < MEMORIA3.entra || t > MEMORIA3.fora ? 0 : t < MEMORIA3.cheia ? clamp((t - MEMORIA3.entra) / (MEMORIA3.cheia - MEMORIA3.entra)) : 1 - clamp((t - MEMORIA3.sai) / (MEMORIA3.fora - MEMORIA3.sai));
      if (a > 0) {
        const alvo = ctx.canvas, d = ctx.getTransform().a;
        if (camada.width !== alvo.width || camada.height !== alvo.height) { camada.width = alvo.width; camada.height = alvo.height; }
        const principal = ctx; ctx = camada.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, W, H); cenaJuramento(t); ctx = principal;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; ctx.drawImage(camada, 0, 0); ctx.restore();
      }
    };

    const TEMPOS_IV = [[91.8, 92.3, 92.95, 93.35], [94.05, 94.4, 95.7, 96.2], [97.6, 98.1, 99, 99.4], [100.1, 100.6, 101.9, 102.3], [102.5, 103, 103.9, 104.3], [105.6, 106.2, 107.6, 108.2]];
    const FALAS_IV = [...document.querySelectorAll(".fala-luta")].slice(11).map((el, i) => [el, TEMPOS_IV[i]]).filter(([, tt]) => tt);
    const SONS_IV = [[91.2, "fissura"], [91.55, "desfaz"], [91.75, "lamento"], [92.9, "cabos"], [93.78, "bloqueio"], [94, "soco"], [94.5, "soco"], [94.74, "soco"], [95.92, "soco"], [96.6, "soco"], [96.7, "racha"], [97.1, "racha"], [97.5, "racha"], [97.8, "desaba"], [99.4, "rio"]];
    const VENTOS_IV = [93.74, 93.95, 94.45, 94.7, 95.2, 96.2];
    quadro = (t) => {
      quadroIII(t);
      FALAS_IV.forEach(([el, [a, b, c, d]]) => (el.style.opacity = janela(t, a, b, c, d).toFixed(3)));
    };

    Object.entries({
      mirar:      { n:[6,-100], h:[14,-132], cF:[34,-90], mF:[66,-96], cT:[-20,-62], mT:[-32,-28], jF:[28,54], pF:[46,114], jT:[-22,56], pT:[-46,114], curva: .1 },
      mirarRecua: { n:[2,-100], h:[10,-132], cF:[32,-90], mF:[64,-96], cT:[-20,-62], mT:[-32,-28], jF:[18,56], pF:[30,114], jT:[-30,54], pT:[-60,112], curva: .05 },
      correrB:    { n:[24,-94], h:[40,-124], cF:[52,-76], mF:[88,-74], cT:[-6,-64], mT:[-26,-40], jF:[-20,48], pF:[-56,90], jT:[40,42], pT:[52,106], curva: .25 }
    }).forEach(([k, P]) => { POSES[k] = P; ANGULOS[k] = paraAngulos(P); });
    FIRME.push([109.4, 113.65]);
    ZEUS.push(
      [110.2, "mirarRecua", -2.6, 0, 0], [110.8, "mirar", -3.4, 0, 0], [111, "mirar", -3.4, 0, 0],
      [111.5, "correr", -3.15, 0, 0], [112, "correrB", -2.9, 0, 0], [112.5, "correr", -2.68, 0, 0], [113, "correrB", -2.48, 0, 0], [113.4, "investida", -2.36, 0, 0],
      [113.55, "estocada", -2.28, 0, 0], [113.65, "estocada", -2.28, 0, 0],
      [114.9, "caido", -3.6, 0, 0], [124.2, "caido", -3.6, 0, 0], [125.3, "caidoErguendo", -3.6, 0, 0], [126.5, "caido", -3.6, 0, 0], [129.5, "caido", -3.6, 0, 0]
    );
    POSEIDON.push(
      [110.2, "mirarRecua", 2.5, 0, 6.283], [110.8, "mirar", 3.2, 0, 6.283], [111, "mirar", 3.2, 0, 6.283],
      [111.5, "correr", 2.95, 0, 6.283], [112, "correrB", 2.68, 0, 6.283], [112.5, "correr", 2.42, 0, 6.283], [113, "correrB", 2.15, 0, 6.283], [113.4, "investida", 1.95, 0, 6.283],
      [113.55, "estocada", 1.84, 0, 6.283], [113.65, "estocada", 1.84, 0, 6.283],
      [114.9, "caido", 3.4, 0, 6.283], [124.6, "caido", 3.4, 0, 6.283], [125.7, "caidoErguendo", 3.4, 0, 6.283], [126.9, "caido", 3.4, 0, 6.283], [129.5, "caido", 3.4, 0, 6.283]
    );
    CAMERA.push(
      [110.8, .1, 1.5, .92, 0], [111, -.1, 1.2, 1.05, 0], [112.2, -.2, 1.05, 1.35, .01], [113.4, -.15, 1.1, 1.65, -.01], [113.62, 0, 1.2, 1.9, 0],
      [114.9, 0, 1.6, .85, 0], [117.6, -.6, 1.4, .9, 0], [118.4, -3.5, .55, 1.5, 0], [120, 0, .5, 2.2, 0], [122.6, 0, .9, 1.4, 0],
      [124.2, 0, 1.5, .95, 0], [127.6, 0, 1.9, .8, 0], [129.5, 0, 2.1, .76, 0]
    );
    TRECHOS.push([110.8, 1.4], [111, .5], [111.5, 1.1], [112, 1.1], [112.5, 1.1], [113, 1.1], [113.4, .9], [113.55, .6], [113.65, .8], [114.2, 1.6], [114.9, 1.4], [116.3, 1.6], [117.6, 1.4], [120, 2.6], [122.4, 1.8], [124.2, 1.6], [126.2, 1.6], [128.1, 1.6], [129.5, 1.2]);
    LENTO.push([110.4, 113.7]);
    TREMORES.push([113.55, .45, .6]);
    SONS.push([113.6, ["zumbido"]]);
    EMISSORES.push(
      { tipo: "faisca", t0: 113.55, dur: .1, n: 90, frente: () => pontoEncontro(), v: 2.5, g: 1, k: 1.2, vida: .9, semente: 801 },
      { tipo: "brasa", t0: 113.55, n: 60, frente: () => pontoEncontro(), v: 2, abre: 1.6, g: .5, k: .8, vida: 2, semente: 803 },
      { tipo: "poeira", t0: 114.9, dur: 1.2, n: 18, frente: (b) => [lerp(-6, 6, hash(Math.round(b * 331))), -.3], v: .3, abre: .5, g: .04, k: .5, vida: 4, tam: 1.4, semente: 805 },
      { tipo: "ouro", t0: 117.7, dur: 2.3, n: 40, frente: (b) => { const m = posMaca(b); return [m.x, -.05]; }, v: .3, abre: 1.2, g: -.2, k: .9, vida: 1.6, semente: 807 },
      { tipo: "ouro", t0: 120, dur: 6, n: 50, frente: () => [0, -.25], v: .35, abre: 1.4, g: -.25, k: .7, vida: 2.4, semente: 809 }
    );
    DESENHO.ouro = (q, e, i) => {
      const [x, y] = proj(q.x, q.y), s = escala() * (.04 + hash(e.semente + i) * .05);
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = clamp(Math.sin(Math.PI * q.u) * .9); ctx.drawImage(SPR_OURO, x - s * 2, y - s * 2, s * 4, s * 4);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    };

    let encontro = null, eris = false;
    const pontoEncontro = () => encontro || (encontro = (() => {
      const SZ = Z(113.55), SP = PO(113.55), ez = eixoMundo(SZ, SZ.P, ang(SZ.P.cF, SZ.P.mF) + EIXO_RAIO), ep = eixoMundo(SP, SP.P, ang(SP.P.cF, SP.P.mF));
      return [(ez.x + Math.cos(ez.a) * 104 * K + ep.x + Math.cos(ep.a) * 64 * K) / 2, (ez.y + Math.sin(ez.a) * 104 * K + ep.y + Math.sin(ep.a) * 64 * K) / 2];
    })());
    const luzFinal = (t) => t < 113.5 ? 0 : t < 114.2 ? suave((t - 113.5) / .7) : t < 114.9 ? 1 : 1 - suave(clamp((t - 114.9) / 1.4));

    const MACA = { entra: 117.6, para: 120, x0: -8.5, x1: 0, r: .2 };
    function posMaca(t) {
      const u = clamp((t - MACA.entra) / (MACA.para - MACA.entra)), e = 1 - Math.pow(1 - u, 2.2), x = lerp(MACA.x0, MACA.x1, e);
      return { x, y: -MACA.r, a: (x - MACA.x1) / MACA.r };
    }
    function macaTela(x, y, r, a, brilho = 0, texto = false) {
      ctx.save(); ctx.translate(x, y);
      if (brilho > 0) { ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = clamp(brilho); ctx.drawImage(SPR_OURO, -r * 4, -r * 4, r * 8, r * 8); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over"; }
      const forma = new Path2D();
      forma.moveTo(0, -r * .78); forma.bezierCurveTo(r * .55, -r * 1.12, r * 1.1, -r * .7, r * 1.02, -r * .05); forma.bezierCurveTo(r * .96, r * .7, r * .45, r * 1.02, 0, r * .9);
      forma.bezierCurveTo(-r * .45, r * 1.02, -r * .96, r * .7, -r * 1.02, -r * .05); forma.bezierCurveTo(-r * 1.1, -r * .7, -r * .55, -r * 1.12, 0, -r * .78); forma.closePath();
      ctx.save(); ctx.rotate(a);
      ctx.fillStyle = "#B08A36"; ctx.fill(forma);
      ctx.strokeStyle = "#5C4414"; ctx.lineWidth = Math.max(1, r * .08); ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(0, -r * .72); ctx.quadraticCurveTo(r * .05, -r * 1.05, r * .18, -r * 1.25); ctx.stroke();
      ctx.fillStyle = "#8C6E26"; ctx.beginPath(); ctx.moveTo(r * .12, -r * 1.05); ctx.quadraticCurveTo(r * .6, -r * 1.42, r * .9, -r * 1.12); ctx.quadraticCurveTo(r * .55, -r * .95, r * .12, -r * 1.05); ctx.fill();
      if (texto && r > 14) { ctx.fillStyle = "rgba(70,50,14,.75)"; ctx.font = `${Math.round(r * .22)}px "Gentium Book Plus", Georgia, serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("ΤΗΙ ΚΑΛΛΙΣΤΗΙ", 0, r * .18); }
      ctx.restore();
      const recorte = new Path2D(); recorte.addPath(forma, new DOMMatrix().rotate(a * 180 / Math.PI));
      ctx.save(); ctx.clip(recorte);
      const g = ctx.createRadialGradient(-r * .35, -r * .4, r * .05, 0, 0, r * 1.1);
      g.addColorStop(0, "rgba(255,244,205,.75)"); g.addColorStop(.5, "rgba(201,161,74,0)"); g.addColorStop(1, "rgba(60,42,10,.55)");
      ctx.fillStyle = g; ctx.fillRect(-r * 1.3, -r * 1.3, r * 2.6, r * 2.6);
      ctx.restore(); ctx.restore();
    }
    function desenharMaca(t) {
      if (t < MACA.entra) return;
      const m = posMaca(t), [x, y] = proj(m.x, m.y), r = escala() * MACA.r, [sx, sy] = proj(m.x, 0);
      ctx.globalAlpha = .7; ctx.drawImage(SPR.contato, sx - r * 1.4, sy - r * .4, r * 2.8, r * .8); ctx.globalAlpha = 1;
      macaTela(x, y, r, m.a, .35 + .65 * janela(t, 119.8, 120.6, 124, 128.6), true);
    }
    function fioDourado(de, para, t, alfa, sem) {
      const [x0, y0] = proj(...de), [x1, y1] = proj(...para), k = escala() / 145, mx = (x0 + x1) / 2 + sr(sem) * 40 * k, my = Math.min(y0, y1) - (60 + hash(sem) * 50) * k;
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
      ctx.setLineDash([3, 9]); ctx.lineDashOffset = -t * 40;
      [[6, .12], [1.8, .85]].forEach(([w, al]) => { ctx.strokeStyle = `rgba(235,208,140,${(al * alfa).toFixed(3)})`; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke(); });
      ctx.restore();
    }
    const SUSSURROS = [[12.85, 13.5, "p"], [24.3, 25.3, "z"], [45.9, 46.4, "p"], [60.6, 62.1, "z"], [66.1, 67.2, "p"], [73.9, 74.6, "z"], [92.95, 93.4, "z"], [92.95, 93.4, "p"], [106.2, 107.3, "p"], [110.5, 111, "z"], [110.5, 111, "p"]];
    function sussurros(t) {
      if (!eris) return;
      SUSSURROS.forEach(([a, b, q], i) => {
        const f = janela(t, a, a + .25, b - .25, b); if (f <= 0) return;
        const S = q === "z" ? Z(t) : PO(t), ouvido = mundo(S, [S.P.h[0] - 12, S.P.h[1] - 2]), fonte = [ouvido[0] - S.dir * 1.4, ouvido[1] - 1.3];
        fioDourado(fonte, ouvido, t, f, 4200 + i * 13);
        const [x, y] = proj(ouvido[0], ouvido[1]), s = escala() * .16;
        ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = f; ctx.drawImage(SPR_OURO, x - s, y - s, s * 2, s * 2); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      });
    }
    function ecoDoJuramento(t) {
      const a = janela(t, 126.3, 126.9, 127.8, 128.5) * .26; if (a <= 0) return;
      const u = Math.min(H * .06, W * .1), esc = u * K, yc = H * .42, mx = cinematica(ANGULOS.jurar).mF[0] * esc, SZ = estadoEm(ZJ, 102.8, 1), SP = estadoEm(ZJ, 102.8, -1);
      ctx.save(); ctx.globalAlpha = a; semArmas = true;
      [["z", SZ, W / 2 - mx], ["p", SP, W / 2 + mx]].forEach(([q, S, x]) => { ctx.save(); ctx.translate(x, yc - Math.max(S.P.pF[1], S.P.pT[1]) * esc); ctx.scale(S.dir * esc, esc); figura(q, S, 102.8, LUZ_NULA, "#D8D4CC"); ctx.restore(); });
      semArmas = false; ctx.restore();
    }

    const choqueIV = choque, desenharIV = desenhar, quadroIV = quadro, keraunosIV = keraunos, tridenteIV = tridente, luzesIV = luzesEm, chuvaBase = chuva, ceuBase = ceu;
    const cenaMemoriaBase = cenaMemoria, cenaForjaBase = cenaForja, cenaJuramentoBase = cenaJuramento;
    cenaMemoria = (t) => { cenaMemoriaBase(t); if (eris) macaTela(W * .1, H * .8 - H * .014, H * .014, .3, .5); };
    cenaForja = (t) => { cenaForjaBase(t); if (eris) macaTela(W * .9, H * .8 - H * .014, H * .014, -.4, .5); };
    cenaJuramento = (t) => { cenaJuramentoBase(t); if (eris) macaTela(W * .8, H * .77, H * .014, .8, .5); };
    chuva = (t, perto) => { if (t > 114.4) return; chuvaBase(t, perto); };
    ceu = () => {
      ceuBase();
      const k = clamp((tempoQuadro - 114.9) / 2.5); if (k <= 0) return;
      const g = ctx.createLinearGradient(0, H * .2, 0, H * .62); g.addColorStop(0, "rgba(200,206,208,0)"); g.addColorStop(1, `rgba(200,206,208,${(.22 * k).toFixed(3)})`);
      ctx.fillStyle = g; ctx.fillRect(-W * .1, -H * .1, W * 1.2, H * 1.2);
    };
    luzesEm = (t) => { const L = luzesIV(t), g = janela(t, 113.15, 113.6, 113.7, 114.2); if (g > 0) { const p = pontoEncontro(); L.push({ x: p[0], y: p[1], i: 2 * g }); } return L; };
    keraunos = (P, t, plano) => {
      if (t >= 113.65) return;
      if (t > 113.15 && t >= PECA_RAIO.pega && !plano) {
        ctx.save(); ctx.translate(P.mF[0], P.mF[1]); ctx.rotate(ang(P.cF, P.mF) + EIXO_RAIO); pedacoRaioLocal(null, .3 + 1.4 * clamp((t - 113.15) / .4)); ctx.restore(); return;
      }
      keraunosIV(P, t, plano);
    };
    tridente = (P, plano) => { if (tempoFigura >= 113.65 && !semArmas) return; tridenteIV(P, plano); };
    choque = (t) => {
      choqueIV(t);
      sussurros(t);
      if (t > 113.15 && t < 113.65) {
        const S = PO(t), e = eixoMundo(S, S.P, ang(S.P.cF, S.P.mF)), [x, y] = proj(e.x + Math.cos(e.a) * 64 * K, e.y + Math.sin(e.a) * 64 * K), s = escala() * (.3 + clamp((t - 113.15) / .4) * .9);
        ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = .8; ctx.drawImage(SPR.luz, x - s, y - s, s * 2, s * 2); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }
      particulas(t, ["ouro"]);
      desenharMaca(t);
      const fios = janela(t, 120.5, 121.3, 123.8, 124.6);
      if (fios > 0) { const m = posMaca(t), o = [m.x, m.y - MACA.r * .8]; [Z(t), PO(t)].forEach((S, k) => fioDourado(o, mundo(S, [S.P.h[0] - 12, S.P.h[1] - 2]), t, fios, 4100 + k * 7)); }
      ecoDoJuramento(t);
    };
    const LAMPEJOS = [[111.45, 111.85, () => cenaMemoria(57.2)], [112.15, 112.55, () => cenaForja(81.9)], [112.85, 113.25, () => cenaJuramento(102.8)]];
    desenhar = (t) => {
      desenharIV(t);
      LAMPEJOS.forEach(([a0, a1, cena]) => {
        const a = janela(t, a0, a0 + .1, a1 - .1, a1); if (a <= 0) return;
        const alvo = ctx.canvas, d = ctx.getTransform().a;
        if (camada.width !== alvo.width || camada.height !== alvo.height) { camada.width = alvo.width; camada.height = alvo.height; }
        const principal = ctx; ctx = camada.getContext("2d"); ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, W, H); cena(); ctx = principal;
        ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a * .95; ctx.drawImage(camada, 0, 0); ctx.restore();
      });
      const k = luzFinal(t);
      if (k > 0) {
        if (t < 114.3) {
          const p = pontoEncontro(), [x, y] = proj(p[0], p[1]), r = escala() * (.6 + 9 * k), g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, `rgba(255,255,255,${Math.min(1, k * 1.6).toFixed(3)})`); g.addColorStop(1, "rgba(240,244,250,0)");
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        }
        ctx.fillStyle = `rgba(244,246,248,${Math.pow(k, 1.6).toFixed(3)})`; ctx.fillRect(0, 0, W, H);
      }
    };

    const estiloFim = document.createElement("style");
    estiloFim.textContent = `
      .fim{display:grid;place-content:center;justify-items:center;gap:1rem;min-height:100vh;padding:12vh 6vw;text-align:center;background:var(--nevoa,#C9CED0);color:var(--carvao,#24282B)}
      .fim .pomo-titulo{margin:0;font-style:italic;font-size:clamp(2.6rem,1.8rem + 3vw,4.4rem);color:#7A5C1E}
      .fim .pomo-verbete{margin:0;max-width:34ch;font-size:clamp(1.05rem,1rem + .3vw,1.25rem);line-height:1.5}
      .fim .pomo-nota{margin:0;font-size:1rem;font-style:italic}
      .fim .pomo-credito{margin:1.6rem 0 0;font-size:.875rem;color:var(--chumbo,#4F5659);letter-spacing:.02em}
      html.revelada .marca{color:#C9A14A !important}
    `;
    document.head.appendChild(estiloFim);

    const TEMPOS_V = [[109.8, 110.4, 111.1, 111.6], [111.7, 112.1, 113.1, 113.45], [116.2, 116.7, 117.3, 117.65], [120.4, 120.9, 121.9, 122.3], [122.5, 122.9, 123.8, 124.2], [124.4, 124.9, 125.8, 126.2], [126.4, 126.9, 128, 128.6]];
    const FALAS_V = [...document.querySelectorAll(".fala-luta")].slice(17).map((el, i) => [el, TEMPOS_V[i]]).filter(([, tt]) => tt);
    const SONS_V = [[113.55, "encontro"], [117.7, "rolar"], [120, "sino"], [120.6, "sussurro"], [122.6, "sussurro"]];
    const ICONE_MACA = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 9c3-3 9-2 10 3s-1 12-5 15c-2 1.5-3 1-5 0-2 1-3 1.5-5 0-4-3-6-10-5-15s7-6 10-3z" fill="#C9A14A"/><path d="M16 9c0-3 1-5 3-6" fill="none" stroke="#6E5218" stroke-width="1.8" stroke-linecap="round"/></svg>`);
    quadro = (t) => {
      quadroIV(t);
      FALAS_V.forEach(([el, [a, b, c, d]]) => (el.style.opacity = janela(t, a, b, c, d).toFixed(3)));
      if (!eris && t >= MACA.para) { eris = true; document.documentElement.classList.add("revelada"); }
      if (eris) { if (icone.getAttribute("href") !== ICONE_MACA) icone.setAttribute("href", ICONE_MACA); const tituloEris = tituloRevelado(); if (!document.hidden && document.title !== tituloEris) document.title = tituloEris; }
      const nevoa = clamp((t - 128.6) / .9);
      if (nevoa > 0) { ctx.fillStyle = `rgba(201,206,208,${nevoa.toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
    };

    const SPRITES_FRONTAO = new Map();
    function spriteBloco(b, contorno) {
      const chave = `${b.cx.toFixed(3)}:${contorno ? 1 : 0}`;
      if (SPRITES_FRONTAO.has(chave)) return SPRITES_FRONTAO.get(chave);
      const T = texturaFrontao(), pts = b.pts.map(([x, y]) => [T.X(x) - T.X(b.cx), T.Y(y) - T.Y(b.cy)]);
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), x0 = Math.floor(Math.min(...xs)) - 3, y0 = Math.floor(Math.min(...ys)) - 3;
      const c = document.createElement("canvas"); c.width = Math.ceil(Math.max(...xs)) - x0 + 6; c.height = Math.ceil(Math.max(...ys)) - y0 + 6;
      const g = c.getContext("2d"); g.translate(-x0, -y0);
      g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
      g.save(); g.clip(); g.drawImage(T.c, -T.X(b.cx), -T.Y(b.cy)); g.restore();
      if (contorno) { g.strokeStyle = "rgba(20,23,26,.55)"; g.lineWidth = 2; g.stroke(); }
      const sp = { c, x0, y0 }; SPRITES_FRONTAO.set(chave, sp);
      return sp;
    }
    function frontao(t) {
      const s = escala() * kz(Z_FUNDO), T = texturaFrontao(), esc = s / T.E, tela = (x, y) => [W / 2 + (x - cam.x) * s, H * .58 + (cam.alt + y) * s];
      FRONTAO.forEach((b) => {
        const tau = t - b.t0; let dx = 0, dy = 0, rot = 0;
        if (tau > 0) { dy = Math.min(7 * tau * tau, -b.cy - .6); const tt = Math.sqrt(dy / 7); dx = b.vx * tt; rot = b.giro * tt; }
        const [px, py] = tela(b.cx + dx, b.cy + dy), r = s * 3;
        if (py + r < 0 || py - r > H || px + r < 0 || px - r > W) return;
        const sp = spriteBloco(b, tau > 0);
        ctx.save(); ctx.translate(px, py); ctx.rotate(rot); ctx.scale(esc, esc); ctx.drawImage(sp.c, sp.x0, sp.y0); ctx.restore();
      });
      const r = clamp((t - 96.7) / 1.05);
      if (r > 0 && t < 98) {
        ctx.strokeStyle = "rgba(14,16,18,.85)"; ctx.lineWidth = 1.6; ctx.lineCap = "round";
        FRONTAO.forEach((b) => {
          const pts = b.junta.map(([x, y]) => tela(x, y)); let tot = 0;
          for (let i = 1; i < pts.length; i++) tot += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          if (tot <= 0) return;
          ctx.setLineDash([tot, tot]); ctx.lineDashOffset = tot * (1 - r);
          ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
        });
        ctx.setLineDash([]);
      }
    }
    const linhaChaoBase = linhaChao;
    linhaChao = (pts, progresso, largura, cor) => {
      if (progresso <= 0) return;
      if (progresso < 1) { linhaChaoBase(pts, progresso, largura, cor); return; }
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      const tela = pts.map(([x, z]) => { const p = noChao(x, z); minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); return p; });
      if (maxX < -60 || minX > W + 60 || maxY < -60 || minY > H + 60) return;
      ctx.beginPath(); tela.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = cor; ctx.lineWidth = largura * kz(pts[0][1]); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
    };
    let resolucao = 1, ultimoQuadroMs = 0, mediaQuadroMs = 16, ultimoAjusteMs = 0;
    function ajustar(alvo) {
      const dpr = Math.min(2, devicePixelRatio || 1) * (alvo === cv ? resolucao : 1);
      W = alvo.clientWidth; H = alvo.clientHeight; alvo.width = Math.round(W * dpr); alvo.height = Math.round(H * dpr);
      ctx = alvo.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      qualidade = clamp((W * H) / (1440 * 900), .45, 1) * (alvo === cv ? .6 + .4 * resolucao : 1);
      sombraCv.width = Math.max(1, Math.round(W / 4)); sombraCv.height = Math.max(1, Math.round(H / 4));
    }
    const quadroV = quadro;
    quadro = (t) => {
      const agora = performance.now(), dt = agora - ultimoQuadroMs; ultimoQuadroMs = agora;
      if (dt > 0 && dt < 120) {
        mediaQuadroMs += (dt - mediaQuadroMs) * .12;
        if (mediaQuadroMs > 26 && resolucao > .5 && agora - ultimoAjusteMs > 600) { resolucao = Math.max(.5, resolucao - .15); ultimoAjusteMs = agora; mediaQuadroMs = 18; ajustar(cv); }
        else if (mediaQuadroMs < 17.5 && resolucao < 1 && agora - ultimoAjusteMs > 2500) { resolucao = Math.min(1, resolucao + .1); ultimoAjusteMs = agora; ajustar(cv); }
      }
      quadroV(t);
    };

    const estiloEris = document.createElement("style");
    const SELO_MACA = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><radialGradient id="h"><stop offset="0" stop-color="#EBD08C" stop-opacity=".55"/><stop offset="1" stop-color="#EBD08C" stop-opacity="0"/></radialGradient></defs><circle cx="24" cy="25" r="23" fill="url(#h)"/><path d="M24 17c3-3 9-2 10 3s-1 12-5 15c-2 1.5-3 1-5 0-2 1-3 1.5-5 0-4-3-6-10-5-15s7-6 10-3z" fill="#C9A14A"/><path d="M24 17c0-3 1-5 3-6" fill="none" stroke="#6E5218" stroke-width="1.8" stroke-linecap="round"/></svg>`);
    estiloEris.textContent = `
      html.revelada .fala::after,html.revelada .fala-luta::after{content:"";display:block;width:1.6em;height:1.6em;margin:.3em auto 0;background:url("${SELO_MACA}") center/contain no-repeat}
      html.revelada :is(path,circle,ellipse,line,polyline,polygon,rect):is(.ouro,.eris,.sussurro,[fill="#C9A14A" i],[stroke="#C9A14A" i]){filter:drop-shadow(0 0 4px rgba(201,161,74,.9))}
    `;
    document.head.appendChild(estiloEris);

    function particula(e, i, t) {
      const cache = e._c || (e._c = []);
      let c = cache[i];
      if (!c) {
        const b = e.t0 + (e.dur ? hash(e.semente + i * 3.1) * e.dur : 0), angulo = (e.ang ?? -Math.PI / 2) + sr(e.semente + i * 5.3) * (e.abre ?? Math.PI), vel = e.v * (.35 + .65 * hash(e.semente + i * 9.1));
        const o = e.frente ? e.frente(b) : ancora(e.x, b);
        c = cache[i] = { b, vida: e.vida * (.6 + .4 * hash(e.semente + i * 7.7)), x0: o[0] + sr(e.semente + i * 1.7) * (e.rx || 0), y0: o[1] + sr(e.semente + i * 2.9) * (e.ry || 0), vx: Math.cos(angulo) * vel, vy: Math.sin(angulo) * vel };
      }
      const a = t - c.b; if (a < 0 || a > c.vida) return null;
      const k = e.k || .001, g = e.g || 0, ek = Math.exp(-k * a), f = (1 - ek) / k;
      let y = c.y0 + (g / k) * a + (c.vy - g / k) * f;
      if (y > 0 && e.tipo === "pedra") y = 0;
      return { x: c.x0 + c.vx * f, y, a, u: a / c.vida, vx: c.vx * ek, vy: (c.vy - g / k) * ek + g / k };
    }
    const estadoBase = estadoEm, MEMO_ESTADO = new Map();
    estadoEm = (tab, t, dir) => {
      let m = MEMO_ESTADO.get(tab); if (!m) MEMO_ESTADO.set(tab, (m = new Map()));
      const chave = dir > 0 ? t : -1e6 - t; let S = m.get(chave);
      if (!S) { S = estadoBase(tab, t, dir); m.set(chave, S); }
      return S;
    };
    const desenharV = desenhar;
    desenhar = (t) => { MEMO_ESTADO.clear(); desenharV(t); };

    const QUADROS_ESTATICOS = [2.5, 11.8, 14.6, 16.6, 30.3, 30.75, 36.5, 48.6, 51, 54.9, 57.2, 61.9, 69.8, 72.6, 75.3, 78.75, 81.9, 85.4, 91.35, 94.02, 96.64, 98.5, 102.6, 108.9, 110.4, 112.35, 113.6, 116.6, 119.95, 121.6, 127.2];
    const ajustarPerf = ajustar;
    let dprEstatico = false;
    ajustar = (alvo) => {
      if (!dprEstatico) { ajustarPerf(alvo); return; }
      W = alvo.clientWidth; H = alvo.clientHeight; alvo.width = W; alvo.height = H;
      ctx = alvo.getContext("2d"); ctx.setTransform(1, 0, 0, 1, 0, 0); qualidade = clamp((W * H) / (1440 * 900), .45, 1);
      sombraCv.width = Math.max(1, Math.round(W / 4)); sombraCv.height = Math.max(1, Math.round(H / 4));
    };
    function quadrosEstaticos(caixa) {
      const estilo = document.createElement("style");
      estilo.textContent = `.estatico .fala-luta{display:none}.quadros{gap:0}.quadros figure{margin:0 0 6vh}.quadros img{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover}.quadros figcaption{width:min(30ch,88vw);margin:1.6rem auto 0;text-align:center;font-size:clamp(1.15rem,1rem + .6vw,1.6rem);line-height:1.35;color:var(--marmore,#EFEEE9)}.quadros figcaption p{margin:0 0 .5em}`;
      document.head.appendChild(estilo);
      const linhas = [[.9, fala], ...[...FALAS_II, ...FALAS_III, ...FALAS_IV, ...FALAS_V].map(([el, tt]) => [tt[0], el])].sort((a, b) => a[0] - b[0]);
      const legendas = QUADROS_ESTATICOS.map(() => []);
      linhas.forEach(([inicio, el]) => { let k = QUADROS_ESTATICOS.findIndex((tq) => tq >= inicio); if (k < 0) k = QUADROS_ESTATICOS.length - 1; legendas[k].push(el); });
      const tela = document.createElement("canvas"); caixa.appendChild(tela);
      dprEstatico = true;
      let k = 0;
      const proximo = () => {
        if (k >= QUADROS_ESTATICOS.length) { tela.remove(); dprEstatico = false; return; }
        ajustar(tela); desenhar(QUADROS_ESTATICOS[k]);
        const fig = document.createElement("figure"), img = document.createElement("img");
        img.src = tela.toDataURL("image/jpeg", .85); img.alt = ""; img.decoding = "async"; fig.appendChild(img);
        if (legendas[k].length) {
          const cap = document.createElement("figcaption");
          legendas[k].forEach((el) => { const p = document.createElement("p"); p.textContent = el.textContent; if (el.style.color) p.style.color = el.style.color; cap.appendChild(p); });
          fig.appendChild(cap);
        }
        caixa.insertBefore(fig, tela);
        k++; setTimeout(proximo, 0);
      };
      if ("IntersectionObserver" in window) {
        const vigia = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { vigia.disconnect(); proximo(); } }, { rootMargin: "150% 0px" });
        vigia.observe(caixa);
      } else proximo();
    }
    const estiloRevisao = document.createElement("style");
    estiloRevisao.textContent = `.fim h2.pomo-titulo{font-weight:400}`;
    document.head.appendChild(estiloRevisao);

    Object.entries({
      travDescendo: { n:[6,-100], h:[12,-134], cF:[50,-120], mF:[86,-146], cT:[-46,-104], mT:[-80,-126], jF:[22,58], pF:[12,118], jT:[-12,56], pT:[-30,110], curva: -.1 },
      travSubindo:  { n:[8,-100], h:[14,-134], cF:[40,-136], mF:[58,-180], cT:[-36,-118], mT:[-54,-152], jF:[16,58], pF:[4,118], jT:[-16,52], pT:[-34,104], curva: -.15 },
      travGolpe:    { n:[16,-96], h:[28,-128], cF:[64,-90], mF:[110,-92], cT:[-30,-84], mT:[-60,-96], jF:[56,48], pF:[82,114], jT:[-36,58], pT:[-74,112], curva: .3 }
    }).forEach(([k, P]) => { POSES[k] = P; ANGULOS[k] = paraAngulos(P); });
    const POSE_TRAVESSIA = { descendo: "travDescendo", subindo: "travSubindo", encarando: "encarando", golpe: "travGolpe" };
    const LUZ_TRAVESSIA = { dx: .35, dy: -1, i: .6 };
    window.pomoDeus = (tela, quem, a, b, u, k) => {
      const A0 = ANGULOS[POSE_TRAVESSIA[a]], A1 = ANGULOS[POSE_TRAVESSIA[b]], largura = tela.clientWidth, altura = tela.clientHeight;
      if (!A0 || !A1 || !largura || !altura) return false;
      const dpr = Math.min(2, devicePixelRatio || 1), pw = Math.round(largura * dpr), ph = Math.round(altura * dpr);
      if (tela.width !== pw || tela.height !== ph) { tela.width = pw; tela.height = ph; }
      const v = suave(clamp(u)), M = {};
      for (const c in A0) M[c] = c[0] === "a" ? giro(A0[c], A1[c], v) : lerp(A0[c], A1[c], v);
      const z = quem === "z", S = { P: cinematica(M), x: 0, alt: 0, r: 0, dir: z ? 1 : -1, sq: 0 };
      const voo = 1 - clamp(k), avanco = clamp(k - 1), iner = { vx: 1.2 * voo + 4 * avanco, vy: (z ? 6 : -3) * voo };
      const g = tela.getContext("2d"), e = pw / 520, principal = ctx, inerciaBase = inercia;
      g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, pw, ph);
      g.setTransform(e * S.dir, 0, 0, e, 260 * e, 400 * e); g.lineJoin = "round";
      ctx = g; inercia = () => iner;
      try { figura(quem, S, 52 + k * 1.5, LUZ_TRAVESSIA); } finally { ctx = principal; inercia = inerciaBase; }
      return true;
    };
    (window.pomoDeusesEsperando || []).forEach((desenhar) => desenhar());

    const RITMO = .62;
    TRECHOS.forEach((trecho) => { trecho[1] *= RITMO; });

    const estiloAjustes = document.createElement("style");
    estiloAjustes.textContent = `
      body::after{z-index:70}
      .progresso{position:fixed;left:0;top:0;width:100%;height:2px;transform-origin:0 50%;transform:scaleX(0);background:#EFEEE9;mix-blend-mode:difference;z-index:37;pointer-events:none}
      html.revelada .progresso{background:#C9A14A;mix-blend-mode:normal}
      .capitulos{position:fixed;left:0;top:0;width:100%;height:0;z-index:38}
      .capitulos__marca{position:absolute;top:0;width:24px;height:14px;margin-left:-12px;padding:0;border:0;background:transparent;cursor:pointer}
      .capitulos__marca::before{content:"";position:absolute;left:50%;top:0;width:1px;height:8px;background:#EFEEE9;mix-blend-mode:difference}
      html.revelada .capitulos__marca::before{background:#C9A14A;mix-blend-mode:normal}
      .capitulos__marca span{position:absolute;top:18px;left:50%;transform:translateX(-50%);padding:.4rem .65rem;border-radius:6px;white-space:nowrap;font:italic .8rem/1 "Gentium Book Plus",Georgia,serif;letter-spacing:.02em;color:#EFEEE9;background:rgba(24,27,30,.92);opacity:0;pointer-events:none;transition:opacity .2s}
      .capitulos__marca--inicio span{left:0;transform:none}
      .capitulos__marca--fim span{left:auto;right:0;transform:none}
      .capitulos__marca:hover span,.capitulos__marca:focus-visible span{opacity:1}
      .capitulos__marca:focus-visible{outline:2px solid #EFEEE9;outline-offset:1px;border-radius:2px}
    `;
    document.head.appendChild(estiloAjustes);
    const barraProgresso = document.createElement("div");
    barraProgresso.className = "progresso"; barraProgresso.setAttribute("aria-hidden", "true"); document.body.appendChild(barraProgresso);
    const atualizarProgresso = () => { const max = document.documentElement.scrollHeight - innerHeight; barraProgresso.style.transform = `scaleX(${(max > 0 ? clamp(scrollY / max) : 0).toFixed(4)})`; };
    addEventListener("scroll", atualizarProgresso, { passive: true }); addEventListener("resize", atualizarProgresso);
    if (window.ScrollTrigger) ScrollTrigger.addEventListener("refresh", atualizarProgresso);
    atualizarProgresso();

    const CAPITULOS = [
      { pt: "Prólogo", en: "Prologue", secao: "#prologo" },
      { pt: "Os irmãos", en: "The brothers", secao: "#irmaos" },
      { pt: "O passado", en: "The past", secao: "#passado" },
      { pt: "A travessia", en: "The crossing", secao: "#travessia" },
      { pt: "I · Fúria", en: "I · Fury", luta: 0 },
      { pt: "II · A primeira ferida", en: "II · The first wound", luta: 40 },
      { pt: "III · O mar sobe ao Olimpo", en: "III · The sea climbs Olympus", luta: 66 },
      { pt: "IV · As armas se quebram", en: "IV · The weapons break", luta: 88.6 },
      { pt: "V · O último golpe", en: "V · The last blow", luta: 109.5 }
    ];
    const gatilhoDe = (el) => (window.ScrollTrigger ? ScrollTrigger.getAll().find((s) => s.trigger === el && s.pin) : null);
    function rolagemDaLuta(tHistoria) {
      let tAnt = 0, telas = 0;
      for (const [tFim, dur] of TRECHOS) {
        if (tHistoria <= tFim) return (telas + dur * clamp((tHistoria - tAnt) / Math.max(.001, tFim - tAnt))) * innerHeight;
        telas += dur; tAnt = tFim;
      }
      return telas * innerHeight;
    }
    function posicaoCapitulo(c) {
      const el = $(c.secao || "#luta"), st = gatilhoDe(el), topo = st ? st.start : el.getBoundingClientRect().top + scrollY;
      return c.secao || !st ? topo : topo + rolagemDaLuta(c.luta);
    }
    function irPara(destino) {
      const veu = document.querySelector(".veu-rever");
      const pular = () => {
        const som = window.pomoSom; window.pomoSom = () => {};
        scrollTo(0, Math.round(destino) + 1);
        if (window.ScrollTrigger) { ScrollTrigger.update(); ScrollTrigger.getAll().forEach((s) => { const tw = s.getTween && s.getTween(); if (tw) tw.progress(1); }); }
        requestAnimationFrame(() => requestAnimationFrame(() => { window.pomoSom = som; }));
        if (veu) veu.classList.remove("veu-rever--ativo");
      };
      if (!veu || matchMedia("(prefers-reduced-motion: reduce)").matches) { pular(); return; }
      veu.classList.add("veu-rever--ativo"); setTimeout(pular, 650);
    }
    const marcasCapitulos = document.createElement("nav");
    marcasCapitulos.className = "capitulos"; document.body.appendChild(marcasCapitulos);
    function desenharMarcas() {
      const raizDoc = document.documentElement, max = raizDoc.scrollHeight - innerHeight;
      marcasCapitulos.hidden = !raizDoc.classList.contains("movimento") || max <= 0;
      if (marcasCapitulos.hidden) return;
      const en = raizDoc.lang === "en";
      marcasCapitulos.setAttribute("aria-label", en ? "Chapters" : "Capítulos");
      marcasCapitulos.innerHTML = CAPITULOS.map((c, i) => {
        const p = clamp(posicaoCapitulo(c) / max, .006, .994), lado = p < .12 ? " capitulos__marca--inicio" : p > .88 ? " capitulos__marca--fim" : "";
        return `<button type="button" class="capitulos__marca${lado}" data-capitulo="${i}" style="left:${(p * 100).toFixed(2)}%"><span>${en ? c.en : c.pt}</span></button>`;
      }).join("");
    }
    marcasCapitulos.addEventListener("click", (e) => { const b = e.target.closest("[data-capitulo]"); if (b) irPara(posicaoCapitulo(CAPITULOS[+b.dataset.capitulo])); });
    if (window.ScrollTrigger) ScrollTrigger.addEventListener("refresh", desenharMarcas);
    addEventListener("resize", desenharMarcas);
    new MutationObserver(desenharMarcas).observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "class"] });
    desenharMarcas();

    let velocidade = 0, tVelocidade = null, msVelocidade = 0;
    const desenharRev = desenhar;
    desenhar = (t) => {
      desenharRev(t);
      if (velocidade <= 5) return;
      const brilho = luzesEm(t).reduce((s, l) => s + Math.min(l.i, 2), 0), k = Math.min(.5, brilho * .14 * clamp((velocidade - 5) / 10));
      if (k > .01) { ctx.fillStyle = `rgba(12,14,16,${k.toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
    };

    const colunaBase = coluna, plintoBase = plintoECapitel;
    const RUINAS = [[-9.6, Z_FUNDO, 4.2], [4.8, Z_FUNDO, 2.4], [6.4, Z_FRENTE, 5.2]];
    const toco = (x, z) => { if (tempoQuadro < 114.85) return 0; const r = RUINAS.find(([rx, rz]) => rx === x && rz === z); return r ? r[2] : 0; };
    coluna = (x, z, alto, lado, marcas, t) => {
      const h = toco(x, z);
      if (!h) { colunaBase(x, z, alto, lado, marcas, t); return; }
      const s = escala() * kz(z), [bx, by] = noChao(x, z), r = .46 * s;
      ctx.save(); ctx.beginPath(); ctx.moveTo(bx - r - 2, by + 2);
      for (let i = 0; i <= 9; i++) ctx.lineTo(bx - r + (i / 9) * 2 * r, by - (h + sr(1900 + x * 7 + i) * .3) * s);
      ctx.lineTo(bx + r + 2, by + 2); ctx.closePath(); ctx.clip();
      colunaBase(x, z, h + .6, lado, [], t); ctx.restore();
      for (let i = 0; i < 3; i++) {
        const zi = z + .2 + i * .15, [cx, cy] = noChao(x + (x > 0 ? 1 : -1) * (1.1 + i * 1.45), zi), rr = .46 * escala() * kz(zi);
        tambor(cx, cy - rr, Math.PI / 2 + sr(1950 + x + i) * .25, rr, 1.4 * escala() * kz(zi), lado, i === 0 ? 1960 : 0);
      }
    };
    plintoECapitel = (x, z, alto) => plintoBase(x, z, toco(x, z) ? 99 : alto);

    const Trilha = (() => {
      let carregando = null, pronto = false, ligado = false, T = null, mestre, mundo, sala, seco, leitura, guerra, coracao, zumbido;
      const fx = {}, ultimo = {}, estado = { batalha: false, lento: false };
      const carregar = () => carregando || (carregando = new Promise((ok, falha) => {
        if (window.Tone) { ok(); return; }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/tone/15.3.5/Tone.min.js";
        s.onload = () => (window.Tone ? ok() : falha(new Error("o Tone.js carregou, mas não apareceu na página")));
        s.onerror = () => { carregando = null; s.remove(); falha(new Error("o Tone.js não carregou")); };
        document.head.appendChild(s);
      }));
      const esperar = (ms) => new Promise((ok) => setTimeout(ok, ms));
      function montar() {
        T = window.Tone;
        mestre = new T.Gain(0).toDestination();
        mundo = new T.Filter(16000, "lowpass").connect(new T.Limiter(-2).connect(mestre));
        sala = new T.Reverb({ decay: 8, wet: .38 }).connect(mundo);
        seco = new T.Gain(.9).connect(mundo);
        leitura = new T.Gain(.9).connect(sala); guerra = new T.Gain(0).connect(sala);
        const tr = T.getTransport ? T.getTransport() : T.Transport; tr.bpm.value = 62;
        const grave = new T.Filter(420, "lowpass").connect(leitura);
        new T.Oscillator("D2", "triangle").connect(new T.Gain(.18).connect(grave)).start();
        new T.Oscillator("A2", "sine").connect(new T.Gain(.12).connect(grave)).start();
        const lira = new T.PluckSynth({ attackNoise: .8, dampening: 3200, resonance: .94 }).connect(new T.Gain(.5).connect(leitura));
        new T.Sequence((t, n) => n && lira.triggerAttack(n, t), ["D4", null, "F4", null, "A4", null, null, "G4", "E4", null, "D4", null, null, null, "C4", null, "D4", null, "A3", null, null, null, null, null], "4n").start(0);
        const cordas = new T.PolySynth(T.Synth, { oscillator: { type: "fatsawtooth", count: 3, spread: 28 }, envelope: { attack: 2.8, decay: 1, sustain: .8, release: 4 } }).connect(new T.Filter(1100, "lowpass").connect(new T.Gain(.08).connect(guerra)));
        const prog = [["D3", "A3", "F4"], ["A#2", "F3", "D4"], ["F2", "C3", "A3"], ["C3", "G3", "E4"]]; let ip = 0;
        new T.Loop((t) => cordas.triggerAttackRelease(prog[ip++ % 4], "2m", t), "2m").start(0);
        const cello = new T.MonoSynth({ oscillator: { type: "sawtooth" }, filter: { Q: 1 }, filterEnvelope: { attack: .2, decay: .6, sustain: .5, baseFrequency: 160, octaves: 2.2 }, envelope: { attack: .14, decay: .3, sustain: .8, release: 1.4 }, portamento: .06 }).connect(new T.Gain(.15).connect(guerra));
        new T.Sequence((t, n) => n && cello.triggerAttackRelease(n, "4n", t), ["D2", "F2", "E2", "D2", "C2", "D2", "A1", null, "A#1", "C2", "D2", "F2", "E2", "C2", "D2", null], "4n").start(0);
        const coro = new T.PolySynth(T.AMSynth, { harmonicity: 1.5, envelope: { attack: 3, release: 5 } }).connect(new T.Filter(1500, "lowpass").connect(new T.Gain(.045).connect(guerra)));
        const vozes = [["A4", "D5"], ["F4", "A#4"], ["F4", "A4"], ["E4", "G4"]]; let iv = 0;
        new T.Loop((t) => coro.triggerAttackRelease(vozes[iv++ % 4], "2m", t), "2m").start("1m");
        const taiko = new T.MembraneSynth({ pitchDecay: .4, octaves: 2.5, envelope: { attack: .002, decay: 1.8, sustain: 0, release: 1 } }).connect(new T.Filter(260, "lowpass").connect(new T.Gain(.7).connect(guerra)));
        new T.Loop((t) => { taiko.triggerAttackRelease("D1", "1m", t); taiko.triggerAttackRelease("D1", "2n", t + T.Time("2n").toSeconds() * 1.5); }, "2m").start(0);
        const batida = new T.MembraneSynth({ pitchDecay: .08, octaves: 1.5, envelope: { attack: .001, decay: .25, sustain: 0 } });
        coracao = new T.Gain(0).connect(sala); batida.connect(coracao);
        new T.Loop((t) => { batida.triggerAttackRelease("E1", "16n", t); batida.triggerAttackRelease("E1", "16n", t + .22); }, "4n").start(0);
        const fazRuido = (tipo, ataque, queda, filtro, freq, ganho, destino = seco) => new T.NoiseSynth({ noise: { type: tipo }, envelope: { attack: ataque, decay: queda, sustain: 0 } }).connect(new T.Filter(freq, filtro).connect(new T.Gain(ganho).connect(destino)));
        fx.trovao = fazRuido("brown", .02, 3.2, "lowpass", 700, 1);
        fx.estalo = fazRuido("white", .001, .12, "bandpass", 5200, .4);
        fx.ronco = fazRuido("brown", .4, 2.6, "lowpass", 180, 1.4);
        fx.pedra = fazRuido("pink", .002, .45, "lowpass", 1300, 1);
        fx.corte = fazRuido("white", .004, .3, "highpass", 2600, .3, sala);
        fx.mar = fazRuido("brown", 2.5, 5, "lowpass", 320, 1.1);
        fx.onda = fazRuido("pink", .02, 3.5, "lowpass", 1400, .9, sala);
        fx.respingo = fazRuido("white", .005, .6, "lowpass", 3000, .35, sala);
        fx.chiado = fazRuido("white", .4, 3, "highpass", 4000, .18, sala);
        fx.estalinho = fazRuido("white", .002, .12, "highpass", 5000, .12, sala);
        fx.tapa = fazRuido("pink", .001, .08, "bandpass", 1800, .6);
        fx.racha = fazRuido("brown", .003, .45, "bandpass", 900, 1.2, sala);
        fx.desaba = fazRuido("brown", .2, 4.5, "lowpass", 260, 1.6);
        fx.rio = fazRuido("pink", 1.5, 5, "lowpass", 900, .25, sala);
        fx.rolar = fazRuido("brown", .5, 2.4, "lowpass", 420, .5, sala);
        const membrana = (queda, oitavas, ganho, destino, pitch) => new T.MembraneSynth({ pitchDecay: pitch, octaves: oitavas, envelope: { attack: .001, decay: queda, sustain: 0 } }).connect(new T.Gain(ganho).connect(destino));
        fx.baque = membrana(2.2, 4, 1, seco, .3);
        fx.soco = membrana(.35, 3, .7, seco, .05);
        fx.bloqueio = membrana(.18, 2, .4, seco, .03);
        fx.grave = membrana(3.5, 3, .6, sala, .5);
        const metal = (envelope, harmonicity, modulationIndex, resonance, octaves, ganho) => new T.MetalSynth({ envelope, harmonicity, modulationIndex, resonance, octaves }).connect(new T.Gain(ganho).connect(sala));
        fx.metal = metal({ attack: .001, decay: 1.1, release: .4 }, 3.1, 18, 2200, 1.2, .16);
        fx.bigorna = metal({ attack: .001, decay: .9, release: .3 }, 5.1, 22, 3400, 1.1, .1);
        fx.fissura = metal({ attack: .001, decay: .9, release: .4 }, 8.5, 20, 6000, 1, .035);
        fx.desfaz = metal({ attack: .01, decay: 3.2, release: 1.5 }, 5.4, 8, 4200, .6, .05);
        fx.cabos = metal({ attack: .001, decay: .35, release: .2 }, 3.2, 10, 1800, .8, .06);
        fx.encontro = metal({ attack: .4, decay: 4, release: 2 }, 4.1, 12, 3000, 1.5, .06);
        fx.sino = metal({ attack: .001, decay: 2.6, release: 1.2 }, 6.2, 6, 5200, .4, .05);
        fx.gota = new T.Synth({ oscillator: { type: "sine" }, envelope: { attack: .001, decay: .45, sustain: 0, release: .5 } }).connect(new T.Gain(.3).connect(sala));
        fx.eletrico = new T.FMSynth({ harmonicity: 3.01, modulationIndex: 30, oscillator: { type: "sawtooth" }, envelope: { attack: .01, decay: 1.6, sustain: 0, release: .3 } }).connect(new T.Gain(.07).connect(sala));
        fx.lira = new T.PluckSynth({ attackNoise: .6, dampening: 2600, resonance: .97 }).connect(new T.Gain(.55).connect(sala));
        fx.ventoFiltro = new T.Filter(600, "bandpass"); fx.ventoFiltro.Q.value = 1.2; fx.ventoFiltro.connect(new T.Gain(.4).connect(seco));
        fx.vento = new T.NoiseSynth({ noise: { type: "pink" }, envelope: { attack: .04, decay: .32, sustain: 0 } }).connect(fx.ventoFiltro);
        const filtroSussurro = new T.Filter(2200, "bandpass"); filtroSussurro.Q.value = .8; filtroSussurro.connect(new T.Gain(.16).connect(sala));
        fx.sussurro = new T.NoiseSynth({ noise: { type: "pink" }, envelope: { attack: .8, decay: 1.8, sustain: 0 } }).connect(filtroSussurro);
        zumbido = new T.Gain(0).connect(mestre); new T.Oscillator(3100, "sine").connect(zumbido).start();
        tr.start(); pronto = true;
      }
      const DURACAO = { trovao: 3, estalo: .12, ronco: 2.5, pedra: .45, corte: .3, mar: 5, onda: 3.5, respingo: .6, chiado: 3, racha: .45, desaba: 4.5, rio: 5, rolar: 2.4, sussurro: 2.4 };
      function tocar(nome) {
        if (!pronto || !ligado) return;
        const agora = T.now(); if (ultimo[nome] && agora - ultimo[nome] < .09) return; ultimo[nome] = agora;
        if (DURACAO[nome]) { fx[nome].triggerAttackRelease(DURACAO[nome], agora); return; }
        switch (nome) {
          case "baque": fx.baque.triggerAttackRelease("A0", "1n", agora); break;
          case "zumbido": zumbido.gain.cancelScheduledValues(agora); zumbido.gain.setValueAtTime(.045, agora); zumbido.gain.linearRampToValueAtTime(0, agora + 5); break;
          case "metal": fx.metal.triggerAttackRelease("C2", .9, agora); break;
          case "metal2": fx.metal.triggerAttackRelease("E2", .7, agora); break;
          case "metalForte": fx.metal.triggerAttackRelease("G1", 1.5, agora); break;
          case "gota": fx.gota.triggerAttackRelease("E6", .3, agora); break;
          case "vento": fx.ventoFiltro.frequency.cancelScheduledValues(agora); fx.ventoFiltro.frequency.setValueAtTime(380, agora); fx.ventoFiltro.frequency.exponentialRampToValueAtTime(2600, agora + .28); fx.vento.triggerAttackRelease(.3, agora); break;
          case "eletrico": fx.eletrico.triggerAttackRelease("A1", 1.4, agora); break;
          case "bigorna": fx.bigorna.triggerAttackRelease("C4", .7, agora); break;
          case "fissura": fx.fissura.triggerAttackRelease("C6", .8, agora); fx.estalinho.triggerAttackRelease(.12, agora + .05); fx.estalinho.triggerAttackRelease(.12, agora + .32); break;
          case "desfaz": fx.desfaz.triggerAttackRelease("E5", 3, agora); break;
          case "lamento": ["D4", "A3", "F3", "D3"].forEach((n, i) => fx.lira.triggerAttack(n, agora + i * .9)); break;
          case "cabos": fx.cabos.triggerAttackRelease("G3", .3, agora); fx.cabos.triggerAttackRelease("D3", .3, agora + .18); break;
          case "bloqueio": fx.bloqueio.triggerAttackRelease("D1", .15, agora); break;
          case "soco": fx.soco.triggerAttackRelease("A0", .3, agora); fx.tapa.triggerAttackRelease(.08, agora); break;
          case "encontro": fx.encontro.triggerAttackRelease("A4", 3, agora); fx.grave.triggerAttackRelease("D1", 3, agora); break;
          case "sino": fx.sino.triggerAttackRelease("E6", 2.4, agora); break;
        }
      }
      window.pomoSom = (nomes) => {
        if (!pronto || !ligado) return;
        nomes.forEach((n) => tocar(n));
        const v = nomes.reduce((m, n) => m || VIBRACOES[n] || 0, 0);
        if (v && navigator.vibrate) navigator.vibrate(v);
      };
      return {
        preparar() { return carregar().catch((erro) => console.warn("pomo:", erro.message)); },
        async alternar() {
          try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (erro) {  }
          if (!pronto) {
            const pedido = window.Tone ? window.Tone.start().catch(() => {}) : null;
            await carregar();
            await Promise.race([pedido || window.Tone.start().catch(() => {}), esperar(2000)]);
            if (window.Tone.getContext().state !== "running") return null;
            montar();
          } else window.Tone.start().catch(() => {});
          ligado = !ligado; mestre.gain.rampTo(ligado ? .85 : 0, .8); return ligado;
        },
        tocar,
        cena(batalha, lento) {
          if (!pronto) return;
          if (batalha !== estado.batalha) { leitura.gain.rampTo(batalha ? 0 : .9, 3); guerra.gain.rampTo(batalha ? .9 : 0, 3); estado.batalha = batalha; }
          if (lento !== estado.lento) { mundo.frequency.rampTo(lento ? 650 : 16000, .8); coracao.gain.rampTo(lento ? .9 : 0, .6); estado.lento = lento; }
        },
        get ligado() { return ligado; }
      };
    })();
    Trilha.preparar();
    let dentroDaLuta = false, ultimoT = 0, ligandoSom = false;
    const emBatalha = (t) => dentroDaLuta && t < 113.55 && !(t > MEMORIA.entra && t < MEMORIA.fora) && !(t > MEMORIA2.entra && t < MEMORIA2.fora) && !(t > MEMORIA3.entra && t < MEMORIA3.fora) && !(t > RACHA - .05 && t < 93.35);
    const atualizarTrilha = () => Trilha.cena(emBatalha(ultimoT), dentroDaLuta && lentidao(ultimoT) > .5);
    const GESTOS = ["pointerdown", "keydown", "touchend"];
    async function ligarSom() {
      if (Trilha.ligado || ligandoSom) return;
      ligandoSom = true;
      try {
        if ((await Trilha.alternar()) === null) esperarGesto();
        else atualizarTrilha();
      } catch (erro) { console.warn("pomo: o som não pôde começar", erro); }
      ligandoSom = false;
    }
    function esperarGesto() {
      const tentar = () => { GESTOS.forEach((ev) => removeEventListener(ev, tentar, true)); ligarSom(); };
      GESTOS.forEach((ev) => addEventListener(ev, tentar, true));
    }
    if (window.ScrollTrigger) ScrollTrigger.create({ trigger: "#luta", start: "top 60%", onEnter: () => { dentroDaLuta = true; atualizarTrilha(); }, onLeaveBack: () => { dentroDaLuta = false; atualizarTrilha(); } });
    const FONTES_SOM = [...SONS, ...[...SONS_II, ...SONS_III, ...SONS_IV, ...SONS_V].map(([t, n]) => [t, [n]]), ...VENTOS_IV.map((t) => [t, ["vento"]])].sort((a, b) => a[0] - b[0]);
    const VIBRACOES = { baque: 60, metal: 35, metal2: 35, metalForte: [70, 30, 110], corte: 45, gota: 15, onda: [80, 40, 160], eletrico: [30, 20, 30, 20, 30], soco: 45, bloqueio: 20, desaba: [120, 60, 200], encontro: [200, 80, 400] };
    let tSom = null;
    const quadroAjustes = quadro;
    quadro = (t) => {
      const agora = performance.now();
      if (tVelocidade !== null) { const dt = (agora - msVelocidade) / 1000; if (dt > 0 && dt < .25) velocidade += (Math.abs(t - tVelocidade) / dt - velocidade) * .25; else velocidade = 0; }
      tVelocidade = t; msVelocidade = agora;
      quadroAjustes(t);
      if (Trilha.ligado && tSom !== null && t > tSom && !saltando) {
        FONTES_SOM.forEach(([te, nomes]) => {
          if (tSom >= te || t < te) return;
          nomes.forEach((n) => Trilha.tocar(n));
          const v = te === GOLPE ? [90, 40, 180] : nomes.reduce((m, n) => m || VIBRACOES[n] || 0, 0);
          if (v && navigator.vibrate) navigator.vibrate(v);
        });
      }
      tSom = t; ultimoT = t;
      atualizarTrilha();
    };

    const lutadorBase = lutador;
    lutador = (quem, S, t, luzes) => {
      const [hx, hy] = proj(...quadril(S)), r = escala() * K * 200;
      if (hx < -r || hx > W + r || hy < -r || hy > H + r) return;
      lutadorBase(quem, S, t, luzes);
    };
    const nuvensBase = nuvens;
    nuvens = (luzes, perto) => { if (perto && tempoQuadro > 115.5) return; nuvensBase(luzes, perto); };
    EMISSORES.forEach((e) => { if (e.semente === 805) { e.n = 8; e.tam = .9; } if (e.tipo === "ouro") e.n = Math.round(e.n * .55); });
    function ondaDePedra(t) {
      if (t < ONDA.t0) return;
      const xf = frenteOnda(t), s = escala();
      BLOCOS.forEach((b) => {
        const d = xf - b.x; if (d > .9) return;
        const h = d > 0 ? Math.exp(-Math.pow(d / .5, 2)) * .9 : .28 + .72 * Math.exp(d / 1.1), sk = s * kz(b.z), [bx, by] = noChao(b.x, b.z);
        const alto = b.alto * h * sk * (b.x < ONDA.x1 + .5 && d <= 0 ? 1.35 : 1), larg = b.larg * sk;
        if (bx + larg < 0 || bx - larg > W || by - alto > H || by < 0) return;
        const treme = ruido(t * 9 + b.x * 5) * .05 * Math.max(0, 1 - Math.abs(d) * 2), inc = -(b.inc + .3) * h + treme;
        ctx.fillStyle = "rgba(8,10,12,.6)"; ctx.beginPath(); ctx.ellipse(bx, by + 1, larg * .75, Math.max(1.5, larg * .75 * passoZ(b.z) / sk), 0, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.translate(bx, by); ctx.rotate(inc);
        const topoD = -alto * (1 + b.perfil), g = ctx.createLinearGradient(-larg / 2, -alto, larg / 2, 0);
        g.addColorStop(0, "#8C9397"); g.addColorStop(1, "#383E42");
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-larg / 2, 2); ctx.lineTo(-larg * .42, -alto); ctx.lineTo(larg * .38, topoD); ctx.lineTo(larg / 2, 2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(176,184,190,.35)"; ctx.beginPath(); ctx.moveTo(-larg * .42, -alto); ctx.lineTo(-larg * .3, -alto - larg * .2); ctx.lineTo(larg * .5, topoD - larg * .2); ctx.lineTo(larg * .38, topoD); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(10,12,14,.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-larg * .1, -alto * .2); ctx.lineTo(larg * .05, -alto * .6); ctx.lineTo(-larg * .05, -alto * .85); ctx.stroke();
        ctx.restore();
      });
    }

    const EN = new Map([
      ["Eu me lembro de quando o Olimpo ainda era inteiro.", "I remember when Olympus was still whole."],
      ["Havia névoa, mármore e um silêncio que parecia eterno.", "There was mist, marble, and a silence that seemed eternal."],
      ["role devagar", "scroll slowly"],
      ["Zeus, o que ajunta as nuvens", "Zeus, the cloud-gatherer"],
      ["Poseidon, o que abala a terra", "Poseidon, the earth-shaker"],
      ["Nenhuma arma podia derrubá-los.", "No weapon could bring them down."],
      ["Mas toda muralha tem uma fresta.", "But every wall has a crack."],
      ["Vou te mostrar como começou.", "Let me show you how it began."],
      ["Antes de serem reis, foram irmãos.", "Before they were kings, they were brothers."],
      ["Dividiram o mundo por sorteio: o céu, o mar e o submundo.", "They divided the world by lot: the sky, the sea, and the underworld."],
      ["Uma vez, Poseidon ajudou a acorrentar o irmão. Zeus perdoou, mas não esqueceu.", "Once, Poseidon helped put his brother in chains. Zeus forgave, but did not forget."],
      ["A Poseidon, disseram que o sorteio tinha sido armado.", "Poseidon was told the lots had been rigged."],
      ["A Zeus, que o irmão queria o trono outra vez.", "Zeus was told his brother wanted the throne again."],
      ["Uma palavra no ouvido certo pesa mais que um raio.", "A word in the right ear weighs more than a thunderbolt."],
      ["Um desceu do céu. O outro subiu do mar.", "One came down from the sky. The other rose from the sea."],
      ["Por onde passavam, eram os mortais que pagavam.", "Wherever they passed, it was the mortals who paid."],
      ["No alto do Olimpo, os dois se olharam em silêncio.", "High on Olympus, the two looked at each other in silence."],
      ["Por um instante, quase lembraram.", "For a moment, they almost remembered."],
      ["Estátua de mármore de Zeus, com cabelo e barba de nuvens, segurando um raio pronto para o arremesso", "Marble statue of Zeus, with hair and beard of clouds, holding a thunderbolt ready to throw"],
      ["Estátua de mármore de Poseidon, com cabelo e barba de ondas, segurando o tridente pronto para o arremesso", "Marble statue of Poseidon, with hair and beard of waves, holding his trident ready to throw"],
      ["Depois do primeiro golpe, não houve mais volta.", "After the first blow, there was no turning back."],
      ["Levantaram-se de novo. Deuses sempre se levantam.", "They rose again. Gods always rise."],
      ["Foi a primeira vez que um irmão fez o outro sangrar.", "It was the first time one brother made the other bleed."],
      ["Zeus se lembrou do escuro dentro do pai.", "Zeus remembered the dark inside their father."],
      ["E da mão do irmão, segurando a sua.", "And his brother's hand, holding his."],
      ["Lembrar doeu mais do que a ferida.", "Remembering hurt more than the wound."],
      ["Poseidon chamou o mar até o topo do mundo.", "Poseidon called the sea to the top of the world."],
      ["O raio entrou na água, e a água não escolheu quem ferir.", "The lightning entered the water, and the water did not choose whom to hurt."],
      ["As armas nasceram do mesmo fogo.", "The weapons were born of the same fire."],
      ["Foram feitas para lutar lado a lado.", "They were made to fight side by side."],
      ["Nunca uma contra a outra.", "Never against each other."],
      ["Restavam as armas. Depois, nem elas.", "They still had their weapons. Then, not even those."],
      ["Lutaram com as mãos, como lutam os homens.", "They fought with their hands, the way men fight."],
      ["O templo que ergueram juntos caiu sobre os dois.", "The temple they had raised together fell on them both."],
      ["Juraram pelo Estige nunca se separar.", "They swore by the Styx never to be parted."],
      ["Nem um deus quebra esse juramento.", "Not even a god breaks that oath."],
      ["Mas um juramento não resiste a um sussurro.", "But no oath survives a whisper."],
      ["Cada um ergueu o que sobrou.", "Each raised what was left."],
      ["E lembraram de tudo, ao mesmo tempo.", "And they remembered everything, all at once."],
      ["Quando a luz se foi, não havia vencedor.", "When the light was gone, there was no victor."],
      ["Eu não criei esse ódio.", "I did not create this hatred."],
      ["Só o acordei.", "I only woke it."],
      ["Deuses não morrem.", "Gods do not die."],
      ["Eles lembram.", "They remember."],
      ["Os irmãos se levantam devagar sob a chuva, no chão molhado do templo. Zeus chama um raio que Poseidon apara com o tridente, e por um instante o tempo quase para. Poseidon crava o tridente e o chão se ergue numa onda de pedra que corre até Zeus e o arremessa contra uma coluna, que se parte e desaba em pedaços. Zeus ergue os braços e a tempestade inteira gira sobre o Olimpo; um raio gigante desce devagar, rasgando o céu, acerta o tridente do irmão e lança Poseidon longe.",
        "The brothers rise slowly in the rain, on the wet floor of the temple. Zeus calls down a bolt that Poseidon parries with his trident, and for a moment time almost stops. Poseidon drives his trident into the ground and the floor rises in a wave of stone that runs to Zeus and hurls him against a column, which breaks and falls apart. Zeus raises his arms and the whole storm turns above Olympus; a giant bolt descends slowly, tearing through the sky, strikes his brother's trident and throws Poseidon far away."],
      ["Os dois se levantam outra vez. Um raio cai na mão de Zeus e vira o keraunós, o raio de duas pontas dos vasos gregos. Os irmãos correm um contra o outro e as armas batem de frente. Poseidon dá duas estocadas que Zeus apara, gira o tridente e passa uma rasteira; Zeus salta num mortal e desce com o raio sobre o tridente erguido, e Poseidon afunda com o peso antes de empurrá-lo de volta. Depois de uma troca rápida de golpes, os dois travam as armas cara a cara, até Poseidon torcer a trava e cortar o braço de Zeus. O sangue dos deuses, prateado, se espalha em câmera lenta, e uma única gota leva Zeus para dentro de uma memória pintada como num vaso antigo, em figuras negras sobre argila: ele estende a mão para o escuro da boca de Cronos, e a mão do irmão segura a sua; Zeus puxa Poseidon para fora, e os dois ficam de mãos dadas diante do pai. A memória se fecha de volta na gota, que cai no chão. Zeus cai de joelhos e Poseidon baixa o tridente. Um brilho dourado passa perto do ouvido de Zeus, e ele se ergue com o raio brilhando mais forte.",
        "The two rise once more. A bolt falls into Zeus's hand and becomes the keraunos, the two-pointed thunderbolt of Greek vases. The brothers run at each other and their weapons collide head-on. Poseidon thrusts twice and Zeus parries, then Poseidon spins his trident and sweeps low; Zeus leaps into a flip and brings the bolt down on the raised trident, and Poseidon sinks under the weight before pushing him back. After a quick exchange of blows, they lock weapons face to face, until Poseidon twists free and cuts Zeus's arm. The blood of the gods, silver, spreads in slow motion, and a single drop carries Zeus into a memory painted like an ancient vase, in black figures on clay: he reaches into the darkness of Cronus's mouth, and his brother's hand takes his; Zeus pulls Poseidon out, and the two stand hand in hand before their father. The memory closes back into the drop, which falls to the ground. Zeus drops to his knees and Poseidon lowers his trident. A golden glint passes near Zeus's ear, and he rises with the bolt shining brighter."],
      ["Poseidon ergue o tridente, e o mar sobe pelo abismo até o topo do Olimpo: uma onda maior que o céu se curva sobre o templo e desaba. A água invade tudo e arrasta Zeus, mas se abre em volta de Poseidon, que atravessa a inundação devagar. Zeus crava o raio na água, e a eletricidade corre por toda a superfície e sobe pelos corpos dos dois irmãos ao mesmo tempo. As faíscas viram as faíscas de uma forja, pintada como num vaso: um Ciclope de um olho só martela sobre a bigorna, e os jovens Zeus e Poseidon pegam ali o raio e o tridente e os erguem juntos, cruzados no alto. De volta ao templo, a água escorre para o abismo, e os dois ficam de joelhos, com as armas rachadas e fumegando.",
        "Poseidon raises his trident, and the sea climbs the abyss to the top of Olympus: a wave taller than the sky curls over the temple and crashes down. The water floods everything and drags Zeus away, but parts around Poseidon, who walks slowly through the flood. Zeus drives his bolt into the water, and the electricity runs across the whole surface and up both brothers' bodies at once. The sparks become the sparks of a forge, painted like a vase: a one-eyed Cyclops hammers on the anvil, and the young Zeus and Poseidon take the bolt and the trident there and raise them together, crossed overhead. Back in the temple, the water drains into the abyss, and the two kneel, their weapons cracked and smoking."],
      ["As duas armas rachadas se encontram uma última vez e param. A luz escapa pelas rachaduras, as pontas se soltam e caem devagar, e por um instante aparece acima deles a lembrança dos dois meninos erguendo as armas na forja. Os irmãos soltam o que restou e abaixam a cabeça, até o luto virar raiva e os punhos subirem. Zeus solta um jab que Poseidon bloqueia e uma direta que acerta o rosto; Poseidon responde com um golpe no estômago e um gancho no queixo; Zeus tenta um soco enorme que passa por cima da cabeça do irmão. Eles se agarram, testa contra testa, até Poseidon erguer Zeus e jogá-lo contra o chão. O templo treme, o frontão com o relevo dos dois irmãos racha e desaba, e Poseidon se joga sobre Zeus para protegê-lo com o próprio corpo. Na poeira surge outra pintura de vaso, com os nomes escritos acima das figuras: os dois, jovens, ajoelhados frente a frente sobre o rio Estige, de mãos dadas, jurando nunca se separar. Quando a poeira assenta, Poseidon ainda cobre o irmão. Um brilho dourado passa perto do ouvido dele, e os dois se levantam e pegam do chão os pedaços das armas.",
        "The two cracked weapons meet one last time and stop. Light escapes through the cracks, the heads come loose and fall slowly, and for a moment the memory of two boys raising their weapons at the forge appears above them. The brothers let go of what is left and bow their heads, until grief turns to rage and their fists come up. Zeus throws a jab that Poseidon blocks and a cross that lands on his face; Poseidon answers with a blow to the stomach and an uppercut to the jaw; Zeus swings a huge punch that passes over his brother's head. They grapple, forehead to forehead, until Poseidon lifts Zeus and slams him to the ground. The temple shakes, the pediment carved with the two brothers cracks and collapses, and Poseidon throws himself over Zeus to shield him with his own body. In the dust another vase painting appears, with the names written above the figures: the two of them, young, kneeling face to face over the river Styx, hand in hand, swearing never to be parted. When the dust settles, Poseidon is still covering his brother. A golden glint passes near his ear, and the two rise and pick up the pieces of their weapons."],
      ["Os dois se afastam, erguem o que restou das armas e correm um contra o outro em câmera lenta. No caminho, lampejos das memórias: a mão do irmão saindo do escuro, as armas erguidas juntas na forja, o juramento sobre o Estige. As duas metades se encontram e a luz engole tudo. Quando o branco se desfaz, a chuva parou, o templo é ruína e os dois irmãos estão caídos, longe um do outro. Então uma maçã de ouro rola devagar pelo chão e para entre os dois, com uma inscrição em grego: à mais bela. Fios dourados sobem da maçã até o ouvido de cada irmão, e a voz que contou toda a história se revela, em dourado: era Éris, a deusa da discórdia. Os dois ainda respiram. A partir daqui, quem voltar pela luta encontra Éris sussurrando em cada cena.",
        "The two step apart, raise what is left of their weapons and run at each other in slow motion. On the way, flashes of memory: his brother's hand coming out of the dark, the weapons raised together at the forge, the oath over the Styx. The two halves meet and the light swallows everything. When the white fades, the rain has stopped, the temple is a ruin and the two brothers lie fallen, far from each other. Then a golden apple rolls slowly across the floor and stops between them, with an inscription in Greek: to the fairest. Golden threads rise from the apple to each brother's ear, and the voice that told the whole story reveals itself, in gold: it was Eris, the goddess of discord. The two are still breathing. From here on, whoever goes back through the fight will find Eris whispering in every scene."]
    ]);
    const PT_DE = new Map([...EN].map(([pt, en]) => [en, pt]));
    const ROTULOS_EN = new Map([
      ["Prólogo", "Prologue"], ["Os irmãos", "The brothers"], ["O passado", "The past"], ["A travessia", "The crossing"], ["A luta", "The fight"],
      ["Friso do vaso. Role para os lados para ver as cenas.", "The vase frieze. Scroll sideways to see the scenes."],
      ["Friso em figuras negras: os três irmãos lutam juntos contra um Titã; tiram a sorte dos reinos num elmo; Poseidon, Hera e Atena acorrentam Zeus; e uma voz que não aparece sussurra no ouvido de Poseidon e de Zeus.",
        "A black-figure frieze: the three brothers fight together against a Titan; they draw lots for their realms from a helmet; Poseidon, Hera and Athena put Zeus in chains; and an unseen voice whispers in the ears of Poseidon and Zeus."]
    ]);
    const CREDITO = `<a href="https://github.com/KaykeSiquara" target="_blank" rel="noopener">Kayke Siquara</a>`;
    const FIM_PT = `<h2 class="pomo-titulo">pomo</h2><p class="pomo-verbete"><em>pomo</em>: fruto, maçã. O pomo da discórdia é a maçã de ouro que Éris, deusa da discórdia, lançou entre os deuses.</p><p class="pomo-nota">Ela esteve em cada cena.</p><button type="button" class="pomo-rever" data-rever>procurá-la na luta</button><p class="pomo-credito">Design e código: ${CREDITO}</p>`;
    const FIM_EN = `<h2 class="pomo-titulo">pomo</h2><p class="pomo-verbete"><em lang="pt-BR">pomo</em>, in Portuguese: fruit, apple. The <em lang="pt-BR">pomo da discórdia</em>, the apple of discord, is the golden apple that Eris, goddess of discord, threw among the gods.</p><p class="pomo-nota">She was in every scene.</p><button type="button" class="pomo-rever" data-rever>find her in the fight</button><p class="pomo-credito">Design and code: ${CREDITO}</p>`;
    const estiloRever = document.createElement("style");
    estiloRever.textContent = `
      .pomo-rever{margin-top:.6rem;padding:.85rem 1.4rem;font-family:"Gentium Book Plus",Georgia,serif;font-style:italic;font-size:1.05rem;line-height:1;color:#EFEEE9;background:#24282B;border:0;border-radius:999px;cursor:pointer}
      .pomo-rever:focus-visible{outline:2px solid #24282B;outline-offset:3px}
      .pomo-credito a{color:inherit;text-underline-offset:3px;text-decoration-thickness:1px}
      .veu-rever{position:fixed;inset:0;z-index:55;background:#C9CED0;opacity:0;pointer-events:none;transition:opacity .6s ease}
      .veu-rever--ativo{opacity:1}
      #luta:focus{outline:none}
    `;
    document.head.appendChild(estiloRever);
    const veuRever = document.createElement("div");
    veuRever.className = "veu-rever"; veuRever.setAttribute("aria-hidden", "true"); document.body.appendChild(veuRever);
    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-rever]")) return;
      const luta = $("#luta"), st = window.ScrollTrigger ? ScrollTrigger.getAll().find((s) => s.trigger === luta && s.pin) : null;
      const ir = () => {
        scrollTo(0, st ? st.start + 1 : luta.getBoundingClientRect().top + scrollY);
        if (st) { ScrollTrigger.update(); const tw = st.getTween && st.getTween(); if (tw) tw.progress(1); }
        luta.setAttribute("tabindex", "-1"); luta.focus({ preventScroll: true });
        veuRever.classList.remove("veu-rever--ativo");
      };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) { ir(); return; }
      veuRever.classList.add("veu-rever--ativo"); setTimeout(ir, 650);
    });
    let idioma = "pt";
    const tituloRevelado = () => (idioma === "en" ? "the apple of discord" : "o pomo da discórdia");
    const trocaIdioma = document.createElement("button");
    trocaIdioma.type = "button"; trocaIdioma.className = "troca-idioma";
    function aplicarIdioma(novo) {
      idioma = novo;
      const en = novo === "en";
      document.documentElement.lang = en ? "en" : "pt-BR";
      document.querySelectorAll(".fala-luta, .so-leitor, .fala, .epiteto, .dica, svg title, .quadros figcaption p").forEach((el) => {
        const atual = el.textContent.trim(), pt = el.getAttribute("data-pt") || (EN.has(atual) ? atual : PT_DE.get(atual));
        if (!pt) { if (en) el.setAttribute("lang", "pt-BR"); else el.removeAttribute("lang"); return; }
        el.setAttribute("data-pt", pt); el.removeAttribute("lang");
        const alvo = en ? EN.get(pt) : pt;
        if (atual !== alvo) el.textContent = alvo;
      });
      document.querySelectorAll("[aria-label]").forEach((el) => {
        const pt = el.getAttribute("data-rotulo-pt") || el.getAttribute("aria-label");
        if (!ROTULOS_EN.has(pt)) return;
        el.setAttribute("data-rotulo-pt", pt); el.setAttribute("aria-label", en ? ROTULOS_EN.get(pt) : pt);
      });
      const fim = $(".fim"); if (fim) { fim.setAttribute("aria-label", en ? "The end" : "Fim"); fim.innerHTML = en ? FIM_EN : FIM_PT; }
      trocaIdioma.textContent = en ? "PT" : "EN";
      trocaIdioma.setAttribute("lang", en ? "pt-BR" : "en");
      trocaIdioma.setAttribute("aria-label", en ? "Ler em português" : "Read in English");
      if (eris) document.title = tituloRevelado();
    }
    document.addEventListener("visibilitychange", () => {
      if (idioma !== "en") return;
      if (document.hidden && document.title === "eles continuam lutando") document.title = "they keep fighting";
      else if (!document.hidden && document.title === "they keep fighting") document.title = tituloGuardado;
    });
    const estiloIdioma = document.createElement("style");
    estiloIdioma.textContent = `
      .idioma{position:fixed;inset:0;z-index:60;display:grid;place-content:center;justify-items:center;gap:1.2rem;padding:8vh 6vw;text-align:center;background:var(--nevoa,#C9CED0);color:var(--carvao,#24282B);font-family:"Gentium Book Plus",Georgia,serif}
      .idioma__nome{margin:0;font-style:italic;font-size:clamp(2.6rem,1.8rem + 3vw,4.2rem)}
      .idioma__convite{margin:0;font-size:1.05rem;line-height:1.5}
      .idioma__opcoes{display:flex;flex-wrap:wrap;justify-content:center;gap:.8rem;margin-top:.6rem}
      .idioma__opcoes button,.troca-idioma{font-family:"Gentium Book Plus",Georgia,serif;font-style:italic;line-height:1;color:#EFEEE9;border:0;border-radius:999px;cursor:pointer}
      .idioma__opcoes button{min-width:9.5rem;padding:.85rem 1.4rem;font-size:1.05rem;background:#24282B}
      .idioma__opcoes button:focus-visible{outline:2px solid #24282B;outline-offset:3px}
      .idioma__som{display:inline-flex;align-items:center;gap:.6rem;padding:.5rem 1.05rem .5rem .75rem;font-family:"Gentium Book Plus",Georgia,serif;font-style:italic;font-size:.95rem;line-height:1;color:#24282B;background:transparent;border:0;border-radius:999px;box-shadow:inset 0 0 0 1px rgba(36,40,43,.45);cursor:pointer}
      .idioma__som:hover{background:rgba(36,40,43,.07)}
      .idioma__som:focus-visible{outline:2px solid #24282B;outline-offset:3px}
      .idioma__icone{width:1.4rem;height:1.4rem;flex:none}
      .idioma__som[aria-checked="true"] .idioma__mudo,.idioma__som[aria-checked="false"] .idioma__ondas{display:none}
      .idioma__aviso{margin:0;font-size:.85rem;color:#4F5659}
      .troca-idioma{position:fixed;top:.9rem;right:1rem;z-index:36;padding:.5rem .8rem;font-size:.8rem;letter-spacing:.06em;background:rgba(24,27,30,.86)}
      .troca-idioma:focus-visible{outline:2px solid #EFEEE9;outline-offset:3px}
      .idioma--saindo{opacity:0;transition:opacity .6s ease}
      @media (prefers-reduced-motion:reduce){.idioma--saindo{transition:none}}
    `;
    document.head.appendChild(estiloIdioma);
    trocaIdioma.addEventListener("click", () => aplicarIdioma(idioma === "en" ? "pt" : "en"));

    const idiomaPedido = (new URLSearchParams(location.search).get("lang") || location.hash.slice(1)).toLowerCase();
    const sugerido = idiomaPedido === "en" || idiomaPedido === "pt" ? idiomaPedido : (navigator.language || "").toLowerCase().startsWith("pt") ? "pt" : "en";
    const ICONE_SOM = `<svg class="idioma__icone" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.2h3.6L12.5 5v14l-4.9-4.2H4z" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path class="idioma__ondas" d="M15.6 9.4a3.6 3.6 0 0 1 0 5.2M18.3 6.8a7.3 7.3 0 0 1 0 10.4"/><path class="idioma__mudo" d="M16 9.5l5 5M21 9.5l-5 5"/></g></svg>`;
    const sobreposicao = document.createElement("div");
    sobreposicao.className = "idioma";
    sobreposicao.setAttribute("role", "dialog"); sobreposicao.setAttribute("aria-modal", "true"); sobreposicao.setAttribute("aria-labelledby", "idioma-nome");
    sobreposicao.innerHTML = `<p class="idioma__nome" id="idioma-nome">pomo</p><p class="idioma__convite"><span lang="pt-BR">Escolha o idioma</span> · <span lang="en">Choose your language</span></p><div class="idioma__opcoes"><button type="button" data-idioma="pt" lang="pt-BR">Português</button><button type="button" data-idioma="en" lang="en">English</button></div><button type="button" class="idioma__som" role="switch" aria-checked="true">${ICONE_SOM}<span lang="pt-BR">som</span>&nbsp;·&nbsp;<span lang="en">sound</span></button><p class="idioma__aviso"><span lang="pt-BR">Contém clarões de luz.</span> · <span lang="en">Contains flashing lights.</span></p>`;
    document.documentElement.style.overflow = "hidden";
    document.body.appendChild(sobreposicao);
    const somAbertura = sobreposicao.querySelector(".idioma__som");
    somAbertura.addEventListener("click", () => somAbertura.setAttribute("aria-checked", String(somAbertura.getAttribute("aria-checked") !== "true")));
    const escolher = (novo) => {
      aplicarIdioma(novo);
      if (somAbertura.getAttribute("aria-checked") === "true") ligarSom();
      document.documentElement.style.overflow = "";
      document.body.appendChild(trocaIdioma);
      sobreposicao.classList.add("idioma--saindo");
      setTimeout(() => sobreposicao.remove(), matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650);
    };
    sobreposicao.addEventListener("click", (e) => { const b = e.target.closest("[data-idioma]"); if (b) escolher(b.dataset.idioma); });
    sobreposicao.addEventListener("keydown", (e) => {
      if (e.key === "Escape") escolher(sugerido);
      if (e.key === "Tab") { const bs = [...sobreposicao.querySelectorAll("button")], i = bs.indexOf(document.activeElement); e.preventDefault(); bs[(i + (e.shiftKey ? -1 : 1) + bs.length) % bs.length].focus(); }
    });
    sobreposicao.querySelector(`[data-idioma="${sugerido}"]`).focus();

    const fala = $(".fala-luta"), faixas = [$(".faixa--cima"), $(".faixa--baixo")], marcaEl = $(".marca");
    let tAnterior = 0, tQuadroAnterior = null, saltando = false;
    function quadro(t) {
      saltando = tQuadroAnterior !== null && Math.abs(t - tQuadroAnterior) > 1.4;
      tQuadroAnterior = t;
      desenhar(t);
      const nevoa = 1 - clamp(t / .9);
      if (nevoa > 0) { ctx.fillStyle = `rgba(201,206,208,${nevoa.toFixed(3)})`; ctx.fillRect(0, 0, W, H); }
      fala.style.opacity = janela(t, .9, 1.5, 3.4, 4.3).toFixed(3);
      const barra = Math.max(janela(t, -1, 0, 3.6, 5), lentidao(t)) * 9;
      faixas.forEach((f) => (f.style.height = barra.toFixed(2) + "vh"));
      const tombo = suave(clamp((t - GOLPE) / .08));
      marcaEl.style.transform = `translateY(${(tombo * 8).toFixed(1)}px) rotate(${(-9 * tombo).toFixed(2)}deg)`;
      if ((tAnterior < GOLPE) !== (t < GOLPE)) { document.title = t >= GOLPE ? "po╱mo" : "pomo"; favicon(t >= GOLPE); }
      tAnterior = t;
    }

    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido || !window.gsap || !window.ScrollTrigger) {
      document.documentElement.classList.add("estatico");
      const caixa = $(".quadros");
      quadrosEstaticos(caixa);
      return;
    }
    const relogio = { t: 0 };
    let pedido = false;
    const pedir = () => { if (!pedido) { pedido = true; requestAnimationFrame(() => { pedido = false; quadro(relogio.t); }); } };
    const tl = gsap.timeline({ paused: true });
    TRECHOS.forEach(([tFim, telas]) => tl.to(relogio, { t: tFim, duration: telas, ease: "none", onUpdate: pedir }));
    ScrollTrigger.create({
      trigger: "#luta", start: "top top", end: () => "+=" + Math.round(tl.duration() * innerHeight), pin: true, scrub: 1, animation: tl, invalidateOnRefresh: true,
      onToggle: (s) => { marcaEl.style.color = s.isActive ? "#EFEEE9" : ""; }
    });
    const redimensionar = () => { ajustar(cv); quadro(relogio.t); };
    addEventListener("resize", redimensionar);
    redimensionar();
  })();

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
