const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const SheetInfo = sequelize.define('SheetInfo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "無名"
    },
    player_name: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    system: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permission: {
        type: DataTypes.ENUM('限團務GM', '團務所有人', '所有人'),
        allowNull: false,
        defaultValue: '所有人'
    },
    updated: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    session: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    tableName: 'sheet_infos',
    timestamps: false
});

module.exports = SheetInfo;

