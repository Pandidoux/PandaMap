# Floating-Tooltips

## Description
Un système de tuto JS pour afficher des indications sur une appli sous la forme d'info-bulles ou "tooltips".

Utilisable comme tuto à l'arrivé sur une page ou pour afficher des informations au survol de certains éléments.

## Fonctionnalitées
- Placement automatique ou manuel de chaque tooltips
- Gestion de cookies intégré pour reporter le prochain affichage du tuto de la page.
- 2 styles par defaut disponible
- Gestion par tooltip de l'affichage sur mobile ou desktop exclusivement


## Dépendances
Cet outil utilise la librairie [Floating-UI](https://floating-ui.com/) pour gérer les placements.

Floating-UI a besoin de 2 librairies JS :
1. [Core](https://www.jsdelivr.com/package/npm/@floating-ui/core) (Dépendance de Floating-UI)
2. [Dom](https://www.jsdelivr.com/package/npm/@floating-ui/dom) (Floating-UI)

## Utilisation
Charger les librairies et le sctipt Floating-Tooltips :
```html
<!-- Floating-UI -->
<script src="https://cdn.jsdelivr.net/npm/@floating-ui/core@1.6.2/dist/floating-ui.core.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.5/dist/floating-ui.dom.umd.min.js"></script>
<!-- Floating-Tooltips -->
<script src="./libs/floating-tooltips.min.js"></script>
```

## Exemple
```javascript
// Definition des options
let options = {
    modal: true, // Fond obscur
    modal_opacity: 0.5,
    style: 'tooltip', // "tooltip" | "transparent"
    arrow: true,
    shadow: true,
    trigger: '#button-show', // Bouton d'ouverture
    hover: false,
    autoshow: true, // Affichage immédia
    autoshow_period: 10, // 10s
    autoshow_identifier: 'tuto',
    tooltips: [ // (Requis)
        {
            reference: '#corner-top-left', // (Requis)
            content: 'Un texte suffisament long', // (Requis)
            placement: 'bottom', // tooltip affiché en dessous
            hover: true, // Affiché au survol
            device: 'desktop', // "desktop" | "mobile"
        },{
            reference: '#corner-top',
            content: 'Un texte suffisament long',
        },{
            ...
        },
    ]
};

let floating_tuto = createFloatingTooltip(options); // Création
// floating_tuto.show(); // Affichage manuel
```

## Options de création
### Options générale
| Option              | Description                                                          | Default Value  | Type      |
|---------------------|----------------------------------------------------------------------|----------------|-----------|
| modal               | Affiche ou non un modal en fond                                      | false          | boolean   |
| modal_opacity       | Transparence du modal                                                | 0.5            | number    |
| style               | Style "tooltip" \| "transparent" ou CSS complet du style à utiliser  | "tooltip"      | string    |
| arrow               | Afficher ou non une flèche                                           | false          | boolean   |
| shadow              | Afficher ou non une ombre                                            | false          | boolean   |
| trigger             | Selector cliquable pour afficher tous les tooltips                   | null           | string    |
| hover               | Afficher ou non les tooltips au survol de la souris                  | false          | boolean   |
| autoshow            | Afficher automatiquement tous les tooltips après l'initialisation    | false          | boolean   |
| autoshow_period     | Report le prochain affichage automatique de X secondes               | null           | number    |
| autoshow_identifier | Utilisé quand plusieurs instances de Floating-Tooltips sont définit  | null           | string    |

### Options sur les tooltips
| Option      | Description                                                                         | Default Value   | Type            |
|-------------|-------------------------------------------------------------------------------------|-----------------|-----------------|
| reference   | (Requis) Selector de l'élément de référence                                         | null            | string          |
| content     | (Requis) Contenu du tooltip                                                         | null            | string \| HTML  |
| placement   | Force le placement top \| right \| bottom \| left \| {prefix}-start \| {prefix}-end | automatique     | string          |
| hover       | Affiche ou non le tooltip au survol de la souris                                    | false           | boolean         |
| device      | Restreint l'affichage du tooltip uniquement sur "mobile" ou "desktop"               | null            | string          |

## Propriétés de le l'instance
La fonction createFloatingTooltip renvoie un objet représentant l'instance des tooltips.

L'instance peut être manipuler avec les fonctions mise à disposition et quelques propriétés.

### Propriétés générale
| Option      | Description                             | Type         |
|-------------|-----------------------------------------|--------------|
| delete      | Supprime tous les tooltips              | function     |
| hide        | Masque tous les tooltips                | function     |
| isMobile    | Indique si un mobile est détecté ou non | boolean      |
| modal_elem  | Element modal créer                     | HTML element |
| show        | Afficher tous les tooltips              | function     |
| stylesheet  | Element style de l'instance             | string       |
| tooltips    | Liste des tooltips                      | array        |

### Propriétés sur les tooltips
| Option    | Description                                                | Type         |
|-----------|------------------------------------------------------------|--------------|
| arrow     | Indique si le tooltip possède une flèche                   | boolean      |
| content   | Contennu du tooltip                                        | boolean      |
| delete    | Supprime le tooltip                                        | function     |
| device    | Type de périphérique où doit être affiché le tooltip       | string       |
| element   | Element HTML du tooltip                                    | HTML element |
| hide      | Masque le tooltip                                          | function     |
| hover     | Le tooltip s'affiche au survol de la souris ou non         | boolean      |
| placement | Placement du tooltip par rapport à l'élément de référence  | string       |
| reference | Element HTML de référence                                  | HTML element |
| shadow    | Indique si le tooltip possède un ombre                     | boolean      |
| show      | Affiche le tooltip                                         | function     |

