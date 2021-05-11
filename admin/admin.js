const express = require("express");
const administrator = express();
const admin_port = 3001;
const fetch = require("node-fetch");

administrator.set("view engine", "ejs");








administrator.get("/", (req, res) => {
    res.render("pages/index")
});





administrator.listen(admin_port, () => {
    console.log("Administrator listening on port 3001");
})