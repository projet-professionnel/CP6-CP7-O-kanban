const sequelize = require('../database');
const { DataTypes, Model } = require('sequelize');

class Card extends Model {}

Card.init({
    title: DataTypes.STRING,
    color: DataTypes.STRING,
    position: DataTypes.INTEGER
}, {
    sequelize,
    tableName: 'card'
});

module.exports = Card;