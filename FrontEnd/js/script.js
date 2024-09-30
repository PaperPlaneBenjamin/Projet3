// Fonction qui supprime dynamiquement les images du HTML
function removePictureHTML(){
    const figures = document.querySelectorAll('.gallery figure');
    figures.forEach(figure => {
        figure.remove();
    })
};

// Fonction qui génère dynamiquement les images de l'API
function addPicture(pictures){
    const gallery = document.querySelector('.gallery');
    const galleryModal = document.querySelector('.pictures-modal')
    pictures.forEach(picture=>{
        // page 
        const figure = document.createElement("figure");
        gallery.appendChild(figure);
        const img = document.createElement("img");
        img.alt=`${picture.title}`;
        img.src=`${picture.imageUrl}`;
        let figcaption = document.createElement("figcaption");
        figcaption.textContent=`${picture.title}`;
        figure.appendChild(img);
        figure.appendChild(figcaption);

        // modale
        const figureModale = document.createElement("figure");
        figureModale.className="figure-modale"
        galleryModal.appendChild(figureModale);
        const imgModale = document.createElement("img");
        imgModale.alt=`${picture.title}`;
        imgModale.src=`${picture.imageUrl}`;
        figureModale.appendChild(imgModale);
        const buttonTrash = document.createElement("button");
        buttonTrash.className="button-trash";
        const iconTrash = document.createElement("i")
        iconTrash.className= "fa-solid fa-trash-can"
        buttonTrash.appendChild(iconTrash)
        buttonTrash.addEventListener("click", () => {
            deletePicture(picture.id, figure, figureModale);
        });
        figureModale.appendChild(buttonTrash);
    })
};

// Fonction qui supprime les images au click sur les boutons 
async function deletePicture(pictureId, figure, figureModale) {
    const response = await fetch(`http://localhost:5678/api/works/${pictureId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("identification")}`
        }});
        if (response.ok) {
            figure.remove(); 
            figureModale.remove();
}}

// Fonction qui crée les boutons de tri
function createButton(categorie,div,pictures){
    const button =document.createElement("div");
    button.className="item";
    const text = document.createElement("p");
    text.className="title";
    text.innerText=categorie;
    div.appendChild(button);
    button.appendChild(text);
    button.addEventListener('click',function(){
        activeButton(button);
        filterPictures(categorie,pictures);
    })
    return button;
};


// Fonction qui gère les boutons de tri  
function addButton (categories,pictures){
    const h2 = document.querySelector(".h2-modal");
    const div =document.createElement("div");
    div.className="flex";
    div.style.display="flex"
    h2.insertAdjacentElement("afterend",div);
    const buttonTous = createButton("Tous",div,pictures);
    activeButton(buttonTous);
    categories.forEach((categorie)=>{
        createButton(categorie,div,pictures);
    })
};

// Fonction qui gère le mode CSS actif du bouton sélectionné
function activeButton(button){
    const allitems = document.querySelectorAll(".item");
    allitems.forEach(item=>{
        item.classList.contains("active-item") && item.classList.remove("active-item");
        let titleItem= item.querySelector(".title");
        titleItem.style.color="#1D6154";
    })
    button.classList.add('active-item');
    const title = button.querySelector(".title");
    title.style.color='white';
    
};

// Fonction qui filtre les images en fonction de la catégorie choisie 
function filterPictures(category,pictures){
    const picturesFiltered = category === "Tous" ? pictures : pictures.filter(picture=>picture.category.name===category);
    removePictureHTML();
    addPicture(picturesFiltered);
};

 //Fonction qui change le texte du lien login à logout et ajoute un évènement au click à logout
 function loginLogout() {
    const link = document.querySelector("ul li .a-index");
    if (link) {
        link.innerText = "logout";
        link.addEventListener("click", logout);
    }
 }

// Fonction qui supprime le token si on click sur logout et reload la page
 function logout(event) {
    event.preventDefault();
    localStorage.removeItem("identification"); 
    window.location.reload();
 }

// supprime les boutons
function deleteButton(){
    const boxFlex = document.querySelector(".flex");
    boxFlex.style.display="none";
}

// affiche le bouton modifier 
function appearBtnModif(){
    const btnModal = document.querySelector(".btn-modal");
    btnModal.style.display = "flex";
}

// affiche la modale 
function appearModal(){
    const modale = document.querySelector("aside");
    const mark = document.querySelector('.modale-gallery .fa-xmark');
    const btnModal = document.querySelector(".btn-modal");
    btnModal.addEventListener("click",()=>{
        modale.style.display="flex";
    })
    modale.addEventListener("click",(event)=>{
        if(event.target===modale ){
            modale.style.display="none";
            stopPropagation()
        }
    })
    mark.addEventListener("click",()=>{
        modale.style.display="none";
    })
}

// affiche le bandeau noir édition 
function appearEdition(){
    const edition = document.querySelector(".banner");
    edition.style.display="flex";
}

// Fonction qui gère la modale au click
function modaleAdd(){
    const btnAddPicture = document.querySelector(".btn-add-picture");
    const modaleGallery = document.querySelector(".modale-gallery");
    const modaleAdd = document.querySelector(".modale-add");
    const iconReturn = document.querySelector(".fa-arrow-left")
    const iconMark = document.querySelector('.modale-add .fa-xmark');
    const asideAdd = document.querySelector("aside");
    btnAddPicture.addEventListener("click",()=>{
        modaleAdd.style.display="flex";
        modaleGallery.style.display="none"
    });
    iconReturn.addEventListener("click",()=>{
        modaleAdd.style.display="none";
        modaleGallery.style.display="flex"
        initializeProject();
    });
    iconMark.addEventListener("click",()=>{
        asideAdd.style.display="none";
        modaleAdd.style.display="none";
        modaleGallery.style.display="flex"
        initializeProject();
    });

}

// Fonction qui permet de charger un projet
function clickInput(){
    document.querySelector('.btn-charge-picture').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });
    document.getElementById('fileInput').addEventListener('change', function(event) {
        let file = event.target.files[0]; 
        if (file) {
            let reader = new FileReader();
    
            reader.onload = function(e) {
                let imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.className="picture-project"
                imgElement.style.width="100%"
                imgElement.style.height="100%"
                imgElement.style.objectFit="contain"
                const imagePreview = document.querySelector('.add-div');
                let imagePreviewChildren = document.querySelectorAll('.add-div > *');
                    imagePreviewChildren.forEach(child => {
                        child.style.display = 'none';
                    });
                imagePreview.style.padding="0"
                imagePreview.appendChild(imgElement); 
            }
    
            reader.readAsDataURL(file);
        }
    });
}
// Fonction qui change la couleur du bouton valider si les tout les champs sont saisis
function colorChange(){
    let accept = false;
    const fileInput = document.getElementById('fileInput');
    const text = document.getElementById("text");
    const category = document.getElementById('category');
    const validate = document.querySelector(".validate-btn");
    let fileIndex = fileInput.files[0]
    if(fileInput && text && category && fileIndex && text.value !== "" && category.value !== ""){
        accept=true;
        validate.style.background="#1D6154"
    }else{
        validate.style.background="#A7A7A7"
    }
    return accept
}

// Fonction qui écoute les champs de saisie d'ajout d'un projet
function validateChangeColor(){
    document.getElementById('fileInput').addEventListener('change', colorChange);
    document.getElementById('text').addEventListener('input', colorChange);
    document.getElementById('category').addEventListener('change', colorChange);
}

// Fonction qui réinitialise la modale ajout d'un projet
function initializeProject(){
    const fileInput = document.getElementById('fileInput');
    const text = document.getElementById("text");
    const category = document.getElementById('category');
    fileInput.value=""
    const pictureProject = document.querySelector(".picture-project")
    pictureProject.remove()
    text.value="";
    const vacantCategory = document.querySelector(".vacant")
    category.value=vacantCategory.value
    const imagePreview = document.querySelector('.add-div');
    let imagePreviewChildren = document.querySelectorAll('.add-div > *');
    imagePreviewChildren.forEach(child => {
        if(child!==fileInput){
            child.style.display = 'flex';
        }
     });

}

// Fonction qui ajoute dynamiquement les catégories au sélect de l'ajout photo
function addCategoriesSelect(categories){
    const select = document.getElementById("category");
    categories.forEach(categorie=>{
        console.log(categorie)
        const option = document.createElement("option");
        option.value = categorie;
        option.text = categorie;
        select.appendChild(option)
    })
}

// 
function fetchOrNotData(){
    const validate = document.querySelector(".validate-btn");
    if(validate.style.backgroundColor="#1D6154"){
        fetchData();
    }
}

// Fonction qui fetch les données du formulaire à l'API
async function fetchData(){
    document.querySelector('.validate-btn').addEventListener('click', async function() {
        const fileInput = document.getElementById('fileInput').files[0];
        const text = document.getElementById('text').value;
        const category = document.getElementById('category').value;
      
        
        const formData = new FormData();
        formData.append('projet', fileInput);
        formData.append('titre', text);
        formData.append('categorie', category);
      
        try {
          const response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
          });
          console.log(response)
          if (!response.ok) {
            throw new Error('Une erreur est survenue lors de la requête.');
          }
      
          const data = await response.json();
          console.log(data)
        } catch (error) {
          console.error('Erreur:', error);
        }
      });
      
}
//Fonction principale qui appelle toutes les fonctions
async function principal(){
    removePictureHTML();
    const response =  await fetch('http://localhost:5678/api/works');
    const pictures =  await response.json();
    addPicture(pictures);
    const categories = [...new Set(pictures.map(picture=>picture.category.name))];
    console.log(categories)
    addButton(categories,pictures);
    const token = localStorage.getItem("identification");
    if (token) {
        loginLogout();
        const flex = document.querySelector('.flex')
        if (flex){
            deleteButton();
        }
        addCategoriesSelect(categories)
        appearEdition();
        appearBtnModif();
        appearModal();
        modaleAdd();
        clickInput();
        validateChangeColor();
        fetchOrNotData();
    }
};

principal();
