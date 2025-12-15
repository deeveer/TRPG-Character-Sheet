const Info = require("./SheetInfo");
const Avatar = require("./Avatar");
const Session = require("./Session");

const DND5eStat = require("./DND5e/Stat");
const DND5eStory = require("./DND5e/Story");
const DND5eEquip = require("./DND5e/Equip");
const DND5eSpell = require("./DND5e/Spell");

const systems = {
    DND5e: {
        schema: {
            stat: DND5eStat,
            story: DND5eStory,
            equip: DND5eEquip,
            spell: DND5eSpell
        },
        props: ["stat", "story", "equip", "spell"]
    }
}

function getSystem(system) {
    if (!systems.hasOwnProperty(system)) {
        throw new Error("No selected system")
    }
    return systems[system]
}

class CharacterSheet {
    info
    user
    system
    query = {}

    //load all schema
    async init(id = null, user = null) {
        if (id != null) {
            this.user = user
            this.info = await Info.findByPk(id)
            this.system = this.info.system
            for (let [key, model] of Object.entries(systems[this.system].schema)) {
                this.query[key] = await model.findOne({ where: { sheet_info_id: id } })
            }
        }
        return this
    }

    async create(name, player, system, author_id) {
        if (!systems.hasOwnProperty(system)) {
            throw new Error("No Selected System")
        }

        // Create sheet info
        this.info = await Info.create({
            name: name,
            player_name: player,
            system: system,
            author_id: author_id
        })

        // Create related models
        await DND5eStat.create({ sheet_info_id: this.info.id })
        await DND5eStory.create({ sheet_info_id: this.info.id })
        await DND5eEquip.create({ sheet_info_id: this.info.id })
        await DND5eSpell.create({ sheet_info_id: this.info.id })
        await Avatar.create({ sheet_info_id: this.info.id, type: system })

        return this.info.id
    }

    async update(newInfo, updated = {}) {
        if (newInfo != null && !['限團務GM', '團務所有人', '所有人'].includes(newInfo.permission)) newInfo.permission = '所有人'
        if (newInfo == null) newInfo = {}
        if (!this.checkOwn()) throw new Error("no Permission")

        // Update sheet info
        await Info.update({
            name: newInfo.name || this.info.name,
            player_name: newInfo.player_name || this.info.player_name,
            permission: newInfo.permission || this.info.permission,
            updated: new Date()
        }, {
            where: { id: this.info.id }
        })

        // Update related models
        const props = systems[this.system].props
        for (let prop of props) {
            if (updated[prop] != null) {
                const model = systems[this.system].schema[prop]
                await model.update(updated[prop], {
                    where: { sheet_info_id: this.info.id }
                })
            }
        }
        return this
    }

    async delete() {
        if (!this.checkOwn()) throw new Error("no Permission")

        // Delete all related records
        await DND5eStat.destroy({ where: { sheet_info_id: this.info.id } })
        await DND5eStory.destroy({ where: { sheet_info_id: this.info.id } })
        await DND5eEquip.destroy({ where: { sheet_info_id: this.info.id } })
        await DND5eSpell.destroy({ where: { sheet_info_id: this.info.id } })
        await Avatar.destroy({ where: { sheet_info_id: this.info.id } })
        await Info.destroy({ where: { id: this.info.id } })

        return this
    }

    async exec(...field) {
        try {
            const sheet = {}
            if (!this.checkOwn() && !await this.checkView()) {
                throw new Error("no Permission")
            }
            sheet.info = this.info
            for (let [key, modelInstance] of Object.entries(this.query)) {
                if (field.length === 0 || field.includes(key)) {
                    if (modelInstance) {
                        sheet[key] = modelInstance.toJSON()
                        delete sheet[key].id
                        delete sheet[key].sheet_info_id
                    }
                }
            }
            return sheet
        } catch (err) {
            throw err
        }
    }

    checkOwn() {
        if (this.user == null) return false
        return this.info.author_id === this.user.id
    }

    async checkView(session = null) {
        switch (this.info.permission) {
            case "所有人":
                return true
            case "限團務GM":
                if (this.user == null) return false
                if (session) return session.gm === this.user.name
                // Check if user is GM in any of the sessions
                const sessions = await Session.findAll({
                    where: {
                        id: this.info.session,
                        gm: this.user.name
                    }
                })
                return sessions.length > 0
            case "團務所有人":
                if (this.user == null) return false
                if (session) return session.player.includes(this.user.name)
                // Check if user is player in any of the sessions
                const playerSessions = await Session.findAll({
                    where: {
                        id: this.info.session,
                        player: {
                            [require('sequelize').Op.contains]: [this.user.name]
                        }
                    }
                })
                return playerSessions.length > 0
        }
    }
}

module.exports = {
    CharacterSheet, getSystem
}
