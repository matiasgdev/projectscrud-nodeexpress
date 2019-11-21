const passport = require('passport')
const User = require('../models/userModel')
const { validationResult } = require('express-validator')

const bcrypt = require('bcrypt')

const Sequelize = require('sequelize')
const { Op } = Sequelize

const crypto = require('crypto')

const { runEmail } = require('../handler/email')

exports.authUser = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  badRequestMessage: 'Complete ambos campos',
  failureFlash: true
})

exports.isAuthenticated = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next()
  }

  return res.redirect('/iniciar-sesion')

}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion')
  })
}

// genera un token si el usuario es valido
exports.sendToken = async (req, res) => {

  let errors = validationResult(req)

  if (!errors.isEmpty()) {

    req.flash('errors', errors.array())
    return res.redirect('/reestablecer-contrasena')

  }

  try {
    const user = await User.findOne({where: { email: req.body.email }})

    if (!user) {
      req.flash('error', 'No existe el usuario')
      return res.redirect('/reestablecer-contrasena')
    }

    user.token = crypto.randomBytes(20).toString('hex')
    user.exp = Date.now() + 3600000
    await user.save()

    const resetUrl = `http://${req.headers.host}/reestablecer-contrasena/${user.token}`

    //send email with token
    await runEmail({
      user,
      subject: 'Reestablecer contraseña en UpProjects',
      resetUrl,
      file: 'resetPasswordEmail'
    })

    req.flash('success', 'Se envio un mensaje a tu correo')
    res.redirect('/iniciar-sesion')

    
  } catch (err) {
    res.status(500).render('500', {message: 'Ha ocurrido un error. Intente más tarde'})
  }
  
}

exports.validateToken = async (req, res) => {
  
  try {
    const user = await User.findOne({
      where: {
        token: req.params.token
      }
    })

    if (!user) {
      res.status(403).redirect('/')
    }

    res.render('resetPasswordConfirm', {
      title: 'Reestablecer contraseña',
      error: req.flash('error')[0]
    })

  } catch (err) {
    res.status(500).render('500', { message: 'Ha ocurrido un error. Intente más tarde'})
  }

}

exports.updatePassword = async (req, res) => {
  const { token } = req.params

  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    req.flash('error', errors.array())
    return res.redirect(`/reestablecer-contrasena/${token}`)
  }


  try {
    const user = await User.findOne({
      where: {
        token: token,
        exp: {
          [Op.gte]: Date.now()
        }
      }
    })  
    
    if (!user) {
      req.flash('error', 'Token no válido')
      res.redirect('/reestablecer-contrasena')
    }
    
    user.password = bcrypt.hashSync(req.body.password, 10)
    user.token = null
    user.exp = null

    await user.save()
    
    req.flash('success', 'Contraseña modificada correctamente')
    res.redirect('/iniciar-sesion')

  } catch (err) {
    res.status(500).render('500', {message: 'Ha ocurrido un error. Intente más tarde'})
  }
}