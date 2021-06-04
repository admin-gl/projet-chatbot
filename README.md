# Projet-Chatbot
## API
L'API est RESTful, elle repose sur les verbes `POST` et `GET`. 
La liste des `noms` est la suivante :  
* `/login` : authentifier un utilisateur
* `/signin` : ajouter un utilisateur s'il n'existe pas déjà
* `/uList` : renvoie une liste des utilisateurs
* `/bList/:interface` : renvoie la liste des `bots` autorisés sur l'`/interface` spécifiée
* `/brains/:id` : renvoie le cerveau du bot d'identifiant `id`
* `/uploadbot` : ajoute un bot à la base mongoDB
* `/delete/:id` : supprime le bot d'identifiant `id`
* `/sesscount/:id/:int/:incr` : met à jour le compteur de sessions ouvertes pour le bot d'identifiant `id` sur l'interface `int`. `incr` signale l'ouverture ou la fermeture de session. 
* `/perm/:interface/:id` : met à jour la permission du bot d'identifiant `id` sur l'interface `interface`

`interface` peut prendre les valeurs suivantes : 
* `discord` : pour l'interface Discord
* `mastodon` : pour l'interface Mastodon
* `navigateur` : pour l'interface navigateur

`id` est l'identifiant créé automatiquement par la base mongoDB lors de l'insertion d'un nouveau document.

`incr` peut prendre les valeurs suivantes : 
* `+` pour l'ouverture d'une session
* `-` pour la fermeture d'une session

La représentation des données est en JSON, tu type `application/json`.