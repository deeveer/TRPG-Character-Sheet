const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const DND5eStory = sequelize.define('DND5eStory', {
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
    class: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    level: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    background: {
        type: DataTypes.STRING(30),
        defaultValue: ''
    },
    race: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    faction: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    exp: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    height: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    skin: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    age: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    weight: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    hair: {
        type: DataTypes.STRING(20),
        defaultValue: ''
    },
    pupil: {
        type: DataTypes.STRING(20),
        defaultValue: ""
    },
    trait: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    alignment: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    backstory: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    otherTrait: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    personality: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    ideals: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    bonds: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    flaws: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    note: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    }
}, {
    tableName: 'dnd5e_stories',
    timestamps: false
});

module.exports = DND5eStory;
