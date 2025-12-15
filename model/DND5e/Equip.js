const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const DND5eEquip = sequelize.define('DND5eEquip', {
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
    attack: {
        type: DataTypes.JSON,
        defaultValue: {
            first: "",
            second: "",
            third: "",
            spells: ""
        }
    },
    money: {
        type: DataTypes.JSON,
        defaultValue: {
            cp: 0,
            sp: 0,
            ep: 0,
            gp: 0,
            pp: 0
        }
    },
    equipment: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    treasure: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    language: {
        type: DataTypes.TEXT,
        defaultValue: ''
    }
}, {
    tableName: 'dnd5e_equips',
    timestamps: false
});

module.exports = DND5eEquip;
