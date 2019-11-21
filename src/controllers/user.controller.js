const User = require('../models/userModel')
const { runEmail } = require('../handler/email')

exports.formCreateUser =  (req, res) => {
  res.render('createUser', {
    title: 'Crear cuenta',
    error: req.flash('error')[0]
  })
}

exports.formLoginUser =  (req, res) => {
  const { error } = req.flash()

  res.render('loginUser', {
    title: 'Iniciar sesión',
    error
  })
}

exports.createUserAccount =  async (req, res) => {

  const { email, name, password } = req.body

  try {
    await User.create({ email, name, password })
    
    const confirmUrl = `http://${req.headers.host}/confirmar/${email}`

    const user = {
      email
    }

    await runEmail({
      user,
      subject: 'Confirma tu cuenta en UpProjects',
      confirmUrl,
      file: 'confirmAccount'
    })  


    req.flash('success', 'Te enviamos un correo para confirmar tu cuenta')
    res.redirect('/iniciar-sesion') 
  } catch(err) {
      req.flash('error', err.errors.map(error => error.message))
      res.render('createUser', {
        messages: req.flash('error'),
        title: 'Registrate en Uptasks',
        email,
        name,
        password
      })
  }

}

exports.formResetPassword = (req, res) => {
  res.render('resetPassword', {
    title: 'Reestablecer contraseña',
    error: req.flash('error'),
    errors: req.flash('errors')
  })
}

exports.confirmAccount = async (req, res) => {

  try {
    const user = await User.findOne({
      where: { email: req.params.mail}
    })
    if (!user) {
      req.flash('error', 'No valido')
      return res.redirect('/registrarse')
    }

    user.active = 1
    await user.save()

    req.flash('success', 'Cuenta activada correctamente')
    res.redirect('/iniciar-sesion')


  } catch (error) {
    res.status(500).render('500', {message: 'Ha ocurrido un error. Intente más tarde'})
  }
  

  res.json(req.params.mail)
}