const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID
const express = require("express");
const bodyParser = require("body-parser");
const api = express();
const port = 3002;


api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));
const uri = "mongodb+srv://admin:oTQ2VwkR6D4cJAh2@cluster.4vwhu.mongodb.net/projectDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function main() {
    try {
        await client.connect()
    } catch (error) {
        console.error(error)
    }
}

main().catch(console.error)

/*
 * authentification utilisateur
 * in: objet user
 * out: faux si pas de match,
 * out: user avec ses permission si match
 */
async function auth(user) {
    nomU = user.nom
    mdpU = user.mdp
    res = await client.db("projectDB").collection("users").findOne({ nom: nomU })
    console.log("res requete auth : ", res)
    if (res.mdp != mdpU) {
        console.log("pas de match")
        return false
    } else if (res.mdp == mdpU) {
        console.log("match")
        return res
    }
}

/*
 * insérer un creveau dans la base mongodb
 * in: l'objet bot à insérer
 * in: le client utilisé pour se connecter à la base
 */
async function createBot(client, bot) {
    console.log("bot", bot)
    const result = await client.db("projectDB").collection("brains").insertOne(bot)
    console.log("Ajouté nouveau cerveau")
}
/*
 * insérer un utilisatuer dans la base mongodb
 * in: l'objet user à insérer
 * in: le client utilisé pour se connecter à la base
 */
async function createUser(client, user) {
    const result = await client.db("projectDB").collection("users").insertOne(user)
    console.log("Ajouté nouvel utilisateur")
}
/*
 * récupère la liste des bots autorisés sur une interface
 * in: l'interface en question
 * in: le client utilisé pour se connecter à la base
 * out: une liste d'objets bot
 */
async function getBrains(client, interface) {
    if (interface == "discord") {
        var bList = await client.db("projectDB")
            .collection("brains")
            .find({ discord: true })
            .toArray()
        return bList;
    } else if (interface == "mastodon") {
        var bList = await client.db("projectDB")
            .collection("brains")
            .find({ mastodon: true })
            .toArray()
        return bList;
    } else if (interface == "navigateur") {
        var bList = await client.db("projectDB")
            .collection("brains")
            .find({ notreInterface: true })
            .toArray()
        return bList;
    } else if (interface == "all") {
        var bList = await client.db("projectDB")
            .collection("brains")
            .find({})
            .toArray()
        return bList;
    }
}
/*
 * récupère la liste de tous les utilisateurs
 * in: le client utilisé pour se connecter à la base
 * out: la liste des utilisateurs
 */
async function getUsers(client) {
    let uList = await client.db("projectDB").collection("users").find({}).toArray()
    return JSON.stringify(uList);
}
/*
 * récupère le document utilisateur ayant un nom donné
 * in: le nom de l'utilisateur
 * out: l'objet user 
 */
async function getUser(nOm) {
    let res = await client.db("projectDB").collection("users").findOne({ nom: nOm })
    return res
}
/*
 * supprime le bot d'id donné
 * in: l'id du bot à supprimer
 */
async function deleteBot(id) {
    let res = await client.db("projectDB").collection("brains").deleteOne({ "_id": ObjectId(id) })
    console.log("Successfully deleted bot id:", id)
}
/*
 * met à jour le compteur de session active
 * in: l'id du bot dont une session vient de s'ouvrir ou de se fermer
 * in: indique s'il s'agit d'une ouverture ou d'une fermeture de session
 */
async function updateSession(id, iFace, incr) {
    var brain = await client.db("projectDB").collection("brains")
        .findOne({ "_id": ObjectId(id) })
    if (incr == "+") {
        switch (iFace) {
            case "discord":
                let x = await client.db("projectDB")
                    .collection("brains")
                    .updateOne({ "_id": ObjectId(id) }, { $inc: { dsSessions: 1 } })
                break;

            case "mastodon":
                let y = await client.db("projectDB")
                    .collection("brains")
                    .updateOne({ "_id": ObjectId(id) }, { $inc: { msSessions: 1 } })
                break;

            case "navigateur":
                let z = await client.db("projectDB")
                    .collection("brains")
                    .updateOne({ "_id": ObjectId(id) }, { $inc: { nvSessions: 1 } })
                break;
        }
    } else if (incr == "-") {
        switch (iFace) {
            case "discord":
                let x = await client.db("projectDB")
                    .collection("brains")
                    .updateOne({ "_id": ObjectId(id) }, { $inc: { dsSessions: -1 } })
                break;

            case "mastodon":
                let y = await client.db("projectDB")
                    .collection("brains")
                    .updateOne({ "_id": ObjectId(id) }, { $inc: { msSessions: -1 } })
                break;

            case "navigateur":
                let z = await client.db("projectDB")
                    .collection("brains")
                    .updateOne({ "_id": ObjectId(id) }, { $inc: { nvSessions: -1 } })
                break;
        }
    }
}
/*
 * change les permissions d'accès aux interfaces d'un bot
 * in: lînterface à toggle
 * in: l'id du bot
 */
async function chPerm(interface, id) {
    var brain = await client.db("projectDB").collection("brains")
        .findOne({ "_id": ObjectId(id) })
    if (interface == "discord") {
        let res = await client.db("projectDB")
            .collection("brains")
            .updateOne({ "_id": ObjectId(id) }, { $set: { discord: !brain.discord } })
    } else if (interface == "mastodon") {
        let res = await client.db("projectDB")
            .collection("brains")
            .updateOne({ "_id": ObjectId(id) }, { $set: { mastodon: !brain.mastodon } })
    } else if (interface == "navigateur") {
        let res = await client.db("projectDB")
            .collection("brains")
            .updateOne({ "_id": ObjectId(id) }, { $set: { notreInterface: !brain.notreInterface } })
    }
}

api.get("/uList", async(req, res) => {
    var ulist = await getUsers(client)
    res.send(ulist)
})

api.get("/sesscount/:id/:int/:incr", async(req, res) => {
    var idBot = req.params["id"]
    var iFace = req.params["int"]
    var incr = req.params["incr"]
    updateSession(idBot, iFace, incr)
    res.send("ok")
})

api.get("/delete/:id", (req, res) => {
    var id = req.params["id"]
    deleteBot(id)
})

api.get("/perm/:interface/:id", (req, res) => {
    var id = req.params["id"]
    var interface = req.params["interface"]
    chPerm(interface, id)
})

api.post("/uploadbot", (req, res) => {
    bot = req.body
    try {
        createBot(client, bot)
    } catch (error) {
        console.log(error)
    }
})

api.get("/bList/:interface", async(req, res) => {
    var iface = req.params["interface"]
    var bList = await getBrains(client, iface)
    res.send(bList)
})

api.get("/brain/:id", async(req, res) => {
    var id = req.params["id"];
    var bot = await client.db("projectDB")
        .collection("brains")
        .find({ _id: ObjectId(id) })
        .toArray()
    res.send(bot[0]);
})

api.post("/login", async(req, res) => {
    user = req.body
    uSer = await auth(user)
    if (uSer == false) {
        res.send(false)
    } else {
        res.send(JSON.stringify(uSer))
    }
})

api.post("/signin", async(req, res) => {
    let user = req.body
    let uSer = await getUser(user.nom)
    if (uSer == null) {
        let r = await createUser(client, user)
        user.success = true
        res.send(user)
    } else if (uSer.nom == user.nom) {
        user.success = false
        res.send(user)
    }

})

api.listen(port, () => {
    console.log("API listening on port 3002");
})