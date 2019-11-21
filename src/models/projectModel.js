const Sequelize = require('sequelize')
const slug = require('slug')
const shortid = require('shortid')

const db = require('../config/database');

const Project = db.define('projects', {
  id: { type: Sequelize.INTEGER(11), primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING(100) },
  url: { type: Sequelize.STRING(100) }
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

module.exports = Project;