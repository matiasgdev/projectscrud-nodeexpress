const Sequelize = require('sequelize')
const db = require('../config/database')

const Project = require('./projectModel')

const Task = db.define('tasks', {
  id: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true },
  task: { type: Sequelize.STRING(100) },
  status: { type: Sequelize.INTEGER(1) }

})

Task.belongsTo(Project)


module.exports = Task