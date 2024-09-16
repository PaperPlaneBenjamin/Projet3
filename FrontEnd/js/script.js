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
        buttonTrash.innerHTML= '<i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>';
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
    const boxFlex = document.querySelector(".flex")
    boxFlex.style.display="none"
}

// affiche le bouton modifier 
function appearBtnModif(){
    const btnModal = document.querySelector(".btn-modal")
    btnModal.style.display = "flex"
}

// affiche la modale 
function appearModal(){
    const modale = document.querySelector("aside")
    const mark = document.querySelector('.fa-xmark')
    const btnModal = document.querySelector(".btn-modal")
    btnModal.addEventListener("click",()=>{
        modale.style.display="flex"
    })
    modale.addEventListener("click",(event)=>{
        if(event.target===modale){
            modale.style.display="none"
        }
    })
    mark.addEventListener("click",()=>{
        modale.style.display="none"
    })
}

// affiche le bandeau noir édition 
function appearEdition(){
    const edition = document.querySelector(".banner")
    edition.style.display="flex"
}

//Fonction principale qui appelle toutes les fonctions
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
        const flex = document.querySelector('.flex')
        if (flex){
            deleteButton();
        }
        appearEdition();
        appearBtnModif();
        appearModal();
    }
};

principal();
