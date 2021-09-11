  
const sequelize = require('../database');
const { DataTypes, Model } = require('sequelize');

class List extends Model {}

List.init({
    name: DataTypes.STRING,
}, {
    sequelize,
    tableName: 'list'
});

module.exports = List;