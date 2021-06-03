const RiveScript = require('rivescript');
const fetch = require("node-fetch");

module.exports = {
    name: "start",
    description: "creer un channel prive pour discuter avec le rivescript choisis et creer le rivescript en question",
    execute(message, botName, listeChannel, BrainMap, timestamps) {
        fetch("http://localhost:3002/bList/discord")
            .then(res => res.json())
            .then(json => {

                let elu = json.filter(brain => brain.nom == botName);
                if (elu[0] === undefined) {
                    message.channel.send('ce nom n\'est pas valide');
                    return
                }

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
                    fetch(`http://localhost:3002/sesscount/${brain._id}/discord/+`);
                    BrainMap.set(channel.id, [bot, brain]);
                    timestamps.set(channel.id, channel.createdAt);
                });
            });
    }
}