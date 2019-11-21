import axios from "axios"
import Swal from 'sweetalert2'
import { updateProgress } from '../functions/progress'

const tasks = document.querySelector('.pending-list')

if (tasks) {
  tasks.addEventListener('click', (e) => {
    
    const item = e.target
    const taskId = item.parentElement.parentElement.dataset.task

    const action = item.dataset.action

    // patch state of task
    const url = `${location.origin}/task/${taskId}`

    if (action === 'toggleStatus') {

        axios.patch(url, { taskId })
        .then( res => {
          if (res.status === 200) {
            item.classList.toggle('completed')
            if (!item.classList.contains('animation-completed')) {
              item.classList.add('animation-completed')
            } else {
              item.classList.remove('animation-completed')
            }

            updateProgress()
          }
        })
        .catch (err =>  {
          Swal.fire({
            title: 'Ocurrio un error',
            text: 'Intenta más tarde',
            icon: 'error'
          })
        })
      
    }
    // delete task
    if (action === 'delete') {
      Swal.fire({
        title: 'Estas seguro de eliminar esta tarea?',
        text: "No estará mas disponible",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Borrar definitivamente',
        cancelButtonText: 'Cancelar'
      }).then( result => {
          if (result.value) {

            axios.delete(url, { params: { id: taskId } })
              .then( response => {

                if (response.status === 200) {
                  Swal.fire( 'Borrado!', response.data.message, 'success' )
                  
                  //delete node
                  const parentItem = item.parentElement.parentElement
                  updateProgress()
                  setTimeout(()=> { 
                    parentItem.parentElement.removeChild(parentItem)
                    
                  }, 1500)

                 }
              })
              .catch( err => {  
                Swal.fire({ icon: 'error', title: 'Hubo un error', text: 'Intente más tarde' })

                setTimeout(() => {
                  window.location.href = '/'
                }, 2500)
              })
          } 
      })
      
    }
  })
} 

export default tasks