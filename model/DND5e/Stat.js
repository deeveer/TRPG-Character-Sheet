const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const DND5eStat = sequelize.define('DND5eStat', {
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
    stat: {
        type: DataTypes.JSON,
        defaultValue: {
            str: 10,
            dex: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10
        }
    },
    inspiration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 50
        }
    },
    passive_wisdom: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 50
        }
    },
    pro: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 50
        }
    },
    armorValue: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 128
        }
    },
    initiative: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 50
        }
    },
    speed: {
        type: DataTypes.STRING(100),
        defaultValue: '0'
    },
    max_hp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 256
        }
    },
    hp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 256
        }
    },
    temp_hp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 100
        }
    },
    hit_dice_total: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            max: 50
        }
    },
    hit_dice: {
        type: DataTypes.STRING(20),
        defaultValue: '0'
    },
    death_save: {
        type: DataTypes.STRING(10),
        defaultValue: "00"
    },
    savings: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    skills: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    skill_multiplier: {
        type: DataTypes.JSON,
        defaultValue: {}
    }
}, {
    tableName: 'dnd5e_stats',
    timestamps: false
});

module.exports = DND5eStat;
