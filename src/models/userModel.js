const Sequelize = require('sequelize')
const db = require('../config/database')
const Project = require('./projectModel')

const bcrypt = require('bcrypt')


const User = db.define('users', {
  id: { 
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre no puede ir vacio'
      },
      isAlpha: {
        msg: 'Escribe un nombre correcto'
      }
    }
  },
  email: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Agrega un correo válido'
      },
      notEmpty: {
        msg: 'El email no puede ir vacio'
      }
    },
    unique: {
      args: true,
      msg: 'El usuario ya ha sido registrado'
    }

  },
  password: {
    type: Sequelize.STRING(60),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El password no puede ir vacio'
      }
    }
  },
  active: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  token: Sequelize.STRING,
  exp: Sequelize.DATE,

}, {
  hooks: {
    beforeCreate: async user => {
      user.password = await bcrypt.hash(user.password, 10)
    }
  }
})

// methods
User.prototype.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password) 
}

User.hasMany(Project)

module.exports = User