const Discord = require('discord.js');
//const RiveScript = require('rivescript');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL'] });

// on choisis un préfixe pour les commandes du bot
const prefixe = 'c.';

// on ajoute un filestream pour lire/ecrire dans des fichiers
const fs = require('fs');

const listeChannel = Array();

const BrainMap = new Map();

// on accede à la liste des commandes réalisables
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// on marque en console que le bot est operationnel
client.once('ready', () => {
    console.log('bip boup');
    client.user.setActivity('c.help', { type: 'LISTENING' });
});


// lorsque le bot detecte un message 
client.on('message', message => {

    if (listeChannel.includes(message.channel.id) && !message.author.bot) {

        if (message.content === "c.stop") { // supprime le channel et les informations relatives dans les structures
            let i = listeChannel.findIndex(id => id === message.channel.id);
            listeChannel.splice(i, 1);
            BrainMap.delete(message.channel.id);
            message.channel.delete();
        } else { // traitement d'un message de chat pour le rivescript
            let bot = BrainMap.get(message.channel.id)
            bot.reply("local-user", message.content)
                .then((reply) => {
                    message.channel.send(reply);
                });
        }

        return
        // on verifie que le message ne viens pas d'un autre bot et que le contenu commence par notre prefixe
    } else if (!message.content.startsWith(prefixe) || message.author.bot) return;

    // on retire le prefixe du message puis on decoupe le message suivant les espaces pour obtenir les arguments
    const args = message.content.slice(prefixe.length).split(/ +/);
    // on prend le premier argument comme commande
    const command = args.shift().toLowerCase();

    if (command === "start" && args.length > 0) {
        client.commands.get('start').execute(message, args[0], listeChannel, BrainMap);
    } else if (command === "help") {
        client.commands.get('help').execute(message);
    }
});

client.login('ODQ5NjgyNTIyODc4MTE1ODUw.YLeugw.1GOq_QBDH3IeVtdVxvDYtMYRYQo');