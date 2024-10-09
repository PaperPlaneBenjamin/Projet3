////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////  1. Fonctions relatives à la création de la page présentant les travaux    //////////////////

// Supprime dynamiquement les images du HTML
function removePictureHTML(){
    const figures = document.querySelectorAll('.gallery figure');
    figures.forEach(figure => {
        figure.remove();
    })
}

// Génère dynamiquement les images de l'API
function addPicture(pictures){
    const gallery = document.querySelector('.gallery');
    const galleryModal = document.querySelector('.pictures-modal');
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
        figureModale.className="figure-modale";
        galleryModal.appendChild(figureModale);
        const imgModale = document.createElement("img");
        imgModale.alt=`${picture.title}`;
        imgModale.src=`${picture.imageUrl}`;
        figureModale.appendChild(imgModale);
        const buttonTrash = document.createElement("button");
        buttonTrash.className="button-trash";
        const iconTrash = document.createElement("i");
        iconTrash.className= "fa-solid fa-trash-can";
        buttonTrash.appendChild(iconTrash);
        buttonTrash.addEventListener("click", () => {
            deletePicture(picture.id, figure, figureModale);
        });
        figureModale.appendChild(buttonTrash);
        adjustNumber();
    })
}

// Crée un boutons de tri
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
}

// Crée les boutons de tri  
function addButton (categories,pictures){
    const h2 = document.querySelector(".h2-modal");
    const div =document.createElement("div");
    div.className="flex";
    div.style.display="flex";
    h2.insertAdjacentElement("afterend",div);
    const buttonTous = createButton("Tous",div,pictures);
    activeButton(buttonTous);
    categories.forEach((categorie)=>{
        createButton(categorie,div,pictures);
    })
}

// Gère le mode CSS actif du bouton sélectionné
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
    
}

// Filtre les travaux en fonction de la catégorie choisie 
function filterPictures(category,pictures){
    const picturesFiltered = category === "Tous" ? pictures : pictures.filter(picture=>picture.category.name===category);
    removePictureHTML();
    addPicture(picturesFiltered);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////  2. Fonctions relatives au mode Login et Logout   ///////////////////////////

 // Change le texte du lien login à logout et ajoute un évènement au click à logout
 function loginLogout() {
    const link = document.querySelector("ul li .a-index");
    if (link) {
        link.innerText = "logout";
        link.addEventListener("click", logout);
    }
 }

// Supprime le token si on click sur logout et reload la page
 function logout(event) {
    event.preventDefault();
    localStorage.removeItem("identification"); 
    window.location.reload();
 }

// Cache les boutons
function deleteButton(){
    const boxFlex = document.querySelector(".flex");
    boxFlex.style.display="none";
}

// Affiche le bouton modifier 
function appearBtnModif(){
    const btnModal = document.querySelector(".btn-modal");
    btnModal.style.display = "flex";
}

// Affiche le bandeau noir édition 
function appearEdition(){
    const edition = document.querySelector(".banner");
    edition.style.display="flex";
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////// 3. Fonctions relatives à l'apparition de la modale et à la supression des travaux  ///////////////

// Affiche la modale 
function appearModal(){
    const modale = document.querySelector("aside");
    const mark = document.querySelector('.modale-gallery .fa-xmark');
    const btnModal = document.querySelector(".btn-modal");
    const modaleGallery = document.querySelector(".modale-gallery");
    const modaleAdd = document.querySelector(".modale-add");
    btnModal.addEventListener("click",()=>{
        modale.style.display="flex";
    })
    modale.addEventListener("click",(event)=>{
        if(event.target===modale ){
            modale.style.display="none";
            modaleAdd.style.display="none";
            modaleGallery.style.display="flex";
            initializeProject();
        }
    })
    mark.addEventListener("click",()=>{
        modale.style.display="none";
    })
}

// Gère la modale au click
function modaleAdd(){
    const btnAddPicture = document.querySelector(".btn-add-picture");
    const modaleGallery = document.querySelector(".modale-gallery");
    const modaleAdd = document.querySelector(".modale-add");
    const iconReturn = document.querySelector(".fa-arrow-left");
    const iconMark = document.querySelector('.modale-add .fa-xmark');
    const asideAdd = document.querySelector("aside");
    btnAddPicture.addEventListener("click",()=>{
        modaleAdd.style.display="flex";
        modaleGallery.style.display="none";
        colorChange();
    });
    iconReturn.addEventListener("click",()=>{
        modaleAdd.style.display="none";
        modaleGallery.style.display="flex";
        initializeProject();
    });
    iconMark.addEventListener("click",()=>{
        asideAdd.style.display="none";
        modaleAdd.style.display="none";
        modaleGallery.style.display="flex";
        initializeProject();
    });

}

// Supprime les images au click sur les boutons 
async function deletePicture(pictureId, figure, figureModale) {
    const response = await fetch(`http://localhost:5678/api/works/${pictureId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("identification")}`
        }});
        if (response.ok) {
            figure.remove(); 
            figureModale.remove();
            setTimeout(adjustNumber, 1);
}}

// Teste si le nombre d'images est strictement supérieur à 12 et ajuste le css
function adjustNumber(){
    const allFigures = document.querySelectorAll('aside figure');
    const h3Modale = document.querySelector('aside .modale-gallery h3');
    const hrModale = document.querySelector('aside .modale-gallery hr');
        if(allFigures.length>12){
            h3Modale.classList.add('margin-adapt');
            hrModale.classList.add('margin-adapt');
        } else {
            h3Modale.classList.remove('margin-adapt');
            hrModale.classList.remove('margin-adapt');
        }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////  4. Fonctions relatives à l'ajout de nouveaux travaux pour la page de présentation  ////////////////


// Ajoute dynamiquement les catégories au sélect de l'ajout photo
function addCategoriesSelect(categories){
    const select = document.getElementById("category");
    let i = 1;
    categories.forEach(categorie=>{
        const option = document.createElement("option");
        option.value = categorie;
        option.text = categorie;
        option.id = i ;
        select.appendChild(option);
        i+=1;
    })
}

// Permet de charger un projet
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
                imgElement.className="picture-project";
                imgElement.style.width="100%";
                imgElement.style.height="100%";
                imgElement.style.objectFit="contain";
                const imagePreview = document.querySelector('.add-div');
                let imagePreviewChildren = document.querySelectorAll('.add-div > *');
                    imagePreviewChildren.forEach(child => {
                        child.style.display = 'none';
                    });
                imagePreview.style.padding="0";
                imagePreview.appendChild(imgElement); 
            }
    
            reader.readAsDataURL(file);
        }
    });
}

// Ecoute les champs de saisie d'ajout d'un projet
function validateChangeColor(){
    document.getElementById('fileInput').addEventListener('change', colorChange);
    document.getElementById('text').addEventListener('input', colorChange);
    document.getElementById('category').addEventListener('change', colorChange);
}

// Réinitialise la modale ajout d'un projet
function initializeProject(){
    const fileInput = document.getElementById('fileInput');
    const text = document.getElementById("text");
    const category = document.getElementById('category');
    fileInput.value="";
    const pictureProject = document.querySelector(".picture-project");
    if (pictureProject){
        pictureProject.remove();
    }
    text.value="";
    const vacantCategory = document.querySelector(".vacant");
    category.value=vacantCategory.value;
    const imagePreview = document.querySelector('.add-div');
    let imagePreviewChildren = document.querySelectorAll('.add-div > *');
    imagePreviewChildren.forEach(child => {
        if(child!==fileInput){
            child.style.display = 'flex';
        }
     });
     errorRemove();

}

// Change la couleur du bouton valider si tout les champs sont saisis
function colorChange(){
    const fileInput = document.getElementById('fileInput').files[0];
    const text = document.getElementById("text").value;
    const category = document.getElementById('category').value;
    const validate = document.querySelector(".validate-btn");
    if(fileInput && text !== "" && category !== " "){
        errorRemove();
        validate.style.background="#1D6154";
        fetchPost=true;
    }else{
        validate.style.background="#A7A7A7";
    }
}

// Fetch si la variable fetchPost est vrai ( champ tous remplis )
function fetchOrNotData(){
    const validate = document.querySelector(".validate-btn");
    const modaleGallery = document.querySelector(".modale-gallery");
    const modaleAdd = document.querySelector(".modale-add");
    const asideAdd = document.querySelector("aside");
    if(fetchPost){
        fetchData();
        asideAdd.style.display="none";
        modaleAdd.style.display="none";
        modaleGallery.style.display="flex";
        initializeProject();
        fetchPost=false;

    } else {
        errorAdd();
    }
}

// Fetch les données du formulaire à l'API
async function fetchData(){
        const fileInput = document.getElementById('fileInput').files[0];
        const text = document.getElementById('text').value;
        const select = document.getElementById("category");
        const category = select.options[select.selectedIndex].id;
        const formData = new FormData();
        formData.append('image', fileInput);
        formData.append('title', text);
        formData.append('category', category);
        try {
          const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("identification")}`,
            },
            body: formData,
          });
          if (!response.ok) {
            throw new Error('Une erreur est survenue lors de la requête.');
          }
          const newProject = await response.json();
          addPicture([newProject]);
        } catch (error) {
          console.error('Erreur:', error);
        }
}

// Ajoute le message d'erreur du bouton valider ajout
function errorAdd(){
    const error = document.querySelector('.error-add-project');
    error.style.visibility="visible";
}

// Retire le message d'erreur du bouton valider ajout
function errorRemove(){
    const error = document.querySelector('.error-add-project');
    error.style.visibility="hidden";
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////  5. Fonction principale qui appelle toutes les fonctions //////////////////////////

async function principal(){
    removePictureHTML();
    const response =  await fetch('http://localhost:5678/api/works');
    const pictures =  await response.json();
    addPicture(pictures);
    const categories = [...new Set(pictures.map(picture=>picture.category.name))];
    addButton(categories,pictures);
    const token = localStorage.getItem("identification");
    if (token) {
        loginLogout();
        const flex = document.querySelector('.flex');
        if (flex){
            deleteButton();
        }
        addCategoriesSelect(categories);
        appearEdition();
        appearBtnModif();
        appearModal();
        modaleAdd();
        clickInput();
        validateChangeColor();
        document.querySelector('.validate-btn').addEventListener('click', fetchOrNotData);
    }
};
let fetchPost = false;
principal();
