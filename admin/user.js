class User {
    constructor(nom, mdp) {
        this.nom = nom
        this.mdp = mdp
        this.admin = false
    }
}

module.exports = User;