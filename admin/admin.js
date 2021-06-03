const express = require("express");
const administrator = express();
const admin_port = 3001;
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload")
    //const json = require("express");
    //const http = require("http");
    //const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bot = require("./bot.js");
const user = require("./user.js");
const { userInfo } = require("os");
const { emitWarning } = require("process");
const { get } = require("http");
const apiURI = "http://localhost:3002"
const session = require("express-session")


administrator.use(fileupload({
    createParentPath: false,
    useTempFiles: true,
    tempFileDir: "./tmp/"
}));
administrator.use(session({ secret: "Secret", name: "sessionID", saveUninitialized: false }))
administrator.use(bodyParser.json());
administrator.use(bodyParser.urlencoded({ extended: false }));
administrator.set("view engine", "ejs");


administrator.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

administrator.get("/", (req, res) => {

    fetch(apiURI + "/bList/all").then(res => res.json()).then(jSon => {
        res.render("pages/index", { bList: jSon, session: req.session })
    })

});

administrator.get("/login", (req, res) => {
    res.render("pages/login")
});

administrator.post("/delete", (req, res) => {
    id = req.body.id
        //console.log("delete bot id : ", botId)
    fetch(apiURI + "/delete/" + id)
    res.redirect("/")
})

administrator.post("/perm/:interface", (req, res) => {
    id = req.body.id
    iface = req.params["interface"]
    fetch(apiURI + "/perm/" + iface + "/" + id)
    res.redirect("/")
})

administrator.post("/login", (req, res) => {
    let nom = req.body.nom
    let pwd = req.body.mdp
    let uSer = new user(nom, pwd)
    userString = JSON.stringify(uSer)
    fetch("http://localhost:3002/login/", {
        method: "POST",
        body: userString,
        headers: { "Content-Type": "application/json" }
    }).then(result => result.json()).then((json) => {
        console.log(json)
        if (json) {
            fetch(apiURI + "/bList/all").then(res => res.json()).then(jSon => {
                req.session.loggedIn = true
                req.session.userName = uSer.nom
                req.session.isAdmin = uSer.admin
                console.log(req.session)
                res.redirect("/")
            })
        } else {
            res.sendStatus(404)
        }
    })
})
administrator.get("/signin", (req, res) => {
    res.render("pages/signinpage")
})

administrator.post("/signin", (req, res) => {
    var nom = req.body.nom
    var mdp = req.body.mdp
    User.signin(new User(nom, prenom))
})

administrator.post("/uploadbot", (req, res) => {
    //console.log("uploaded : ", req.files.botfile)
    //console.log("path : ", req.files.botfile.tempFilePath)
    var fileString = fs.readFileSync(req.files.botfile.tempFilePath, "utf-8")
    var newBot = new bot(req.files.botfile.name, fileString)
    jsonStringBot = JSON.stringify(newBot)
    console.log("obj : ", newBot)
    console.log("json : ", jsonStringBot)
    fetch("http://localhost:3002/uploadbot/", {
            method: "POST",
            body: jsonStringBot,
            headers: { "Content-Type": "application/json" }
        })
        //console.log(fileString)
    res.redirect("/")
})
administrator.post("/newdefault", (req, res) => {
    var newBot = new bot("default.rive", "+ hello bot\n- Hello human!")
    var jsonStringBot = JSON.stringify(newBot)
    fetch("http://localhost:3002/uploadbot/", {
        method: "POST",
        body: jsonStringBot,
        headers: { "Content-Type": "application/json" }
    })
    res.redirect("/")
})

administrator.listen(admin_port, () => {
    console.log("Administrator listening on port 3001");
})