const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// ref to the model
const User = require('../models/userModel')

// local strategy (login credentials)
passport.use(
  new LocalStrategy(
    //by default passport wait an user and password
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {

        const user = await User.findOne({ where: { email }})

        if (!user) {
          return done(null, false, {
            message: 'Email incorrecto'
          })
        }

        if (user.active == 0) {
          return done(null, false, {
            message: 'Confirma tu cuenta antes de iniciar sesión'
          })
        }

        // email valid, verify password
        if (!user.verifyPassword(password)) {
          return done(null, false, {
            message: 'Password incorrecto'
          })
        } 
        // give user
        return done(null, user)

      } catch (err) {
        // user don't exists
        return done(null, false, {
          message: 'El usuario con esas credenciales no existe'
        })
        
      }
    }

  )
)


passport.serializeUser((user, cb) => {
  cb(null, user)
})
passport.deserializeUser((user, cb) => {
  cb(null, user)
})

module.exports = passport
