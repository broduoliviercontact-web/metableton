export const sections = [
  {
    id: "blog-news",
    slug: "blog-news",
    title: "Blog / News",
    intro:
      "Articles, réflexions, découvertes et actualités autour d’Ableton Live, de la production musicale et du live.",
  },
  {
    id: "guides-ableton-live",
    slug: "guides-ableton-live",
    title: "Guides Ableton Live",
    intro:
      "Des guides clairs et concrets pour mieux comprendre Ableton Live, améliorer ton workflow et produire plus efficacement.",
  },
  {
    id: "max-for-live",
    slug: "max-for-live",
    title: "Max for Live",
    intro:
      "Une sélection de devices, d’idées et de ressources pour explorer Max for Live, enrichir ton workflow et ouvrir de nouvelles possibilités dans Ableton Live.",
  },
  {
    id: "freebies",
    slug: "freebies",
    title: "Freebies",
    intro:
      "Des ressources gratuites pour produire, jouer et gagner du temps dans Ableton Live : racks, templates, presets et outils pratiques.",
  },
];

const articles = [
  {
  "id": "meld",
  "slug": "meld",
  featured: true,
  "section": "guides-ableton-live",
  "type": "Guide",
  "label": "Guide",
  "title": "MELD Le synthétiseur couteau suisse",
  "summary": "Meld Le synthétiseur boite à outils",
  "heroImage": "/articles/guides-ableton/Meld-main.jpg",
  "thumbnail": "/articles/guides-ableton/Meld-main.jpg",
  "imageAlt": "Visuel d’article pour Ableton Live",
  "tags": [
    "device",
    "meld",
    "synthétiseur"
  ],
  "content": [
    {
      "type": "paragraph",
      "content": "Quand Ableton a sorti Meld, j’ai tout de suite eu l’impression qu’ils n’avaient pas simplement ajouté “un synthé de plus” à Live.\nMeld, c’est plutôt un instrument qui condense plusieurs philosophies de synthèse dans une interface très musicale : formes de base, empilements d’oscillateurs, FM, waveshaping, oscillateurs percussifs, textures bruitées… Le tout dans un deux moteurs séparé."
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/meld-osc.jpg",
      "alt": "/articles/guides-ableton/Meld-main.jpg",
      "caption": "meld oascillator"
    }
  ]
},
{
  "id": "tous-les-oscillateurs-du-meld",
  "slug": "tous-les-oscillateurs-du-meld",
  "section": "guides-ableton-live",
  "type": "Guide",
  "label": "Guide",
  "title": "Tous les Oscillateurs du MELD",
  "summary": "",
  "heroImage": "/articles/guides-ableton/Meld-main.jpg",
  "heroImagePosition": "58% 50%",
  "thumbnail": "/articles/guides-ableton/Meld-main.jpg",
  "thumbnailPosition": "50% 50%",
  "imageAlt": "Visuel d’article pour Ableton Live",
  "tags": [
    "device",
    "meld",
    "synthétiseur"
  ],
  "content": [
    {
      "type": "paragraph",
      "content": "Depuis la version d'Ableton Live 12, nous avons un nouveau synthétiseur ; Le Meld. Tous les synthétiseur d'ableton sont des déclarations d'amour, des hommages à des synthétiseur, l’Opérator c’est le Yahama DX7, l’Electric c’est le fender Rhodes etc…\nA mon avis Meld c'est un clin d'œil à Emilie Gillet et ses deux merveilleux modules de synthétiseur modulaire ; [Braids](https://pichenettes.github.io/mutable-instruments-documentation/modules/braids/) et [plaits](https://pichenettes.github.io/mutable-instruments-documentation/modules/plaits/). C’est deux Oscillateur on la même logique, une dizaine de forme d’onde très bien pensée. Avec pour chaque oscillateur deux paramètre modulable différent par oscillateur.\nDans Meld c’est pareille 25 formes d’ondes les plus malines les une que les autres.\nDans cette articles on va voirs ensemble en détails chaque forme d’onde d’oscillateur."
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/ALL-OSC.png",
      "alt": "",
      "position": "0% 100%"
    },
    {
      "type": "heading",
      "content": "Dans cette articles on va voirs ensemble en détails chaque forme d’onde d’oscillateur"
    },
    {
      "type": "heading",
      "content": "OSC ∿⎍▲🪚",
      "align": "center"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/Basic shapes.png",
      "alt": "",
      "align": "center"
    },
    {
      "type": "list",
      "items": [
        "•Shape : change la forme d’onde",
        "•Tone : enrichisseur de forme d’onde"
      ]
    },
    {
      "type": "heading",
      "content": "2 OSC+DETUNE ∿⎍▲🪚"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/DualBasicShape.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Shape : change la forme d’onde",
        "•Detune : detune le 2eme osc"
      ]
    },
    {
      "type": "heading",
      "content": "⎍OSC⎍ SYNC"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/Square Sync.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Freq 1 : change freq. de l’osc carré 1",
        "•Freq 2 : change freq. de l’osc carré 2"
      ]
    },
    {
      "type": "heading",
      "content": "⎍OSC⎍ 5TH"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/Square 5th.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•5th Amt : ajoute l’osc en quinte",
        "•P. Width : pulse width modulation"
      ]
    },
    {
      "type": "heading",
      "content": "OSC ∿⎍▲🪚 \n+\nWAVESHAPER/NOISE"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/Noisy shapes.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Shape : change la forme d’onde",
        "•Rough : noise + waveshaper"
      ]
    },
    {
      "type": "heading",
      "content": "∿OSC∿ SUB"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/sub.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Tone : morphe entre sine et carré",
        "•Aux : ajoute osc subharmonic"
      ]
    },
    {
      "type": "heading",
      "content": "∿∿MULTIPLE OSC∿∿"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/swamesine.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Motion : random pitch modulation",
        "•Spacing : chord osc volume + chord osc invert"
      ]
    },
    {
      "type": "heading",
      "content": "▲▲MULTIPLE OSC▲▲"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/Swaretriangle.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Motion : random pitch modulation",
        "•Spacing : chord osc volume + chord osc invert"
      ]
    },
    {
      "type": "heading",
      "content": "🪚 🪚MULTIPLE OSC 🪚 🪚"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/swarmsaw.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Motion : random pitch modulation",
        "•Spacing : chord osc volume + chord osc invert"
      ]
    },
    {
      "type": "heading",
      "content": "⎍⎍MULTIPLE OSC⎍⎍"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/swarmesqaure.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Motion : random pitch modulation",
        "•Spacing : chord osc volume + chord osc invert"
      ]
    },
    {
      "type": "heading",
      "content": "∿HARMONIC FM OSC∿"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/harmonicfm.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "Amount : FM amount",
        "Ratio : FM ratio"
      ]
    },
    {
      "type": "heading",
      "content": "∿FM WAVESHAPER OSC∿"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/foldfm.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Amount : FM amount",
        "•Shape : wavefolder"
      ]
    },
    {
      "type": "heading",
      "content": "∿FM FEEDBACK OSC∿"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/Squelch.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Amount : FM amount",
        "•Feedback : feedback"
      ]
    },
    {
      "type": "heading",
      "content": "∿FM OSC∿"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/fm.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Amount : FM amount",
        "•Ratio : FM ratio"
      ]
    },
    {
      "type": "heading",
      "content": "⎍CHIPTUNE OSC⎍"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/chip.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Tone : pulse width modulation & pitch 2eme osc",
        "•Rate : pitch modulation rate"
      ]
    },
    {
      "type": "heading",
      "content": "∿SHEPARD TONE OSC∿"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/shepard.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•0 => 49 Shepard tone down",
        "•50 => no Shepard tone"
      ]
    },
    {
      "type": "heading",
      "content": "💣KICK OSC💣"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/tarp.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Decay : volume decay",
        "•Tone : pitch modulation amount"
      ]
    },
    {
      "type": "heading",
      "content": "🔥EXTRATONE OSC🔥"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/extra.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Pitch : pitch",
        "•Env Amt : envelope amount modulation"
      ]
    },
    {
      "type": "heading",
      "content": "⚠NOISE LOOP OSC⚠"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/noiseloop.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "Rate : rate noise modulation",
        "Fade : grain noise fade"
      ]
    },
    {
      "type": "heading",
      "content": "⚠NOISE FILTER OSC⚠"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/noisefiltre.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Freq : filter frequency",
        "•Narrow : filter bandwidth"
      ]
    },
    {
      "type": "heading",
      "content": "⚠DIGITAL NOISE OSC⚠"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/bitgrung.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "Freq : square osc frequency",
        "Mult : subharmonic multiple"
      ]
    },
    {
      "type": "heading",
      "content": "⚙CRACK OSC⚙"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/crackle.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Density : density of crack",
        "•Intensity : tone"
      ]
    },
    {
      "type": "heading",
      "content": "☂RAIN OSC☂"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/rain.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Tone : noise resonance",
        "•Rate : rain rate"
      ]
    },
    {
      "type": "heading",
      "content": "⊛BUBBLE OSC⊛"
    },
    {
      "type": "image",
      "src": "/articles/guides-ableton/MELD/bubble.png",
      "alt": "",
      "position": "50% 50%"
    },
    {
      "type": "list",
      "items": [
        "•Density : bubble generation",
        "•Spread : bubble size"
      ]
    }
  ]
},


  {
    id: "blog-produire-vite",
    slug: "pourquoi-ableton-live-pour-produire-vite",
    section: "blog-news",
    type: "Réflexion",
    label: "Ressource",
    title: "Pourquoi Ableton Live reste un des meilleurs outils pour produire vite",
    summary:
      "Une réflexion simple sur ce qui rend Ableton Live si efficace pour composer, tester et finir des idées rapidement.",
    heroImage: "/articles/blog-news/ableton-interface-closeup.jpg",
    thumbnail: "/articles/blog-news/ableton-interface-closeup.jpg",
    imageAlt: "Gros plan sur l’interface d’Ableton Live",
    tags: ["workflow", "composition", "ableton"],
    content: [
      {
        type: "paragraph",
        content:
          "Ableton Live reste un outil redoutablement rapide parce qu’il réduit la distance entre une idée et son premier résultat audible. Tout y favorise l’essai, la variation et l’itération.",
      },
      {
        type: "paragraph",
        content:
          "La Session View, les racks, les warps et les automatisations permettent d’avancer sans casser l’élan. On teste, on garde, on jette, puis on recommence avec très peu de friction.",
      },
      {
        type: "paragraph",
        content:
          "Cette vitesse ne sert pas seulement à commencer des morceaux. Elle aide surtout à prendre plus de décisions claires avant que l’idée ne se refroidisse.",
      },
    ],
  },
  {
    id: "blog-home-studio",
    slug: "home-studio-ce-qui-compte-vraiment",
    section: "blog-news",
    type: "Réflexion",
    label: "Ressource",
    title:
      "Home studio : ce qui compte vraiment quand on produit de la musique",
    summary:
      "Avant d’acheter du matériel, mieux vaut comprendre ce qui améliore réellement ton confort de travail et la qualité de tes sessions.",
    heroImage: "/articles/blog-news/home-studio-ableton.jpg",
    thumbnail: "/articles/blog-news/home-studio-ableton.jpg",
    imageAlt: "Home studio avec Ableton Live ouvert sur l’écran principal",
    tags: ["studio", "workflow", "production"],
    content: [
      {
        type: "paragraph",
        content:
          "Le home studio idéal n’est pas forcément celui qui accumule le plus de matériel. C’est d’abord un espace où l’on peut travailler longtemps, clairement et sans friction inutile.",
      },
      {
        type: "paragraph",
        content:
          "Une écoute stable, un bureau confortable, une bonne organisation des fichiers et une routine simple changent souvent davantage le résultat qu’un achat impulsif.",
      },
      {
        type: "paragraph",
        content:
          "Avant d’ajouter un nouvel outil, mieux vaut vérifier si le problème vient vraiment du matériel ou d’un manque de méthode dans le workflow quotidien.",
      },
    ],
  },
  {
    id: "blog-finir-morceaux",
    slug: "pourquoi-on-ne-finit-pas-ses-morceaux",
    section: "blog-news",
    type: "Réflexion",
    label: "Article",
    title:
      "Pourquoi tant de producteurs commencent des morceaux sans les finir",
    summary:
      "Un article sur les blocages les plus fréquents en production et sur quelques habitudes simples pour aller au bout de ses idées.",
    heroImage: "/articles/blog-news/arrangement-overview.jpg",
    thumbnail: "/articles/blog-news/arrangement-overview.jpg",
    imageAlt: "Vue Arrangement d’Ableton Live avec une structure de morceau",
    tags: ["arrangement", "workflow", "production"],
    content: [
      {
        type: "paragraph",
        content:
          "Beaucoup de morceaux s’arrêtent au stade de la boucle parce que la production change alors de nature. Il ne s’agit plus seulement de trouver une idée forte, mais de l’organiser dans le temps.",
      },
      {
        type: "paragraph",
        content:
          "Le blocage vient souvent d’un perfectionnisme trop précoce, d’une écoute trop analytique ou d’un manque de structure intermédiaire entre sketch et morceau final.",
      },
      {
        type: "paragraph",
        content:
          "Avancer par étapes courtes, figer certaines décisions et accepter une version imparfaite aide souvent davantage que chercher l’arrangement parfait dès le départ.",
      },
    ],
  },
  {
    id: "guide-bien-demarrer",
    slug: "bien-demarrer-sur-ableton-live",
    section: "guides-ableton-live",
    type: "Guide",
    label: "Guide",

    title: "Bien démarrer sur Ableton Live",
    summary:
      "Un guide simple et concret pour comprendre l’interface, le workflow et les bases de la production dans Ableton Live.",
    heroImage: "/articles/guides-ableton/max-for-live-PATCH.jpg",
    thumbnail: "/articles/guides-ableton/max-for-live-PATCH.jpg",
    imageAlt: "Interface d’Ableton Live pour un guide de prise en main",
    tags: ["debutant", "workflow", "ableton"],
    content: [
      {
        type: "paragraph",
        content:
          "Les premiers pas dans Ableton Live sont souvent plus simples qu’ils n’en ont l’air. L’essentiel est de comprendre les grandes zones de l’interface et le rôle de chaque vue.",
      },
      {
        type: "heading",
        content: "1. Comprendre ce que tu regardes",
      },
      {
        type: "paragraph",
        content:
          "Avant de penser plugins ou techniques avancées, prends le temps d’identifier les pistes, le navigateur, la zone de clips et les contrôles de transport. Cette lecture de base accélère tout le reste.",
      },
      {
        type: "list",
        items: [
          "repérer la Session View et l’Arrangement View",
          "comprendre la différence entre piste audio et piste MIDI",
          "savoir où se trouvent les devices, les samples et les instruments",
        ],
      },
      {
        type: "heading",
        content: "2. Travailler avec un petit nombre d’éléments",
      },
      {
        type: "paragraph",
        content:
          "Pour bien commencer, mieux vaut une session légère avec quelques sons bien choisis. Une batterie, une basse, un instrument principal et deux idées rythmiques suffisent largement à apprendre le workflow.",
      },
      {
        type: "image",
        src: "/articles/guides-ableton/browser-and-session-view.jpg",
        alt: "Gros plan sur l’interface d’Ableton Live",
        caption:
          "Le plus utile au début est de bien lire l’interface, pas de multiplier les pistes.",
      },
      {
        type: "heading",
        content: "3. Construire une routine simple",
      },
      {
        type: "paragraph",
        content:
          "Nommer les pistes, sauvegarder tôt, colorer les groupes et garder une organisation stable rendent chaque session plus lisible. Ce sont ces habitudes qui font gagner du temps sur le long terme.",
      },
      {
        type: "callout",
        label: "Méthode",
        content:
          "Commence par refaire plusieurs petites sessions courtes plutôt que de viser immédiatement un morceau complet.",
      },
      {
        type: "paragraph",
        content:
          "Ableton Live devient vite agréable dès que l’on comprend son rythme propre. Une fois cette base installée, les fonctions avancées prennent beaucoup plus de sens.",
      },
    ],
  },
  {
    id: "guide-organiser-samples",
    slug: "organiser-ses-samples-dans-ableton-live",
    section: "guides-ableton-live",
    type: "Workflow",
    label: "Guide",
    title: "Comment mieux organiser ses samples dans Ableton Live",
    summary:
      "Une méthode simple pour retrouver plus vite tes sons, éviter les projets cassés et gagner du temps en production.",
    heroImage: "/articles/guides-ableton/browser-and-session-view.jpg",
    thumbnail: "/articles/guides-ableton/browser-and-session-view.jpg",
    imageAlt:
      "Interface Ableton Live utilisée pour illustrer un guide d’organisation",
    tags: ["samples", "organisation", "workflow"],
    content: [
      {
        type: "paragraph",
        content:
          "Organiser ses samples n’a rien d’administratif. C’est une façon de travailler plus vite, de garder des projets lisibles et d’éviter les fichiers manquants quand une session vieillit.",
      },
      {
        type: "paragraph",
        content:
          "L’idée n’est pas de construire une archive parfaite. Il s’agit plutôt de mettre en place quelques habitudes stables pour retrouver un kick, un field recording ou une texture sans casser le rythme de production.",
      },
      {
        type: "heading",
        content: "1. Ranger les sons par usage, pas seulement par origine",
      },
      {
        type: "paragraph",
        content:
          "Une bibliothèque trop littérale devient vite difficile à parcourir. Mieux vaut regrouper les sons selon la façon dont tu les utilises réellement : drums, textures, voix, one-shots, transitions, ambiances.",
      },
      {
        type: "gif",
        src: "/articles/guides-ableton/sample-organisation-1.svg",
        alt: "Placeholder montrant l’organisation d’un dossier de samples dans Ableton Live",
        caption:
          "Placeholder GIF : exemple de classement par familles d’usage dans une bibliothèque de samples.",
      },
      {
        type: "callout",
        label: "Astuce",
        content:
          "Si un dossier te force à réfléchir trop longtemps, il est probablement rangé selon une logique qui ne correspond pas à ton vrai workflow.",
      },
      {
        type: "heading",
        content: "2. Collecter les fichiers dès qu’un projet commence à compter",
      },
      {
        type: "paragraph",
        content:
          "Quand une idée devient un vrai projet, prends l’habitude de collecter ses médias. Tu sécurises la session, tu facilites les sauvegardes et tu évites les dépendances dispersées sur plusieurs disques ou téléchargements temporaires.",
      },
      {
        type: "list",
        items: [
          "collecter les samples importés qui ne viennent pas de ta bibliothèque principale",
          "renommer clairement les versions de projet importantes",
          "garder un dossier projet propre avec audio, exports et références au même endroit",
        ],
      },
      {
        type: "gif",
        src: "/articles/guides-ableton/sample-organisation-2.svg",
        alt: "Placeholder montrant la consolidation d’un projet et la relocalisation des fichiers",
        caption:
          "Placeholder GIF : exemple de session consolidée avec des fichiers relocalisés proprement.",
      },
      {
        type: "quote",
        content:
          "Un projet bien collecté ne sert pas seulement à éviter les erreurs. Il permet aussi de réouvrir une idée six mois plus tard sans perdre de temps à enquêter.",
      },
      {
        type: "heading",
        content: "3. Créer une routine simple pour retrouver vite un son",
      },
      {
        type: "paragraph",
        content:
          "Une bonne organisation ne repose pas uniquement sur le rangement initial. Elle dépend surtout d’une routine de nommage, de favoris et de nettoyage léger mais régulier.",
      },
      {
        type: "image",
        src: "/articles/guides-ableton/clean-project-view.jpg",
        alt: "Session Ableton Live utilisée comme environnement de travail",
        caption:
          "L’important est de garder une logique de recherche constante d’un projet à l’autre.",
      },
      {
        type: "callout",
        label: "Mémo",
        content:
          "Une bibliothèque claire vaut mieux qu’une bibliothèque immense. Supprimer le bruit est souvent plus utile qu’ajouter encore des dossiers.",
      },
      {
        type: "paragraph",
        content:
          "Sur le long terme, quelques règles simples suffisent : des noms cohérents, des emplacements stables et des projets collectés au bon moment. Cette discipline légère change profondément la fluidité du travail.",
      },
    ],
  },
  {
    id: "guide-session-arrangement",
    slug: "session-view-et-arrangement-view",
    section: "guides-ableton-live",
    type: "Workflow",
    label: "Guide",
    title: "Session View et Arrangement View : comprendre enfin la différence",
    summary:
      "Une explication claire pour savoir quand utiliser chaque vue et mieux construire ton workflow dans Ableton Live.",
    heroImage: "/articles/guides-ableton/session-view.jpg",
    thumbnail: "/articles/guides-ableton/session-view.jpg",
    imageAlt: "Capture d’écran de la Session View d’Ableton Live",
    tags: ["session view", "arrangement", "workflow"],
    content: [
      {
        type: "paragraph",
        content:
          "La confusion entre Session View et Arrangement View vient souvent du fait qu’elles montrent le même projet avec deux logiques très différentes. L’une est pensée pour tester, l’autre pour construire dans le temps.",
      },
      {
        type: "paragraph",
        content:
          "La Session View aide à lancer des idées, comparer des variations et improviser une forme. L’Arrangement View sert à fixer ces choix, à travailler les transitions et à finaliser la structure.",
      },
      {
        type: "paragraph",
        content:
          "Comprendre ce rôle complémentaire change beaucoup la manière d’avancer. On cesse d’opposer les deux vues et on commence à les utiliser comme deux étapes d’un même workflow.",
      },
    ],
  },
  {
    id: "guide-habitudes-sessions-propres",
    slug: "5-habitudes-pour-des-sessions-ableton-propres",
    section: "guides-ableton-live",
    type: "Workflow",
    label: "Guide",
    title: "5 habitudes pour rendre tes sessions Ableton plus propres",
    summary:
      "Couleurs, noms, groupes, routings, templates : des gestes simples qui rendent ton projet plus lisible et plus efficace.",
    heroImage: "/articles/guides-ableton/clean-project-view.jpg",
    thumbnail: "/articles/guides-ableton/clean-project-view.jpg",
    imageAlt: "Template Ableton Live bien organisé",
    tags: ["organisation", "template", "workflow"],
    content: [
      {
        type: "paragraph",
        content:
          "Une session propre ne sert pas à faire joli. Elle rend les décisions plus rapides, les erreurs plus visibles et le retour dans un projet beaucoup moins fatigant.",
      },
      {
        type: "list",
        items: [
          "nommer les pistes dès qu’elles deviennent importantes",
          "utiliser des couleurs cohérentes pour les familles d’éléments",
          "grouper tôt ce qui travaille ensemble",
          "garder quelques retours et routings récurrents",
          "partir d’un template simple plutôt que d’un projet vide ou trop chargé",
        ],
      },
      {
        type: "paragraph",
        content:
          "Ces habitudes paraissent modestes, mais elles changent profondément la vitesse de lecture d’une session. C’est souvent ce qui sépare un projet confus d’un projet agréable à finir.",
      },
    ],
  },
  {
    id: "m4l-par-ou-commencer",
    slug: "max-for-live-par-ou-commencer",
    section: "max-for-live",
    type: "Introduction",
    label: "Guide",
    title: "Max for Live : par où commencer sans se perdre",
    summary:
      "Une porte d’entrée simple pour comprendre ce qu’est Max for Live, à quoi il sert, et comment l’utiliser sans complexifier ton setup.",
    heroImage: "/articles/max-for-live/max-like-interface.jpg",
    thumbnail: "/articles/max-for-live/max-like-interface.jpg",
    imageAlt: "Interface d’un device Max for Live",
    tags: ["max for live", "debutant", "devices"],
    content: [
      {
        type: "paragraph",
        content:
          "Max for Live peut sembler intimidant au départ parce qu’il ouvre énormément de possibilités. Pourtant, son usage le plus intéressant est souvent très concret : ajouter un outil précis à un workflow déjà stable.",
      },
      {
        type: "paragraph",
        content:
          "Le plus simple est de commencer par quelques devices utilitaires, bien identifiés, puis d’observer ceux qui apportent réellement quelque chose à ta façon de produire ou de jouer.",
      },
      {
        type: "paragraph",
        content:
          "L’objectif n’est pas de tout explorer. Il s’agit d’apprendre à reconnaître les devices qui clarifient un geste, un son ou une méthode de travail.",
      },
    ],
  },
  {
    id: "m4l-trois-devices-utiles",
    slug: "3-devices-max-for-live-utiles",
    section: "max-for-live",
    type: "Sélection",
    label: "Device",
    title: "3 devices Max for Live vraiment utiles au quotidien",
    summary:
      "Une petite sélection d’outils concrets pour améliorer ton workflow, ton sound design ou ta façon de jouer dans Ableton Live.",
    heroImage: "/articles/max-for-live/device-workflow.jpg",
    thumbnail: "/articles/max-for-live/device-workflow.jpg",
    imageAlt: "Configuration Ableton Live et contrôleurs pour un workflow créatif",
    tags: ["max for live", "devices", "workflow"],
    content: [
      {
        type: "paragraph",
        content:
          "Les meilleurs devices Max for Live ne sont pas forcément les plus spectaculaires. Ce sont souvent ceux qui économisent des gestes répétitifs ou ouvrent une variation utile sans alourdir la session.",
      },
      {
        type: "paragraph",
        content:
          "Un bon device peut servir à moduler un paramètre clé, à préparer des variations de jeu ou à créer une interaction plus souple avec un instrument ou un rack existant.",
      },
      {
        type: "paragraph",
        content:
          "La vraie question reste toujours la même : est-ce que cet outil accélère une pratique réelle, ou ajoute-t-il juste une couche de complexité séduisante mais peu utilisée ?",
      },
    ],
  },
  {
    id: "m4l-outil-creatif",
    slug: "max-for-live-outil-creatif-pas-gadget",
    section: "max-for-live",
    type: "Réflexion",
    label: "Guide",
    title: "Comment utiliser Max for Live comme outil créatif, pas comme gadget",
    summary:
      "Une réflexion pratique sur la bonne manière d’intégrer Max for Live dans un vrai workflow de production.",
    heroImage: "/articles/max-for-live/creative-ableton-view.jpg",
    thumbnail: "/articles/max-for-live/creative-ableton-view.jpg",
    imageAlt: "Vue Ableton Live utilisée pour illustrer une approche créative",
    tags: ["max for live", "creativite", "workflow"],
    content: [
      {
        type: "paragraph",
        content:
          "Max for Live devient vraiment intéressant lorsqu’il aide à produire autrement, pas lorsqu’il détourne l’attention de la musique. Un bon device ouvre une possibilité claire et reste lisible dans la session.",
      },
      {
        type: "paragraph",
        content:
          "L’enjeu est de sélectionner peu d’outils, mais de bien comprendre où les placer : en amont pour générer, au milieu pour transformer, ou en aval pour structurer un geste de performance.",
      },
      {
        type: "paragraph",
        content:
          "Utilisé avec cette discipline, Max for Live cesse d’être un terrain de curiosité permanente et devient un vrai prolongement du workflow.",
      },
    ],
  },
  {
    id: "freebie-template-ableton",
    slug: "freebie-template-ableton-live",
    section: "freebies",
    type: "Template",
    label: "Gratuit",
    title: "Freebie : un template Ableton Live simple pour démarrer plus vite",
    summary:
      "Un template clair et léger pour commencer une session avec de bonnes bases, sans perdre du temps à tout reconfigurer.",
    heroImage: "/articles/freebies/template-session.jpg",
    thumbnail: "/articles/freebies/template-session.jpg",
    imageAlt: "Template Ableton Live préparé comme point de départ",
    tags: ["template", "gratuit", "workflow"],
    content: [
      {
        type: "paragraph",
        content:
          "Un template utile n’a pas besoin d’être complexe. Il doit surtout retirer les réglages répétitifs qui ralentissent le démarrage d’une session sans imposer une direction musicale trop rigide.",
      },
      {
        type: "paragraph",
        content:
          "Quelques pistes bien nommées, des groupes clairs, deux ou trois retours et une organisation stable suffisent à rendre le travail plus fluide dès les premières minutes.",
      },
      {
        type: "paragraph",
        content:
          "L’intérêt d’un template simple est qu’il reste facile à détourner. Il accompagne la pratique sans enfermer l’idée dans une structure trop lourde.",
      },
    ],
  },
  {
    id: "freebie-rack-epaisseur",
    slug: "freebie-rack-ableton-epaisseur",
    section: "freebies",
    type: "Rack",
    label: "Gratuit",
    title: "Freebie : un rack Ableton pour épaissir un son en quelques secondes",
    summary:
      "Un rack simple et rapide à utiliser pour donner plus de corps à un son sans compliquer ton mix.",
    heroImage: "/articles/freebies/rack-demo.jpg",
    thumbnail: "/articles/freebies/rack-demo.jpg",
    imageAlt: "Gros plan sur une interface Ableton Live pour illustrer un rack",
    tags: ["rack", "gratuit", "mix"],
    content: [
      {
        type: "paragraph",
        content:
          "Certains outils deviennent utiles précisément parce qu’ils vont droit au but. Un rack d’épaisseur bien pensé doit permettre de densifier une source sans masquer son rôle dans le mix.",
      },
      {
        type: "paragraph",
        content:
          "Le bon dosage vient souvent d’une légère combinaison de saturation, de largeur et de contrôle dynamique. L’intérêt est d’obtenir ce résultat vite, avec peu de paramètres.",
      },
      {
        type: "paragraph",
        content:
          "Ce type de freebie vaut par sa simplicité : on l’ajoute, on écoute, on dose, puis on revient au morceau sans rompre le flux de travail.",
      },
    ],
  },
];

export const navigationGroups = {
  primary: sections.map((section) => ({
    label: section.title,
    href: `/${section.slug}`,
  })),
  secondary: [
    { label: "Cours / accompagnement", href: "/cours-accompagnement" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact / Réseaux sociaux", href: "/contact-reseaux-sociaux" },
  ],
};

const secondaryPageEntries = [
  {
    slug: "cours-accompagnement",
    title: "Cours / accompagnement",
    intro:
      "Un accompagnement sobre et concret pour mieux comprendre Ableton Live, clarifier un workflow et préparer des sessions plus solides.",
    panels: [
      {
        title: "Cours Ableton Live",
        text:
          "Des sessions ciblées pour prendre en main Ableton Live, mieux comprendre l’interface et avancer avec des bases claires.",
      },
      {
        title: "Coaching production",
        text:
          "Un regard extérieur pour débloquer un projet, affiner une méthode de travail et produire avec plus de recul.",
      },
      {
        title: "Préparation live",
        text:
          "Un accompagnement simple pour structurer un set, fiabiliser un workflow scène et préparer une session jouable.",
      },
    ],
  },
  {
    slug: "portfolio",
    title: "Portfolio",
    intro:
      "Quelques axes de travail, projets et contextes dans lesquels METABLETON intervient autour d’Ableton Live, de la production et du live.",
    panels: [
      {
        title: "Guides et contenus éditoriaux",
        text:
          "Conception de contenus pédagogiques autour du workflow, de la production musicale et de l’usage d’Ableton Live.",
      },
      {
        title: "Accompagnement créatif",
        text:
          "Aide à la structuration de projets, à l’organisation de sessions et à la mise en place d’une méthode plus lisible.",
      },
      {
        title: "Préparation de sets et outils",
        text:
          "Développement d’outils simples, templates, racks et méthodes pour jouer, produire et travailler plus sereinement.",
      },
    ],
  },
  {
    slug: "contact-reseaux-sociaux",
    title: "Contact / Réseaux sociaux",
    intro:
      "Pour une demande, une question ou un échange autour d’Ableton Live, tu peux utiliser les liens ci-dessous.",
    links: [
      {
        label: "Email",
        value: "hello@metableton.com",
        href: "mailto:hello@metableton.com",
      },
      {
        label: "Instagram",
        value: "@metableton",
        href: "https://instagram.com/metableton",
      },
      {
        label: "YouTube",
        value: "METABLETON",
        href: "https://youtube.com/@metableton",
      },
      {
        label: "Liens complémentaires",
        value: "À préciser selon les besoins",
        href: "#",
      },
    ],
  },
];

export const secondaryPages = secondaryPageEntries.reduce((accumulator, page) => {
  accumulator[`/${page.slug}`] = {
    ...page,
    path: `/${page.slug}`,
  };

  return accumulator;
}, {});

export const allArticles = articles.map((article) => {
  const section = sections.find((currentSection) => currentSection.id === article.section);
  const sectionSlug = section?.slug || article.section;

  return {
    ...article,
    path: `/${sectionSlug}/${article.slug}`,
  };
});

export const articlesBySection = sections.reduce((accumulator, section) => {
  accumulator[section.id] = allArticles.filter((article) => article.section === section.id);

  return accumulator;
}, {});

export const sectionPages = sections.reduce((accumulator, section) => {
  accumulator[`/${section.slug}`] = {
    ...section,
    path: `/${section.slug}`,
    items: section.id === "blog-news" ? allArticles : articlesBySection[section.id],
  };

  return accumulator;
}, {});

export const articlesByPath = allArticles.reduce((accumulator, article) => {
  accumulator[article.path] = article;
  return accumulator;
}, {});

export const featuredArticle =
  allArticles.find((article) => article.featured) || allArticles[0];

const heroCarouselSlugs = [
  "meld",
  "bien-demarrer-sur-ableton-live",
  "max-for-live-par-ou-commencer",
  "freebie-template-ableton-live",
];

export const heroCarouselSlides = heroCarouselSlugs
  .map((slug) => allArticles.find((article) => article.slug === slug))
  .filter(Boolean)
  .map((article) => ({
    ...article,
    sectionTitle:
      sections.find((section) => section.id === article.section)?.title || article.section,
  }));
