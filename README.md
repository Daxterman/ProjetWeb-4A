# PolyBlind Test

## Description du projet

**PolyBlind Test** offre une expérience immersive de blind test musical, permettant aux utilisateurs de tester leurs connaissances musicales tout en découvrant de nouveaux morceaux. Grâce à l'intégration de **l'API de Spotify**, personnalisez vos parties avec vos propres playlists. Que vous soyez un mélomane passionné ou un amateur de musique occasionnel, **PolyBlind Test** est conçu pour vous divertir et vous défier.

**Caractéristiques clés :**

1.  **Accès Illimité à la Bibliothèque Spotify :** Notre jeu utilise l'API de Spotify pour offrir un accès illimité à des millions de chansons. Testez vos connaissances musicales parmi une bibliothèque sans fin de morceaux de tous les genres et de toutes les époques.
    
2.  **Personnalisation Totale :** Créez des playlists personnalisées pour des sessions de blind test uniques. Choisissez des thèmes, des genres ou des listes de lecture spécifiques pour des expériences sur mesure.
    
3.  **Tableaux de Classement :** Suivez votre classement en temps réel et tentez de faire de votre mieux pour gagner la partie!

## Configuration

Afin d'utiliser ce projet, il vous faudra créer un fichier .env dans le répertoire du projet contenant deux tokens : ClientID et SecretID. Vous obtiendrez ces tokens en créant une application sur le dashboard de Spotify
developer.spotify.com/dashboard

## Membres de l'équipe

- Clément Menuge : Gestion de la musique avec l'API Spotify, modifications sur la page d'accueil, HTML/CSS

- Mathieu Leray : Gestion des buzzers et du système de points de la partie, trafic des données envoyées par les clients et le serveur, HTML/CSS

- Zeineb Amara : Page d'accueil, HTML/CSS

## Technologies utilisées

- HTML / CSS
- JavaScript
- Node.js
- Socket.io
- Express
- Dotenv
- Cors
- Bootstrap
- jQuery

## Bugs connus

Nous avons pour l'instant relevé un seul bug lié aux buzzers. Lorsqu'une musique est lancée, le buzzer devient actif pour les joueurs. Cependant, si le joueur buzz instantanément, la musique n'a pas le temps de se charger l'état Play/Pause du lecteur est inversé, ce qui dérègle toute la synchronisation entre le buzzer et le lecteur. Cependant, ce problème est réglé lors du passage à la musique suivante. En réalité ce bug ne peut avoir lieu car un joueur ne va pas buzzer si la musique n'a pas encore commencée.