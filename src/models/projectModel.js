const Sequelize = require('sequelize')
const slug = require('slug')
const shortid = require('shortid')

// const Task = require('./taskModel')
const db = require('../config/database');

const Project = db.define('projects', {
  id: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING(100) },
  url: { type: Sequelize.STRING(100) },
  createdAt: {type: Sequelize.DATE, defaultValue: Sequelize.NOW }
},
  {
    hooks: {
      beforeCreate: (project) => {
        const url = slug(project.name).toLowerCase()

        project.url = `${url}-${shortid.generate()}`
      },
      //beforeUpdate: (project) => {
      //  const url = slug(project.name).toLowerCase()
      //  project.url = `${url}-${shortid.generate()}`
      //}
    }
  }
)

// Project.hasMany(Task)

module.exports = Project