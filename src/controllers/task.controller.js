const Project = require('../models/projectModel')
const Task = require('../models/taskModel')

const { validationResult } = require('express-validator')

exports.addTask = async (req, res) => {
  
  const userId = res.locals.user.id

  try {
    const projectsPromise = Project.findAll({ where: { userId }})
    const projectPromise = Project.findOne({ where: { url: req.params.url, userId }})

    const [ projects, project ] = await Promise.all([projectsPromise, projectPromise])

    if (!project) {
      res.render('404', { message: 'el proyecto no existe'})
      return; 
    }
    
    const tasks = await Task.findAll({
      where: {
        projectId: project.id
      }
    })

    const { task } = req.body

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.render('tasks', {
        title: 'Tareas del proyecto',
        errors: errors.array(),
        project,
        projects,
        tasks
      })
    } else {
      const status = 0 //default 0
      const projectId = project.id

      const result = await Task.create({ task, status, projectId})

      if (!result) {
        throw new Error('Ocurrio un error al crear la tarea. Intenta más tarde')
      }

      res.redirect('/proyecto/' + req.params.url)
    }
  } catch(err) {
    res.status(500).render('500', { message: 'Hubo un error. Intente más tarde' })
  }
}

exports.updateTaskState = async (req, res) => {
  const { id } = req.params

  try {
    const task = await Task.findOne({ where: { id } })

    if (!task) {
      return res.status(400).json({message: 'tarea no encontrada'})
    }

    // update status
    let status = 0
    if (task.status === status) {
      status = 1
    }

    task.status = status

    const result = await task.save()

    if (!result) {
      return res.status(500).json({message: 'Hubo un error al actualizar la tarea. Intente más tarde'})
    }

    res.status(200).json({message: 'Actualizado'})

  } catch (err) {
      res.status(500).render('500', { message: 'Hubo un error. Intente más tarde' })
  }
  
}

exports.deleteTask = async (req, res) => {
  const { id } = req.params

  try {
    const result = await Task.destroy({
      where: {
        id
      }
    })
  
    if (!result) {
      return res.status(400).json({message: 'tarea no encontrada'})
    }
    res.status(200).json({message: 'Tarea eliminada!'})

  } catch (err) {
      res.status(500).render('500', { message: 'Hubo un error. Intente más tarde' })
  }
  

  

}