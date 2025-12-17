const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const SessionLink = sequelize.define('SessionLink', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sessions',
            key: 'id'
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expireAt: {
        type: DataTypes.DATE,
        defaultValue: () => new Date(Date.now() + 604800000) // 7 days in milliseconds
    }
}, {
    tableName: 'session_links',
    timestamps: false
});

module.exports = SessionLink;
