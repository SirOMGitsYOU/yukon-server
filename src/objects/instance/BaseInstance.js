export default class BaseInstance {

    constructor(waddle) {
        this.users = [...waddle.users]

        // Don't start until all users are ready
        this.ready = []

        this.handleStartGame = this.handleStartGame.bind(this)
    }

    init() {
        for (let user of this.users) {
            this.addListeners(user)

            user.joinRoom(user.handler.rooms[this.id])
        }
    }

    addListeners(user) {
        user.events.on('start_game', this.handleStartGame)
    }

    removeListeners(user) {
        user.events.off('start_game', this.handleStartGame)
    }

    handleStartGame(args, user) {
        if (!this.started && !this.ready.includes(user)) {
            this.ready.push(user)

            this.checkStart()
        }
    }

    checkStart() {
        // Compare with non null values in case user disconnects
        if (this.ready.length == this.users.filter(Boolean).length) {
            this.start()
        }
    }

    start() {
        this.started = true
    }

    remove(user) {
        this.removeListeners(user)

        // Remove from users
        let seat = this.users.indexOf(user)
        this.users[seat] = null

        // Remove from ready
        this.ready = this.ready.filter(u => u != user)

        user.minigameRoom = null

        if (!this.started) {
            this.checkStart()
        }
    }

    getSeat(user) {
        return this.users.indexOf(user)
    }

    send(action, args = {}, user = null, filter = [user]) {
        let users = this.users.filter(u => !filter.includes(u)).filter(Boolean)

        for (let u of users) {
            u.send(action, args)
        }
    }

}