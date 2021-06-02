const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const bodyParser = require("body-parser");
const api = express();
const port = 3002;


api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
const uri = "mongodb+srv://admin:oTQ2VwkR6D4cJAh2@cluster.4vwhu.mongodb.net/projectDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function main() {
    try {
        await client.connect()
            //await getUsers(client)
    } catch (error) {
        console.log(error)
    }
}

main().catch(console.error)

async function listDB(client) {
    const dblist = await client.db().admin().listDatabases()
    console.log("DB")
    dblist.databases.forEach(db => {
        console.log(db.name)
    });
}





async function createBot(client, bot) {
    const result = await client.db("projectDB").collection("brains").insertOne(bot)
    console.log("Ajouté nouveau cerveau")
}

async function getBrains(client) {
    let bList = await client.db("projectDB").collection("brains").find({}).toArray();
    return bList

}

async function createUser(client, user) {
    const result = await client.db("projectDB").collection("users").insertOne(user)
    console.log("Ajouté nouvel utilisateur")
}

async function getUsers(client) {
    let uList = await client.db("projectDB").collection("users").find({}).toArray()
    return uList;
}

api.get("/test", (req, res) => {
    res.send(JSON.stringify({
        name: "Glenan",
        pwd: "1234"
    }))
})

api.get("/bList", async(req, res) => {
    var bList = await getBrains(client)
    res.send(bList)
})

api.get("/uList", async(req, res) => {
    var ulist = await getUsers(client)
        //console.log(ulist);
    res.send(ulist)
})

api.post("/uploadbot", (req, res) => {
    bot = req.body
    console.log("BOT", bot)
    try {
        createBot(client, bot)
    } catch (error) {
        console.log(error)
    }
})

api.listen(port, () => {
    console.log("API listening on port 3002");
})