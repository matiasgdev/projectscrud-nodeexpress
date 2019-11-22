import projects from './modules/projects'
import tasks from './modules/tasks'
import {updateProgress} from './functions/progress'
import moment from 'moment'

document.addEventListener('DOMContentLoaded', () => {
  updateProgress()
  const projectDate = document.querySelectorAll('.projects__list--item--date')
  projectDate.forEach(item => {
    item.textContent = moment(item.textContent).format('LLL')
  })
})