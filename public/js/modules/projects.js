import Swal from 'sweetalert2'
import axios from 'axios'



const btnDelete = document.querySelector('#delete-project')

if (btnDelete) {
  btnDelete.addEventListener('click', e => {

    const urlProject = e.target.dataset.projectUrl

    Swal.fire({
      title: 'Estas seguro de eliminar este proyecto?',
      text: "No estará mas disponible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Borrar definitivamente',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (result.value) {

        const url = `${location.origin}/proyectos/${urlProject}`

        //send delete action
        axios.delete(url, { params: { urlProject }})
          .then((response) => {
            console.log(response)

            Swal.fire(
              'Borrado!',
              response.data.message,
              'success'
            )
      
            setTimeout(() => {
              window.location.href = '/'
            }, 1500)

          })
          .catch( err => {
            Swal.fire({
              icon: 'error',
              title: 'Hubo un error',
              text: err.message
            })
          })
  
      }
    })
  
  })
}

export default btnDelete
