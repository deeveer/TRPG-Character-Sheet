const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const DND5eSpell = sequelize.define('DND5eSpell', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sheet_info_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sheet_infos',
            key: 'id'
        }
    },
    spell_class: {
        type: DataTypes.STRING(30),
        defaultValue: ""
    },
    spell_ability: {
        type: DataTypes.STRING(20),
        defaultValue: ""
    },
    spell_save: {
        type: DataTypes.STRING(20),
        defaultValue: "0"
    },
    spell_bonus: {
        type: DataTypes.STRING(20),
        defaultValue: "0"
    },
    spell: {
        type: DataTypes.JSON,
        defaultValue: {
            "0": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "1": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "2": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "3": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "4": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "5": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "6": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "7": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "8": {
                total: 0,
                usage: 0,
                list: [{}]
            },
            "9": {
                total: 0,
                usage: 0,
                list: [{}]
            }
        }
    }
}, {
    tableName: 'dnd5e_spells',
    timestamps: false
});

module.exports = DND5eSpell;
