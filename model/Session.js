const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            len: [3, 30]
        }
    },
    gm: {
        type: DataTypes.STRING,
        allowNull: false
    },
    player: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    sheet: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'sessions',
    timestamps: false
});

module.exports = Session;
