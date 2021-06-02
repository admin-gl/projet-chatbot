const RiveScript = require('rivescript');
const fetch = require("node-fetch");

module.exports = {
    name: "start",
    description: "creer un channel prive pour discuter avec le rivescript choisis et creer le rivescript en question",
    execute(message, botName, listeChannel, BrainMap) {
        fetch("http://localhost:3002/bList")
            .then(res => res.json())
            .then(json => {

                const elu = json.filter(brain => brain.nom == botName);
                if (elu === []) return

                brain = elu[0];
                message.guild.channels.create(`${botName} talks with ${message.author.tag}`, { // creation du channel
                    type: 'text',
                    position: 0,
                    permissionOverwrites: [{
                            id: message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL']
                        },
                        {
                            id: message.author.id,
                            allow: ['VIEW_CHANNEL']
                        }
                    ]
                }).then((channel) => {
                    listeChannel.push(channel.id); // creation du rivescript
                    let bot = new RiveScript();
                    let code = brain.cerveau;
                    bot.stream(code, function(error) {
                        console.error("Error in your RiveScript code:\n\n" + error);
                    });
                    bot.sortReplies();
                    BrainMap.set(channel.id, bot)
                });

            });
    }
}