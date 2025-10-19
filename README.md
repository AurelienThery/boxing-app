# 🥊 Boxing Training App

Application web pour les entraînements de boxe en salle. Cette application permet de gérer des sessions d'entraînement avec un minuteur professionnel, des programmes prédéfinis et une bibliothèque de combinaisons de coups.

## 📋 Fonctionnalités

### 🕐 Minuteur d'entraînement
- Timer configurable pour rounds et périodes de repos
- Affichage clair du round actuel et du temps restant
- Contrôles Start/Pause/Reset
- Notifications sonores pour les changements de round
- Avertissement visuel et sonore 10 secondes avant la fin du round
- Paramètres personnalisables :
  - Durée des rounds (1-12 minutes)
  - Temps de repos (10-120 secondes)
  - Nombre de rounds (1-12)
  - Activation/désactivation du son

### 💪 Programmes d'entraînement prédéfinis
- **Débutant** : 3 rounds × 2 min (repos: 60s)
- **Intermédiaire** : 5 rounds × 3 min (repos: 60s)
- **Avancé** : 8 rounds × 3 min (repos: 45s)
- **Sparring** : 6 rounds × 3 min (repos: 60s)
- **Technique** : 4 rounds × 4 min (repos: 90s)
- **Cardio** : 10 rounds × 2 min (repos: 30s)

### 🎯 Bibliothèque de combinaisons
8 combinaisons de coups classiques avec descriptions :
- Jab-Cross (1-2)
- Jab-Cross-Crochet (1-2-3)
- Double Jab-Cross (1-1-2)
- Et 5 autres combinaisons avancées

### 📊 Historique d'entraînement
- Sauvegarde automatique des sessions terminées
- Affichage des 50 dernières sessions
- Détails complets (date, rounds, durées)
- Stockage local persistant

## 🚀 Installation et utilisation

### Prérequis
- Un navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Python 3 (pour le serveur local) ou tout autre serveur HTTP

### Lancement rapide

1. Clonez le repository :
```bash
git clone https://github.com/AurelienThery/boxing-app.git
cd boxing-app
```

2. Lancez un serveur HTTP local :
```bash
# Avec Python 3
python3 -m http.server 8080

# Ou avec Node.js
npx http-server -p 8080
```

3. Ouvrez votre navigateur à l'adresse : `http://localhost:8080`

### Utilisation sans serveur
Vous pouvez aussi simplement ouvrir le fichier `index.html` directement dans votre navigateur.

## 📱 Interface

L'application dispose de 4 onglets principaux :

1. **Minuteur** : Timer principal avec contrôles et paramètres
2. **Entraînements** : Sélection rapide de programmes prédéfinis
3. **Combinaisons** : Référence des combinaisons de coups
4. **Historique** : Suivi de vos sessions d'entraînement

## 🎨 Design

- Interface moderne et responsive
- Dégradés de couleurs élégants
- Animations fluides
- Optimisé pour mobile et desktop
- Thème violet/rose avec accentuations

## 🛠️ Technologies utilisées

- HTML5
- CSS3 (animations, gradients, flexbox, grid)
- JavaScript ES6+ (Web Audio API, LocalStorage)
- Aucune dépendance externe

## 📝 Numérotation des coups

1. Jab (direct du bras avant)
2. Cross (direct du bras arrière)
3. Crochet avant
4. Crochet arrière
5. Uppercut avant
6. Uppercut arrière

## 🔊 Notifications sonores

- **Début de round** : Bip court aigu
- **Début de repos** : Bip long moyen
- **Avertissement (10s)** : Bip court
- **Fin d'entraînement** : Mélodie de 4 notes

## 💾 Stockage des données

Les données sont stockées localement dans le navigateur (LocalStorage) :
- Aucune connexion internet requise
- Données privées et sécurisées
- Persistantes entre les sessions

## 📄 Licence

Ce projet est open source et disponible sous licence MIT.

## 👨‍💻 Auteur

AurelienThery