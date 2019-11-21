import Swal from 'sweetalert2'

export const updateProgress = () => {

  // select tasks already exists
  const tasks = document.querySelectorAll('li.task')

  if (tasks.length) {
      //select completed tasks
    const completedTasks = document.querySelectorAll('i.completed')
    //calculate progress

    const progress = Math.round((completedTasks.length / tasks.length) * 100)

    //show progress
    const percentage = document.querySelector('#percentage')
    const percentageNumber = document.querySelectorAll('.percentage-number')[0]

    percentage.style.width = progress + '%'
    percentageNumber.textContent = progress + '%'

    if (progress === 100) {
      Swal.fire( 'Has completado este proyecto', 'Felicitaciones', 'success' )
      
    }


  }


}