// let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
let token = localStorage.getItem("token");
// ---------- Variables et functions pour le filtre de galerie -----------

const btns = document.querySelectorAll('.buttons button');
let imgs = []

// Met la classe au bouton selectionné par le click (car il est cvallback dans filter img)
function setActiveBtn(e) {
    btns.forEach(btn => {
        btn.classList.remove('btn-clicked');
    });
    e.target.classList.add('btn-clicked');
}

function filterImg(e) {
    setActiveBtn(e);
    imgs.forEach(img => {
        // Va dans toute les images et les remet par défaut en expand
      img.classList.remove('img-shrink');
      img.classList.add('img-expand')

    //   va chercher les donné des images et des boutons 
      const imgType = parseInt(img.dataset.img);
      const btnType = parseInt(e.target.dataset.btn);
    
    //   si la donné du bouton ne correspond pas la donné image applique la classe shrink
      if(imgType!== btnType) {
        img.classList.remove('img-expand');
        img.classList.add('img-shrink');
      }
    });
}   

// Le premier bouton ramene toute les images en grand et le met en surbrillance
function tous() {
    btns[0].addEventListener('click', (e) => {
        setActiveBtn(e)
        imgs.forEach(img => {
        img.classList.remove('img-shrink');
        img.classList.add('img-expanded');
        });
        });
}
 // selectionne tout les boutons et selon celui click active la function filterImg
function activateFilter() {
    for(let i = 1; i < btns.length; i++) {
        btns[i].addEventListener('click', filterImg);
        }
}

// -----------------------------------------------------------------------------------------------






// ------- Affiche les photo dans la gallerie ------------------------------

function affichePhoto() {
    fetch('http://localhost:5678/api/works')
    .then(res => res.json())
    .then(data => {
        document.querySelector('.gallery').innerHTML = '';

        data.forEach(element => {
            photoGallery(element)    
        });
        data.forEach(element => {
            photoModal(element)
        })
        imgs = document.querySelectorAll('.gallery figure');
        activateFilter()
        tous()
        document.querySelectorAll('.trash').forEach(element => {
          element.addEventListener('click', deleteImg); 
        });
        
    })
}
affichePhoto()

let counter = 0;
// Crée les éléments figure etc pour chaque photo 
function photoGallery(element) {
  counter++
    const figure = document.createElement("figure");
    figure.setAttribute("data-img", `${element.categoryId}`);
    figure.setAttribute("data-id", `${counter}`);
     let newFigure = document.querySelector(".gallery").appendChild(figure);
    newFigure.innerHTML = `<img src="${element.imageUrl}" alt="${element.title}" crossorigin="anonymous" ">
    <figcaption>${element.title}</figcaption>`;
}

function photoModal(element) {
    let figure = document.createElement("figure");
    let newFigureModal = document
          .querySelector(".modal__gallery")
          .appendChild(figure);
        newFigureModal.classList.add("modal__figure");
        newFigureModal.innerHTML = `<i class="direction fa-solid fa-arrows-up-down-left-right" style="display: none;"></i>
            <i class=" trash fa-solid fa-trash-can" id="${element.id}"></i><img src="${element.imageUrl}" alt="${element.title}" crossorigin="anonymous">
            <figcaption>éditer</figcaption>`;
}
// ------------------------------------------------------------------------------------------





// ouverture des modal / fermeture --------------


function openModal(modalId) {
    const modal = document.querySelector(modalId);
    modal.style.display = null;
    modal.setAttribute('aria-modal', 'true');
    eventPropagation(modal);
  }
  
  function closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.style.display = 'none';
      modal.setAttribute('aria-modal', 'false');
    });
  }
  
  function eventPropagation(modal) {
    modal
      .querySelector('.js-modal-stop')
      .addEventListener('click', stopPropagation);
    modal.addEventListener('click', closeModals);
  }
  
  function stopPropagation(event) {
    event.stopPropagation();
  }
  
  document.querySelector('.js-modal').addEventListener('click', function(event) {
    event.preventDefault();
    openModal('.modal');
  });
  
  document.querySelector('.js-modal-Form').addEventListener('click', function(event) {
    event.preventDefault();
    openModal('#modal-Form');
  });
  
  const closeModalButtons = document.querySelectorAll('.js-close-modal');
  closeModalButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      closeModals();
    });
  });
  
  document.querySelector('.backward').addEventListener('click', function(event) {
    event.preventDefault();
    closeModals();
    openModal('.modal');
  });


  document.querySelector('.js-modal-stop').addEventListener('click', function(event) {
    if (event.target === this) {
      closeModals();
    }
  });


  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 27) {
      closeModals();
    }
  });

// ---------------------------------------------------------------------------------------------------

// supression de l'image
let gallery = document.querySelector('.gallery');

function deleteImg(e) {
  let id = e.target.id;
  // counter = id;
  let figure = gallery.querySelector(`figure[data-id="${id}"]`);
  figure.remove()
  const figureElement = e.target.parentNode;
  const galleryElement = figureElement.parentNode;
  galleryElement.removeChild(figureElement);
  fetch("http://localhost:5678/api/works/" + id, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(res => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(res.statusText);
  })

  .then(data => {
    affichePhoto()
  })
  .catch((err) => console.log(err))
}

// -------------------------------------------------------------------------------------

// Gestion ajout de l'image

let photoForm = document.getElementById('photo-submit');
let btnValue = null;
document.getElementById('category').addEventListener('change', (e) => {
  btnValue = e.target.options[e.target.selectedIndex].getAttribute('data-btn');
})


photoForm.addEventListener("submit", function(e){
  e.preventDefault();
 
  let formData = new FormData();
  formData.append("image", imageSelected)
  formData.append("title", titleValue )
  formData.append('category', btnValue)
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      accept: "application/json",
    },
    body: formData,
  })
  .then(res => res.json()) 
});

let uploadButton = document.getElementById('upload-button');
let chosenImage = document.getElementById('chosen-image');
let fileName = document.getElementById('file-name');
let titleValue = document.getElementById('name').value;

let imageSelected = null;

uploadButton.onchange = () => {
  let reader = new FileReader(); 
  reader.readAsDataURL(uploadButton.files[0]);
  imageSelected = uploadButton.files[0]
  reader.onload = () => {
      chosenImage.setAttribute('src',reader.result)
  }
  let labelClass = document.querySelector('.label-file');
  labelClass.style.display = 'none';
}











// -------------- Gestion login et logout -----------

if(localStorage.getItem("token")) {
  document.querySelector('.login__btn').innerText = "logout"
  const modalOpener = document.querySelector(".modal__link");
  modalOpener.style.display = null;
  const editionMode = document.querySelector(".edition-mode__container");
  editionMode.style.display = null;
  let categoryButtons = document.querySelector('.buttons');
  categoryButtons.style.display = "none"
  if(document.querySelector('.login__btn').innerText === "logout") {
    document.querySelector('.login__btn').addEventListener('click', () => {
      localStorage.clear()
      window.location.href = "./assets/pages/login.html"
    })
  }
}

// ----------