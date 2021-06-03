const { MessageEmbed } = require("discord.js")
const fetch = require("node-fetch");

module.exports = {
    name: "help",
    description: "envoi un message d'aide en privé à l'auteur du message",
    execute(message) {

        fetch("http://localhost:3002/bList/discord")
            .then(res => res.json())
            .then(json => {

                let listeNom = '';
                json.forEach(brain => {
                    listeNom += `\t- ${brain.nom}\n`
                });

                const commands = "**c.start** __nom__ → lance un chat écrit avec l'IA choisis.\n**c.stop** → ferme le salon de discussion (seulement valable dans votre salon)\n**c.help** → affiche cette aide";
                const msg = new MessageEmbed();
                msg.addField("commandes :", commands);
                msg.addField("IA disponibles :", listeNom);
                msg.setTitle("RiveScript Bot aide:");
                msg.setColor('#CC455B');

                message.author.send(msg);
                message.delete();
            });


    }
}