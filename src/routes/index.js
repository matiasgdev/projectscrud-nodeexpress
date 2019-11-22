const express = require('express')
const router = express.Router()

const { check } = require('express-validator')

const { 
  index, 
  getProjectByUrl,
  newProject,
  edit,
  updateProject,
  deleteProject
}  = require('../controllers/project.controller')

const { addTask, updateTaskState, deleteTask } = require('../controllers/task.controller')

const { formCreateUser, createUserAccount, formLoginUser, formResetPassword, confirmAccount } = require('../controllers/user.controller')

const { authUser, isAuthenticated, logout, sendToken, validateToken, updatePassword } = require('../controllers/auth.controller')




router.get('/',isAuthenticated, index )


router.post('/new-project', isAuthenticated,  
    check('name')
    .not().isEmpty().withMessage('El campo no puede estar vacio')
    .isLength({min: 5}).withMessage('Debe contener al menos 5 caracteres')
    .trim()
    .escape()
    , newProject
  )

router.get('/proyecto/:url', isAuthenticated, getProjectByUrl)

router.get('/proyecto/editar/:id', isAuthenticated, edit)

// update
router.post('/new-project/:id',  isAuthenticated,
  check('name')
  .not().isEmpty().withMessage('El campo no puede estar vacio')
  .isLength({min: 5}).withMessage('Debe contener al menos 5 caracteres')
  .trim()
  .escape()
  , updateProject )

//delete
router.delete('/proyectos/:url', isAuthenticated, deleteProject)

//add task
router.post('/proyecto/:url', isAuthenticated,
  check('task')
  .not().isEmpty().withMessage('El campo no puede estar vacio')
  .isLength({min: 3}).withMessage('Debe contener al menos 3 caracteres')
  .trim()
  .escape()
  , addTask
)

// update task
router.patch('/task/:id', isAuthenticated, updateTaskState )

//delete task
router.delete('/task/:id', isAuthenticated, deleteTask )

//form create user
router.get('/registrarse', formCreateUser )

//create user
router.post('/registrarse', createUserAccount)
router.get('/confirmar/:mail', confirmAccount)

//form login
router.get('/iniciar-sesion', formLoginUser)
//login user
router.post('/iniciar-sesion', authUser)

//logout
router.get('/logout', logout)

//reset password
router.get('/reestablecer-contrasena', formResetPassword )

router.post('/reset-password', [ 
  check('email')
  .not().isEmpty().withMessage('El campo no puede estar vacio')
  .isEmail().withMessage('Ingresa un email válido')
  .trim().escape()
] , sendToken )

router.get('/reestablecer-contrasena/:token', validateToken)

router.post('/reestablecer-contrasena/:token', [
    check('password')
    .not().isEmpty().withMessage('La contraseña no puede ir vacia')
    .isLength({min: 5}).withMessage('Debe contener al menos 5 caracteres')
    .escape()
  ], updatePassword)

module.exports = router