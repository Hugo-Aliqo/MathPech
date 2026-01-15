
import { Level, Lesson, Exercise } from './types';

export const LEVELS: { value: Level; label: string; cycle: string }[] = [
  { value: '6eme', label: '6ème', cycle: 'Cycle 3' },
  { value: '5eme', label: '5ème', cycle: 'Cycle 4' },
  { value: '4eme', label: '4ème', cycle: 'Cycle 4' },
  { value: '3eme', label: '3ème', cycle: 'Cycle 4' },
  { value: '2nde', label: 'Seconde', cycle: 'Lycée' },
  { value: '1ere', label: 'Première', cycle: 'Lycée' },
  { value: 'Terminale', label: 'Terminale', cycle: 'Lycée' },
];

export const MOCK_LESSONS: Lesson[] = [
  // --- 6ème (Cycle 3) ---
  {
    id: 'l_6_1',
    title: 'Les Fractions simples',
    level: '6eme',
    category: 'Algebre',
    summary: 'Comprendre la notion de partage et d\'écriture fractionnaire.',
    content: `Une fraction représente le partage d'une unité en parts égales.
    
**Exemple :** $\\frac{3}{4}$ signifie que l'on a pris 3 parts d'une unité coupée en 4.
- Le chiffre du haut est le **numérateur**.
- Le chiffre du bas est le **dénominateur**.`,
  },
  {
    id: 'l_6_2',
    title: 'Angles et Mesures',
    level: '6eme',
    category: 'Geometrie',
    summary: 'Apprendre à nommer et mesurer les angles avec un rapporteur.',
    content: `Un angle est une portion de plan délimitée par deux demi-droites de même origine.
- Un angle **aigu** mesure moins de $90^\\circ$.
- Un angle **droit** mesure exactement $90^\\circ$.
- Un angle **obtus** mesure entre $90^\\circ$ et $180^\\circ$.`,
  },

  // --- 5ème (Cycle 4) ---
  {
    id: 'l_5_1',
    title: 'Priorités Opératoires',
    level: '5eme',
    category: 'Algebre',
    summary: 'Apprendre l\'ordre des calculs dans une expression complexe.',
    content: `Dans une expression sans parenthèses, on effectue :
1. Les **multiplications** et les **divisions**.
2. Les **additions** et les **soustractions** de gauche à droite.

S'il y a des parenthèses, on commence par les calculs les plus intérieurs.`,
  },
  {
    id: 'l_5_2',
    title: 'Nombres Relatifs',
    level: '5eme',
    category: 'Algebre',
    summary: 'Introduction aux nombres négatifs et leur position sur une droite graduée.',
    content: `Un nombre relatif est composé d'un signe (+ ou -) et d'une distance à zéro.
- Pour additionner deux nombres de même signe, on garde le signe et on additionne les distances.
- Pour deux nombres de signes contraires, on prend le signe de celui qui a la plus grande distance et on soustrait les distances.`,
  },

  // --- 4ème (Cycle 4) ---
  {
    id: 'l_4_1',
    title: 'Théorème de Pythagore',
    level: '4eme',
    category: 'Geometrie',
    summary: 'Calculer la longueur d\'un côté dans un triangle rectangle.',
    content: `Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés.
    
Si $ABC$ est rectangle en $A$, alors :
$BC^2 = AB^2 + AC^2$`,
  },
  {
    id: 'l_4_2',
    title: 'Puissances de 10',
    level: '4eme',
    category: 'Algebre',
    summary: 'Utiliser les exposants pour écrire de très grands ou très petits nombres.',
    content: `L'expression $10^n$ représente un 1 suivi de $n$ zéros.
- $10^3 = 1000$
- $10^{-2} = 0,01$
- Notation scientifique : $a \\times 10^n$ où $1 \\leq a < 10$.`,
  },

  // --- 3ème (Cycle 4) ---
  {
    id: 'l1',
    title: 'Identités Remarquables',
    level: '3eme',
    category: 'Algebre',
    summary: 'Maîtriser les développements rapides avec les formules clés.',
    content: `Les trois identités remarquables à connaître par cœur :
    
1. $(a + b)^2 = a^2 + 2ab + b^2$
2. $(a - b)^2 = a^2 - 2ab + b^2$
3. $(a - b)(a + b) = a^2 - b^2$`,
  },
  {
    id: 'l_3_2',
    title: 'Théorème de Thalès',
    level: '3eme',
    category: 'Geometrie',
    summary: 'Calculer des longueurs dans des triangles emboîtés.',
    content: `Si deux droites $(BM)$ et $(CN)$ sont sécantes en $A$, et si $(MN) // (BC)$, alors :
    
$\\frac{AM}{AB} = \\frac{AN}{AC} = \\frac{MN}{BC}$`,
  },

  // --- Seconde (Lycée) ---
  {
    id: 'l2',
    title: 'Fonction Carrée',
    level: '2nde',
    category: 'Analyse',
    summary: 'Étude de la fonction $f(x) = x^2$ et sa représentation graphique.',
    content: `La fonction carrée est définie sur $\\mathbb{R}$ par $f(x) = x^2$.
- Sa courbe est une **parabole**.
- Elle est décroissante sur $]-\\infty; 0]$ et croissante sur $[0; +\\infty[$.`,
  },
  {
    id: 'l_2_2',
    title: 'Vecteurs du Plan',
    level: '2nde',
    category: 'Geometrie',
    summary: 'Translation et coordonnées de vecteurs.',
    content: `Un vecteur $\\vec{u}$ est défini par une direction, un sens et une norme.
- Relation de Chasles : $\\vec{AB} + \\vec{BC} = \\vec{AC}$
- Coordonnées : $\\vec{AB}(x_B - x_A ; y_B - y_A)$`,
  },

  // --- Première (Lycée) ---
  {
    id: 'l_1_1',
    title: 'La Dérivation',
    level: '1ere',
    category: 'Analyse',
    summary: 'Calculer le coefficient directeur de la tangente en un point.',
    content: `Le nombre dérivé $f'(a)$ est la limite du taux d'accroissement quand $h$ tend vers 0.
    
Formules usuelles :
- Si $f(x) = x^n$, alors $f'(x) = nx^{n-1}$.
- Si $f(x) = \\frac{1}{x}$, alors $f'(x) = -\\frac{1}{x^2}$.`,
  },
  {
    id: 'l_1_2',
    title: 'Suites Numériques',
    level: '1ere',
    category: 'Analyse',
    summary: 'Suites arithmétiques et géométriques.',
    content: `Une suite $(u_n)$ est une fonction de $\\mathbb{N}$ vers $\\mathbb{R}$.
- Arithmétique : $u_{n+1} = u_n + r$
- Géométrique : $u_{n+1} = u_n \\times q$`,
  },

  // --- Terminale (Lycée) ---
  {
    id: 'l3',
    title: 'Nombres Complexes',
    level: 'Terminale',
    category: 'Analyse',
    summary: 'Introduction à l\'ensemble $\\mathbb{C}$ et au nombre $i$.',
    content: `Dans $\\mathbb{C}$, il existe $i$ tel que $i^2 = -1$.
Tout complexe s'écrit sous forme algébrique $z = a + ib$.`,
  },
  {
    id: 'l_t_2',
    title: 'Calcul Intégral',
    level: 'Terminale',
    category: 'Analyse',
    summary: 'Calcul d\'aires sous la courbe et primitives.',
    content: `L'intégrale d'une fonction $f$ entre $a$ et $b$ est notée $\\int_{a}^{b} f(x) dx$.
Elle correspond à l'aire sous la courbe si $f(x) \\geq 0$.`,
  }
];

export const MOCK_EXERCISES: Record<string, Exercise[]> = {
  'l_6_1': [
    {
      id: 'e_6_1',
      lessonId: 'l_6_1',
      difficulty: 'Bronze',
      question: 'Si je mange $\\frac{1}{4}$ d\'un gâteau, combien de parts reste-t-il sur 4 ?',
      hints: ['Le total est $\\frac{4}{4}$', 'Fais la soustraction $4 - 1$'],
      solution: '3',
      explanation: 'Le gâteau entier représente $\\frac{4}{4}$. Si on enlève $\\frac{1}{4}$, il reste $4 - 1 = 3$ parts.'
    },
    {
      id: 'e_6_2',
      lessonId: 'l_6_1',
      difficulty: 'Argent',
      question: 'Quelle est la fraction simplifiée de $\\frac{10}{20}$ ?',
      hints: ['Divise le haut et le bas par 10'],
      solution: '1/2',
      explanation: 'Pour simplifier $\\frac{10}{20}$, on divise le numérateur et le dénominateur par leur plus grand diviseur commun, ici 10. $10 \\div 10 = 1$ et $20 \\div 10 = 2$.'
    }
  ],
  'l_5_1': [
    {
      id: 'e_5_1',
      lessonId: 'l_5_1',
      difficulty: 'Bronze',
      question: 'Calculer : $5 + 3 \\times 2$',
      hints: ['La multiplication est prioritaire'],
      solution: '11',
      explanation: 'On effectue d\'abord la multiplication : $3 \\times 2 = 6$. Puis l\'addition : $5 + 6 = 11$. L\'erreur classique est de faire $5 + 3$ d\'abord.'
    },
    {
      id: 'e_5_2',
      lessonId: 'l_5_1',
      difficulty: 'Argent',
      question: 'Calculer : $(10 - 2) \\times 3$',
      hints: ['Les parenthèses sont prioritaires'],
      solution: '24',
      explanation: 'On calcule d\'abord ce qui est entre parenthèses : $10 - 2 = 8$. Puis on multiplie : $8 \\times 3 = 24$.'
    }
  ],
  'l_4_1': [
    {
      id: 'e_4_1',
      lessonId: 'l_4_1',
      difficulty: 'Bronze',
      question: 'Dans un triangle rectangle, si les côtés de l\'angle droit valent 3 et 4, combien vaut l\'hypoténuse ?',
      hints: ['Calcule $3^2 + 4^2$', 'Cherche la racine carrée du résultat'],
      solution: '5',
      explanation: 'On applique Pythagore : $3^2 + 4^2 = 9 + 16 = 25$. La racine carrée de 25 est 5.'
    }
  ],
  'l1': [
    {
      id: 'e1',
      lessonId: 'l1',
      difficulty: 'Bronze',
      question: 'Développer l\'expression : $(x + 4)^2$',
      hints: ['Utilise $(a+b)^2 = a^2 + 2ab + b^2$'],
      solution: 'x^2 + 8x + 16',
      explanation: 'On utilise l\'identité remarquable $(a+b)^2 = a^2 + 2ab + b^2$ avec $a=x$ et $b=4$. On obtient $x^2 + 2 \\times x \\times 4 + 4^2$, ce qui donne $x^2 + 8x + 16$.'
    },
    {
      id: 'e1_2',
      lessonId: 'l1',
      difficulty: 'Argent',
      question: 'Développer $(2x - 3)^2$',
      hints: ['Utilise $(a-b)^2 = a^2 - 2ab + b^2$'],
      solution: '4x^2 - 12x + 9',
      explanation: 'Avec $a=2x$ et $b=3$, on a $(2x)^2 - 2(2x)(3) + 3^2$, donc $4x^2 - 12x + 9$.'
    },
    {
      id: 'e1_3',
      lessonId: 'l1',
      difficulty: 'Or',
      question: 'Calculer $99^2$ en utilisant les identités remarquables.',
      hints: ['99 = 100 - 1', 'Utilise $(a-b)^2$'],
      solution: '9801',
      explanation: '$99^2 = (100 - 1)^2 = 100^2 - 2 \\times 100 \\times 1 + 1^2 = 10000 - 200 + 1 = 9801$.'
    }
  ],
  'l_1_1': [
    {
      id: 'e_1_1',
      lessonId: 'l_1_1',
      difficulty: 'Bronze',
      question: 'Quelle est la dérivée de $f(x) = x^2$ ?',
      hints: ['Applique la formule $nx^{n-1}$ avec $n=2$'],
      solution: '2x',
      explanation: 'La dérivée de $x^n$ est $nx^{n-1}$. Pour $n=2$, on a $2x^{2-1} = 2x$.'
    },
    {
      id: 'e_1_2',
      lessonId: 'l_1_1',
      difficulty: 'Argent',
      question: 'Dériver $g(x) = 5x^3$',
      hints: ['Le coefficient 5 reste devant'],
      solution: '15x^2',
      explanation: 'On dérive $x^3$ en $3x^2$ et on multiplie par le coefficient 5 : $5 \\times 3x^2 = 15x^2$.'
    }
  ],
  'l3': [
    {
      id: 'e3',
      lessonId: 'l3',
      difficulty: 'Argent',
      question: 'Calculer $(2i)^2$',
      hints: ['Rappelle-toi que $i^2 = -1$', '$(2i)^2 = 2^2 \\times i^2$'],
      solution: '-4',
      explanation: 'On élève chaque facteur au carré : $(2i)^2 = 2^2 \\times i^2$. On sait que $2^2 = 4$ et $i^2 = -1$, donc $4 \\times (-1) = -4$. L\'erreur classique est d\'oublier le signe moins.'
    },
    {
      id: 'e3_2',
      lessonId: 'l3',
      difficulty: 'Or',
      question: 'Donner la forme algébrique de $(1+i)^2$',
      hints: ['Développe comme une identité remarquable classique'],
      solution: '2i',
      explanation: '$(1+i)^2 = 1^2 + 2i + i^2 = 1 + 2i - 1 = 2i$.'
    }
  ]
};
