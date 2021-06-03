class Bot {
    constructor(nom, cerveau) {
        this.nom = nom
        this.cerveau = cerveau
        this.notreInterface = true
        this.discord = true
        this.mastodon = true
        this.dsSessions = 0
        this.msSessions = 0
        this.nvSessions = 0
    }
}

module.exports = Bot;