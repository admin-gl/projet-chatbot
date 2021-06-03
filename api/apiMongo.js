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
        console.log(error)
    }
}

main().catch(console.error)

async function listDB(client) {
    const dblist = await client.db().admin().listDatabases()
        //console.log("DB")
    dblist.databases.forEach(db => {
        console.log(db.name)
    });
}

async function auth(user) {
    nomU = user.nom
    mdpU = user.mdp
    res = await client.db("projectDB").collection("users").findOne({ name: nomU })
    if (res.password != mdpU) {
        return false
    } else if (res.password == mdpU) {
        return true
    }
}



async function createBot(client, bot) {
    console.log("bot", bot)
    const result = await client.db("projectDB").collection("brains").insertOne(bot)
    console.log("Ajouté nouveau cerveau")
}

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

async function createUser(client, user) {
    const result = await client.db("projectDB").collection("users").insertOne(user)
    console.log("Ajouté nouvel utilisateur")
}

async function getUsers(client) {
    let uList = await client.db("projectDB").collection("users").find({}).toArray()
    return JSON.stringify(uList);
}

async function deleteBot(id) {
    let res = await client.db("projectDB").collection("brains").deleteOne({ "_id": ObjectId(id) })
    console.log("Successfully deleted bot id:", id)
}

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
        //console.log(ulist);
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
        //console.log("BOT", bot)
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
    aUth = await auth(user)
    console.log(aUth)
    if (aUth) {
        res.send(true)
    } else {
        res.send(false)
    }
})


api.listen(port, () => {
    console.log("API listening on port 3002");
})