# TRAXUS // FIELD OP: ACTIVE

Site experiencial com estética de terminal militar/industrial: uma sequência de boot, seções que trocam como páginas de um dossiê e uma cena 3D em tempo real com pós-processamento de glitch, scanline e aberração cromática.

![React](https://img.shields.io/badge/React-19-20232a?style=flat-square&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?style=flat-square&logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-motion-0ae448?style=flat-square&logo=greensock&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

---

## Destaques

- **Boot sequence** — a interface só "liga" depois de uma tela de inicialização; o conteúdo é montado em seguida.
- **Cena 3D procedural** — objeto industrial modelado só com geometria (toros, cilindros, caixas), com inclinação por parallax do mouse. Sem GLB.
- **Particle Construct** — partículas percorrem curvas de Bézier cúbicas e constroem progressivamente a silhueta do objeto, como `THREE.Points` dentro do mesmo pipeline de pós-processamento.
- **Pós-processamento em dois modos** — glitch, chromatic aberration, scanline, noise e vignette, com intensidade maior na seção do construct.
- **Camadas de ruído globais** — dados flutuantes, barras diagonais, varredura de scan, objetos-flash e dropouts de ruído disparados em intervalos aleatórios.
- **Navegação por "páginas"** — `PageStack` + `PageSwap` trocam seções com slab de carregamento e marcador de capítulo em tela cheia.

## Seções

`Boot` → `Hero` → `Manifesto` → `Particle Construct` → `Identity Flash` → `Data Specs` → `Terminal` → `Sector Map` → `Mission Log` → `Contact` → `End Transmission`

## Estrutura

```
src/
├── components/
│   ├── canvas/     # Scene, Model, ParticleConstruct, Lights, Effects (R3F)
│   ├── sections/   # uma seção por arquivo, na ordem acima
│   └── ui/         # camadas globais: StatusBar, Ticker, ScanSweep, PageSwap…
├── hooks/          # useFlashSequence, useScrollTransitions, useScrollParallax…
├── utils/          # timing centralizado e geração de "data gibberish"
└── styles/
```

## Rodar localmente

```bash
npm install
npm run dev       # http://127.0.0.1:5173
npm run build     # type-check + build de produção
npm run preview
```

## Stack

React 19 · TypeScript · Vite · Three.js · React Three Fiber · Drei · @react-three/postprocessing · GSAP · Motion · Leva

---

Feito por [João Rabelo](https://github.com/jrabeloneto).
