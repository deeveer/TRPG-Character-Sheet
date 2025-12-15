const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const TempUser = sequelize.define('TempUser', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: [4, 20]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [6, 255]
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'temp_users',
    timestamps: false
});

module.exports = TempUser;
