const Project = require('../models/projectModel')
const Task = require('../models/taskModel')

const { validationResult } = require('express-validator')


exports.index = async (req, res) => {
  const userId = res.locals.user.id
  const projects = await Project.findAll({where: { userId }})

  res.render('index', {
    title: 'Proyectos',
    projects
  })
}

exports.create = async (req, res) => {
  const userId = res.locals.user.id
  const projects = await Project.findAll({where: { userId }})

  res.render('newProject', {
    title: 'Nuevo proyecto',
    projects
  })
}

exports.newProject = async (req, res) => {

  const userId = res.locals.user.id
  const projects = await Project.findAll({where: { userId }})
  
  const { name } = req.body
  // get errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.render('newProject', {
      title: 'Nuevo proyecto',
      errors: errors.array(),
      projects
    })
  } else { //insert in db
      try {
        const userId = res.locals.user.id

        await Project.create({ name, userId })
        res.redirect('/')

      } catch(err) {
          res.status(500).render('500', {message: 'Ha ocurrido un error. Intente más tarde'})
      }
  }
}

exports.getProjectByUrl = async (req, res) => {

  const userId = res.locals.user.id
  const projectsPromise = Project.findAll({where: { userId }})

  const projectPromise = Project.findOne({
    where: {
      url: req.params.url,
      userId
    }
  })

  try {
    const [ projects, project ] = await Promise.all([projectsPromise, projectPromise])

    if (!project) {
      return res.render('404', { message: 'el proyecto no existe'})
    }

    // Get tasks by project
    const tasks = await Task.findAll({
      where: {
        projectId: project.id
      },
      //include: [
      //  { model: Project }
      //]
    })

  
    res.status(200).render('tasks', {
      title: 'Tareas del proyecto',
      project,
      projects,
      tasks
    })

  } catch (err) {
    console.log(err)
    res.status(500).render('500', {message: 'Ha ocurrido un error. Intente más tarde'})
  }
 
}

exports.edit = async (req, res) => {
  const userId = res.locals.user.id
  const projectsPromise = Project.findAll({where: { userId }})

  const projectPromise = Project.findOne({
    where: {
      id: req.params.id,
      userId
    }
  })

  const [ projects, project ] = await Promise.all([projectsPromise, projectPromise])

  res.render('newProject', {
    title: 'Editar projecto',
    project,
    projects
  })
}


exports.updateProject = async (req, res) => {

  const userId = res.locals.user.id
  const projectsPromise = Project.findAll({where: { userId }})

  const projectPromise = Project.findOne({
    where: {
      id: req.params.id,
      userId
    }
  })

  const [ projects, project ] = await Promise.all([projectsPromise, projectPromise])
  
  const { name } = req.body
  // get errors
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    res.render('newProject', {
      title: 'Editar proyecto',
      errors: errors.array(),
      projects,
      project
    })
  } else { //insert in db
      try {
        await Project.update( { name }, { where: { id: req.params.id, userId } } )
        res.redirect('/')

      } catch(err) {
        res.status(500).render('500', {message: 'Ha ocurrido un error. Intente más tarde'})
      }
  }
}

exports.deleteProject = async (req, res) => {
  const userId = res.locals.user.id
  const { urlProject } = req.query

  try {
    const result = await Project.destroy( {where: { url: urlProject, userId }})
  
    if (!result) {
      return res.status(403).send('No tienes autorización')
    }

  } catch (err) {
      return res.status(500).render('500', {message: 'Ha ocurrido un error. Intente más tarde'})
  }

  res.status(200).json({message: 'Proyecto eliminado satisfactoriamente'})

}