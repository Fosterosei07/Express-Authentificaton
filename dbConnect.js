const {Sequelize} = require('sequelize')

const DATABASE_NAME= process.env.DATABASE_NAME
const DBUSER = process.env.DB_USER
const DBPASS = process.env.DB_PASS

const sequelize = new Sequelize(DATABASE_NAME, DBUSER, DBPASS, {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize