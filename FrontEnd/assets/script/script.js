const gallery = document.querySelector('.gallery');
function getImages() {
    fetch("http://localhost:5678/api/works")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(data) {
        data.forEach(element => {
            var figure = document.createElement('figure');
            let newFigure = document.querySelector('.gallery').appendChild(figure);
            newFigure.innerHTML = `<img src="${element.imageUrl}" alt="${element.title}" crossorigin="anonymous">
            <figcaption>${element.title}</figcaption>`   
        });

        data.forEach(element => {
            var figure = document.createElement('figure');
            let newFigureModal = document.querySelector('.modal__gallery').appendChild(figure);
            newFigureModal.classList.add('modal__figure');
            newFigureModal.innerHTML = `<i class="direction fa-solid fa-arrows-up-down-left-right" style="display: none;"></i>
            <i class=" trash fa-solid fa-trash-can"></i><img src="${element.imageUrl}" alt="${element.title}" crossorigin="anonymous">
            <figcaption>éditer</figcaption>`
        })
    })
}
getImages()

let modal = null
let modalPhoto = null

const openModal = function (e) {
    e.preventDefault()
    var target = document.querySelector(e.target.getAttribute('href'))
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', true)
    target.style.display = null
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-close-modal').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})
 
const closeModal = function(e) {
    if(modal === null) return
    e.preventDefault()
    modal.removeAttribute('aria-modal')
    modal.setAttribute('aria-hidden','true')
    modal.style.display = 'none'
    modal.removeEventListener('click', closeModal)
    modal = null
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    
}




// Ajout de la deuxieme modal avec retour arriere modal 1 et retour vers html


const openModalPhoto = function(e) {
    // closeModal()
    var target = document.querySelector(e.target.getAttribute('href'))
    e.preventDefault
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', true)
    target.style.display = null
    modalPhoto = target
    modalPhoto.querySelector('.js-close-modal').addEventListener('click', closeModal)
    modalPhoto.querySelector('.js-close-modal').addEventListener('click', closeModal2)
    modalPhoto.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    modalPhoto.addEventListener('click', closeModal)
    modalPhoto.addEventListener('click', closeModal2)
    
    

}

document.querySelectorAll('.js-modal2').forEach(a => {
    a.addEventListener('click', openModalPhoto)
    // console.log(target)
})

const closeModal2 = function(e) {
    e.preventDefault()
    if(modalPhoto === null) return
    modalPhoto.removeAttribute('aria-modal')
    modalPhoto.setAttribute('aria-hidden','true')
    modalPhoto.style.display = 'none'
    modalPhoto.removeEventListener('click', closeModal)
    modalPhoto = null
    modalPhoto.querySelector('.js-close-modal').removeEventListener('click', closeModal)
    modalPhoto.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    // modalPhoto.querySelector('.js-close-modal').removeEventListener('click', closeModal)
}

window.addEventListener('keydown', function(e){
  if (e.key === "Escape" || e.key === 'Esc') {
    closeModal(e)
    closemodal2(e)
  }  
})

const stopPropagation = function(e) {
    e.stopPropagation()
}
