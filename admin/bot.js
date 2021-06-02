class Bot {
    constructor(nom, cerveau) {
        this.nom = nom
        this.cerveau = cerveau
        this.notreInterface = true
        this.discord = true
        this.mastodon = true
    }
}

module.exports = Bot;