const { DataTypes } = require('sequelize');
const sequelize = global.sequelize;

const Avatar = sequelize.define('Avatar', {
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
    type: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    image: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    }
}, {
    tableName: 'avatars',
    timestamps: false
});

module.exports = Avatar;
