const Sequelize = require('sequelize');

const connection = new Sequelize('guiaperguntas','root','Friagemben10',{
    host:'localhost',
    dialect:'mysql'
});

module.exports =  connection;
