const express = require("express");
const administrator = express();
const admin_port = 3001;
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload")
const json = require("express");
const http = require("http");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bot = require("./bot.js");
const { userInfo } = require("os");
const apiURI = "http://localhost:3002"

administrator.use(fileupload({
    createParentPath: false,
    useTempFiles: true,
    tempFileDir: "./tmp/"
}));
administrator.use(bodyParser.json());
administrator.use(bodyParser.urlencoded({ extended: false }));
administrator.set("view engine", "ejs");


administrator.get("/", (req, res) => {
    res.render("pages/index")

});

administrator.get("/login", (req, res) => {
    res.render("pages/loginpage")

});

administrator.post("/login", (req, res) => {

})

administrator.get("/signin", (req, res) => {
    res.render("pages/signinpage")
})

administrator.post("/signin", (req, res) => {
        var nom = req.body.nom
        var mdp = req.body.mdp
        User.signin(new User(nom, prenom))
    })
    /*
    fetch(apiURI + "/uList").then(res => res.json()).then(json => {
        console.log(json)
    })
    */
administrator.post("/login", (req, res) => {
    //check login info with db
    res.render("pages/index")
        //set session
        //fetch list of brains
});

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
    res.send("ok")
})


administrator.listen(admin_port, () => {
    console.log("Administrator listening on port 3001");
})